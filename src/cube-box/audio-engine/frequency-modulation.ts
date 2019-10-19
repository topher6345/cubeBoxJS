export default class FequencyModulation {
  ctx: AudioContext;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }
  node(
    delay: number,
    decayTime: number,
    lfoFreq: number,
    frequencyModulationAmount: number
  ) {
    const currentTime = this.ctx.currentTime;
    const frequencyModulation = this.ctx.createOscillator();

    frequencyModulation.type = "sine"; // TODO: hook this up to UI
    frequencyModulation.frequency.value = lfoFreq;

    frequencyModulation.start(currentTime + delay);
    frequencyModulation.stop(currentTime + decayTime + delay);

    const frequencyModulationGain = this.ctx.createGain();
    frequencyModulationGain.gain.value = frequencyModulationAmount;
    frequencyModulation.connect(frequencyModulationGain);

    return frequencyModulationGain;
  }
}
