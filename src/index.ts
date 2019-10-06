let masterControlState = true;

import { SCALES } from "./scales";
import cubeBox from "./cube-box";
import UI from "./ui";
import AudioEngine from "./audio-engine";
import CompositionEngine from "./composition-engine";
const audioEngine = new AudioEngine();
const compositionEngine = new CompositionEngine(audioEngine, "square");
const ui = new UI();

const blendModes = [
  "source-over",
  "source-in",
  "source-out",
  "source-atop",
  "destination-over",
  "destination-in",
  "destination-out",
  "destination-atop",
  "lighter",
  "copy",
  "xor",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity"
];

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

ui.volumeControl.addEventListener(
  "change",
  () => {
    audioEngine.masterGain.gain.value = parseFloat(ui.volumeControl.value); // TODO: make exponential
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
    const frequency = parseFloat(ui.filterControl.value); // TODO: make exponential
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
