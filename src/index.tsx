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

const sel = (a:string) => document.querySelector(a);
const masterGain =  sel("input[name='']");
const etMasterFilterValue =  sel("input[name='']");
const asterControlState =  sel("input[name='']");
const setDecayTime =  sel("input[name='']");
const chordOctave =  sel("input[name='']");
const setLfoFrequency =  sel("input[name='']");
const filterEnvelopeQ =  sel("input[name='']");
const detune =  sel("input[name='']");
const etFilterEnvelopeStartFrequency =  sel("input[name='']");
const lfoWave =  sel("input[name='']");
const amplitudeAttack =  sel("input[name='']");
const etFilterEnvelopeSustain =  sel("input[name='']");
const oscialltorType =  sel("input[name='']");
const scale =  sel("input[name='']");
const setBlendMode =  sel("input[name='']");
const lfoAmount =  sel("input[name='']");
const mplitudeRelease =  sel("input[name='']");
const swipeFrequency =  sel("input[name='']");
const swipeOctave =  sel("input[name='']");
const chordVelocity =  sel("input[name='']");
const swipeVelocity =  sel("input[name='']");
const sustain =  sel("input[name='']");
