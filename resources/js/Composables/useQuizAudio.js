import { ref } from 'vue';

export function useQuizAudio() {
    const soundOn = ref(true);
    let ctx = null;

    function ac() {
        if (typeof window === 'undefined') return null;
        if (!ctx) {
            try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; }
        }
        if (ctx && ctx.state === 'suspended') ctx.resume();
        return ctx;
    }

    function blip(freq, dur, type, gain) {
        if (!soundOn.value) return;
        const a = ac();
        if (!a) return;
        const o = a.createOscillator();
        const g = a.createGain();
        o.type = type || 'square';
        o.frequency.setValueAtTime(freq, a.currentTime);
        g.gain.setValueAtTime(0, a.currentTime);
        g.gain.linearRampToValueAtTime(gain || 0.06, a.currentTime + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
        o.connect(g).connect(a.destination);
        o.start();
        o.stop(a.currentTime + dur + 0.02);
    }

    function noise(dur, gain) {
        if (!soundOn.value) return;
        const a = ac();
        if (!a) return;
        const buf = a.createBuffer(1, a.sampleRate * dur, a.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
        const src = a.createBufferSource();
        src.buffer = buf;
        const g = a.createGain();
        g.gain.value = gain || 0.04;
        const filt = a.createBiquadFilter();
        filt.type = 'highpass';
        filt.frequency.value = 800;
        src.connect(filt).connect(g).connect(a.destination);
        src.start();
    }

    function vibrate(ms = 8) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(ms);
    }

    const sfx = {
        hover: () => blip(880, 0.04, 'triangle', 0.025),
        tap: () => blip(620, 0.06, 'square', 0.05),
        pick: () => { blip(880, 0.05, 'square', 0.05); setTimeout(() => blip(1320, 0.07, 'square', 0.04), 40); },
        next: () => { blip(740, 0.06, 'sawtooth', 0.05); setTimeout(() => blip(1100, 0.08, 'square', 0.04), 60); },
        back: () => blip(420, 0.06, 'square', 0.04),
        rewind: () => noise(0.6, 0.05),
        reveal: () => {
            const seq = [440, 660, 880, 1320];
            seq.forEach((f, i) => setTimeout(() => blip(f, 0.12, 'square', 0.05), i * 100));
            setTimeout(() => noise(0.4, 0.04), 0);
        },
    };

    function popBurst(x, y) {
        if (typeof document === 'undefined') return;
        const colors = ['var(--qz-pink)', 'var(--qz-blue)', 'var(--qz-yellow)', 'var(--qz-green)'];
        const wrap = document.createElement('div');
        wrap.className = 'qz-pickburst';
        wrap.style.left = x + 'px';
        wrap.style.top = y + 'px';
        for (let i = 0; i < 14; i++) {
            const s = document.createElement('span');
            const ang = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
            const dist = 60 + Math.random() * 80;
            s.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
            s.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
            s.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
            s.style.background = colors[i % colors.length];
            s.style.borderRadius = i % 3 === 0 ? '50%' : '2px';
            wrap.appendChild(s);
        }
        document.body.appendChild(wrap);
        setTimeout(() => wrap.remove(), 700);
    }

    function tapFeedback(e, sfxName) {
        if (sfx[sfxName]) sfx[sfxName]();
        vibrate();
        const r = e?.currentTarget?.getBoundingClientRect?.();
        if (r) popBurst(r.left + r.width / 2, r.top + r.height / 2);
    }

    function toggleSound() {
        soundOn.value = !soundOn.value;
    }

    return { soundOn, sfx, tapFeedback, popBurst, toggleSound };
}
