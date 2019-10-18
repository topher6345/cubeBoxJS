/**
 * AudioEngine is a subsystem that handles interaction with the WebAudio API.
 *
 * An instance is initialized which wraps the global audio context.
 *
 * The instance exposes a method playTone() which plays the sound.
 *
 */
export default class AudioEngine {
  public filterEnvelopeQ: number;
  public filterEnvelopeStart: number;
  public frequencyModulationAmount: number;
  public amplitudeRelease: number;

  lfoFreq: number;
  masterFilter: BiquadFilterNode;
  masterGain: GainNode;
  ctx: AudioContext;
  sineTerms: Float32Array;
  cosineTerms: Float32Array;
  customWaveform: PeriodicWave;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
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

    this.filterEnvelopeStart = 12000;
    this.amplitudeRelease = 0.2;

    this.customWaveform = <PeriodicWave>(
      this.ctx.createPeriodicWave(this.cosineTerms, this.sineTerms)
    );

    this.frequencyModulationAmount = 3;
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
    frequencyModulationGain.gain.value = this.frequencyModulationAmount;

    const amplitudeEnvelope = this.ctx.createGain();
    const amplitudeAttack = 0.1; // TODO: hook this up to UI
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
      currentTime + delay + decayTime + this.amplitudeRelease
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

  setMasterGain(input: string) {
    this.masterGain.gain.value = this.expon(input);
  }

  setMasterFilterValue(input: string) {
    this.masterFilter.frequency.setValueAtTime(
      this.exponOver(input, 18500, 20),
      this.currentTime()
    );
  }

  setLfoFrequency(input: string) {
    this.lfoFreq = this.exponOver(input, 8, 0.001);
  }

  setFilterEnvelopeStartFrequency(input: string) {
    this.masterFilter.frequency.setValueAtTime(
      this.exponOver(input, 18500, 1000),
      this.currentTime()
    );
  }

  private exponOver(input: string, max: number, floor: number) {
    return this.expon(input) * max + floor;
  }

  private expon(x: string) {
    // Must be in range 0.0-1.0
    return -Math.sqrt(-parseFloat(x) + 1) + 1;
  }

  private currentTime(): number {
    return this.ctx.currentTime;
  }
}
