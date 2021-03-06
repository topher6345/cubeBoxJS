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

export default class AudioEngine {
  private ctx: AudioContext;

  public masterFilter: BiquadFilterNode;
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
  private analyser: AnalyserNode;

  constructor(ctx: AudioContext, visualizeCanvas: HTMLCanvasElement) {
    this.ctx = ctx;

    this.masterFilter = this.ctx.createBiquadFilter();
    this.masterFilter.type = "lowpass";
    this.masterFilter.frequency.setValueAtTime(18500, this.ctx.currentTime);
    this.masterFilter.Q.value = 0.01;

    this.compressor = ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-50, ctx.currentTime);
    this.compressor.knee.setValueAtTime(40, ctx.currentTime);
    this.compressor.ratio.setValueAtTime(12, ctx.currentTime);
    this.compressor.attack.setValueAtTime(0, ctx.currentTime);
    this.compressor.release.setValueAtTime(0.25, ctx.currentTime);

    this.masterGain = <GainNode>this.ctx.createGain();

    this.analyser = this.ctx.createAnalyser();
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = -0;
    this.analyser.smoothingTimeConstant = 0.85;
    this.analyser.fftSize = 2048;

    this.masterFilter
      .connect(this.compressor)
      .connect(this.masterGain)
      .connect(this.analyser)
      .connect(this.ctx.destination);

    this.visualize(visualizeCanvas);

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

  visualize(canvas: HTMLCanvasElement) {
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const canvasCtx: CanvasRenderingContext2D = canvas.getContext("2d");
    const bufferLength = this.analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    const draw = () => {
      requestAnimationFrame(draw);

      this.analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = "rgba(200, 200, 200, 0.4)";
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "rgba(0, 0, 0, 0.8)";

      canvasCtx.beginPath();

      const sliceWidth = (WIDTH * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * HEIGHT) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();
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
      .connect(this.masterFilter);
  }

  setMasterGain(input: string): void {
    this.masterGain.gain.value = exponOver(input, 1.7, 0.0);
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
}
