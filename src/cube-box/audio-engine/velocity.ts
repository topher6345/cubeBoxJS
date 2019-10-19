export default class Velocity {
  private ctx: AudioContext;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  node(startTime: number, velocity: number): GainNode {
    const velocityGain = this.ctx.createGain();
    velocityGain.gain.setValueAtTime(
      velocity,
      this.ctx.currentTime + startTime
    );
    return velocityGain;
  }
}
