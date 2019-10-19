export default class Oscillator {
  private ctx: AudioContext;
  private sineTerms: Float32Array;
  private cosineTerms: Float32Array;
  private customWaveform: PeriodicWave;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.sineTerms = new Float32Array([0, 0, 1, 0, 1]);
    this.cosineTerms = new Float32Array(this.sineTerms.length);
    this.customWaveform = this.ctx.createPeriodicWave(
      this.cosineTerms,
      this.sineTerms
    );
  }

  node(
    startTime: number,
    decayTime: number,
    oscialltorType: string,
    freq: number,
    detune: number
  ): OscillatorNode {
    const currentTime = this.ctx.currentTime;
    const oscillator = this.ctx.createOscillator();

    if (oscialltorType == "custom") {
      oscillator.setPeriodicWave(this.customWaveform); // TODO: Add more custom Waveforms
    } else {
      oscillator.type = <OscillatorType>oscialltorType;
    }

    oscillator.frequency.value = freq;
    oscillator.detune.setValueAtTime(detune, currentTime + startTime);

    oscillator.start(currentTime + startTime);
    oscillator.stop(currentTime + decayTime + startTime);

    return oscillator;
  }
}
