let masterControlState = true;
/**
 *
 * This file is where everything gets hooked up
 *
 */
import Scales from "./scales";
import graphicsEngine from "./graphics-engine";
import controls from "./controls";
import AudioEngine from "./audio-engine";
const audioEngine = new AudioEngine();
import CompositionEngine from "./composition-engine";

// Hook up the Audio Engine to the Composition Engine
const compositionEngine = new CompositionEngine(audioEngine, "square");

controls.attach("blendModePicker", () => {
  const index = controls.blendModePicker.selectedIndex;
  graphicsEngine.setBlendMode(controls.blendModePicker.options[index].value);
});

controls.attach("wavePicker", () => {
  const index = controls.wavePicker.selectedIndex;
  compositionEngine.oscialltorType = controls.wavePicker.options[index].value;
});

controls.attach("volumeControl", () => {
  audioEngine.setMasterGain(controls.volumeControl.value);
});

controls.attach("masterControl", () => {
  masterControlState = controls.masterControl.checked;
});

controls.attach("filterControl", () => {
  audioEngine.setMasterFilterValue(controls.filterControl.value);
});

controls.attach("decayTime", () => {
  compositionEngine.setDecayTime(controls.decayTime.value);
});

controls.attach("octave", () => {
  compositionEngine.globalRoot = parseFloat(controls.octave.value);
});

controls.attach("lfoFrequency", () => {
  audioEngine.setLfoFrequency(controls.lfoFrequency.value);
});

controls.attach("filterEnvelopeQ", () => {
  audioEngine.filterEnvelopeQ = parseFloat(controls.filterEnvelopeQ.value);
});

controls.attach("detune", () => {
  compositionEngine.detune = parseFloat(controls.detune.value);
});

controls.attach("filterEnvelopeStart", () => {
  audioEngine.setFilterEnvelopeStartFrequency(
    controls.filterEnvelopeStart.value
  );
});

controls.attach("frequencyModulationAmount", () => {
  audioEngine.frequencyModulationAmount = parseFloat(
    controls.frequencyModulationAmount.value
  );
});

controls.attach("amplitudeRelease", () => {
  audioEngine.amplitudeRelease = parseFloat(controls.amplitudeRelease.value);
});

controls.validate();

function play() {
  compositionEngine.chordVoices.forEach((voice: Generator, index: number) => {
    const scaleDegree = voice.next().value;
    if (scaleDegree) {
      const colorIndex = Scales[controls.scalePicker.value][scaleDegree];
      compositionEngine.notePressed(colorIndex, 0);
      graphicsEngine.play(index, colorIndex);
    }
  });

  compositionEngine.swipeVoices.forEach((voice: Generator, index: number) => {
    const scaleDegree = voice.next().value;
    const swipeFrequency = 0.4;
    if (scaleDegree) {
      const colorIndex = Scales[controls.scalePicker.value][scaleDegree];
      compositionEngine.notePressed(colorIndex, index * swipeFrequency);
      setTimeout(
        () => graphicsEngine.play(index + 4, colorIndex),
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
  graphicsEngine.draw();
  requestAnimationFrame(main);
  return;
}

requestAnimationFrame(main);
