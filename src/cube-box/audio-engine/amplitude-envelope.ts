const expZero = 0.00000001;

export default class AmplitudeEnvelope {
  ctx: AudioContext;
  currentTime: number;
  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.currentTime = this.ctx.currentTime;
  }

  node(
    delay: number,
    exponentialEnvelope: boolean,
    decayTime: number,
    amplitudeRelease: number
  ): GainNode {
    const amplitudeEnvelope = this.ctx.createGain();
    const amplitudeAttack = 0.1; // TODO: hook this up to UI
    // Amplitude Pre-Attack
    amplitudeEnvelope.gain.cancelScheduledValues(this.currentTime + delay);
    amplitudeEnvelope.gain.setValueAtTime(0, this.currentTime + delay);
    // Amplitude Attack
    amplitudeEnvelope.gain.linearRampToValueAtTime(
      1,
      this.currentTime + delay + amplitudeAttack
    );
    // Amplitude Decay
    if (exponentialEnvelope) {
      amplitudeEnvelope.gain.exponentialRampToValueAtTime(
        expZero,
        this.currentTime + delay + decayTime + amplitudeRelease
      );
    } else {
      // Amplitude Decay
      amplitudeEnvelope.gain.linearRampToValueAtTime(
        0,
        this.currentTime + delay + decayTime + amplitudeRelease
      );
    }

    return amplitudeEnvelope;
  }
}
