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
