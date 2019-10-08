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
  public filterEnvelopeStart: number;

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

    this.filterEnvelopeStart = 12000; // TODO: hook this up to UI

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

    const oscillator: OscillatorNode = this.ctx.createOscillator();
    if (oscialltorType == "custom") {
      oscillator.setPeriodicWave(this.customWaveform); // TODO: Add more custom Waveforms
    } else {
      oscillator.type = <OscillatorType>oscialltorType;
    }
    oscillator.frequency.value = freq;
    oscillator.detune.setValueAtTime(detune, currentTime + delay);

    const frequencyModulation = this.ctx.createOscillator();
    frequencyModulation.type = "sine"; // TODO: hook this up to UI
    frequencyModulation.frequency.value = this.lfoFreq;

    const frequencyModulationGain = this.ctx.createGain();
    frequencyModulationGain.gain.value = 3; // TODO: hook this up to UI

    const amplitudeEnvelope = this.ctx.createGain();
    const amplitudeAttack = 0.1; // TODO: hook this up to UI
    const amplitudeRelease = 0.2;
    // Amplitude Pre-Attack
    amplitudeEnvelope.gain.cancelScheduledValues(currentTime + delay);
    amplitudeEnvelope.gain.setValueAtTime(0, currentTime + delay);
    // Amplitude Attack
    amplitudeEnvelope.gain.linearRampToValueAtTime(
      1,
      currentTime + delay + amplitudeAttack
    );
    // Amplitude Decay
    amplitudeEnvelope.gain.exponentialRampToValueAtTime(
      expZero,
      currentTime + delay + decayTime + amplitudeRelease
    );

    const biquadFilter = this.ctx.createBiquadFilter();
    const filterEnvelopeSustain = 1000; // TODO: hook this up to UI

    biquadFilter.type = "lowpass";
    biquadFilter.Q.value = this.filterEnvelopeQ;

    // Filter Frequency Pre-Attack
    biquadFilter.frequency.setValueAtTime(
      this.filterEnvelopeStart,
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
    //           osc -> amplitudeEnvelope -> biquadFilter -> masterFilter
    frequencyModulation.connect(frequencyModulationGain);
    frequencyModulationGain.connect(oscillator.frequency);
    oscillator.connect(amplitudeEnvelope);
    amplitudeEnvelope.connect(biquadFilter);
    biquadFilter.connect(this.masterFilter);

    frequencyModulation.start(currentTime + delay);
    oscillator.start(currentTime + delay);
    oscillator.stop(currentTime + decayTime + delay);
    frequencyModulation.stop(currentTime + decayTime + delay);
  }
}
