class AudioEngine {
  ctx: AudioContext;
  masterGain: GainNode;
  masterFilter: BiquadFilterNode;
  customWaveform: PeriodicWave;

  constructor() {
    this.ctx = new AudioContext();
    this.masterGain = <GainNode>this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterFilter = this.ctx.createBiquadFilter();
    this.masterFilter.type = "lowpass";
    this.masterFilter.frequency.setValueAtTime(12000, this.ctx.currentTime);
    this.masterFilter.Q.value = 0.01;
    this.masterFilter.connect(this.masterGain);
    this.customWaveform = <PeriodicWave>(
      this.ctx.createPeriodicWave(
        new Float32Array([0, 0, 1, 0, 1]),
        new Float32Array(4)
      )
    );
  }

  playTone(
    freq: number,
    detune: number,
    delay: number,
    decayTime: number,
    oscillatorType: OscillatorType
  ) {
    const expZero = 0.00000001;
    const lfoFreq = 0.01;
    const osc: OscillatorNode = this.ctx.createOscillator();
    const sine = this.ctx.createOscillator();
    sine.type = "sine";
    sine.frequency.value = lfoFreq;

    const sineGain = this.ctx.createGain();
    sineGain.gain.value = 3;
    const ADSRNode = this.ctx.createGain();
    const biquadFilter = this.ctx.createBiquadFilter();
    const biquadFilterQValue = 0.01;
    const biquadFilterInitCutoffFreq = 12000;
    const biquadFilterADSRS = 1000;

    biquadFilter.type = "lowpass";
    biquadFilter.frequency.setValueAtTime(
      biquadFilterInitCutoffFreq,
      this.ctx.currentTime
    );
    biquadFilter.Q.value = biquadFilterQValue;

    biquadFilter.frequency.exponentialRampToValueAtTime(
      biquadFilterADSRS,
      this.ctx.currentTime + delay + 1
    );

    // sine -> sineGain
    //            |
    //          frequency
    //            |
    //           osc -> ADSRNode -> biquatFilter -> masterFilter
    sine.connect(sineGain);
    sineGain.connect(osc.frequency);
    osc.connect(ADSRNode);
    ADSRNode.connect(biquadFilter);
    biquadFilter.connect(this.masterFilter);

    // const oscillatorType: string =
    //   UI.wavePicker.options[UI.wavePicker.selectedIndex].value;

    if (oscillatorType == "custom") {
      osc.setPeriodicWave(this.customWaveform);
    } else {
      osc.type = <OscillatorType>oscillatorType;
    }

    ADSRNode.gain.cancelScheduledValues(this.ctx.currentTime + delay);
    ADSRNode.gain.setValueAtTime(0, this.ctx.currentTime + delay);
    ADSRNode.gain.linearRampToValueAtTime(
      1,
      this.ctx.currentTime + delay + 0.1
    );

    osc.frequency.value = freq;
    osc.detune.setValueAtTime(detune, this.ctx.currentTime + delay);
    sine.start(this.ctx.currentTime + delay);
    osc.start(this.ctx.currentTime + delay);

    ADSRNode.gain.exponentialRampToValueAtTime(
      expZero,
      this.ctx.currentTime + delay + decayTime + 0.2
    );
    osc.stop(this.ctx.currentTime + decayTime + delay);
    sine.stop(this.ctx.currentTime + decayTime + delay);
  }
}
