/**
 * AudioEngine is a subsystem that handles interaction with the WebAudio API.
 *
 * An instance is initialized which wraps the global audio context.
 *
 * The instance exposes a method playTone() which plays the sound.
 *
 */

import EnvelopeFilter from "./audio-engine/envelope-filter";
import AmplitudeEnvelope from "./audio-engine/amplitude-envelope";
import Oscillator from "./audio-engine/oscillator";
import FequencyModulation from "./audio-engine/frequency-modulation";
import Velocity from "./audio-engine/velocity";

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
  exponentialEnvelope: boolean;
  filterEnvelopeSustain: number;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.masterGain = <GainNode>this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);

    this.masterFilter = this.ctx.createBiquadFilter();
    this.masterFilter.type = "lowpass";
    this.masterFilter.frequency.setValueAtTime(12000, this.ctx.currentTime);
    this.masterFilter.Q.value = 0.01;
    this.masterFilter.connect(this.masterGain);

    this.lfoFreq = 0.01;
    this.filterEnvelopeQ = 0.01;
    this.filterEnvelopeStart = 12000;
    this.amplitudeRelease = 0.2;
    this.frequencyModulationAmount = 3;
    this.exponentialEnvelope = true;

    this.filterEnvelopeSustain = 1000;
  }

  playTone(
    freq: number,
    detune: number,
    delay: number,
    decayTime: number,
    oscialltorType: string,
    velocity: number
  ) {
    /**
     * Every playTone() invocation creates a new oscialltor and destroys it when the note is done.
     *
     * We can do this because playTone requires a decayTime known ahead of time.
     */
    const osc = new Oscillator(this.ctx).node(
      oscialltorType,
      freq,
      detune,
      delay,
      decayTime
    );

    const lfo = new FequencyModulation(this.ctx).node(
      this.lfoFreq,
      this.frequencyModulationAmount,
      delay,
      decayTime
    );

    const ampEnv = new AmplitudeEnvelope(this.ctx).node(
      delay,
      this.exponentialEnvelope,
      decayTime,
      this.amplitudeRelease
    );

    const filterEnv = new EnvelopeFilter(this.ctx).node(
      this.filterEnvelopeStart,
      this.filterEnvelopeQ,
      this.filterEnvelopeSustain,
      delay
    );

    const velocityGain = new Velocity(this.ctx).node(velocity, delay);
    // lfo
    //  |
    // osc -> ampEnv -> filterEnv -> velocityGain -> masterFilter

    lfo.connect(osc.frequency);
    osc.connect(ampEnv);
    ampEnv.connect(filterEnv);
    filterEnv.connect(velocityGain);
    velocityGain.connect(this.masterFilter);
  }

  setMasterGain(input: string): void {
    this.masterGain.gain.value = this.expon(input);
  }

  setMasterFilterValue(input: string): void {
    this.masterFilter.frequency.setValueAtTime(
      this.exponOver(input, 18500, 20),
      this.ctx.currentTime
    );
  }

  setLfoFrequency(input: string): void {
    this.lfoFreq = this.exponOver(input, 8, 0.001);
  }

  setFilterEnvelopeStartFrequency(input: string): void {
    this.masterFilter.frequency.setValueAtTime(
      this.exponOver(input, 18500, 1000),
      this.ctx.currentTime
    );
  }

  private exponOver(input: string, max: number, floor: number) {
    return this.expon(input) * max + floor;
  }

  private expon(x: string) {
    // Must be in range 0.0-1.0
    return -Math.sqrt(-parseFloat(x) + 1) + 1;
  }
}
