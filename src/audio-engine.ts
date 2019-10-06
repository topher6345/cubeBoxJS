class AudioEngine {
  ctx: AudioContext;
  masterGain: GainNode;
  masterFilter: BiquadFilterNode;
  sineTerms: Float32Array;
  cosineTerms: Float32Array;
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

    this.sineTerms = new Float32Array([0, 0, 1, 0, 1]);
    this.cosineTerms = new Float32Array(this.sineTerms.length);
    this.masterFilter.connect(this.masterGain);

    this.customWaveform = <PeriodicWave>(
      this.ctx.createPeriodicWave(this.cosineTerms, this.sineTerms)
    );
  }

  playTone(
    freq: number,
    detune: number,
    delay: number,
    decayTime: number,
    oscialltorType: string
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
    const filterEnvelopeSustain = 1000;
    const currentTime = this.ctx.currentTime;

    biquadFilter.type = "lowpass";
    biquadFilter.frequency.setValueAtTime(
      biquadFilterInitCutoffFreq,
      currentTime
    );
    biquadFilter.Q.value = biquadFilterQValue;

    biquadFilter.frequency.exponentialRampToValueAtTime(
      filterEnvelopeSustain,
      currentTime + delay + 1
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

    // const oscialltorType: string =
    // UI.wavePicker.options[UI.wavePicker.selectedIndex].value;

    if (oscialltorType == "custom") {
      osc.setPeriodicWave(this.customWaveform);
    } else {
      osc.type = <OscillatorType>oscialltorType;
    }

    ADSRNode.gain.cancelScheduledValues(currentTime + delay);
    ADSRNode.gain.setValueAtTime(0, currentTime + delay);
    ADSRNode.gain.linearRampToValueAtTime(1, currentTime + delay + 0.1);

    osc.frequency.value = freq;
    osc.detune.setValueAtTime(detune, currentTime + delay);
    sine.start(currentTime + delay);
    osc.start(currentTime + delay);

    ADSRNode.gain.exponentialRampToValueAtTime(
      expZero,
      currentTime + delay + decayTime + 0.2
    );
    osc.stop(currentTime + decayTime + delay);
    sine.stop(currentTime + decayTime + delay);
  }
}

export default AudioEngine;