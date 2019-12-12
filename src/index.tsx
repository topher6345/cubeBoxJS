import * as ReactDOM from "react-dom";
import * as React from "react";

import CubeBox from "./cube-box";

import Slider from "./components/slider";
import Select from "./components/select";
import Toggle from "./components/toggle";
import { ControlValues, HashStorage } from "./cube-box/control-values";

const audioContext = new AudioContext();
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const cubeBox = new CubeBox(canvas, audioContext);

const hashStorage = new HashStorage();

const route = (state: ControlValues) => {
  console.log(state);
  cubeBox.audioEngine.setMasterGain(state.masterGain);
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

interface ControlPanelProps extends React.Props<any> {
  masterGain: string;
  setMasterFilterValue: string;
  masterControlState: boolean;
  setDecayTime: string;
  chordOctave: number;
  setLfoFrequency: string;
  filterEnvelopeQ: number;
  detune: number;
  setFilterEnvelopeStartFrequency: string;
  lfoWave: string;
  amplitudeAttack: number;
  setFilterEnvelopeSustain: string;
  oscialltorType: string;
  scale: string;
  setBlendMode: string;
  lfoAmount: number;
  amplitudeRelease: number;
  swipeFrequency: number;
  swipeOctave: number;
  chordVelocity: number;
  swipeVelocity: number;
  sustain: boolean;
}

function draw(now: number) {
  cubeBox.tick(now);
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

// const sel = (a: string) => document.querySelector(a);
const root = document.getElementById("cubebox");

const sel = (a: string): HTMLElement => document.querySelector(a);
const onClick = (
  s: HTMLElement,
  f: (this: HTMLElement, ev: MouseEvent) => any
) => s.addEventListener("click", f, false);

const masterGain = sel("input[name='masterGain']");
onClick(masterGain, () => {});
const masterFilterValue = sel("input[name='masterFilterValue']");
onClick(masterFilterValue, () => {});
const masterControlState = sel("input[name='masterControlState']");
onClick(masterControlState, () => {});
const setDecayTime = sel("input[name='setDecayTime']");
onClick(setDecayTime, () => {});
const chordOctave = sel("input[name='chordOctave']");
onClick(chordOctave, () => {});
const setLfoFrequency = sel("input[name='setLfoFrequency']");
onClick(setLfoFrequency, () => {});
const filterEnvelopeQ = sel("input[name='filterEnvelopeQ']");
onClick(filterEnvelopeQ, () => {});
const detune = sel("input[name='detune']");
onClick(detune, () => {});
const etFilterEnvelopeStartFrequency = sel(
  "input[name='etFilterEnvelopeStartFrequency']"
);
onClick(etFilterEnvelopeStartFrequency, () => {});
const lfoWave = sel("input[name='lfoWave']");
onClick(lfoWave, () => {});
const amplitudeAttack = sel("input[name='amplitudeAttack']");
onClick(amplitudeAttack, () => {});
const etFilterEnvelopeSustain = sel("input[name='etFilterEnvelopeSustain']");
onClick(etFilterEnvelopeSustain, () => {});
const oscialltorType = sel("input[name='oscialltorType']");
onClick(oscialltorType, () => {});
const scale = sel("input[name='scale']");
onClick(scale, () => {});
const setBlendMode = sel("input[name='setBlendMode']");
onClick(setBlendMode, () => {});
const lfoAmount = sel("input[name='lfoAmount']");
onClick(lfoAmount, () => {});
const mplitudeRelease = sel("input[name='mplitudeRelease']");
onClick(mplitudeRelease, () => {});
const swipeFrequency = sel("input[name='swipeFrequency']");
onClick(swipeFrequency, () => {});
const swipeOctave = sel("input[name='swipeOctave']");
onClick(swipeOctave, () => {});
const chordVelocity = sel("input[name='chordVelocity']");
onClick(chordVelocity, () => {});
const swipeVelocity = sel("input[name='swipeVelocity']");
onClick(swipeVelocity, () => {});
const sustain = sel("input[name='sustain']");
onClick(sustain, () => {});

const masterGainHandler = (e: string) => hashStorage.update({ masterGain: e });
const etMasterFilterValueHandler = (e: string) =>
  hashStorage.update({ setMasterFilterValue: e });
const asterControlStateHandler = (e: boolean) => {
  hashStorage.update({ masterControlState: e });
};
const setDecayTimeHandler = (e: string) =>
  hashStorage.update({ setDecayTime: e });
const chordOctaveHandler = (e: string) =>
  hashStorage.update({ chordOctave: parseInt(e) });
const setLfoFrequencyHandler = (e: string) => {
  hashStorage.update({ setLfoFrequency: e });
};
const filterEnvelopeQHandler = (e: number) => {
  hashStorage.update({ filterEnvelopeQ: e });
};
const detuneHandler = (e: number) => {
  hashStorage.update({ detune: e });
};
const FilterEnvelopeStartFrequencyHandler = (e: string) => {
  hashStorage.update({ setFilterEnvelopeStartFrequency: e });
};
const lfoWaveHandler = (e: string) => {
  hashStorage.update({ lfoWave: e });
};
const amplitudeAttackHandler = (e: string) => {
  hashStorage.update({ amplitudeAttack: parseFloat(e) });
};
const FilterEnvelopeSustainHandler = (e: string) => {
  hashStorage.update({ setFilterEnvelopeSustain: e });
};
const oscialltorTypeHandler = (e: string) => {
  hashStorage.update({ oscialltorType: e });
};
const scaleHandler = (e: string) => {
  hashStorage.update({ scale: e });
};
const setBlendModeHandler = (e: string) => {
  hashStorage.update({ setBlendMode: e });
};
const lfoAmountHandler = (e: number) => {
  hashStorage.update({ lfoAmount: e });
};
const mplitudeReleaseHandler = (e: string) => {
  hashStorage.update({ amplitudeRelease: parseFloat(e) });
};
const swipeFrequencyHandler = (e: number) => {
  hashStorage.update({ swipeFrequency: e });
};
const swipeOctaveHandler = (e: string) =>
  hashStorage.update({ swipeOctave: parseInt(e) });
const chordVelocityHandler = (e: number) =>
  hashStorage.update({ chordVelocity: e });
const swipeVelocityHandler = (e: number) => {
  hashStorage.update({ swipeVelocity: e });
};
// const sustainHandler = (e: boolean) =>  hashStorage.update({ sustain: !e })
