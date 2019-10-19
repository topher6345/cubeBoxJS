const expZero = 0.00000001;

export default class AmplitudeEnvelope {
  private ctx: AudioContext;
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
    const playTime = currentTime + startTime;
    const amplitudeEnvelope = this.ctx.createGain();
    const amplitudeAttack = 0.1; // TODO: hook this up to UI

    // Amplitude Pre-Attack
    amplitudeEnvelope.gain.cancelScheduledValues(playTime);
    amplitudeEnvelope.gain.setValueAtTime(0, playTime);

    // Amplitude Attack
    amplitudeEnvelope.gain.linearRampToValueAtTime(
      1,
      playTime + amplitudeAttack
    );

    // Amplitude Decay
    if (sustain) {
      amplitudeEnvelope.gain.exponentialRampToValueAtTime(
        expZero,
        playTime + decayTime + amplitudeRelease
      );
    } else {
      amplitudeEnvelope.gain.linearRampToValueAtTime(
        0,
        playTime + decayTime + amplitudeRelease
      );
    }

    return amplitudeEnvelope;
  }
}
