export default class AudioEngine {
  /**
   * AudioEngine is a subsystem that handles interaction with the WebAudio API.
   *
   * An instance is initialized which wraps the global audio context.
   *
   * The instance exposes a method playTone() which plays the sound.
   *
   */

  /**
   * These properties can be hooked up to the UI
   * */
  public masterGain: GainNode;
  public masterFilter: BiquadFilterNode;
  public lfoFreq: number;
  public filterEnvelopeQ: number;

  private ctx: AudioContext;
  private sineTerms: Float32Array;
  private cosineTerms: Float32Array;
  private customWaveform: PeriodicWave;

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

    this.lfoFreq = 0.01;
    this.filterEnvelopeQ = 0.01;

    this.customWaveform = <PeriodicWave>(
      this.ctx.createPeriodicWave(this.cosineTerms, this.sineTerms)
    );
  }

  currentTime(): number {
    return this.ctx.currentTime;
  }

  playTone(
    freq: number,
    detune: number,
    delay: number,
    decayTime: number,
    oscialltorType: string
  ) {
    /**
     * Every playTone() invocation creates a new oscialltor and destroys it when the note is done.
     *
     * We can do this because playTone requires a decayTime known ahead of time.
     */
    const currentTime = this.ctx.currentTime;
    const expZero = 0.00000001;

    const osc: OscillatorNode = this.ctx.createOscillator();
    if (oscialltorType == "custom") {
      osc.setPeriodicWave(this.customWaveform); // TODO: Add more custom Waveforms
    } else {
      osc.type = <OscillatorType>oscialltorType;
    }
    osc.frequency.value = freq;
    osc.detune.setValueAtTime(detune, currentTime + delay);

    const sine = this.ctx.createOscillator();
    sine.type = "sine";
    sine.frequency.value = this.lfoFreq;

    const sineGain = this.ctx.createGain();
    sineGain.gain.value = 3; // TODO: hook this up to UI

    const attackDecay = this.ctx.createGain();
    // Amplitude Pre-Attack
    attackDecay.gain.cancelScheduledValues(currentTime + delay);
    attackDecay.gain.setValueAtTime(0, currentTime + delay);
    // Amplitude Attack
    attackDecay.gain.linearRampToValueAtTime(1, currentTime + delay + 0.1);
    // Amplitude Decay
    attackDecay.gain.exponentialRampToValueAtTime(
      expZero,
      currentTime + delay + decayTime + 0.2
    );

    const biquadFilter = this.ctx.createBiquadFilter();
    const biquadFilterInitCutoffFreq = 12000; // TODO: hook this up to UI
    const filterEnvelopeSustain = 1000; // TODO: hook this up to UI

    biquadFilter.type = "lowpass";
    biquadFilter.Q.value = this.filterEnvelopeQ;

    // Filter Frequency Pre-Attack
    biquadFilter.frequency.setValueAtTime(
      biquadFilterInitCutoffFreq,
      currentTime
    );

    // Filter Frequency Decay
    biquadFilter.frequency.exponentialRampToValueAtTime(
      filterEnvelopeSustain, // Filter Frequency Sustain
      currentTime + delay + 1
    );

    // sine -> sineGain
    //            |
    //          frequency
    //            |
    //           osc -> attackDecay -> biquadFilter -> masterFilter
    sine.connect(sineGain);
    sineGain.connect(osc.frequency);
    osc.connect(attackDecay);
    attackDecay.connect(biquadFilter);
    biquadFilter.connect(this.masterFilter);

    sine.start(currentTime + delay);
    osc.start(currentTime + delay);
    osc.stop(currentTime + decayTime + delay);
    sine.stop(currentTime + decayTime + delay);
  }
}
