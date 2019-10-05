let masterControlState = true;

import { SCALES } from "./scales";
import { urnJB } from "./random";
import fetchBuffer from "./fetch-buffer";

const CANVAS = <HTMLCanvasElement>document.getElementById("canvas");
const CTX: CanvasRenderingContext2D = CANVAS.getContext("2d");

type CubePosition = [number, number, number, number];
type RGB = [number, number, number];

class Cube {
  ctx: CanvasRenderingContext2D;
  position: CubePosition;
  alpha: number;
  colors: Array<RGB>;
  note: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    position: CubePosition,
    note: number
  ) {
    this.ctx = ctx;
    this.position = position;
    this.alpha = 0;
    this.colors = [
      [255, 0, 0],
      [206, 154, 255],
      [255, 255, 0],
      [101, 101, 153],
      [227, 251, 255],
      [172, 28, 2],
      [0, 204, 255],
      [255, 101, 1],
      [255, 0, 255],
      [51, 204, 51],
      [140, 138, 140],
      [0, 0, 254]
    ];
    this.note = note;
  }

  draw() {
    this.alpha = this.alpha > 0 ? this.alpha - 1 : this.alpha;

    const rgba = [...this.colors[this.note], this.alpha / 100];
    CTX.fillStyle = `rgba(${rgba.join(",")})`;
    const [x, y, xw, yw] = this.position;
    CTX.fillRect(x, y, xw, yw);
  }

  activate(note: string) {
    this.alpha = 70;
    this.note = noteArray.indexOf(note);
  }

  play(degree: number) {
    this.alpha = 70;
    this.note = degree;
  }
}

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

interface Octave {
  [key: string]: number;
  C: number;
  "C#": number;
  D: number;
  "D#": number;
  E: number;
  F: number;
  "F#": number;
  G: number;
  "G#": number;
  A: number;
  "A#": number;
  B: number;
}

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

const filterControl: HTMLInputElement = document.querySelector(
  "input[name='filter']"
);
filterControl.addEventListener("change", changeMasterFilter, false);

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

function createNoteTable(): Octave[] {
  let noteFreq: Octave[] = [];

  const size = 9;
  for (let i = 0; i < size; i++) {
    noteFreq[i] = {} as Octave;
  }

  noteFreq[0]["A"] = 27.5;
  noteFreq[0]["A#"] = 29.135235094880619;
  noteFreq[0]["B"] = 30.867706328507756;

  noteFreq[1]["C"] = 32.703195662574829;
  noteFreq[1]["C#"] = 34.647828872109012;
  noteFreq[1]["D"] = 36.708095989675945;
  noteFreq[1]["D#"] = 38.890872965260113;
  noteFreq[1]["E"] = 41.203444614108741;
  noteFreq[1]["F"] = 43.653528929125485;
  noteFreq[1]["F#"] = 46.249302838954299;
  noteFreq[1]["G"] = 48.999429497718661;
  noteFreq[1]["G#"] = 51.913087197493142;
  noteFreq[1]["A"] = 55.0;
  noteFreq[1]["A#"] = 58.270470189761239;
  noteFreq[1]["B"] = 61.735412657015513;
  noteFreq[2]["C"] = 65.406391325149658;
  noteFreq[2]["C#"] = 69.295657744218024;
  noteFreq[2]["D"] = 73.41619197935189;
  noteFreq[2]["D#"] = 77.781745930520227;
  noteFreq[2]["E"] = 82.406889228217482;
  noteFreq[2]["F"] = 87.307057858250971;
  noteFreq[2]["F#"] = 92.498605677908599;
  noteFreq[2]["G"] = 97.998858995437323;
  noteFreq[2]["G#"] = 103.826174394986284;
  noteFreq[2]["A"] = 110.0;
  noteFreq[2]["A#"] = 116.540940379522479;
  noteFreq[2]["B"] = 123.470825314031027;

  noteFreq[3]["C"] = 130.812782650299317;
  noteFreq[3]["C#"] = 138.591315488436048;
  noteFreq[3]["D"] = 146.83238395870378;
  noteFreq[3]["D#"] = 155.563491861040455;
  noteFreq[3]["E"] = 164.813778456434964;
  noteFreq[3]["F"] = 174.614115716501942;
  noteFreq[3]["F#"] = 184.997211355817199;
  noteFreq[3]["G"] = 195.997717990874647;
  noteFreq[3]["G#"] = 207.652348789972569;
  noteFreq[3]["A"] = 220.0;
  noteFreq[3]["A#"] = 233.081880759044958;
  noteFreq[3]["B"] = 246.941650628062055;

  noteFreq[4]["C"] = 261.625565300598634;
  noteFreq[4]["C#"] = 277.182630976872096;
  noteFreq[4]["D"] = 293.66476791740756;
  noteFreq[4]["D#"] = 311.12698372208091;
  noteFreq[4]["E"] = 329.627556912869929;
  noteFreq[4]["F"] = 349.228231433003884;
  noteFreq[4]["F#"] = 369.994422711634398;
  noteFreq[4]["G"] = 391.995435981749294;
  noteFreq[4]["G#"] = 415.304697579945138;
  noteFreq[4]["A"] = 440.0;
  noteFreq[4]["A#"] = 466.163761518089916;
  noteFreq[4]["B"] = 493.883301256124111;

  noteFreq[5]["C"] = 523.251130601197269;
  noteFreq[5]["C#"] = 554.365261953744192;
  noteFreq[5]["D"] = 587.32953583481512;
  noteFreq[5]["D#"] = 622.253967444161821;
  noteFreq[5]["E"] = 659.255113825739859;
  noteFreq[5]["F"] = 698.456462866007768;
  noteFreq[5]["F#"] = 739.988845423268797;
  noteFreq[5]["G"] = 783.990871963498588;
  noteFreq[5]["G#"] = 830.609395159890277;
  noteFreq[5]["A"] = 880.0;
  noteFreq[5]["A#"] = 932.327523036179832;
  noteFreq[5]["B"] = 987.766602512248223;

  noteFreq[6]["C"] = 1046.502261202394538;
  noteFreq[6]["C#"] = 1108.730523907488384;
  noteFreq[6]["D"] = 1174.659071669630241;
  noteFreq[6]["D#"] = 1244.507934888323642;
  noteFreq[6]["E"] = 1318.510227651479718;
  noteFreq[6]["F"] = 1396.912925732015537;
  noteFreq[6]["F#"] = 1479.977690846537595;
  noteFreq[6]["G"] = 1567.981743926997176;
  noteFreq[6]["G#"] = 1661.218790319780554;
  noteFreq[6]["A"] = 1760.0;
  noteFreq[6]["A#"] = 1864.655046072359665;
  noteFreq[6]["B"] = 1975.533205024496447;
  noteFreq[7]["C"] = 2093.004522404789077;
  noteFreq[7]["C#"] = 2217.461047814976769;
  noteFreq[7]["D"] = 2349.318143339260482;
  noteFreq[7]["D#"] = 2489.015869776647285;
  noteFreq[7]["E"] = 2637.020455302959437;
  noteFreq[7]["F"] = 2793.825851464031075;
  noteFreq[7]["F#"] = 2959.955381693075191;
  noteFreq[7]["G"] = 3135.963487853994352;
  noteFreq[7]["G#"] = 3322.437580639561108;
  noteFreq[7]["A"] = 3520.0;
  noteFreq[7]["A#"] = 3729.310092144719331;
  noteFreq[7]["B"] = 3951.066410048992894;

  noteFreq[8]["C"] = 4186.009044809578154;
  return noteFreq;
}

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

function changeMasterFilter() {
  masterBiquadFilter.frequency.setValueAtTime(
    parseFloat(filterControl.value),
    AUDIO_CONTEXT.currentTime
  );
}

masterBiquadFilter.connect(masterGainNode);
masterGainNode.gain.value = parseFloat(volumeControl.value);

// Create the keys; skip any that are sharp or flat; for
// our purposes we don't need them. Each octave is inserted
// into a <div> of class "octave".
const noteFreq: Octave[] = createNoteTable();
const noteArray: string[] = Object.keys(noteFreq[1]);
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
  const stringNote: string = Object.keys(noteFreq[octave])[note];
  const frequency = noteFreq[octave][stringNote.toString()];

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
