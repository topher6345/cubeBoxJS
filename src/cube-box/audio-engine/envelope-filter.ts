export default class EnvelopeFilter {
  ctx: AudioContext;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  node(
    startTime: number,
    decayTime: number,
    start: number,
    Q: number,
    sustain: number
  ): BiquadFilterNode {
    const currentTime = this.ctx.currentTime;
    const biquadFilter = this.ctx.createBiquadFilter();

    biquadFilter.type = "lowpass";
    biquadFilter.Q.value = Q;
    biquadFilter.frequency.setValueAtTime(start, currentTime);
    biquadFilter.frequency.exponentialRampToValueAtTime(
      sustain,
      currentTime + startTime + decayTime
    );

    return biquadFilter;
  }
}