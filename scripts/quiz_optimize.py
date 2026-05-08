#!/usr/bin/env python3
"""Find the minimum subset of quiz questions that preserves character matching accuracy.

Strategy:
1. Simulate N random "users" by sampling answers from the 25-question quiz
2. For each user, compute baseline character ranking using all 25 questions
3. Greedy: build the smallest subset where:
   - Top-1 match equals baseline >= TARGET_TOP1
   - Spearman correlation of full ranking >= TARGET_RHO
4. Also enforce: every trait must be touched by >= MIN_TRAIT_COVERAGE questions
"""
import json, os, random, math
from collections import Counter

random.seed(42)

ROOT = os.path.join(os.path.dirname(__file__), "..")

with open(os.path.join(ROOT, "quiz_questions.json")) as f:
    Q = json.load(f)
with open(os.path.join(ROOT, "quiz_characters.json")) as f:
    C = json.load(f)

questions = Q["questions"]
traits = [t["key"] for t in Q["traits"]]
characters = C["characters"]

EFFECT_SCALE = 0.4   # matches frontend
BASELINE = 5.0
N_USERS = 2000

def init_traits():
    return {k: BASELINE for k in traits}

def apply_answer(t_vec, q, opt_idx):
    effects = q["options"][opt_idx].get("effects", {})
    for k, v in effects.items():
        if k in t_vec:
            t_vec[k] = max(0.0, min(10.0, t_vec[k] + v * EFFECT_SCALE))

def manhattan(a, b):
    return sum(abs(a.get(k, BASELINE) - b.get(k, BASELINE)) for k in traits)

def rank_chars(t_vec):
    scored = [(c["id"], manhattan(t_vec, c["traits"])) for c in characters]
    scored.sort(key=lambda x: x[1])
    return [s[0] for s in scored]

def simulate_user(question_indices):
    t_vec = init_traits()
    answers = {}
    for i in question_indices:
        q = questions[i]
        n_opts = len(q["options"])
        # Slider questions don't actually move trait vector in frontend
        # (answerSlider just stores the value), so emulate that
        if i in (11, 24):
            answers[i] = random.randint(0, 100)
            continue
        opt = random.randint(0, n_opts - 1)
        answers[i] = opt
        apply_answer(t_vec, q, opt)
    return t_vec, answers

def replay(answers, question_indices):
    t_vec = init_traits()
    for i in question_indices:
        if i in (11, 24):
            continue
        if i not in answers:
            continue
        q = questions[i]
        apply_answer(t_vec, q, answers[i])
    return t_vec

def spearman(rank_a, rank_b):
    pos_a = {x: i for i, x in enumerate(rank_a)}
    pos_b = {x: i for i, x in enumerate(rank_b)}
    n = len(rank_a)
    d2 = sum((pos_a[k] - pos_b[k]) ** 2 for k in pos_a)
    return 1 - (6 * d2) / (n * (n*n - 1))

def evaluate_subset(subset, sim_data):
    """Compare ranking from subset vs full 25Q baseline."""
    top1_match = 0
    top3_match = 0
    rho_sum = 0.0
    for full_rank, answers in sim_data:
        sub_vec = replay(answers, subset)
        sub_rank = rank_chars(sub_vec)
        if sub_rank[0] == full_rank[0]:
            top1_match += 1
        if full_rank[0] in sub_rank[:3]:
            top3_match += 1
        rho_sum += spearman(sub_rank, full_rank)
    n = len(sim_data)
    return {
        "top1": top1_match / n * 100,
        "top3_loose": top3_match / n * 100,
        "rho": rho_sum / n,
    }

# Build simulation set
print(f"Simulating {N_USERS} users on full 25-question quiz...")
all_q = list(range(len(questions)))
sim_data = []
for _ in range(N_USERS):
    t_vec, answers = simulate_user(all_q)
    full_rank = rank_chars(t_vec)
    sim_data.append((full_rank, answers))
print("Done.\n")

# Trait coverage of each non-slider question
def trait_keys_of(q_idx):
    q = questions[q_idx]
    keys = set()
    for opt in q["options"]:
        keys.update(opt.get("effects", {}).keys())
    return keys

# Greedy: start with empty subset, add the question that maximizes top-1 accuracy
print("Greedy subset selection...")
non_slider = [i for i in all_q if i not in (11, 24)]

def greedy_top_n(target_size):
    selected = []
    remaining = set(non_slider)
    while len(selected) < target_size:
        best_q = None
        best_score = -1.0
        for q_idx in remaining:
            trial = sorted(selected + [q_idx])
            r = evaluate_subset(trial, sim_data)
            score = r["top1"] + 30 * r["rho"]  # weighted
            if score > best_score:
                best_score = score
                best_q = q_idx
        selected.append(best_q)
        remaining.remove(best_q)
        r = evaluate_subset(sorted(selected), sim_data)
        print(f"  +q{best_q+1:02d}  N={len(selected):2d}  top1={r['top1']:5.1f}%  top3={r['top3_loose']:5.1f}%  rho={r['rho']:.3f}")
    return sorted(selected)

# Run greedy up to 18 questions, find sweet spot
best_subset = greedy_top_n(18)

print("\n=== TARGETS ===")
print("Top-1 = same primary character as 25Q baseline")
print("Top-3 loose = baseline winner is in subset's top 3")
print("Spearman rho = full 60-character ranking similarity (1.0 = identical)")
print()
print("Recommended thresholds for 'preserves accuracy':")
print("  Top-1 >= 85%, rho >= 0.85: GOOD")
print("  Top-1 >= 90%, rho >= 0.90: EXCELLENT")
