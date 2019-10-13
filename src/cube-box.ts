import Scales from "./cube-box/scales";
import GraphicsEngine from "./cube-box/graphics-engine";
import AudioEngine from "./cube-box/audio-engine";
import CompositionEngine from "./cube-box/composition-engine";

export default class CubeBox {
  /**
   *
   * Responsible for drawing to the screen and playing the sounds
   *
   * exposes subsystems to the UI for interaction
   *
   * exposes one public method tick() which can be called at 60fps
   *
   */

  audioEngine: AudioEngine;
  compositionEngine: CompositionEngine;
  graphicsEngine: GraphicsEngine;
  masterControlState: boolean;
  scale: string;

  private then: number;

  constructor(canvas: HTMLCanvasElement, ctx: AudioContext) {
    this.audioEngine = new AudioEngine(ctx);
    this.graphicsEngine = new GraphicsEngine(canvas);
    this.compositionEngine = new CompositionEngine(this.audioEngine);
    this.masterControlState = true;
    this.then = null;
    this.scale = "Ionian";
  }

  /**
   *
   * Every chordSpeed milliseconds call play()
   *
   */

  tick(now: number) {
    if (!this.then) this.then = now;

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

  /**
   *
   * play the chord voices (sounds and colors)
   *
   * play the swipe voices (sounds and colors)
   *
   */
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
