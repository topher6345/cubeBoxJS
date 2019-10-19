export default class Velocity {
  ctx: AudioContext;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  node(velocity: number, delay: number): GainNode {
    const velocityGain = this.ctx.createGain();
    velocityGain.gain.setValueAtTime(velocity, this.ctx.currentTime + delay);
    return velocityGain;
  }
}
