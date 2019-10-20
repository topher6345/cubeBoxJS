export default class FequencyModulation {
  private ctx: AudioContext;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }
  node(
    startTime: number,
    noteLength: number,
    lfoFreq: number,
    lfoAmount: number,
    lfoWave: string
  ) {
    const currentTime = this.ctx.currentTime;
    const lfo = this.ctx.createOscillator();

    lfo.type = <OscillatorType>lfoWave;
    lfo.frequency.value = lfoFreq;

    lfo.start(currentTime + startTime);
    lfo.stop(currentTime + noteLength + startTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.value = lfoAmount;

    return lfo.connect(gainNode);
  }
}
