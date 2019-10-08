let masterControlState = true;

import { SCALES } from "./scales";
import cubeBox from "./cube-box";
import UI from "./ui";
import AudioEngine from "./audio-engine";
import CompositionEngine from "./composition-engine";
const audioEngine = new AudioEngine();
const compositionEngine = new CompositionEngine(audioEngine, "square");
const ui = new UI();

ui.attach("blendModePicker", () => {
  const index = ui.blendModePicker.selectedIndex;
  cubeBox.ctx.globalCompositeOperation =
    ui.blendModePicker.options[index].value;
});

ui.attach("wavePicker", () => {
  const index = ui.wavePicker.selectedIndex;
  compositionEngine.oscialltorType = ui.wavePicker.options[index].value;
});

ui.attach("volumeControl", () => {
  audioEngine.masterGain.gain.value = ui.expon(ui.volumeControl.value);
});

ui.attach("masterControl", () => {
  masterControlState = ui.masterControl.checked;
});

ui.attach("filterControl", () => {
  const max = 18500;
  const floor = 400;
  const frequency = ui.expon(ui.filterControl.value) * max + floor;
  audioEngine.masterFilter.frequency.setValueAtTime(
    frequency,
    audioEngine.currentTime()
  );
});

ui.attach("decayTime", () => {
  compositionEngine.setDecayTime(parseFloat(ui.decayTime.value));
});

compositionEngine.globalRoot = parseFloat(ui.octave.value);

ui.attach("octave", () => {
  compositionEngine.globalRoot = parseFloat(ui.octave.value);
});

ui.attach("lfoFrequency", () => {
  const max = 8;
  const floor = 0.001;
  const frequency = ui.expon(ui.lfoFrequency.value) * max + floor;
  audioEngine.lfoFreq = frequency;
});

ui.attach("filterEnvelopeQ", () => {
  audioEngine.filterEnvelopeQ = parseFloat(ui.filterEnvelopeQ.value);
});

ui.attach("detune", () => {
  compositionEngine.detune = parseFloat(ui.detune.value);
});

ui.attach("filterEnvelopeStart", () => {
  const max = 18500;
  const floor = 1000;
  const frequency = ui.expon(ui.filterEnvelopeStart.value) * max + floor;
  audioEngine.masterFilter.frequency.setValueAtTime(
    frequency,
    audioEngine.currentTime()
  );
});

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
