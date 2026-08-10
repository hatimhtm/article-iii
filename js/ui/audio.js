/**
 * Optional ambience, synthesised — no audio files, nothing to download.
 * Off until the traveller asks for it.
 */
export function createAudio() {
  let ctx = null;
  let master = null;
  let drone = null;
  let on = false;

  function build() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const bus = ctx.createGain();
    bus.gain.value = 0.5;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 420;
    lp.Q.value = 0.6;
    bus.connect(lp).connect(master);

    // a slow, slightly detuned open fifth — D2 and A2
    const voices = [73.42, 110.0, 146.83].map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 2 ? 'triangle' : 'sine';
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = i === 2 ? 0.12 : 0.3;
      // gentle drift so it never sits perfectly still
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.03 + i * 0.017;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.6 + i * 0.4;
      lfo.connect(lfoGain).connect(o.detune);
      lfo.start();
      o.connect(g).connect(bus);
      o.start();
      return o;
    });
    drone = { voices, bus };
    return true;
  }

  return {
    get enabled() { return on; },
    toggle() {
      if (!ctx && !build()) return false;
      on = !on;
      ctx.resume?.();
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setTargetAtTime(on ? 0.16 : 0, t, on ? 1.4 : 0.5);
      return on;
    },
    /** a soft struck tone when a new section takes the stage */
    chime(index = 0) {
      if (!on || !ctx) return;
      const t = ctx.currentTime;
      // pentatonic, so any two chimes in a row still agree
      const scale = [0, 2, 4, 7, 9];
      const semis = scale[index % 5] + 12 * Math.floor((index % 15) / 5);
      const f = 293.66 * Math.pow(2, semis / 12);
      [1, 2.01].forEach((mult, k) => {
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.value = f * mult;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(k ? 0.035 : 0.07, t + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + (k ? 2.2 : 3.4));
        o.connect(g).connect(master);
        o.start(t);
        o.stop(t + 3.6);
      });
    },
    suspend() { if (ctx && !on) ctx.suspend?.(); },
  };
}
