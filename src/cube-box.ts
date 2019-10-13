import Scales from "./cube-box/scales";
import GraphicsEngine from "./cube-box/graphics-engine";
import AudioEngine from "./cube-box/audio-engine";
import CompositionEngine from "./cube-box/composition-engine";

export default class CubeBox {
  audioEngine: AudioEngine;
  compositionEngine: CompositionEngine;
  graphicsEngine: GraphicsEngine;
  masterControlState: boolean;
  then: number;
  scale: string;

  constructor(canvas: HTMLCanvasElement) {
    this.audioEngine = new AudioEngine();
    this.graphicsEngine = new GraphicsEngine(canvas);
    this.compositionEngine = new CompositionEngine(this.audioEngine, "square");
    this.masterControlState = true;
    // this.controls.attach("blendModePicker", () => {
    //   const index = this.controls.blendModePicker.selectedIndex;
    //   this.graphicsEngine.setBlendMode(
    //     this.controls.blendModePicker.options[index].value
    //   );
    // });

    // this.controls.attach("wavePicker", () => {
    //   this.compositionEngine.oscialltorType = this.controls.wavePicker.options[
    //     this.controls.wavePicker.selectedIndex
    //   ].value;
    // });

    // this.controls.attach("volumeControl", () => {
    //   this.audioEngine.setMasterGain(this.controls.volumeControl.value);
    // });

    // this.controls.attach("masterControl", () => {
    //   this.masterControlState = this.controls.masterControl.checked;
    // });

    // this.controls.attach("filterControl", () => {
    //   this.audioEngine.setMasterFilterValue(this.controls.filterControl.value);
    // });

    // this.controls.attach("decayTime", () => {
    //   this.compositionEngine.setDecayTime(this.controls.decayTime.value);
    // });

    // this.controls.attach("octave", () => {
    //   this.compositionEngine.globalRoot = parseFloat(
    //     this.controls.octave.value
    //   );
    // });

    // this.controls.attach("lfoFrequency", () => {
    //   this.audioEngine.setLfoFrequency(this.controls.lfoFrequency.value);
    // });

    // this.controls.attach("filterEnvelopeQ", () => {
    //   this.audioEngine.filterEnvelopeQ = parseFloat(
    //     this.controls.filterEnvelopeQ.value
    //   );
    // });

    // this.controls.attach("detune", () => {
    //   this.compositionEngine.detune = parseFloat(this.controls.detune.value);
    // });

    // this.controls.attach("filterEnvelopeStart", () => {
    //   this.audioEngine.setFilterEnvelopeStartFrequency(
    //     this.controls.filterEnvelopeStart.value
    //   );
    // });

    // this.controls.attach("frequencyModulationAmount", () => {
    //   this.audioEngine.frequencyModulationAmount = parseFloat(
    //     this.controls.frequencyModulationAmount.value
    //   );
    // });

    // this.controls.attach("amplitudeRelease", () => {
    //   this.audioEngine.amplitudeRelease = parseFloat(
    //     this.controls.amplitudeRelease.value
    //   );
    // });

    // this.controls.validate();
    this.then = null;
    this.scale = "Ionian";
  }

  tick(now: number) {
    if (!this.then) this.then = now;

    // Every chordSpeed milliseconds
    if (
      !this.then ||
      (now - this.then > this.compositionEngine.chordSpeed &&
        this.masterControlState)
    ) {
      this.play();
      this.then = now;
    }
    this.graphicsEngine.draw();
  }

  updateScale(scale: string) {
    this.scale = scale;
  }

  private play() {
    this.compositionEngine.chordVoices.forEach(
      (voice: Generator, index: number) => {
        const scaleDegree = voice.next().value;
        if (scaleDegree) {
          const colorIndex = Scales[this.scale][scaleDegree];
          this.compositionEngine.notePressed(colorIndex, 0);
          this.graphicsEngine.play(index, colorIndex);
        }
      }
    );

    this.compositionEngine.swipeVoices.forEach(
      (voice: Generator, index: number) => {
        const scaleDegree = voice.next().value;
        const swipeFrequency = 0.4;
        if (scaleDegree) {
          const colorIndex = Scales[this.scale][scaleDegree];
          this.compositionEngine.notePressed(
            colorIndex,
            index * swipeFrequency
          );
          setTimeout(
            () => this.graphicsEngine.play(index + 4, colorIndex),
            index * swipeFrequency * 1000
          );
        }
      }
    );
  }
}
