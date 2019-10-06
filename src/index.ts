let masterControlState = true;

import { SCALES } from "./scales";
import cubeBox from "./cube-box";
import AudioEngine from "./audio-engine";
import CompositionEngine from "./composition-engine";
const audioEngine = new AudioEngine();
const compositionEngine = new CompositionEngine(audioEngine, "square");

const UI: any = {};
UI.wavePicker = <HTMLSelectElement>(
  document.querySelector("select[name='waveform']")
);

UI.wavePicker.addEventListener(
  "change",
  () => {
    compositionEngine.oscialltorType =
      UI.wavePicker.options[UI.wavePicker.selectedIndex].value;
  },
  false
);

UI.volumeControl = <HTMLInputElement>(
  document.querySelector("input[name='volume']")
);
UI.volumeControl.addEventListener(
  "change",
  () => {
    audioEngine.masterGain.gain.value = parseFloat(UI.volumeControl.value);
  },
  false
);

UI.masterControl = <HTMLInputElement>(
  document.querySelector("input[name='masterClock']")
);
UI.masterControl.addEventListener(
  "change",
  () => {
    masterControlState = UI.masterControl.checked;
  },
  false
);

UI.scalePicker = <HTMLSelectElement>(
  document.querySelector("select[name='scale']")
);

UI.filterControl = <HTMLInputElement>(
  document.querySelector("input[name='filter']")
);
UI.filterControl.addEventListener(
  "change",
  () => {
    audioEngine.masterFilter.frequency.setValueAtTime(
      parseFloat(UI.filterControl.value),
      audioEngine.currentTime()
    );
  },
  false
);

let then: number = null;
function main(now: number) {
  if (!then) then = now;

  // Every chordSpeed milliseconds
  if (
    (!then || now - then > compositionEngine.chordSpeed) &&
    masterControlState
  ) {
    compositionEngine.chordVoices.forEach((voice: Generator, index: number) => {
      const scaleDegree = voice.next().value;
      if (scaleDegree) {
        const colorIndex = SCALES[UI.scalePicker.value][scaleDegree];
        compositionEngine.notePressed(
          colorIndex,
          compositionEngine.globalRoot,
          0
        );
        cubeBox.play(index, colorIndex);
      }
    });

    compositionEngine.swipeVoices.forEach((voice: Generator, index: number) => {
      const scaleDegree = voice.next().value;
      const swipeFrequency = 0.4;
      if (scaleDegree) {
        const colorIndex = SCALES[UI.scalePicker.value][scaleDegree];
        compositionEngine.notePressed(
          colorIndex,
          compositionEngine.globalRoot,
          index * swipeFrequency
        );
        setTimeout(
          () => cubeBox.play(index + 4, colorIndex),
          index * swipeFrequency * 1000
        );
      }
    });
    then = now;
  }
  cubeBox.draw();
  requestAnimationFrame(main);
  return;
}

requestAnimationFrame(main);
