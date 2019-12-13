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

slider("input[name='masterControlState']",
  function(this: HTMLInputElement) {
    cubeBox.masterControlState = !cubeBox.masterControlState
    hashStorage.update({ setMasterFilterValue: cubeBox.masterControlState });
  },
  () => {}
 )

// const masterFilterValue = sel("input[name='masterFilterValue']");
// // onClick(masterFilterValue, () => {});
// const masterControlState = sel("input[name='masterControlState']");
// // onClick(masterControlState, () => {});
// const setDecayTime = sel("input[name='setDecayTime']");
// // onClick(setDecayTime, () => {});
// const chordOctave = sel("input[name='chordOctave']");
// // onClick(chordOctave, () => {});
// const setLfoFrequency = sel("input[name='setLfoFrequency']");
// // onClick(setLfoFrequency, () => {});
// const filterEnvelopeQ = sel("input[name='filterEnvelopeQ']");
// // onClick(filterEnvelopeQ, () => {});
// const detune = sel("input[name='detune']");
// // onClick(detune, () => {});
// const etFilterEnvelopeStartFrequency = sel(
//   "input[name='etFilterEnvelopeStartFrequency']"
// );
// // onClick(etFilterEnvelopeStartFrequency, () => {});
// const lfoWave = sel("input[name='lfoWave']");
// // onClick(lfoWave, () => {});
// const amplitudeAttack = sel("input[name='amplitudeAttack']");
// // onClick(amplitudeAttack, () => {});
// const setFilterEnvelopeSustain = sel("input[name='setFilterEnvelopeSustain']");
// // onClick(setFilterEnvelopeSustain, () => {});
// const oscialltorType = sel("input[name='oscialltorType']");
// // onClick(oscialltorType, () => {});
// const scale = sel("input[name='scale']");
// // onClick(scale, () => {});
// const setBlendMode = sel("input[name='setBlendMode']");
// // onClick(setBlendMode, () => {});
// const lfoAmount = sel("input[name='lfoAmount']");
// // onClick(lfoAmount, () => {});
// const amplitudeRelease = sel("input[name='amplitudeRelease']");
// // onClick(amplitudeRelease, () => {});
// const swipeFrequency = sel("input[name='swipeFrequency']");
// // onClick(swipeFrequency, () => {});
// const swipeOctave = sel("input[name='swipeOctave']");
// // onClick(swipeOctave, () => {});
// const chordVelocity = sel("input[name='chordVelocity']");
// // onClick(chordVelocity, () => {});
// const swipeVelocity = sel("input[name='swipeVelocity']");
// // onClick(swipeVelocity, () => {});
// const sustain = sel("input[name='sustain']");
// onClick(sustain, () => {});


const route = (state: ControlValues) => {
  cubeBox.audioEngine.setMasterGain(state.masterGain);
  sel("input[name='masterGain']").value = state.masterGain;

  cubeBox.audioEngine.setMasterFilterValue(state.setMasterFilterValue);
  cubeBox.masterControlState = state.masterControlState;
  cubeBox.compositionEngine.setDecayTime(state.setDecayTime);
  cubeBox.chordOctave = state.chordOctave;
  cubeBox.audioEngine.setLfoFrequency(state.setLfoFrequency);
  cubeBox.audioEngine.filterEnvelopeQ = state.filterEnvelopeQ;
  cubeBox.compositionEngine.detune = state.detune;
  cubeBox.audioEngine.setFilterEnvelopeStartFrequency(
    state.setFilterEnvelopeStartFrequency
  );
  cubeBox.audioEngine.lfoWave = state.lfoWave;
  cubeBox.audioEngine.amplitudeAttack = state.amplitudeAttack;
  cubeBox.audioEngine.setFilterEnvelopeSustain(state.setFilterEnvelopeSustain);
  cubeBox.compositionEngine.oscialltorType = state.oscialltorType;
  cubeBox.scale = state.scale;
  cubeBox.graphicsEngine.setBlendMode(state.setBlendMode);
  cubeBox.audioEngine.lfoAmount = state.lfoAmount;
  cubeBox.audioEngine.amplitudeRelease = state.amplitudeRelease;
  cubeBox.swipeFrequency = state.swipeFrequency;
  cubeBox.swipeOctave = state.swipeOctave;
  cubeBox.chordVelocity = state.chordVelocity;
  cubeBox.swipeVelocity = state.swipeVelocity;
  cubeBox.audioEngine.sustain = state.sustain;
};

route(hashStorage.state());
debugger;