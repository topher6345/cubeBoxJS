const expZero = 0.00000001;

export default class AmplitudeEnvelope {
  private ctx: AudioContext;
  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  node(
    startTime: number,
    noteLength: number,
    sustain: boolean,
    amplitudeRelease: number,
    amplitudeAttack: number
  ): GainNode {
    const currentTime = this.ctx.currentTime;
    const playTime = currentTime + startTime;
    const gainNode = this.ctx.createGain();

    // Amplitude Pre-Attack
    gainNode.gain.cancelScheduledValues(playTime);
    gainNode.gain.setValueAtTime(0, playTime);

    // Amplitude Attack
    gainNode.gain.linearRampToValueAtTime(1, playTime + amplitudeAttack);

    // Amplitude Decay
    if (sustain) {
      gainNode.gain.exponentialRampToValueAtTime(
        expZero,
        playTime + noteLength + amplitudeRelease
      );
    } else {
      gainNode.gain.linearRampToValueAtTime(
        0,
        playTime + noteLength + amplitudeRelease
      );
    }

    return gainNode;
  }
}
