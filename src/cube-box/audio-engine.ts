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
import exponOver from "./audio-engine/expon";
import makeDistortionCurve from "./audio-engine/distortion";

export default class AudioEngine {
  private ctx: AudioContext;

  public masterFilter: BiquadFilterNode;
  public distortion: WaveShaperNode;
  private compressor: DynamicsCompressorNode;
  public masterGain: GainNode;

  public lfoAmount: number;
  public lfoWave: string;
  public lfoFreq: number;

  public filterEnvelopeQ: number;
  public filterEnvelopeSustain: number;
  public filterEnvelopeStart: number;

  public amplitudeRelease: number;
  public sustain: boolean;
  public amplitudeAttack: number;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;

    this.masterFilter = this.ctx.createBiquadFilter();
    this.masterFilter.type = "lowpass";
    this.masterFilter.frequency.setValueAtTime(18500, this.ctx.currentTime);
    this.masterFilter.Q.value = 0.01;

    this.distortion = ctx.createWaveShaper();

    this.distortion.curve = makeDistortionCurve(0);
    this.distortion.oversample = "4x";

    this.compressor = ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-50, ctx.currentTime);
    this.compressor.knee.setValueAtTime(40, ctx.currentTime);
    this.compressor.ratio.setValueAtTime(12, ctx.currentTime);
    this.compressor.attack.setValueAtTime(0, ctx.currentTime);
    this.compressor.release.setValueAtTime(0.25, ctx.currentTime);

    this.masterGain = <GainNode>this.ctx.createGain();

    this.distortion
      .connect(this.masterFilter)
      .connect(this.compressor)
      .connect(this.masterGain)
      .connect(this.ctx.destination);

    this.lfoFreq = 0.1;
    this.lfoAmount = 2;
    this.lfoWave = "sine";

    this.filterEnvelopeQ = 0.1;
    this.filterEnvelopeStart = 18500;
    this.filterEnvelopeSustain = 300;

    this.amplitudeAttack = 0.25;
    this.sustain = true;
    this.amplitudeRelease = 0.4;
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
      this.lfoAmount,
      this.lfoWave
    );

    const ampEnv = new AmplitudeEnvelope(this.ctx).node(
      startTime,
      decayTime,
      this.sustain,
      this.amplitudeRelease,
      this.amplitudeAttack
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
    osc
      .connect(ampEnv)
      .connect(filterEnv)
      .connect(velocityGain)
      .connect(this.distortion);
  }

  setMasterGain(input: string): void {
    this.masterGain.gain.value = exponOver(input, 1.0, 0.0);
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

  setFilterEnvelopeSustain(input: string): void {
    this.filterEnvelopeSustain = exponOver(input, 18500, 10);
  }

  setDistortionAmount(input: string): void {
    this.distortion.curve = makeDistortionCurve(exponOver(input, 1.0, 0.0));
  }
}
