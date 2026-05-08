#!/usr/bin/env python3
"""Realistic accuracy: simulate users who behave like a target character.

For each character, generate plausible answers (with small noise),
then check: does subset still pick the same character?
"""
import json, os, random, math

random.seed(42)
ROOT = os.path.join(os.path.dirname(__file__), "..")

with open(os.path.join(ROOT, "quiz_questions.json")) as f:
    Q = json.load(f)
with open(os.path.join(ROOT, "quiz_characters.json")) as f:
    C = json.load(f)

questions = Q["questions"]
traits = [t["key"] for t in Q["traits"]]
characters = C["characters"]

EFFECT_SCALE = 0.4
BASELINE = 5.0
NOISE = 0.15  # 15% chance to pick a non-optimal answer (real users aren't perfect)
RUNS_PER_CHAR = 30  # simulate each character 30 different ways

def init_traits():
    return {k: BASELINE for k in traits}

def apply_answer(t_vec, q, opt_idx):
    eff = q["options"][opt_idx].get("effects", {})
    for k, v in eff.items():
        if k in t_vec:
            t_vec[k] = max(0.0, min(10.0, t_vec[k] + v * EFFECT_SCALE))

def manhattan(a, b):
    return sum(abs(a.get(k, BASELINE) - b.get(k, BASELINE)) for k in traits)

def rank_chars(t_vec):
    scored = [(c["id"], manhattan(t_vec, c["traits"])) for c in characters]
    scored.sort(key=lambda x: x[1])
    return [s[0] for s in scored]

def best_option_for_char(q, target_traits):
    """Which option pushes user toward the target character's trait vector?"""
    best, best_score = 0, -1e9
    for i, opt in enumerate(q["options"]):
        eff = opt.get("effects", {})
        # score = sum over traits of (delta * (target - baseline))
        score = sum(v * (target_traits.get(k, 5) - 5) for k, v in eff.items())
        if score > best_score:
            best_score = score
            best = i
    return best

def simulate_char_user(target_char, question_indices):
    """Simulate someone whose true profile matches target_char."""
    answers = {}
    for i in question_indices:
        q = questions[i]
        if i in (11, 24):  # slider questions
            answers[i] = 50
            continue
        if random.random() < NOISE:
            answers[i] = random.randint(0, len(q["options"]) - 1)
        else:
            answers[i] = best_option_for_char(q, target_char["traits"])
    return answers

def replay(answers, question_indices):
    t_vec = init_traits()
    for i in question_indices:
        if i in (11, 24):
            continue
        if i not in answers:
            continue
        apply_answer(t_vec, questions[i], answers[i])
    return t_vec

all_q = list(range(len(questions)))
non_slider = [i for i in all_q if i not in (11, 24)]

# Build sim data: for each character, multiple noisy runs
print(f"Simulating {len(characters)} characters x {RUNS_PER_CHAR} runs = {len(characters)*RUNS_PER_CHAR} users...")
sim_data = []
for ch in characters:
    for _ in range(RUNS_PER_CHAR):
        ans = simulate_char_user(ch, all_q)
        sim_data.append((ch["id"], ans))

def evaluate(subset, label=""):
    top1 = top3 = top5 = 0
    n = len(sim_data)
    for true_id, ans in sim_data:
        vec = replay(ans, subset)
        ranked = rank_chars(vec)
        if ranked[0] == true_id: top1 += 1
        if true_id in ranked[:3]: top3 += 1
        if true_id in ranked[:5]: top5 += 1
    return {"top1": top1/n*100, "top3": top3/n*100, "top5": top5/n*100}

# Baseline: all 25 questions
r25 = evaluate(all_q)
print(f"\n[FULL 25Q baseline]   top1={r25['top1']:5.1f}%  top3={r25['top3']:5.1f}%  top5={r25['top5']:5.1f}%")

# Greedy: pick subset that maximizes top-1
print("\nGreedy build-up (target: maximize top-1 character recovery)...")
selected = []
remaining = set(non_slider)
prev_top1 = 0
for step in range(1, 19):
    best_q, best_top1, best_full = None, -1, None
    for q_idx in remaining:
        trial = sorted(selected + [q_idx])
        r = evaluate(trial)
        if r["top1"] > best_top1:
            best_top1 = r["top1"]
            best_q = q_idx
            best_full = r
    selected.append(best_q)
    remaining.remove(best_q)
    delta = best_full["top1"] - prev_top1
    prev_top1 = best_full["top1"]
    print(f"  N={step:2d} +q{best_q+1:02d}  top1={best_full['top1']:5.1f}% (+{delta:4.1f})  top3={best_full['top3']:5.1f}%  top5={best_full['top5']:5.1f}%")

print(f"\nFor reference: full 25Q top1 = {r25['top1']:.1f}%")
print(f"\nOptimal subset of N questions (by greedy):\n  {sorted([i+1 for i in selected])}")
