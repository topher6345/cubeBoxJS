export class EnvelopeFilter {
  ctx: AudioContext;
  currentTime: number;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.currentTime = this.ctx.currentTime;
  }

  node(
    start: number,
    Q: number,
    sustain: number,
    time: number
  ): BiquadFilterNode {
    const biquadFilter = this.ctx.createBiquadFilter();
    biquadFilter.type = "lowpass";
    biquadFilter.Q.value = Q;

    // Filter Frequency Pre-Attack
    biquadFilter.frequency.setValueAtTime(start, this.currentTime);

    // Filter Frequency Decay
    biquadFilter.frequency.exponentialRampToValueAtTime(
      sustain, // Filter Frequency Sustain
      time + 1
    );

    return biquadFilter;
  }
}
