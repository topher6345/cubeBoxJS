const expZero = 0.00000001;

export default class AmplitudeEnvelope {
  ctx: AudioContext;
  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  node(
    startTime: number,
    decayTime: number,
    sustain: boolean,
    amplitudeRelease: number
  ): GainNode {
    const currentTime = this.ctx.currentTime;
    const amplitudeEnvelope = this.ctx.createGain();
    const amplitudeAttack = 0.1; // TODO: hook this up to UI

    // Amplitude Pre-Attack
    amplitudeEnvelope.gain.cancelScheduledValues(currentTime + startTime);
    amplitudeEnvelope.gain.setValueAtTime(0, currentTime + startTime);

    // Amplitude Attack
    amplitudeEnvelope.gain.linearRampToValueAtTime(
      1,
      currentTime + startTime + amplitudeAttack
    );

    // Amplitude Decay
    if (sustain) {
      amplitudeEnvelope.gain.exponentialRampToValueAtTime(
        expZero,
        currentTime + startTime + decayTime + amplitudeRelease
      );
    } else {
      amplitudeEnvelope.gain.linearRampToValueAtTime(
        0,
        currentTime + startTime + decayTime + amplitudeRelease
      );
    }

    return amplitudeEnvelope;
  }
}
