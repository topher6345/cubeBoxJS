export default class EnvelopeFilter {
  ctx: AudioContext;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  node(
    start: number,
    Q: number,
    sustain: number,
    delay: number
  ): BiquadFilterNode {
    const currentTime = this.ctx.currentTime;
    const biquadFilter = this.ctx.createBiquadFilter();

    biquadFilter.type = "lowpass";
    biquadFilter.Q.value = Q;
    biquadFilter.frequency.setValueAtTime(start, currentTime);
    biquadFilter.frequency.exponentialRampToValueAtTime(
      sustain,
      currentTime + delay + 1
    );

    return biquadFilter;
  }
}
