export default class Oscillator {
  ctx: AudioContext;
  currentTime: number;
  sineTerms: Float32Array;
  cosineTerms: Float32Array;
  customWaveform: PeriodicWave;

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
    delay: number,
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
    oscillator.detune.setValueAtTime(detune, currentTime + delay);

    oscillator.start(currentTime + delay);
    oscillator.stop(currentTime + decayTime + delay);

    return oscillator;
  }
}
