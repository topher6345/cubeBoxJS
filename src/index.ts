let masterControlState = true;

import { SCALES } from "./scales";
import { urnJB } from "./random";
import fetchBuffer from "./fetch-buffer";
import Cube from "./cube";
import { createNoteTable, Octave } from "./note-table";

const CANVAS = <HTMLCanvasElement>document.getElementById("canvas");
const CTX: CanvasRenderingContext2D = CANVAS.getContext("2d");
const CUBE_ORIGIN: [number, number] = [33, 33];
const CUBE_SIZE: number = 66;
const CUBES: Cube[] = [
  new Cube(
    CTX,
    [CUBE_ORIGIN[0] + 0, CUBE_ORIGIN[1] + 0, CUBE_SIZE, CUBE_SIZE],
    0
  ),
  new Cube(
    CTX,
    [CUBE_ORIGIN[0] + 0, CUBE_ORIGIN[1] + 33, CUBE_SIZE, CUBE_SIZE],
    1
  ),
  new Cube(
    CTX,
    [CUBE_ORIGIN[0] + 33, CUBE_ORIGIN[1] + 0, CUBE_SIZE, CUBE_SIZE],
    2
  ),
  new Cube(
    CTX,
    [CUBE_ORIGIN[0] + 33, CUBE_ORIGIN[1] + 33, CUBE_SIZE, CUBE_SIZE],
    3
  ),
  new Cube(
    CTX,
    [CUBE_ORIGIN[0] + 66 + 66, CUBE_ORIGIN[1] + 0, CUBE_SIZE, CUBE_SIZE],
    4
  ),
  new Cube(
    CTX,
    [CUBE_ORIGIN[0] + 66 + 66, CUBE_ORIGIN[1] + 33, CUBE_SIZE, CUBE_SIZE],
    5
  ),
  new Cube(
    CTX,
    [CUBE_ORIGIN[0] + 99 + 66, CUBE_ORIGIN[1] + 0, CUBE_SIZE, CUBE_SIZE],
    6
  ),
  new Cube(
    CTX,
    [CUBE_ORIGIN[0] + 99 + 66, CUBE_ORIGIN[1] + 33, CUBE_SIZE, CUBE_SIZE],
    7
  )
];

const wavePicker: HTMLSelectElement = document.querySelector(
  "select[name='waveform']"
);

const volumeControl: HTMLInputElement = document.querySelector(
  "input[name='volume']"
);
volumeControl.addEventListener("change", changeVolume, false);
function changeVolume() {
  masterGainNode.gain.value = parseFloat(volumeControl.value);
}

const masterControl: HTMLInputElement = document.querySelector(
  "input[name='masterClock']"
);
masterControl.addEventListener("change", changeMasterControl, false);
function changeMasterControl() {
  masterControlState = masterControl.checked;
}

const scalePicker: HTMLSelectElement = document.querySelector(
  "select[name='scale']"
);

const AUDIO_CONTEXT: AudioContext = new AudioContext();
const convolver = AUDIO_CONTEXT.createConvolver();
// grab audio track via XHR for convolver node
convolver.buffer = fetchBuffer("media/concert-crowd.ogg", AUDIO_CONTEXT);

const masterGainNode: GainNode = AUDIO_CONTEXT.createGain();
masterGainNode.connect(AUDIO_CONTEXT.destination);

const masterBiquadFilter = AUDIO_CONTEXT.createBiquadFilter();
masterBiquadFilter.type = "lowpass";
masterBiquadFilter.frequency.setValueAtTime(12000, AUDIO_CONTEXT.currentTime);
masterBiquadFilter.Q.value = 0.01;

const filterControl: HTMLInputElement = document.querySelector(
  "input[name='filter']"
);
filterControl.addEventListener("change", changeMasterFilter, false);
function changeMasterFilter() {
  masterBiquadFilter.frequency.setValueAtTime(
    parseFloat(filterControl.value),
    AUDIO_CONTEXT.currentTime
  );
}

masterBiquadFilter.connect(masterGainNode);
masterGainNode.gain.value = parseFloat(volumeControl.value);

const NOTE_FREQUENCIES: Octave[] = createNoteTable();
const sineTerms: Float32Array = new Float32Array([0, 0, 1, 0, 1]);
const cosineTerms: Float32Array = new Float32Array(sineTerms.length);
const customWaveform: PeriodicWave = AUDIO_CONTEXT.createPeriodicWave(
  cosineTerms,
  sineTerms
);

function playTone(freq: number, detune: number, delay: number) {
  const expZero = 0.00000001;
  const lfoFreq = 0.01;
  const osc: OscillatorNode = AUDIO_CONTEXT.createOscillator();
  const sine = AUDIO_CONTEXT.createOscillator();
  sine.type = "sine";
  sine.frequency.value = lfoFreq;

  const sineGain = AUDIO_CONTEXT.createGain();
  sineGain.gain.value = 3;
  const ADSRNode = AUDIO_CONTEXT.createGain();
  const biquadFilter = AUDIO_CONTEXT.createBiquadFilter();
  const biquadFilterQValue = 0.01;
  const biquadFilterInitCutoffFreq = 12000;
  const biquadFilterADSRS = 1000;

  biquadFilter.type = "lowpass";
  biquadFilter.frequency.setValueAtTime(
    biquadFilterInitCutoffFreq,
    AUDIO_CONTEXT.currentTime
  );
  biquadFilter.Q.value = biquadFilterQValue;

  biquadFilter.frequency.exponentialRampToValueAtTime(
    biquadFilterADSRS,
    AUDIO_CONTEXT.currentTime + delay + 1
  );

  // sine -> sineGain
  //            |
  //          frequency
  //            |
  //           osc -> ADSRNode -> biquatFilter -> masterBiquadFilter
  sine.connect(sineGain);
  sineGain.connect(osc.frequency);
  osc.connect(ADSRNode);
  ADSRNode.connect(biquadFilter);
  biquadFilter.connect(masterBiquadFilter);

  const type: string = wavePicker.options[wavePicker.selectedIndex].value;

  if (type == "custom") {
    osc.setPeriodicWave(customWaveform);
  } else {
    osc.type = <OscillatorType>type;
  }

  ADSRNode.gain.cancelScheduledValues(AUDIO_CONTEXT.currentTime + delay);
  ADSRNode.gain.setValueAtTime(0, AUDIO_CONTEXT.currentTime + delay);
  ADSRNode.gain.linearRampToValueAtTime(
    1,
    AUDIO_CONTEXT.currentTime + delay + 0.1
  );

  osc.frequency.value = freq;
  osc.detune.setValueAtTime(detune, AUDIO_CONTEXT.currentTime + delay);
  sine.start(AUDIO_CONTEXT.currentTime + delay);
  osc.start(AUDIO_CONTEXT.currentTime + delay);

  ADSRNode.gain.exponentialRampToValueAtTime(
    expZero,
    AUDIO_CONTEXT.currentTime + delay + decayTime + 0.2
  );
  osc.stop(AUDIO_CONTEXT.currentTime + decayTime + delay);
  sine.stop(AUDIO_CONTEXT.currentTime + decayTime + delay);
}

function notePressed(note: number, octave: number, delay: number) {
  const stringNote: string = Object.keys(NOTE_FREQUENCIES[octave])[note];
  const frequency = NOTE_FREQUENCIES[octave][stringNote.toString()];

  playTone(frequency, -5, delay);
  playTone(frequency, 5, delay);
}

const decayTime = 4;
let chordSpeed = decayTime * 1000; //ms
let chordVoices = [urnJB(7), urnJB(7), urnJB(7), urnJB(7)];
let swipeVoices = [urnJB(7), urnJB(7), urnJB(7), urnJB(7)];
let globalRoot = 3;

let then: number = null;

function main(now: number) {
  if (!then) then = now;

  // Every chordSpeed milliseconds
  if ((!then || now - then > chordSpeed) && masterControlState) {
    chordVoices.forEach((voice, index) => {
      const scaleDegree = voice.next().value;
      if (scaleDegree) {
        const colorIndex = SCALES[scalePicker.value][scaleDegree];
        notePressed(colorIndex, globalRoot, 0);
        CUBES[index].play(colorIndex);
      }
    });

    swipeVoices.forEach((voice, index) => {
      const scaleDegree = voice.next().value;
      if (scaleDegree) {
        const colorIndex = SCALES[scalePicker.value][scaleDegree];
        notePressed(colorIndex, globalRoot, index * 0.4);
        setTimeout(() => CUBES[index + 4].play(colorIndex), index * 1000 * 0.4);
      }
    });
    then = now;
  }

  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
  CUBES.forEach(cube => cube.draw());
  requestAnimationFrame(main);
  return;
}

requestAnimationFrame(main);
