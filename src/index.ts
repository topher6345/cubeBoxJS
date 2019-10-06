let masterControlState = true;

import { SCALES } from "./scales";
import cubeBox from "./cube-box";
import UI from "./ui";
import AudioEngine from "./audio-engine";
import CompositionEngine from "./composition-engine";
const audioEngine = new AudioEngine();
const compositionEngine = new CompositionEngine(audioEngine, "square");
const ui = new UI();

ui.blendModePicker.addEventListener(
  "change",
  () => {
    const index = ui.blendModePicker.selectedIndex;
    cubeBox.ctx.globalCompositeOperation =
      ui.blendModePicker.options[index].value;
  },
  false
);
ui.wavePicker.addEventListener(
  "change",
  () => {
    const index = ui.wavePicker.selectedIndex;
    compositionEngine.oscialltorType = ui.wavePicker.options[index].value;
  },
  false
);

function expon(x: string) {
  // Must be in range 0.0-1.0
  return -Math.sqrt(-parseFloat(x) + 1) + 1;
}

ui.volumeControl.addEventListener(
  "change",
  () => {
    audioEngine.masterGain.gain.value = expon(ui.volumeControl.value);
  },
  false
);

ui.masterControl.addEventListener(
  "change",
  () => {
    masterControlState = ui.masterControl.checked;
  },
  false
);

ui.filterControl.addEventListener(
  "change",
  () => {
    const max = 18500;
    const floor = 400;
    const frequency = expon(ui.filterControl.value) * max + floor;
    audioEngine.masterFilter.frequency.setValueAtTime(
      frequency,
      audioEngine.currentTime()
    );
  },
  false
);

function play() {
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
}

let then: number = null;
function main(now: number) {
  if (!then) then = now;

  // Every chordSpeed milliseconds
  if (
    (!then || now - then > compositionEngine.chordSpeed) &&
    masterControlState
  ) {
    play();
    then = now;
  }
  cubeBox.draw();
  requestAnimationFrame(main);
  return;
}

requestAnimationFrame(main);
