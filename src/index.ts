let masterControlState = true;

import { SCALES } from "./scales";
import cubeBox from "./cube-box";
import AudioEngine from "./audio-engine";
import CompositionEngine from "./composition-engine";
const audioEngine = new AudioEngine();
const compositionEngine = new CompositionEngine(audioEngine, "square");

class UI {
  wavePicker: HTMLSelectElement;
  volumeControl: HTMLInputElement;
  masterControl: HTMLInputElement;
  scalePicker: HTMLSelectElement;
  filterControl: HTMLInputElement;
}

const ui = new UI();

ui.wavePicker = <HTMLSelectElement>(
  document.querySelector("select[name='waveform']")
);

ui.wavePicker.addEventListener(
  "change",
  () => {
    compositionEngine.oscialltorType =
      ui.wavePicker.options[ui.wavePicker.selectedIndex].value;
  },
  false
);

ui.volumeControl = <HTMLInputElement>(
  document.querySelector("input[name='volume']")
);
ui.volumeControl.addEventListener(
  "change",
  () => {
    audioEngine.masterGain.gain.value = parseFloat(ui.volumeControl.value);
  },
  false
);

ui.masterControl = <HTMLInputElement>(
  document.querySelector("input[name='masterClock']")
);
ui.masterControl.addEventListener(
  "change",
  () => {
    masterControlState = ui.masterControl.checked;
  },
  false
);

ui.scalePicker = <HTMLSelectElement>(
  document.querySelector("select[name='scale']")
);

ui.filterControl = <HTMLInputElement>(
  document.querySelector("input[name='filter']")
);
ui.filterControl.addEventListener(
  "change",
  () => {
    audioEngine.masterFilter.frequency.setValueAtTime(
      parseFloat(ui.filterControl.value),
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
        const colorIndex = SCALES[ui.scalePicker.value][scaleDegree];
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
        const colorIndex = SCALES[ui.scalePicker.value][scaleDegree];
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
