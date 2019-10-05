const CubeBox: any = {};
let masterControlState = true;

import { SCALES } from "./scales";
import { urnJB } from "./random";
import fetchBuffer from "./fetch-buffer";
import Cube from "./cube";
import { createNoteTable, Octave } from "./note-table";

CubeBox.CANVAS = <HTMLCanvasElement>document.getElementById("canvas");
CubeBox.CTX = <CanvasRenderingContext2D>CubeBox.CANVAS.getContext("2d");
CubeBox.CUBE_ORIGIN = <[number, number]>[33, 33];
CubeBox.CUBE_SIZE = <number>66;
CubeBox.CUBES = <Cube[]>[
  new Cube(
    CubeBox.CTX,
    [
      CubeBox.CUBE_ORIGIN[0] + 0,
      CubeBox.CUBE_ORIGIN[1] + 0,
      CubeBox.CUBE_SIZE,
      CubeBox.CUBE_SIZE
    ],
    0
  ),
  new Cube(
    CubeBox.CTX,
    [
      CubeBox.CUBE_ORIGIN[0] + 0,
      CubeBox.CUBE_ORIGIN[1] + 33,
      CubeBox.CUBE_SIZE,
      CubeBox.CUBE_SIZE
    ],
    1
  ),
  new Cube(
    CubeBox.CTX,
    [
      CubeBox.CUBE_ORIGIN[0] + 33,
      CubeBox.CUBE_ORIGIN[1] + 0,
      CubeBox.CUBE_SIZE,
      CubeBox.CUBE_SIZE
    ],
    2
  ),
  new Cube(
    CubeBox.CTX,
    [
      CubeBox.CUBE_ORIGIN[0] + 33,
      CubeBox.CUBE_ORIGIN[1] + 33,
      CubeBox.CUBE_SIZE,
      CubeBox.CUBE_SIZE
    ],
    3
  ),
  new Cube(
    CubeBox.CTX,
    [
      CubeBox.CUBE_ORIGIN[0] + 66 + 66,
      CubeBox.CUBE_ORIGIN[1] + 0,
      CubeBox.CUBE_SIZE,
      CubeBox.CUBE_SIZE
    ],
    4
  ),
  new Cube(
    CubeBox.CTX,
    [
      CubeBox.CUBE_ORIGIN[0] + 66 + 66,
      CubeBox.CUBE_ORIGIN[1] + 33,
      CubeBox.CUBE_SIZE,
      CubeBox.CUBE_SIZE
    ],
    5
  ),
  new Cube(
    CubeBox.CTX,
    [
      CubeBox.CUBE_ORIGIN[0] + 99 + 66,
      CubeBox.CUBE_ORIGIN[1] + 0,
      CubeBox.CUBE_SIZE,
      CubeBox.CUBE_SIZE
    ],
    6
  ),
  new Cube(
    CubeBox.CTX,
    [
      CubeBox.CUBE_ORIGIN[0] + 99 + 66,
      CubeBox.CUBE_ORIGIN[1] + 33,
      CubeBox.CUBE_SIZE,
      CubeBox.CUBE_SIZE
    ],
    7
  )
];

const wavePicker: HTMLSelectElement = document.querySelector(
  "select[name='waveform']"
);

const volumeControl: HTMLInputElement = document.querySelector(
  "input[name='volume']"
);
volumeControl.addEventListener(
  "change",
  () => {
    MASTER_GAIN_NODE.gain.value = parseFloat(volumeControl.value);
  },
  false
);

const masterControl: HTMLInputElement = document.querySelector(
  "input[name='masterClock']"
);
masterControl.addEventListener(
  "change",
  () => {
    masterControlState = masterControl.checked;
  },
  false
);

const scalePicker: HTMLSelectElement = document.querySelector(
  "select[name='scale']"
);

const AUDIO_CONTEXT: AudioContext = new AudioContext();
const convolver = AUDIO_CONTEXT.createConvolver();
// grab audio track via XHR for convolver node
convolver.buffer = fetchBuffer("media/concert-crowd.ogg", AUDIO_CONTEXT);

const MASTER_GAIN_NODE: GainNode = AUDIO_CONTEXT.createGain();
MASTER_GAIN_NODE.connect(AUDIO_CONTEXT.destination);

const MASTER_BIQUAD_FILTER = AUDIO_CONTEXT.createBiquadFilter();
MASTER_BIQUAD_FILTER.type = "lowpass";
MASTER_BIQUAD_FILTER.frequency.setValueAtTime(12000, AUDIO_CONTEXT.currentTime);
MASTER_BIQUAD_FILTER.Q.value = 0.01;

const filterControl: HTMLInputElement = document.querySelector(
  "input[name='filter']"
);
filterControl.addEventListener(
  "change",
  () => {
    MASTER_BIQUAD_FILTER.frequency.setValueAtTime(
      parseFloat(filterControl.value),
      AUDIO_CONTEXT.currentTime
    );
  },
  false
);

MASTER_BIQUAD_FILTER.connect(MASTER_GAIN_NODE);
MASTER_GAIN_NODE.gain.value = parseFloat(volumeControl.value);

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
  //           osc -> ADSRNode -> biquatFilter -> MASTER_BIQUAD_FILTER
  sine.connect(sineGain);
  sineGain.connect(osc.frequency);
  osc.connect(ADSRNode);
  ADSRNode.connect(biquadFilter);
  biquadFilter.connect(MASTER_BIQUAD_FILTER);

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
        CubeBox.CUBES[index].play(colorIndex);
      }
    });

    swipeVoices.forEach((voice, index) => {
      const scaleDegree = voice.next().value;
      if (scaleDegree) {
        const colorIndex = SCALES[scalePicker.value][scaleDegree];
        notePressed(colorIndex, globalRoot, index * 0.4);
        setTimeout(
          () => CubeBox.CUBES[index + 4].play(colorIndex),
          index * 1000 * 0.4
        );
      }
    });
    then = now;
  }

  CubeBox.CTX.clearRect(0, 0, CubeBox.CANVAS.width, CubeBox.CANVAS.height);
  (<Cube[]>CubeBox.CUBES).forEach(cube => cube.draw());
  requestAnimationFrame(main);
  return;
}

requestAnimationFrame(main);
