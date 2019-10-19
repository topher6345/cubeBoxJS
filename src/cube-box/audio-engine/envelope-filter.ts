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

    // Filter Frequency Initialization
    biquadFilter.frequency.setValueAtTime(start, currentTime);

    // Filter Frequency Decay
    biquadFilter.frequency.exponentialRampToValueAtTime(
      sustain, // Filter Frequency Sustain
      currentTime + delay + 1
    );

    return biquadFilter;
  }
}
