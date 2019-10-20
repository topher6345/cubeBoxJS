export default class Oscillator {
  private ctx: AudioContext;
  private customWaveform: PeriodicWave;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    const sineTerms = new Float32Array([0, 0, 1, 0, 1]);
    const cosineTerms = new Float32Array(sineTerms.length);
    this.customWaveform = this.ctx.createPeriodicWave(cosineTerms, sineTerms);
  }

  node(
    startTime: number,
    noteLength: number,
    oscillatorWave: string,
    frequency: number,
    detune: number
  ): OscillatorNode {
    const currentTime = this.ctx.currentTime;
    const oscillator = this.ctx.createOscillator();

    if (oscillatorWave == "custom") {
      oscillator.setPeriodicWave(this.customWaveform); // TODO: Add more custom Waveforms
    } else {
      oscillator.type = <OscillatorType>oscillatorWave;
    }

    oscillator.frequency.value = frequency;
    oscillator.detune.setValueAtTime(detune, currentTime + startTime);

    oscillator.start(currentTime + startTime);
    oscillator.stop(currentTime + noteLength + startTime);

    return oscillator;
  }
}
