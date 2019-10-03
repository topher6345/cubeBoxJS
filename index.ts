const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

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
    ctx.fillStyle = `rgba(${rgba.join(",")})`;
    const [x, y, xw, yw] = this.position;
    ctx.fillRect(x, y, xw, yw);
  }

  activate() {
    this.alpha = 70;
    this.note = Math.floor(Math.random() * 12);
  }
}

const cubeOrigin: [number, number] = [0, 0];
const cubeSize: number = 150;

const cubes: Cube[] = [
  new Cube(ctx, [cubeOrigin[0] + 0, cubeOrigin[1] + 0, cubeSize, cubeSize], 0),
  new Cube(ctx, [cubeOrigin[0] + 0, cubeOrigin[1] + 25, cubeSize, cubeSize], 1),
  new Cube(ctx, [cubeOrigin[0] + 25, cubeOrigin[1] + 0, cubeSize, cubeSize], 2),
  new Cube(
    ctx,
    [cubeOrigin[0] + 25, cubeOrigin[1] + 25, cubeSize, cubeSize],
    3
  ),
  new Cube(
    ctx,
    [cubeOrigin[0] + 100, cubeOrigin[1] + 0, cubeSize, cubeSize],
    4
  ),
  new Cube(
    ctx,
    [cubeOrigin[0] + 100, cubeOrigin[1] + 25, cubeSize, cubeSize],
    5
  ),
  new Cube(
    ctx,
    [cubeOrigin[0] + 125, cubeOrigin[1] + 0, cubeSize, cubeSize],
    6
  ),
  new Cube(
    ctx,
    [cubeOrigin[0] + 125, cubeOrigin[1] + 25, cubeSize, cubeSize],
    7
  )
];

interface Octave {
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

const audioContext: AudioContext = new AudioContext();
const wavePicker: HTMLSelectElement = document.querySelector(
  "select[name='waveform']"
);
const volumeControl: HTMLInputElement = document.querySelector(
  "input[name='volume']"
);
volumeControl.addEventListener("change", changeVolume, false);

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

const masterGainNode: GainNode = audioContext.createGain();

const sweepEnv = audioContext.createGain();
masterGainNode.connect(audioContext.destination);
masterGainNode.gain.value = parseFloat(volumeControl.value);

// Create the keys; skip any that are sharp or flat; for
// our purposes we don't need them. Each octave is inserted
// into a <div> of class "octave".
const noteFreq: Octave[] = createNoteTable();
const keyboard: HTMLDivElement = document.querySelector(".keyboard");
noteFreq.forEach((keys: Octave, index: number) => {
  const keyList = Object.entries(keys);
  const octaveElem: HTMLDivElement = document.createElement("div");
  octaveElem.className = "octave";

  keyList.forEach(function(key) {
    // skip any that are sharp or flat
    if (key[0].length === 1) {
      octaveElem.appendChild(createKey(key[0], index.toString(), key[1]));
    }
  });

  keyboard.appendChild(octaveElem);
});

document
  .querySelector("div[data-note='B'][data-octave='5']")
  .scrollIntoView(false);

const sineTerms: Float32Array = new Float32Array([0, 0, 1, 0, 1]);
const cosineTerms: Float32Array = new Float32Array(sineTerms.length);
const customWaveform: PeriodicWave = audioContext.createPeriodicWave(
  cosineTerms,
  sineTerms
);

const oscList: OscillatorNode[][] = Array(9);

function createKey(note: string, octave: string, freq: string) {
  const keyElement: HTMLDivElement = document.createElement("div");
  const labelElement: HTMLDivElement = document.createElement("div");

  keyElement.className = "key";
  keyElement.dataset["octave"] = octave;
  keyElement.dataset["note"] = note;
  keyElement.dataset["frequency"] = freq;

  labelElement.innerHTML = note + "<sub>" + octave + "</sub>";
  keyElement.appendChild(labelElement);

  keyElement.addEventListener("mousedown", notePressed, false);
  keyElement.addEventListener("mousedown", () => cubes[6].activate(), false);
  keyElement.addEventListener("mouseup", noteReleased, false);
  keyElement.addEventListener("mouseover", notePressed, false);
  // keyElement.addEventListener("mouseleave", noteReleased, false);

  return keyElement;
}

let sweepLength = 1;
function playTone(freq: number, detune: number): OscillatorNode {
  const osc: OscillatorNode = audioContext.createOscillator();
  const ADSRNode = audioContext.createGain();
  const biquadFilter = audioContext.createBiquadFilter();
  biquadFilter.type = "lowpass";
  biquadFilter.frequency.setValueAtTime(12000, audioContext.currentTime);
  biquadFilter.Q.value = 0.001;

  osc.connect(biquadFilter);
  biquadFilter.connect(ADSRNode);
  ADSRNode.connect(masterGainNode);

  const type: string = wavePicker.options[wavePicker.selectedIndex].value;

  if (type == "custom") {
    osc.setPeriodicWave(customWaveform);
  } else {
    osc.type = <OscillatorType>type;
  }

  ADSRNode.gain.cancelScheduledValues(audioContext.currentTime);
  ADSRNode.gain.setValueAtTime(0, audioContext.currentTime);
  // set our attack
  ADSRNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.1);

  ADSRNode.gain.linearRampToValueAtTime(
    0,
    audioContext.currentTime + sweepLength - 0.1
  );

  osc.frequency.value = freq;
  osc.detune.setValueAtTime(detune, audioContext.currentTime);
  osc.start();
  osc.stop(audioContext.currentTime + sweepLength + 3);

  return osc;
}

function notePressed(event: MouseEvent) {
  if (event.buttons & 1) {
    const dataset = (event.target as HTMLButtonElement).dataset;

    if (!dataset["pressed"]) {
      const { note, octave, frequency } = dataset;
      const index = octave[note];
      oscList[index] = [
        playTone(parseFloat(frequency), 0),
        playTone(parseFloat(frequency), 1)
      ];
      dataset["pressed"] = "yes";
    }
  }
}

function noteReleased(event) {
  const dataset = event.target.dataset;

  if (dataset && dataset["pressed"]) {
    const { note, octave } = dataset;
    const index = octave[note];

    oscList[index].forEach(o => o.stop());
    oscList[index] = oscList[index].map(() => null);
    delete dataset["pressed"];
  }
}
function changeVolume() {
  masterGainNode.gain.value = parseFloat(volumeControl.value);
}

function main() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cubes.forEach(cube => cube.draw());
  requestAnimationFrame(main);
  return;
}

function logKey(e: KeyboardEvent) {
  switch (e.code) {
    case "KeyA":
      cubes[0].activate();
      notePressed;
      break;
    case "KeyS":
      cubes[1].activate();
      break;
    case "KeyD":
      cubes[2].activate();
      break;
    case "KeyF":
      cubes[3].activate();
      break;
    case "KeyJ":
      cubes[4].activate();
      break;
    case "KeyK":
      cubes[5].activate();
      break;
    case "KeyL":
      cubes[6].activate();
      break;
    case "Semicolon":
      cubes[7].activate();
      break;
    default:
      break;
  }
}
document.addEventListener("keydown", logKey);

requestAnimationFrame(main);
