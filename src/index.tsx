import CubeBox from "./cube-box";

import { ControlValues, HashStorage } from "./cube-box/control-values";

const audioContext = new AudioContext();
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const cubeBox = new CubeBox(canvas, audioContext);
const hashStorage = new HashStorage();

const sel = (a: string): HTMLInputElement => document.querySelector(a);

function draw(now: number) {
  cubeBox.tick(now);
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

// function setMasterFilterValueHandler(elem: HTMLElement, ev: MouseEvent) {
//   hashStorage.update({ setMasterFilterValue: elem });
// }
// function setMasterControlStateHandler(elem: HTMLElement, ev: MouseEvent) {
//   hashStorage.update({ masterControlState: elem });
// }
// function setDecayTimeHandler(elem: HTMLElement, ev: MouseEvent) {
//   hashStorage.update({ setDecayTime: elem });
// }
// function chordOctaveHandler(elem: HTMLElement, ev: MouseEvent) {
//   hashStorage.update({ chordOctave: parseInt(elem as any) });
// }
// function setLfoFrequencyHandler(elem: HTMLElement, ev: MouseEvent) {
//   hashStorage.update({ setLfoFrequency: elem });
// }
// function filterEnvelopeQHandler(elem: HTMLElement, ev: MouseEvent) {
//   hashStorage.update({ filterEnvelopeQ: elem });
// }
// function detuneHandler(elem: HTMLElement, ev: MouseEvent) {
//   hashStorage.update({ detune: elem });
// }
// function etFilterEnvelopeStartFrequencyHandler(
//   elem: HTMLElement,
//   ev: MouseEvent
// ) {
//   hashStorage.update({ setFilterEnvelopeStartFrequency: elem });
// }
// function lfoWaveHandler(elem: HTMLElement, ev: MouseEvent) {
//   hashStorage.update({ lfoWave: elem });
// }
// function amplitudeAttackHandler(elem: HTMLElement, ev: MouseEvent) {
//   hashStorage.update({ amplitudeAttack: parseFloat(elem as any) });
// }
// function setFilterEnvelopeSustainHandler(elem: HTMLElement, ev: MouseEvent) {
//   hashStorage.update({ setFilterEnvelopeSustain: elem });
// }
// function oscialltorTypeHandler(elem: HTMLElement, ev: MouseEvent) {
//   hashStorage.update({ oscialltorType: elem });
// }
// function scaleHandler(elem: HTMLElement, ev: MouseEvent) {
//   hashStorage.update({ scale: elem });
// }
// function setBlendModeHandler(elem: HTMLElement, ev: MouseEvent) {
//   hashStorage.update({ setBlendMode: elem });
// }
// function lfoAmountHandler(elem: HTMLElement, ev: MouseEvent) {
//   hashStorage.update({ lfoAmount: elem });
// }
// function mplitudeReleaseHandler(elem: HTMLElement, ev: MouseEvent) {
//   hashStorage.update({ amplitudeRelease: parseFloat(elem as any) });
// }
// function swipeFrequencyHandler(elem: HTMLElement, ev: MouseEvent) {
//   hashStorage.update({ swipeFrequency: elem });
// }
// function swipeOctaveHandler(elem: HTMLElement, ev: MouseEvent) {
//   hashStorage.update({ swipeOctave: parseInt(elem as any) });
// }
// function chordVelocityHandler(elem: HTMLElement, ev: MouseEvent) {
//   hashStorage.update({ chordVelocity: elem });
// }
// function swipeVelocityHandler(elem: HTMLElement, ev: MouseEvent) {
//   hashStorage.update({ swipeVelocity: elem });
// }
// function sustainHandler(elem: HTMLElement, ev: MouseEvent) {
//   hashStorage.update({ sustain: !elem });
// }

const slider = (s: string, onInput: Function, onChange: Function) => {
  const elem = sel(s);
  elem.addEventListener("change", onInput as any, false);
  elem.addEventListener("input", onChange as any, false);
};

slider(
  "input[name='masterGain']",
  function(this: HTMLInputElement) {
    hashStorage.update({ masterGain: this.value });
  },
  function(this: HTMLInputElement) {
    cubeBox.audioEngine.setMasterGain(this.value);
  }
);

slider(
  "input[name='setMasterFilterValue']",
  function(this: HTMLInputElement) {
    hashStorage.update({ setMasterFilterValue: this.value });
  },
  function(this: HTMLInputElement) {
    cubeBox.audioEngine.setMasterFilterValue(this.value);
  }
);

slider(
  "input[name='masterControlState']",
  function(this: HTMLInputElement) {
    cubeBox.masterControlState = this.checked;
    hashStorage.update({ masterControlState: this.checked });
  },
  () => {}
);

const route = (state: ControlValues) => {
  cubeBox.audioEngine.setMasterGain(state.masterGain);
  sel("input[name='masterGain']").value = state.masterGain;

  cubeBox.audioEngine.setMasterFilterValue(state.setMasterFilterValue);
  sel("input[name='setMasterFilterValue']").value = state.setMasterFilterValue;

  cubeBox.masterControlState = state.masterControlState;
  sel("input[name='masterControlState']").checked = state.masterControlState;

  cubeBox.compositionEngine.setDecayTime(state.setDecayTime);
  sel("input[name='setDecayTime']").value = state.setDecayTime;

  cubeBox.chordOctave = state.chordOctave;
  sel("input[name='chordOctave']").value = state.chordOctave.toString();

  cubeBox.audioEngine.setLfoFrequency(state.setLfoFrequency);
  sel("input[name='setLfoFrequency']").value = state.setLfoFrequency;

  cubeBox.audioEngine.filterEnvelopeQ = state.filterEnvelopeQ;
  sel("input[name='filterEnvelopeQ']").value = state.filterEnvelopeQ.toString();

  cubeBox.compositionEngine.detune = state.detune;
  sel("input[name='detune']").value = state.detune.toString();

  cubeBox.audioEngine.setFilterEnvelopeStartFrequency(
    state.setFilterEnvelopeStartFrequency
  );
  sel("input[name='setFilterEnvelopeStartFrequency']").value =
    state.setFilterEnvelopeStartFrequency;

  cubeBox.audioEngine.lfoWave = state.lfoWave;
  sel("select[name='lfoWave']").value = state.lfoWave;

  cubeBox.audioEngine.amplitudeAttack = state.amplitudeAttack;
  sel("input[name='amplitudeAttack']").value = state.amplitudeAttack.toString();

  cubeBox.audioEngine.setFilterEnvelopeSustain(state.setFilterEnvelopeSustain);
  sel(
    "input[name='setFilterEnvelopeSustain']"
  ).value = state.setFilterEnvelopeSustain.toString();

  cubeBox.compositionEngine.oscialltorType = state.oscialltorType;
  sel("select[name='oscialltorType']").value = state.oscialltorType;

  cubeBox.scale = state.scale;
  sel("select[name='scale']").value = state.scale;

  cubeBox.graphicsEngine.setBlendMode(state.setBlendMode);
  sel("select[name='setBlendMode']").value = state.setBlendMode;

  cubeBox.audioEngine.lfoAmount = state.lfoAmount;
  sel("input[name='lfoAmount']").value = state.lfoAmount.toString();

  cubeBox.audioEngine.amplitudeRelease = state.amplitudeRelease;
  sel("input[name='amplitudeRelease']").value = state.amplitudeRelease.toString();

  cubeBox.swipeFrequency = state.swipeFrequency;
  sel("input[name='swipeFrequency']").value = state.swipeFrequency.toString();

  cubeBox.swipeOctave = state.swipeOctave;
  sel("input[name='swipeOctave']").value = state.swipeOctave.toString();

  cubeBox.chordVelocity = state.chordVelocity;
  sel("input[name='chordVelocity']").value = state.chordVelocity.toString();

  cubeBox.swipeVelocity = state.swipeVelocity;
  sel("input[name='swipeVelocity']").value = state.swipeVelocity.toString();

  cubeBox.audioEngine.sustain = state.sustain;
  sel("input[name='sustain']").value = state.sustain.toString();
};

// route once on page load
route(hashStorage.state());
