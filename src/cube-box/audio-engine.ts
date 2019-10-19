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
import { exponOver, expon } from "./audio-engine/expon";

export default class AudioEngine {
  public filterEnvelopeQ: number;
  public frequencyModulationAmount: number;
  public amplitudeRelease: number;

  ctx: AudioContext;
  masterGain: GainNode;
  masterFilter: BiquadFilterNode;
  lfoFreq: number;
  exponentialEnvelope: boolean;
  filterEnvelopeSustain: number;
  filterEnvelopeStart: number;

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
    startTime: number,
    decayTime: number,
    freq: number,
    detune: number,
    oscialltorType: string,
    velocity: number
  ) {
    /**
     * Every playTone() invocation creates a new oscialltor and destroys it when the note is done.
     *
     * We can do this because playTone requires a decayTime known ahead of time.
     */
    const osc = new Oscillator(this.ctx).node(
      startTime,
      decayTime,
      oscialltorType,
      freq,
      detune
    );

    const lfo = new FequencyModulation(this.ctx).node(
      startTime,
      decayTime,
      this.lfoFreq,
      this.frequencyModulationAmount
    );

    const ampEnv = new AmplitudeEnvelope(this.ctx).node(
      startTime,
      decayTime,
      this.exponentialEnvelope,
      this.amplitudeRelease
    );

    const filterEnv = new EnvelopeFilter(this.ctx).node(
      startTime,
      decayTime,
      this.filterEnvelopeStart,
      this.filterEnvelopeQ,
      this.filterEnvelopeSustain
    );

    const velocityGain = new Velocity(this.ctx).node(startTime, velocity);

    lfo.connect(osc.frequency);
    osc.connect(ampEnv);
    ampEnv.connect(filterEnv);
    filterEnv.connect(velocityGain);
    velocityGain.connect(this.masterFilter);
    // lfo
    //  |
    // osc -> ampEnv -> filterEnv -> velocityGain -> masterFilter
  }

  setMasterGain(input: string): void {
    this.masterGain.gain.value = expon(input);
  }

  setMasterFilterValue(input: string): void {
    this.masterFilter.frequency.setValueAtTime(
      exponOver(input, 18500, 20),
      this.ctx.currentTime
    );
  }

  setLfoFrequency(input: string): void {
    this.lfoFreq = exponOver(input, 8, 0.001);
  }

  setFilterEnvelopeStartFrequency(input: string): void {
    this.filterEnvelopeStart = exponOver(input, 18500, 1000);
  }
}
