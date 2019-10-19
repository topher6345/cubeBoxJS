const expZero = 0.00000001;

export default class AmplitudeEnvelope {
  ctx: AudioContext;
  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  node(
    delay: number,
    sustain: boolean,
    decayTime: number,
    amplitudeRelease: number
  ): GainNode {
    const currentTime = this.ctx.currentTime;
    const amplitudeEnvelope = this.ctx.createGain();
    const amplitudeAttack = 0.1; // TODO: hook this up to UI

    // Amplitude Pre-Attack
    amplitudeEnvelope.gain.cancelScheduledValues(currentTime + delay);
    amplitudeEnvelope.gain.setValueAtTime(0, currentTime + delay);

    // Amplitude Attack
    amplitudeEnvelope.gain.linearRampToValueAtTime(
      1,
      currentTime + delay + amplitudeAttack
    );

    // Amplitude Decay
    if (sustain) {
      amplitudeEnvelope.gain.exponentialRampToValueAtTime(
        expZero,
        currentTime + delay + decayTime + amplitudeRelease
      );
    } else {
      amplitudeEnvelope.gain.linearRampToValueAtTime(
        0,
        currentTime + delay + decayTime + amplitudeRelease
      );
    }

    return amplitudeEnvelope;
  }
}
