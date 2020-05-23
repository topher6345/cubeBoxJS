/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/cube-box.ts":
/*!*************************!*\
  !*** ./src/cube-box.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const scales_1 = __webpack_require__(/*! ./cube-box/scales */ "./src/cube-box/scales.ts");
const graphics_engine_1 = __webpack_require__(/*! ./cube-box/graphics-engine */ "./src/cube-box/graphics-engine.ts");
const audio_engine_1 = __webpack_require__(/*! ./cube-box/audio-engine */ "./src/cube-box/audio-engine.ts");
const composition_engine_1 = __webpack_require__(/*! ./cube-box/composition-engine */ "./src/cube-box/composition-engine.ts");
/**
 *
 * CubeBox
 *
 * Responsible for drawing to the screen and playing the sounds
 *
 * exposes subsystems to the UI for interaction
 *
 * exposes one public method tick() which can be called at 60fps
 *
 */
class CubeBox {
    constructor(canvas, ctx) {
        this.audioEngine = new audio_engine_1.default(ctx);
        this.graphicsEngine = new graphics_engine_1.default(canvas);
        this.compositionEngine = new composition_engine_1.default(this.audioEngine);
        this.masterControlState = false;
        this.then = null;
        this.scale = "Lydian";
        this.swipeFrequency = 0.4;
        this.chordOctave = 3;
        this.swipeOctave = 3;
        this.chordVelocity = 1.0;
        this.swipeVelocity = 1.0;
    }
    /**
     *
     * Every chordSpeed milliseconds call play()
     *
     */
    tick(now) {
        if (!this.then)
            this.then = now;
        if (!this.then ||
            (now - this.then > this.compositionEngine.chordSpeed &&
                this.masterControlState)) {
            this.play();
            this.then = now;
        }
        this.graphicsEngine.draw();
    }
    /**
     *
     * play the chord voices (sounds and colors)
     *
     * play the swipe voices (sounds and colors)
     *
     */
    play() {
        this.compositionEngine.chordVoices.forEach((voice, index) => {
            const scaleDegree = voice.next().value;
            if (scaleDegree) {
                const colorIndex = scales_1.default[this.scale][scaleDegree];
                this.compositionEngine.notePressed(colorIndex, this.chordOctave, 0, this.chordVelocity);
                this.graphicsEngine.play(index, colorIndex, this.chordVelocity * 100);
            }
        });
        this.compositionEngine.swipeVoices.forEach((voice, index) => {
            const scaleDegree = voice.next().value;
            if (scaleDegree) {
                const colorIndex = scales_1.default[this.scale][scaleDegree];
                this.compositionEngine.notePressed(colorIndex, this.swipeOctave, index * this.swipeFrequency, this.swipeVelocity);
                setTimeout(() => this.graphicsEngine.play(index + 4, colorIndex, this.chordVelocity * 100), index * this.swipeFrequency * 1000);
            }
        });
    }
}
exports.default = CubeBox;


/***/ }),

/***/ "./src/cube-box/audio-engine.ts":
/*!**************************************!*\
  !*** ./src/cube-box/audio-engine.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * AudioEngine is a subsystem that handles interaction with the WebAudio API.
 *
 * An instance is initialized which wraps the global audio context.
 *
 * The instance exposes a method playTone() which plays the sound.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const envelope_filter_1 = __webpack_require__(/*! ./audio-engine/envelope-filter */ "./src/cube-box/audio-engine/envelope-filter.ts");
const amplitude_envelope_1 = __webpack_require__(/*! ./audio-engine/amplitude-envelope */ "./src/cube-box/audio-engine/amplitude-envelope.ts");
const oscillator_1 = __webpack_require__(/*! ./audio-engine/oscillator */ "./src/cube-box/audio-engine/oscillator.ts");
const frequency_modulation_1 = __webpack_require__(/*! ./audio-engine/frequency-modulation */ "./src/cube-box/audio-engine/frequency-modulation.ts");
const velocity_1 = __webpack_require__(/*! ./audio-engine/velocity */ "./src/cube-box/audio-engine/velocity.ts");
const expon_1 = __webpack_require__(/*! ./audio-engine/expon */ "./src/cube-box/audio-engine/expon.ts");
class AudioEngine {
    constructor(ctx) {
        this.ctx = ctx;
        this.masterFilter = this.ctx.createBiquadFilter();
        this.masterFilter.type = "lowpass";
        this.masterFilter.frequency.setValueAtTime(18500, this.ctx.currentTime);
        this.masterFilter.Q.value = 0.01;
        this.compressor = ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-50, ctx.currentTime);
        this.compressor.knee.setValueAtTime(40, ctx.currentTime);
        this.compressor.ratio.setValueAtTime(12, ctx.currentTime);
        this.compressor.attack.setValueAtTime(0, ctx.currentTime);
        this.compressor.release.setValueAtTime(0.25, ctx.currentTime);
        this.masterGain = this.ctx.createGain();
        this.masterFilter
            .connect(this.compressor)
            .connect(this.masterGain)
            .connect(this.ctx.destination);
        this.lfoFreq = 0.1;
        this.lfoAmount = 2;
        this.lfoWave = "sine";
        this.filterEnvelopeQ = 0.1;
        this.filterEnvelopeStart = 18500;
        this.filterEnvelopeSustain = 300;
        this.amplitudeAttack = 0.25;
        this.sustain = true;
        this.amplitudeRelease = 0.4;
    }
    playTone(startTime, decayTime, freq, detune, oscialltorType, velocity) {
        /**
         * Every playTone() invocation creates a new oscialltor and destroys it when the note is done.
         *
         * We can do this because playTone requires a decayTime known ahead of time.
         */
        const osc = new oscillator_1.default(this.ctx).node(startTime, decayTime, oscialltorType, freq, detune);
        const lfo = new frequency_modulation_1.default(this.ctx).node(startTime, decayTime, this.lfoFreq, this.lfoAmount, this.lfoWave);
        const ampEnv = new amplitude_envelope_1.default(this.ctx).node(startTime, decayTime, this.sustain, this.amplitudeRelease, this.amplitudeAttack);
        const filterEnv = new envelope_filter_1.default(this.ctx).node(startTime, decayTime, this.filterEnvelopeStart, this.filterEnvelopeQ, this.filterEnvelopeSustain);
        const velocityGain = new velocity_1.default(this.ctx).node(startTime, velocity);
        lfo.connect(osc.frequency);
        osc
            .connect(ampEnv)
            .connect(filterEnv)
            .connect(velocityGain)
            .connect(this.masterFilter);
    }
    setMasterGain(input) {
        this.masterGain.gain.value = expon_1.default(input, 1.0, 0.0);
    }
    setMasterFilterValue(input) {
        this.masterFilter.frequency.setValueAtTime(expon_1.default(input, 18500, 20), this.ctx.currentTime);
    }
    setLfoFrequency(input) {
        this.lfoFreq = expon_1.default(input, 8, 0.001);
    }
    setFilterEnvelopeStartFrequency(input) {
        this.filterEnvelopeStart = expon_1.default(input, 18500, 1000);
    }
    setFilterEnvelopeSustain(input) {
        this.filterEnvelopeSustain = expon_1.default(input, 18500, 10);
    }
}
exports.default = AudioEngine;


/***/ }),

/***/ "./src/cube-box/audio-engine/amplitude-envelope.ts":
/*!*********************************************************!*\
  !*** ./src/cube-box/audio-engine/amplitude-envelope.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const expZero = 0.00000001;
class AmplitudeEnvelope {
    constructor(ctx) {
        this.ctx = ctx;
    }
    node(startTime, noteLength, sustain, amplitudeRelease, amplitudeAttack) {
        const currentTime = this.ctx.currentTime;
        const playTime = currentTime + startTime;
        const gainNode = this.ctx.createGain();
        // Amplitude Pre-Attack
        gainNode.gain.cancelScheduledValues(playTime);
        gainNode.gain.setValueAtTime(0, playTime);
        // Amplitude Attack
        gainNode.gain.linearRampToValueAtTime(1, playTime + amplitudeAttack);
        // Amplitude Decay
        if (sustain) {
            gainNode.gain.exponentialRampToValueAtTime(expZero, playTime + noteLength + amplitudeRelease);
        }
        else {
            gainNode.gain.linearRampToValueAtTime(0, playTime + noteLength + amplitudeRelease);
        }
        return gainNode;
    }
}
exports.default = AmplitudeEnvelope;


/***/ }),

/***/ "./src/cube-box/audio-engine/envelope-filter.ts":
/*!******************************************************!*\
  !*** ./src/cube-box/audio-engine/envelope-filter.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class EnvelopeFilter {
    constructor(ctx) {
        this.ctx = ctx;
    }
    node(startTime, noteLength, filterEnvelopeStart, Q, sustain) {
        const currentTime = this.ctx.currentTime;
        const biquadFilter = this.ctx.createBiquadFilter();
        biquadFilter.type = "lowpass";
        biquadFilter.Q.value = Q;
        biquadFilter.frequency.setValueAtTime(filterEnvelopeStart, currentTime);
        biquadFilter.frequency.exponentialRampToValueAtTime(sustain, currentTime + startTime + noteLength);
        return biquadFilter;
    }
}
exports.default = EnvelopeFilter;


/***/ }),

/***/ "./src/cube-box/audio-engine/expon.ts":
/*!********************************************!*\
  !*** ./src/cube-box/audio-engine/expon.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (input, max, floor) => {
    return expon(input) * max + floor;
};
const expon = (x) => {
    let value = parseFloat(x);
    value = value < 0.0 ? 0.0 : value;
    value = value > 1.0 ? 1.0 : value;
    return -Math.sqrt(-value + 1) + 1;
};


/***/ }),

/***/ "./src/cube-box/audio-engine/frequency-modulation.ts":
/*!***********************************************************!*\
  !*** ./src/cube-box/audio-engine/frequency-modulation.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class FequencyModulation {
    constructor(ctx) {
        this.ctx = ctx;
    }
    node(startTime, noteLength, lfoFreq, lfoAmount, lfoWave) {
        const currentTime = this.ctx.currentTime;
        const lfo = this.ctx.createOscillator();
        lfo.type = lfoWave;
        lfo.frequency.value = lfoFreq;
        lfo.start(currentTime + startTime);
        lfo.stop(currentTime + noteLength + startTime);
        const gainNode = this.ctx.createGain();
        gainNode.gain.value = lfoAmount;
        return lfo.connect(gainNode);
    }
}
exports.default = FequencyModulation;


/***/ }),

/***/ "./src/cube-box/audio-engine/oscillator.ts":
/*!*************************************************!*\
  !*** ./src/cube-box/audio-engine/oscillator.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Oscillator {
    constructor(ctx) {
        this.ctx = ctx;
        const sineTerms = new Float32Array([0, 0, 1, 0, 1]);
        const cosineTerms = new Float32Array(sineTerms.length);
        this.customWaveform = this.ctx.createPeriodicWave(cosineTerms, sineTerms);
    }
    node(startTime, noteLength, oscillatorWave, frequency, detune) {
        const currentTime = this.ctx.currentTime;
        const oscillator = this.ctx.createOscillator();
        if (oscillatorWave == "custom") {
            oscillator.setPeriodicWave(this.customWaveform); // TODO: Add more custom Waveforms
        }
        else {
            oscillator.type = oscillatorWave;
        }
        oscillator.frequency.value = frequency;
        oscillator.detune.setValueAtTime(detune, currentTime + startTime);
        oscillator.start(currentTime + startTime);
        oscillator.stop(currentTime + noteLength + startTime);
        return oscillator;
    }
}
exports.default = Oscillator;


/***/ }),

/***/ "./src/cube-box/audio-engine/velocity.ts":
/*!***********************************************!*\
  !*** ./src/cube-box/audio-engine/velocity.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Velocity {
    constructor(ctx) {
        this.ctx = ctx;
    }
    node(startTime, velocity) {
        const velocityGain = this.ctx.createGain();
        velocityGain.gain.setValueAtTime(velocity, this.ctx.currentTime + startTime);
        return velocityGain;
    }
}
exports.default = Velocity;


/***/ }),

/***/ "./src/cube-box/composition-engine.ts":
/*!********************************************!*\
  !*** ./src/cube-box/composition-engine.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = __webpack_require__(/*! ./composition-engine/random */ "./src/cube-box/composition-engine/random.ts");
const note_table_1 = __webpack_require__(/*! ./composition-engine/note-table */ "./src/cube-box/composition-engine/note-table.ts");
class CompositionEngine {
    constructor(audioEngine) {
        this.decayTime = 2;
        this.chordSpeed = this.decayTime * 1000; //ms
        this.chordVoices = [random_1.default(7), random_1.default(7), random_1.default(7), random_1.default(7)];
        this.swipeVoices = [random_1.default(7), random_1.default(7), random_1.default(7), random_1.default(7)];
        this.audioEngine = audioEngine;
        this.noteTable = new note_table_1.default();
        this.detune = 0;
        this.globalRoot = 2;
        this.oscialltorType = "sawtooth";
    }
    setDecayTime(decayTime) {
        this.decayTime = parseFloat(decayTime);
        this.chordSpeed = this.decayTime * 1000; //ms
    }
    notePressed(note, octave, startTime, velocity) {
        const frequency = this.noteTable.getNoteFrequency(note, octave);
        this.audioEngine.playTone(startTime, this.decayTime, frequency, -this.detune, this.oscialltorType, velocity);
        this.audioEngine.playTone(startTime, this.decayTime, frequency, this.detune, this.oscialltorType, velocity);
    }
}
exports.default = CompositionEngine;


/***/ }),

/***/ "./src/cube-box/composition-engine/note-table.ts":
/*!*******************************************************!*\
  !*** ./src/cube-box/composition-engine/note-table.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class NoteTable {
    constructor() {
        this.noteFrequencies = [
            {
                A: 55.0,
                "A#": 58.270470189761239,
                B: 61.735412657015513,
                C: 32.703195662574829,
                "C#": 34.647828872109012,
                D: 36.708095989675945,
                "D#": 38.890872965260113,
                E: 41.203444614108741,
                F: 43.653528929125485,
                "F#": 46.249302838954299,
                G: 48.999429497718661,
                "G#": 51.913087197493142
            },
            {
                A: 110.0,
                "A#": 116.540940379522479,
                B: 123.470825314031027,
                C: 65.406391325149658,
                "C#": 69.295657744218024,
                D: 73.41619197935189,
                "D#": 77.781745930520227,
                E: 82.406889228217482,
                F: 87.307057858250971,
                "F#": 92.498605677908599,
                G: 97.998858995437323,
                "G#": 103.826174394986284
            },
            {
                A: 220.0,
                "A#": 233.081880759044958,
                B: 246.941650628062055,
                C: 130.812782650299317,
                "C#": 138.591315488436048,
                D: 146.83238395870378,
                "D#": 155.563491861040455,
                E: 164.813778456434964,
                F: 174.614115716501942,
                "F#": 184.997211355817199,
                G: 195.997717990874647,
                "G#": 207.652348789972569
            },
            {
                A: 440.0,
                "A#": 466.163761518089916,
                B: 493.883301256124111,
                C: 261.625565300598634,
                "C#": 277.182630976872096,
                D: 293.66476791740756,
                "D#": 311.12698372208091,
                E: 329.627556912869929,
                F: 349.228231433003884,
                "F#": 369.994422711634398,
                G: 391.995435981749294,
                "G#": 415.304697579945138
            },
            {
                A: 880.0,
                "A#": 932.327523036179832,
                B: 987.766602512248223,
                C: 523.251130601197269,
                "C#": 554.365261953744192,
                D: 587.32953583481512,
                "D#": 622.253967444161821,
                E: 659.255113825739859,
                F: 698.456462866007768,
                "F#": 739.988845423268797,
                G: 783.990871963498588,
                "G#": 830.609395159890277
            },
            {
                A: 1760.0,
                "A#": 1864.655046072359665,
                B: 1975.533205024496447,
                C: 1046.502261202394538,
                "C#": 1108.730523907488384,
                D: 1174.659071669630241,
                "D#": 1244.507934888323642,
                E: 1318.510227651479718,
                F: 1396.912925732015537,
                "F#": 1479.977690846537595,
                G: 1567.981743926997176,
                "G#": 1661.218790319780554
            },
            {
                A: 3520.0,
                "A#": 3729.310092144719331,
                B: 3951.066410048992894,
                C: 2093.004522404789077,
                "C#": 2217.461047814976769,
                D: 2349.318143339260482,
                "D#": 2489.015869776647285,
                E: 2637.020455302959437,
                F: 2793.825851464031075,
                "F#": 2959.955381693075191,
                G: 3135.963487853994352,
                "G#": 3322.437580639561108
            }
        ];
    }
    getNoteFrequency(note, octave) {
        const stringNote = Object.keys(this.noteFrequencies[octave])[note];
        return this.noteFrequencies[octave][stringNote];
    }
}
exports.default = NoteTable;


/***/ }),

/***/ "./src/cube-box/composition-engine/random.ts":
/*!***************************************************!*\
  !*** ./src/cube-box/composition-engine/random.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function* urnJB(length) {
    let array = randArray(length);
    let index = 0;
    while (true) {
        yield array[index];
        index = index + 1;
        if (index === length) {
            array = randArray(length);
            index = 0;
        }
    }
}
exports.default = urnJB;
function randArray(length) {
    let array = [];
    for (let i = 0; i < length; i++) {
        array[i] = i;
    }
    // Fisher-Yates shuffling algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


/***/ }),

/***/ "./src/cube-box/control-values.ts":
/*!****************************************!*\
  !*** ./src/cube-box/control-values.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const INIT_CONTROL_VALUES = {
    masterGain: "1.0",
    setMasterFilterValue: "1.0",
    masterControlState: false,
    setDecayTime: "4",
    chordOctave: 3,
    setLfoFrequency: "0.1",
    filterEnvelopeQ: 0.1,
    detune: 0,
    setFilterEnvelopeStartFrequency: "18500",
    lfoWave: "sine",
    amplitudeAttack: 0.25,
    setFilterEnvelopeSustain: "300",
    oscialltorType: "triangle",
    scale: "Lydian",
    setBlendMode: "source-over",
    lfoAmount: 2,
    amplitudeRelease: 0.4,
    swipeFrequency: 0.4,
    swipeOctave: 3,
    chordVelocity: 1.0,
    swipeVelocity: 1.0,
    sustain: true,
};
class HashStorage {
    constructor() {
        this.isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
        this.isEmpty = (a) => a.length === 0;
        try {
            if (this.isEmpty(this.decode(window.location.hash))) {
                window.location.hash = this.encode(INIT_CONTROL_VALUES);
            }
        }
        catch (e) {
            window.location.hash = this.encode(INIT_CONTROL_VALUES);
        }
    }
    state() {
        return this.decode(window.location.hash);
    }
    encode(state) {
        return btoa(JSON.stringify(state));
    }
    decode(hash) {
        return JSON.parse(atob(hash.substring(1)));
    }
    update(data) {
        const _state = this.state();
        const updated = Object.assign(Object.assign({}, _state), data);
        if (this.isEqual(updated, _state)) {
            return false;
        }
        else {
            window.location.hash = this.encode(updated);
            console.log(_state);
            return updated;
        }
    }
    setMasterGain(e) {
        this.update({ masterGain: e });
    }
}
exports.HashStorage = HashStorage;


/***/ }),

/***/ "./src/cube-box/graphics-engine.ts":
/*!*****************************************!*\
  !*** ./src/cube-box/graphics-engine.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const square_1 = __webpack_require__(/*! ./graphics-engine/square */ "./src/cube-box/graphics-engine/square.ts");
/**
 *
 * Wraps the Canvas context
 *
 * This class is responsible for laying out the squares on the canvas.
 *
 * Call draw() to draw to the canvas.
 *
 * It passes the canvas contex into `Squares`s
 *
 * `Squares`s draw themselves on the screen.
 */
class GraphicsEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.unitSquare = 33;
        this.squareOrigin = [this.unitSquare, this.unitSquare];
        this.squareSize = this.unitSquare * 2;
        this.squares = [
            new square_1.default(this.ctx, [
                this.squareOrigin[0],
                this.squareOrigin[1],
                this.squareSize,
                this.squareSize
            ], 0),
            new square_1.default(this.ctx, [
                this.squareOrigin[0],
                this.squareOrigin[1] + this.unitSquare,
                this.squareSize,
                this.squareSize
            ], 1),
            new square_1.default(this.ctx, [
                this.squareOrigin[0] + this.unitSquare,
                this.squareOrigin[1],
                this.squareSize,
                this.squareSize
            ], 2),
            new square_1.default(this.ctx, [
                this.squareOrigin[0] + this.unitSquare,
                this.squareOrigin[1] + this.unitSquare,
                this.squareSize,
                this.squareSize
            ], 3),
            new square_1.default(this.ctx, [
                this.squareOrigin[0] + this.unitSquare * 4,
                this.squareOrigin[1],
                this.squareSize,
                this.squareSize
            ], 4),
            new square_1.default(this.ctx, [
                this.squareOrigin[0] + this.unitSquare * 4,
                this.squareOrigin[1] + this.unitSquare,
                this.squareSize,
                this.squareSize
            ], 5),
            new square_1.default(this.ctx, [
                this.squareOrigin[0] + this.unitSquare * 5,
                this.squareOrigin[1],
                this.squareSize,
                this.squareSize
            ], 6),
            new square_1.default(this.ctx, [
                this.squareOrigin[0] + this.unitSquare * 5,
                this.squareOrigin[1] + this.unitSquare,
                this.squareSize,
                this.squareSize
            ], 7)
        ];
    }
    clearRect() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    setBlendMode(blendMode) {
        this.ctx.globalCompositeOperation = blendMode;
    }
    draw() {
        this.clearRect();
        this.squares.forEach(cube => cube.draw());
    }
    play(index, colorIndex, velocity) {
        this.squares[index].play(colorIndex, velocity);
    }
}
exports.default = GraphicsEngine;


/***/ }),

/***/ "./src/cube-box/graphics-engine/square.ts":
/*!************************************************!*\
  !*** ./src/cube-box/graphics-engine/square.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Colors = [
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
class Square {
    constructor(ctx, position, note) {
        this.ctx = ctx;
        this.position = position;
        this.note = note;
        this.alpha = 0;
        this.alphaScalar = 100;
    }
    play(degree, velocity) {
        this.alpha = Math.round(velocity);
        this.note = degree;
    }
    draw() {
        this.decrementAlpha();
        this.drawRect();
    }
    drawRect() {
        this.ctx.fillStyle = this.color();
        this.ctx.fillRect(...this.position);
    }
    decrementAlpha() {
        this.alpha = this.alpha > 0 ? this.alpha - 1 : this.alpha;
    }
    color() {
        return `rgba(${this.rgba().join(",")})`;
    }
    rgba() {
        const [r, g, b] = Colors[this.note];
        return [r, g, b, this.alpha / this.alphaScalar];
    }
}
exports.default = Square;


/***/ }),

/***/ "./src/cube-box/scales.ts":
/*!********************************!*\
  !*** ./src/cube-box/scales.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    Ionian: [0, 2, 4, 5, 7, 9, 11],
    Lydian: [0, 2, 4, 6, 7, 9, 11],
    Locrian: [0, 1, 3, 5, 6, 8, 10],
    Phrygian: [0, 1, 3, 5, 7, 8, 10],
    Aeolean: [0, 2, 3, 5, 7, 8, 10],
    Dorian: [0, 2, 3, 5, 7, 9, 10],
    Mixolydian: [0, 2, 4, 5, 7, 9, 10]
};


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const cube_box_1 = __webpack_require__(/*! ./cube-box */ "./src/cube-box.ts");
const control_values_1 = __webpack_require__(/*! ./cube-box/control-values */ "./src/cube-box/control-values.ts");
const audioContext = new AudioContext();
const canvas = document.getElementById("canvas");
const cubeBox = new cube_box_1.default(canvas, audioContext);
const hashStorage = new control_values_1.HashStorage();
const sel = (a) => document.querySelector(a);
function draw(now) {
    cubeBox.tick(now);
    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
const slider = (s, onInput, onChange) => {
    const elem = sel(s);
    elem.addEventListener("change", onInput, false);
    elem.addEventListener("input", onChange, false);
};
const sl = (name, onInput, onChange) => {
    slider(`input[name='${name}']`, function () {
        onInput(this.value);
    }, function () {
        onChange(this.value);
    });
};
const ss = (name, onInput, onChange) => {
    slider(`select[name='${name}']`, function () {
        onInput(this.value);
    }, function () {
        onChange(this.value);
    });
};
const sc = (name, onInput, onChange) => {
    slider(`input[name='${name}']`, function () {
        onInput(this.checked);
    }, function () {
        onChange(this.checked);
    });
};
sl("masterGain", (e) => hashStorage.update({ masterGain: e }), (e) => cubeBox.audioEngine.setMasterGain(e));
sl("setMasterFilterValue", (e) => hashStorage.update({ setMasterFilterValue: e }), (e) => cubeBox.audioEngine.setMasterFilterValue(e));
sc("masterControlState", (e) => {
    cubeBox.masterControlState = e;
    hashStorage.update({ masterControlState: e });
}, () => { });
sl("chordOctave", (e) => hashStorage.update({ chordOctave: parseFloat(e) }), (e) => (cubeBox.chordOctave = parseFloat(e)));
sl("setDecayTime", (e) => hashStorage.update({ setDecayTime: e }), (e) => cubeBox.compositionEngine.setDecayTime(e.toString()));
sl("filterEnvelopeQ", (e) => hashStorage.update({ filterEnvelopeQ: e }), (e) => (cubeBox.audioEngine.filterEnvelopeQ = e));
sl("detune", (e) => hashStorage.update({ detune: e }), (e) => (cubeBox.compositionEngine.detune = e));
sl("setFilterEnvelopeStartFrequency", (e) => hashStorage.update({ setFilterEnvelopeStartFrequency: e }), (e) => cubeBox.audioEngine.setFilterEnvelopeStartFrequency(e.toString()));
ss("lfoWave", (e) => hashStorage.update({ lfoWave: e }), (e) => (cubeBox.audioEngine.lfoWave = e));
sl("amplitudeAttack", (e) => hashStorage.update({ amplitudeAttack: parseFloat(e) }), (e) => (cubeBox.audioEngine.amplitudeAttack = parseFloat(e)));
sl("setFilterEnvelopeSustain", (e) => hashStorage.update({ setFilterEnvelopeSustain: e }), (e) => cubeBox.audioEngine.setFilterEnvelopeSustain(e.toString()));
ss("oscialltorType", (e) => hashStorage.update({ oscialltorType: e }), (e) => (cubeBox.compositionEngine.oscialltorType = e));
ss("scale", (e) => hashStorage.update({ scale: e }), (e) => (cubeBox.scale = e));
ss("setBlendMode", (e) => hashStorage.update({ setBlendMode: e }), (e) => cubeBox.graphicsEngine.setBlendMode(e));
sl("lfoAmount", (e) => hashStorage.update({ lfoAmount: e }), (e) => (cubeBox.audioEngine.lfoAmount = e));
sl("amplitudeRelease", (e) => hashStorage.update({ amplitudeRelease: e }), (e) => (cubeBox.audioEngine.amplitudeRelease = parseFloat(e.toString())));
sl("swipeFrequency", (e) => hashStorage.update({ swipeFrequency: e }), (e) => (cubeBox.swipeFrequency = e));
sl("swipeOctave", (e) => hashStorage.update({ swipeOctave: e }), (e) => (cubeBox.swipeOctave = e));
sl("chordVelocity", (e) => hashStorage.update({ chordVelocity: e }), (e) => (cubeBox.chordVelocity = e));
sl("swipeVelocity", (e) => hashStorage.update({ swipeVelocity: e }), (e) => (cubeBox.swipeVelocity = e));
sc("sustain", (e) => hashStorage.update({ sustain: e }), (e) => (cubeBox.audioEngine.sustain = e));
sl("setLfoFrequency", (e) => hashStorage.update({ setLfoFrequency: e }), (e) => cubeBox.audioEngine.setLfoFrequency(e));
sc("hide", (e) => {
    debugger;
    sel(".settingsBar").hidden = true;
}, (e) => (cubeBox.audioEngine.sustain = e));
sel("input[name='hide']").addEventListener("change", () => {
    document
        .querySelectorAll(".settingsBar > div")
        .forEach((e) => (e.style.display = "none"));
    document.querySelector(".settingsBar > div:nth-child(1)").style.display = "block";
});
sel("input[name='show']").addEventListener("change", () => {
    document
        .querySelectorAll(".settingsBar > div")
        .forEach((e) => (e.style.display = "block"));
    document.querySelector(".settingsBar > div:nth-child(1)").style.display = "none";
});
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    }
    else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
sc("fullscreen", (e) => {
    toggleFullScreen();
}, (e) => { });
sel("input[name='fullscreen']").addEventListener("change", () => {
    document
        .querySelectorAll(".settingsBar > div")
        .forEach((e) => (e.style.display = "none"));
    document.querySelector(".settingsBar > div:nth-child(1)").style.display = "block";
});
const route = (state) => {
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
    cubeBox.audioEngine.setFilterEnvelopeStartFrequency(state.setFilterEnvelopeStartFrequency);
    sel("input[name='setFilterEnvelopeStartFrequency']").value =
        state.setFilterEnvelopeStartFrequency;
    cubeBox.audioEngine.lfoWave = state.lfoWave;
    sel("select[name='lfoWave']").value = state.lfoWave;
    cubeBox.audioEngine.amplitudeAttack = state.amplitudeAttack;
    sel("input[name='amplitudeAttack']").value = state.amplitudeAttack.toString();
    cubeBox.audioEngine.setFilterEnvelopeSustain(state.setFilterEnvelopeSustain);
    sel("input[name='setFilterEnvelopeSustain']").value = state.setFilterEnvelopeSustain.toString();
    cubeBox.compositionEngine.oscialltorType = state.oscialltorType;
    sel("select[name='oscialltorType']").value = state.oscialltorType;
    cubeBox.scale = state.scale;
    sel("select[name='scale']").value = state.scale;
    cubeBox.graphicsEngine.setBlendMode(state.setBlendMode);
    sel("select[name='setBlendMode']").value = state.setBlendMode;
    cubeBox.audioEngine.lfoAmount = state.lfoAmount;
    sel("input[name='lfoAmount']").value = state.lfoAmount.toString();
    cubeBox.audioEngine.amplitudeRelease = parseFloat(state.amplitudeRelease.toString());
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
window.addEventListener("hashchange", () => route(hashStorage.state()), false);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2N1YmUtYm94LnRzIiwid2VicGFjazovLy8uL3NyYy9jdWJlLWJveC9hdWRpby1lbmdpbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2N1YmUtYm94L2F1ZGlvLWVuZ2luZS9hbXBsaXR1ZGUtZW52ZWxvcGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2N1YmUtYm94L2F1ZGlvLWVuZ2luZS9lbnZlbG9wZS1maWx0ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2N1YmUtYm94L2F1ZGlvLWVuZ2luZS9leHBvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY3ViZS1ib3gvYXVkaW8tZW5naW5lL2ZyZXF1ZW5jeS1tb2R1bGF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9jdWJlLWJveC9hdWRpby1lbmdpbmUvb3NjaWxsYXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY3ViZS1ib3gvYXVkaW8tZW5naW5lL3ZlbG9jaXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9jdWJlLWJveC9jb21wb3NpdGlvbi1lbmdpbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2N1YmUtYm94L2NvbXBvc2l0aW9uLWVuZ2luZS9ub3RlLXRhYmxlLnRzIiwid2VicGFjazovLy8uL3NyYy9jdWJlLWJveC9jb21wb3NpdGlvbi1lbmdpbmUvcmFuZG9tLnRzIiwid2VicGFjazovLy8uL3NyYy9jdWJlLWJveC9jb250cm9sLXZhbHVlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY3ViZS1ib3gvZ3JhcGhpY3MtZW5naW5lLnRzIiwid2VicGFjazovLy8uL3NyYy9jdWJlLWJveC9ncmFwaGljcy1lbmdpbmUvc3F1YXJlLnRzIiwid2VicGFjazovLy8uL3NyYy9jdWJlLWJveC9zY2FsZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FB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QUFDLGNBQWMsQ0FBQztJQUM5QyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUU1RSxPQUFPLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7SUFDeEMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7SUFFdEUsT0FBTyxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO0lBQzVDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBRTFFLE9BQU8sQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztJQUM1QyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUUxRSxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO0lBQzVDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ2hFLENBQUMsQ0FBQztBQUVGLDBCQUEwQjtBQUMxQixLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDM0IsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsImltcG9ydCBTY2FsZXMgZnJvbSBcIi4vY3ViZS1ib3gvc2NhbGVzXCI7XG5pbXBvcnQgR3JhcGhpY3NFbmdpbmUgZnJvbSBcIi4vY3ViZS1ib3gvZ3JhcGhpY3MtZW5naW5lXCI7XG5pbXBvcnQgQXVkaW9FbmdpbmUgZnJvbSBcIi4vY3ViZS1ib3gvYXVkaW8tZW5naW5lXCI7XG5pbXBvcnQgQ29tcG9zaXRpb25FbmdpbmUgZnJvbSBcIi4vY3ViZS1ib3gvY29tcG9zaXRpb24tZW5naW5lXCI7XG5cbi8qKlxuICpcbiAqIEN1YmVCb3hcbiAqXG4gKiBSZXNwb25zaWJsZSBmb3IgZHJhd2luZyB0byB0aGUgc2NyZWVuIGFuZCBwbGF5aW5nIHRoZSBzb3VuZHNcbiAqXG4gKiBleHBvc2VzIHN1YnN5c3RlbXMgdG8gdGhlIFVJIGZvciBpbnRlcmFjdGlvblxuICpcbiAqIGV4cG9zZXMgb25lIHB1YmxpYyBtZXRob2QgdGljaygpIHdoaWNoIGNhbiBiZSBjYWxsZWQgYXQgNjBmcHNcbiAqXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1YmVCb3gge1xuICBhdWRpb0VuZ2luZTogQXVkaW9FbmdpbmU7XG4gIGNvbXBvc2l0aW9uRW5naW5lOiBDb21wb3NpdGlvbkVuZ2luZTtcbiAgZ3JhcGhpY3NFbmdpbmU6IEdyYXBoaWNzRW5naW5lO1xuICBtYXN0ZXJDb250cm9sU3RhdGU6IGJvb2xlYW47XG4gIHNjYWxlOiBzdHJpbmc7XG4gIHN3aXBlRnJlcXVlbmN5OiBudW1iZXI7XG4gIGNob3JkT2N0YXZlOiBudW1iZXI7XG4gIHN3aXBlT2N0YXZlOiBudW1iZXI7XG4gIHN3aXBlVmVsb2NpdHk6IG51bWJlcjtcbiAgY2hvcmRWZWxvY2l0eTogbnVtYmVyO1xuXG4gIHByaXZhdGUgdGhlbjogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIGN0eDogQXVkaW9Db250ZXh0KSB7XG4gICAgdGhpcy5hdWRpb0VuZ2luZSA9IG5ldyBBdWRpb0VuZ2luZShjdHgpO1xuICAgIHRoaXMuZ3JhcGhpY3NFbmdpbmUgPSBuZXcgR3JhcGhpY3NFbmdpbmUoY2FudmFzKTtcbiAgICB0aGlzLmNvbXBvc2l0aW9uRW5naW5lID0gbmV3IENvbXBvc2l0aW9uRW5naW5lKHRoaXMuYXVkaW9FbmdpbmUpO1xuICAgIHRoaXMubWFzdGVyQ29udHJvbFN0YXRlID0gZmFsc2U7XG4gICAgdGhpcy50aGVuID0gbnVsbDtcbiAgICB0aGlzLnNjYWxlID0gXCJMeWRpYW5cIjtcbiAgICB0aGlzLnN3aXBlRnJlcXVlbmN5ID0gMC40O1xuICAgIHRoaXMuY2hvcmRPY3RhdmUgPSAzO1xuICAgIHRoaXMuc3dpcGVPY3RhdmUgPSAzO1xuICAgIHRoaXMuY2hvcmRWZWxvY2l0eSA9IDEuMDtcbiAgICB0aGlzLnN3aXBlVmVsb2NpdHkgPSAxLjA7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogRXZlcnkgY2hvcmRTcGVlZCBtaWxsaXNlY29uZHMgY2FsbCBwbGF5KClcbiAgICpcbiAgICovXG5cbiAgdGljayhub3c6IG51bWJlcikge1xuICAgIGlmICghdGhpcy50aGVuKSB0aGlzLnRoZW4gPSBub3c7XG5cbiAgICBpZiAoXG4gICAgICAhdGhpcy50aGVuIHx8XG4gICAgICAobm93IC0gdGhpcy50aGVuID4gdGhpcy5jb21wb3NpdGlvbkVuZ2luZS5jaG9yZFNwZWVkICYmXG4gICAgICAgIHRoaXMubWFzdGVyQ29udHJvbFN0YXRlKVxuICAgICkge1xuICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICB0aGlzLnRoZW4gPSBub3c7XG4gICAgfVxuICAgIHRoaXMuZ3JhcGhpY3NFbmdpbmUuZHJhdygpO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIHBsYXkgdGhlIGNob3JkIHZvaWNlcyAoc291bmRzIGFuZCBjb2xvcnMpXG4gICAqXG4gICAqIHBsYXkgdGhlIHN3aXBlIHZvaWNlcyAoc291bmRzIGFuZCBjb2xvcnMpXG4gICAqXG4gICAqL1xuICBwcml2YXRlIHBsYXkoKSB7XG4gICAgdGhpcy5jb21wb3NpdGlvbkVuZ2luZS5jaG9yZFZvaWNlcy5mb3JFYWNoKFxuICAgICAgKHZvaWNlOiBHZW5lcmF0b3IsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgICAgY29uc3Qgc2NhbGVEZWdyZWUgPSB2b2ljZS5uZXh0KCkudmFsdWU7XG4gICAgICAgIGlmIChzY2FsZURlZ3JlZSkge1xuICAgICAgICAgIGNvbnN0IGNvbG9ySW5kZXggPSBTY2FsZXNbdGhpcy5zY2FsZV1bc2NhbGVEZWdyZWVdO1xuICAgICAgICAgIHRoaXMuY29tcG9zaXRpb25FbmdpbmUubm90ZVByZXNzZWQoXG4gICAgICAgICAgICBjb2xvckluZGV4LFxuICAgICAgICAgICAgdGhpcy5jaG9yZE9jdGF2ZSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICB0aGlzLmNob3JkVmVsb2NpdHlcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMuZ3JhcGhpY3NFbmdpbmUucGxheShpbmRleCwgY29sb3JJbmRleCwgdGhpcy5jaG9yZFZlbG9jaXR5ICogMTAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLmNvbXBvc2l0aW9uRW5naW5lLnN3aXBlVm9pY2VzLmZvckVhY2goXG4gICAgICAodm9pY2U6IEdlbmVyYXRvciwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICBjb25zdCBzY2FsZURlZ3JlZSA9IHZvaWNlLm5leHQoKS52YWx1ZTtcbiAgICAgICAgaWYgKHNjYWxlRGVncmVlKSB7XG4gICAgICAgICAgY29uc3QgY29sb3JJbmRleCA9IFNjYWxlc1t0aGlzLnNjYWxlXVtzY2FsZURlZ3JlZV07XG4gICAgICAgICAgdGhpcy5jb21wb3NpdGlvbkVuZ2luZS5ub3RlUHJlc3NlZChcbiAgICAgICAgICAgIGNvbG9ySW5kZXgsXG4gICAgICAgICAgICB0aGlzLnN3aXBlT2N0YXZlLFxuICAgICAgICAgICAgaW5kZXggKiB0aGlzLnN3aXBlRnJlcXVlbmN5LFxuICAgICAgICAgICAgdGhpcy5zd2lwZVZlbG9jaXR5XG4gICAgICAgICAgKTtcbiAgICAgICAgICBzZXRUaW1lb3V0KFxuICAgICAgICAgICAgKCkgPT5cbiAgICAgICAgICAgICAgdGhpcy5ncmFwaGljc0VuZ2luZS5wbGF5KFxuICAgICAgICAgICAgICAgIGluZGV4ICsgNCxcbiAgICAgICAgICAgICAgICBjb2xvckluZGV4LFxuICAgICAgICAgICAgICAgIHRoaXMuY2hvcmRWZWxvY2l0eSAqIDEwMFxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgaW5kZXggKiB0aGlzLnN3aXBlRnJlcXVlbmN5ICogMTAwMFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9XG59XG4iLCIvKipcbiAqIEF1ZGlvRW5naW5lIGlzIGEgc3Vic3lzdGVtIHRoYXQgaGFuZGxlcyBpbnRlcmFjdGlvbiB3aXRoIHRoZSBXZWJBdWRpbyBBUEkuXG4gKlxuICogQW4gaW5zdGFuY2UgaXMgaW5pdGlhbGl6ZWQgd2hpY2ggd3JhcHMgdGhlIGdsb2JhbCBhdWRpbyBjb250ZXh0LlxuICpcbiAqIFRoZSBpbnN0YW5jZSBleHBvc2VzIGEgbWV0aG9kIHBsYXlUb25lKCkgd2hpY2ggcGxheXMgdGhlIHNvdW5kLlxuICpcbiAqL1xuXG5pbXBvcnQgRW52ZWxvcGVGaWx0ZXIgZnJvbSBcIi4vYXVkaW8tZW5naW5lL2VudmVsb3BlLWZpbHRlclwiO1xuaW1wb3J0IEFtcGxpdHVkZUVudmVsb3BlIGZyb20gXCIuL2F1ZGlvLWVuZ2luZS9hbXBsaXR1ZGUtZW52ZWxvcGVcIjtcbmltcG9ydCBPc2NpbGxhdG9yIGZyb20gXCIuL2F1ZGlvLWVuZ2luZS9vc2NpbGxhdG9yXCI7XG5pbXBvcnQgRmVxdWVuY3lNb2R1bGF0aW9uIGZyb20gXCIuL2F1ZGlvLWVuZ2luZS9mcmVxdWVuY3ktbW9kdWxhdGlvblwiO1xuaW1wb3J0IFZlbG9jaXR5IGZyb20gXCIuL2F1ZGlvLWVuZ2luZS92ZWxvY2l0eVwiO1xuaW1wb3J0IGV4cG9uT3ZlciBmcm9tIFwiLi9hdWRpby1lbmdpbmUvZXhwb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXVkaW9FbmdpbmUge1xuICBwcml2YXRlIGN0eDogQXVkaW9Db250ZXh0O1xuXG4gIHB1YmxpYyBtYXN0ZXJGaWx0ZXI6IEJpcXVhZEZpbHRlck5vZGU7XG4gIHByaXZhdGUgY29tcHJlc3NvcjogRHluYW1pY3NDb21wcmVzc29yTm9kZTtcbiAgcHVibGljIG1hc3RlckdhaW46IEdhaW5Ob2RlO1xuXG4gIHB1YmxpYyBsZm9BbW91bnQ6IG51bWJlcjtcbiAgcHVibGljIGxmb1dhdmU6IHN0cmluZztcbiAgcHVibGljIGxmb0ZyZXE6IG51bWJlcjtcblxuICBwdWJsaWMgZmlsdGVyRW52ZWxvcGVROiBudW1iZXI7XG4gIHB1YmxpYyBmaWx0ZXJFbnZlbG9wZVN1c3RhaW46IG51bWJlcjtcbiAgcHVibGljIGZpbHRlckVudmVsb3BlU3RhcnQ6IG51bWJlcjtcblxuICBwdWJsaWMgYW1wbGl0dWRlUmVsZWFzZTogbnVtYmVyO1xuICBwdWJsaWMgc3VzdGFpbjogYm9vbGVhbjtcbiAgcHVibGljIGFtcGxpdHVkZUF0dGFjazogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGN0eDogQXVkaW9Db250ZXh0KSB7XG4gICAgdGhpcy5jdHggPSBjdHg7XG5cbiAgICB0aGlzLm1hc3RlckZpbHRlciA9IHRoaXMuY3R4LmNyZWF0ZUJpcXVhZEZpbHRlcigpO1xuICAgIHRoaXMubWFzdGVyRmlsdGVyLnR5cGUgPSBcImxvd3Bhc3NcIjtcbiAgICB0aGlzLm1hc3RlckZpbHRlci5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoMTg1MDAsIHRoaXMuY3R4LmN1cnJlbnRUaW1lKTtcbiAgICB0aGlzLm1hc3RlckZpbHRlci5RLnZhbHVlID0gMC4wMTtcblxuICAgIHRoaXMuY29tcHJlc3NvciA9IGN0eC5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IoKTtcbiAgICB0aGlzLmNvbXByZXNzb3IudGhyZXNob2xkLnNldFZhbHVlQXRUaW1lKC01MCwgY3R4LmN1cnJlbnRUaW1lKTtcbiAgICB0aGlzLmNvbXByZXNzb3Iua25lZS5zZXRWYWx1ZUF0VGltZSg0MCwgY3R4LmN1cnJlbnRUaW1lKTtcbiAgICB0aGlzLmNvbXByZXNzb3IucmF0aW8uc2V0VmFsdWVBdFRpbWUoMTIsIGN0eC5jdXJyZW50VGltZSk7XG4gICAgdGhpcy5jb21wcmVzc29yLmF0dGFjay5zZXRWYWx1ZUF0VGltZSgwLCBjdHguY3VycmVudFRpbWUpO1xuICAgIHRoaXMuY29tcHJlc3Nvci5yZWxlYXNlLnNldFZhbHVlQXRUaW1lKDAuMjUsIGN0eC5jdXJyZW50VGltZSk7XG5cbiAgICB0aGlzLm1hc3RlckdhaW4gPSA8R2Fpbk5vZGU+dGhpcy5jdHguY3JlYXRlR2FpbigpO1xuXG4gICAgdGhpcy5tYXN0ZXJGaWx0ZXJcbiAgICAgIC5jb25uZWN0KHRoaXMuY29tcHJlc3NvcilcbiAgICAgIC5jb25uZWN0KHRoaXMubWFzdGVyR2FpbilcbiAgICAgIC5jb25uZWN0KHRoaXMuY3R4LmRlc3RpbmF0aW9uKTtcblxuICAgIHRoaXMubGZvRnJlcSA9IDAuMTtcbiAgICB0aGlzLmxmb0Ftb3VudCA9IDI7XG4gICAgdGhpcy5sZm9XYXZlID0gXCJzaW5lXCI7XG5cbiAgICB0aGlzLmZpbHRlckVudmVsb3BlUSA9IDAuMTtcbiAgICB0aGlzLmZpbHRlckVudmVsb3BlU3RhcnQgPSAxODUwMDtcbiAgICB0aGlzLmZpbHRlckVudmVsb3BlU3VzdGFpbiA9IDMwMDtcblxuICAgIHRoaXMuYW1wbGl0dWRlQXR0YWNrID0gMC4yNTtcbiAgICB0aGlzLnN1c3RhaW4gPSB0cnVlO1xuICAgIHRoaXMuYW1wbGl0dWRlUmVsZWFzZSA9IDAuNDtcbiAgfVxuXG4gIHBsYXlUb25lKFxuICAgIHN0YXJ0VGltZTogbnVtYmVyLFxuICAgIGRlY2F5VGltZTogbnVtYmVyLFxuICAgIGZyZXE6IG51bWJlcixcbiAgICBkZXR1bmU6IG51bWJlcixcbiAgICBvc2NpYWxsdG9yVHlwZTogc3RyaW5nLFxuICAgIHZlbG9jaXR5OiBudW1iZXJcbiAgKSB7XG4gICAgLyoqXG4gICAgICogRXZlcnkgcGxheVRvbmUoKSBpbnZvY2F0aW9uIGNyZWF0ZXMgYSBuZXcgb3NjaWFsbHRvciBhbmQgZGVzdHJveXMgaXQgd2hlbiB0aGUgbm90ZSBpcyBkb25lLlxuICAgICAqXG4gICAgICogV2UgY2FuIGRvIHRoaXMgYmVjYXVzZSBwbGF5VG9uZSByZXF1aXJlcyBhIGRlY2F5VGltZSBrbm93biBhaGVhZCBvZiB0aW1lLlxuICAgICAqL1xuICAgIGNvbnN0IG9zYyA9IG5ldyBPc2NpbGxhdG9yKHRoaXMuY3R4KS5ub2RlKFxuICAgICAgc3RhcnRUaW1lLFxuICAgICAgZGVjYXlUaW1lLFxuICAgICAgb3NjaWFsbHRvclR5cGUsXG4gICAgICBmcmVxLFxuICAgICAgZGV0dW5lXG4gICAgKTtcblxuICAgIGNvbnN0IGxmbyA9IG5ldyBGZXF1ZW5jeU1vZHVsYXRpb24odGhpcy5jdHgpLm5vZGUoXG4gICAgICBzdGFydFRpbWUsXG4gICAgICBkZWNheVRpbWUsXG4gICAgICB0aGlzLmxmb0ZyZXEsXG4gICAgICB0aGlzLmxmb0Ftb3VudCxcbiAgICAgIHRoaXMubGZvV2F2ZVxuICAgICk7XG5cbiAgICBjb25zdCBhbXBFbnYgPSBuZXcgQW1wbGl0dWRlRW52ZWxvcGUodGhpcy5jdHgpLm5vZGUoXG4gICAgICBzdGFydFRpbWUsXG4gICAgICBkZWNheVRpbWUsXG4gICAgICB0aGlzLnN1c3RhaW4sXG4gICAgICB0aGlzLmFtcGxpdHVkZVJlbGVhc2UsXG4gICAgICB0aGlzLmFtcGxpdHVkZUF0dGFja1xuICAgICk7XG5cbiAgICBjb25zdCBmaWx0ZXJFbnYgPSBuZXcgRW52ZWxvcGVGaWx0ZXIodGhpcy5jdHgpLm5vZGUoXG4gICAgICBzdGFydFRpbWUsXG4gICAgICBkZWNheVRpbWUsXG4gICAgICB0aGlzLmZpbHRlckVudmVsb3BlU3RhcnQsXG4gICAgICB0aGlzLmZpbHRlckVudmVsb3BlUSxcbiAgICAgIHRoaXMuZmlsdGVyRW52ZWxvcGVTdXN0YWluXG4gICAgKTtcblxuICAgIGNvbnN0IHZlbG9jaXR5R2FpbiA9IG5ldyBWZWxvY2l0eSh0aGlzLmN0eCkubm9kZShzdGFydFRpbWUsIHZlbG9jaXR5KTtcblxuICAgIGxmby5jb25uZWN0KG9zYy5mcmVxdWVuY3kpO1xuICAgIG9zY1xuICAgICAgLmNvbm5lY3QoYW1wRW52KVxuICAgICAgLmNvbm5lY3QoZmlsdGVyRW52KVxuICAgICAgLmNvbm5lY3QodmVsb2NpdHlHYWluKVxuICAgICAgLmNvbm5lY3QodGhpcy5tYXN0ZXJGaWx0ZXIpO1xuICB9XG5cbiAgc2V0TWFzdGVyR2FpbihpbnB1dDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5tYXN0ZXJHYWluLmdhaW4udmFsdWUgPSBleHBvbk92ZXIoaW5wdXQsIDEuMCwgMC4wKTtcbiAgfVxuXG4gIHNldE1hc3RlckZpbHRlclZhbHVlKGlucHV0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLm1hc3RlckZpbHRlci5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoXG4gICAgICBleHBvbk92ZXIoaW5wdXQsIDE4NTAwLCAyMCksXG4gICAgICB0aGlzLmN0eC5jdXJyZW50VGltZVxuICAgICk7XG4gIH1cblxuICBzZXRMZm9GcmVxdWVuY3koaW5wdXQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMubGZvRnJlcSA9IGV4cG9uT3ZlcihpbnB1dCwgOCwgMC4wMDEpO1xuICB9XG5cbiAgc2V0RmlsdGVyRW52ZWxvcGVTdGFydEZyZXF1ZW5jeShpbnB1dDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5maWx0ZXJFbnZlbG9wZVN0YXJ0ID0gZXhwb25PdmVyKGlucHV0LCAxODUwMCwgMTAwMCk7XG4gIH1cblxuICBzZXRGaWx0ZXJFbnZlbG9wZVN1c3RhaW4oaW5wdXQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuZmlsdGVyRW52ZWxvcGVTdXN0YWluID0gZXhwb25PdmVyKGlucHV0LCAxODUwMCwgMTApO1xuICB9XG59XG4iLCJjb25zdCBleHBaZXJvID0gMC4wMDAwMDAwMTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW1wbGl0dWRlRW52ZWxvcGUge1xuICBwcml2YXRlIGN0eDogQXVkaW9Db250ZXh0O1xuICBjb25zdHJ1Y3RvcihjdHg6IEF1ZGlvQ29udGV4dCkge1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICB9XG5cbiAgbm9kZShcbiAgICBzdGFydFRpbWU6IG51bWJlcixcbiAgICBub3RlTGVuZ3RoOiBudW1iZXIsXG4gICAgc3VzdGFpbjogYm9vbGVhbixcbiAgICBhbXBsaXR1ZGVSZWxlYXNlOiBudW1iZXIsXG4gICAgYW1wbGl0dWRlQXR0YWNrOiBudW1iZXJcbiAgKTogR2Fpbk5vZGUge1xuICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gdGhpcy5jdHguY3VycmVudFRpbWU7XG4gICAgY29uc3QgcGxheVRpbWUgPSBjdXJyZW50VGltZSArIHN0YXJ0VGltZTtcbiAgICBjb25zdCBnYWluTm9kZSA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcblxuICAgIC8vIEFtcGxpdHVkZSBQcmUtQXR0YWNrXG4gICAgZ2Fpbk5vZGUuZ2Fpbi5jYW5jZWxTY2hlZHVsZWRWYWx1ZXMocGxheVRpbWUpO1xuICAgIGdhaW5Ob2RlLmdhaW4uc2V0VmFsdWVBdFRpbWUoMCwgcGxheVRpbWUpO1xuXG4gICAgLy8gQW1wbGl0dWRlIEF0dGFja1xuICAgIGdhaW5Ob2RlLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMSwgcGxheVRpbWUgKyBhbXBsaXR1ZGVBdHRhY2spO1xuXG4gICAgLy8gQW1wbGl0dWRlIERlY2F5XG4gICAgaWYgKHN1c3RhaW4pIHtcbiAgICAgIGdhaW5Ob2RlLmdhaW4uZXhwb25lbnRpYWxSYW1wVG9WYWx1ZUF0VGltZShcbiAgICAgICAgZXhwWmVybyxcbiAgICAgICAgcGxheVRpbWUgKyBub3RlTGVuZ3RoICsgYW1wbGl0dWRlUmVsZWFzZVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2Fpbk5vZGUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShcbiAgICAgICAgMCxcbiAgICAgICAgcGxheVRpbWUgKyBub3RlTGVuZ3RoICsgYW1wbGl0dWRlUmVsZWFzZVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2Fpbk5vZGU7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEVudmVsb3BlRmlsdGVyIHtcbiAgY3R4OiBBdWRpb0NvbnRleHQ7XG5cbiAgY29uc3RydWN0b3IoY3R4OiBBdWRpb0NvbnRleHQpIHtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgfVxuXG4gIG5vZGUoXG4gICAgc3RhcnRUaW1lOiBudW1iZXIsXG4gICAgbm90ZUxlbmd0aDogbnVtYmVyLFxuICAgIGZpbHRlckVudmVsb3BlU3RhcnQ6IG51bWJlcixcbiAgICBROiBudW1iZXIsXG4gICAgc3VzdGFpbjogbnVtYmVyXG4gICk6IEJpcXVhZEZpbHRlck5vZGUge1xuICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gdGhpcy5jdHguY3VycmVudFRpbWU7XG4gICAgY29uc3QgYmlxdWFkRmlsdGVyID0gdGhpcy5jdHguY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG5cbiAgICBiaXF1YWRGaWx0ZXIudHlwZSA9IFwibG93cGFzc1wiO1xuICAgIGJpcXVhZEZpbHRlci5RLnZhbHVlID0gUTtcbiAgICBiaXF1YWRGaWx0ZXIuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKGZpbHRlckVudmVsb3BlU3RhcnQsIGN1cnJlbnRUaW1lKTtcbiAgICBiaXF1YWRGaWx0ZXIuZnJlcXVlbmN5LmV4cG9uZW50aWFsUmFtcFRvVmFsdWVBdFRpbWUoXG4gICAgICBzdXN0YWluLFxuICAgICAgY3VycmVudFRpbWUgKyBzdGFydFRpbWUgKyBub3RlTGVuZ3RoXG4gICAgKTtcblxuICAgIHJldHVybiBiaXF1YWRGaWx0ZXI7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IChpbnB1dDogc3RyaW5nLCBtYXg6IG51bWJlciwgZmxvb3I6IG51bWJlcikgPT4ge1xuICByZXR1cm4gZXhwb24oaW5wdXQpICogbWF4ICsgZmxvb3I7XG59O1xuXG5jb25zdCBleHBvbiA9ICh4OiBzdHJpbmcpOiBudW1iZXIgPT4ge1xuICBsZXQgdmFsdWUgPSBwYXJzZUZsb2F0KHgpO1xuICB2YWx1ZSA9IHZhbHVlIDwgMC4wID8gMC4wIDogdmFsdWU7XG4gIHZhbHVlID0gdmFsdWUgPiAxLjAgPyAxLjAgOiB2YWx1ZTtcbiAgcmV0dXJuIC1NYXRoLnNxcnQoLXZhbHVlICsgMSkgKyAxO1xufTtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEZlcXVlbmN5TW9kdWxhdGlvbiB7XG4gIHByaXZhdGUgY3R4OiBBdWRpb0NvbnRleHQ7XG5cbiAgY29uc3RydWN0b3IoY3R4OiBBdWRpb0NvbnRleHQpIHtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgfVxuICBub2RlKFxuICAgIHN0YXJ0VGltZTogbnVtYmVyLFxuICAgIG5vdGVMZW5ndGg6IG51bWJlcixcbiAgICBsZm9GcmVxOiBudW1iZXIsXG4gICAgbGZvQW1vdW50OiBudW1iZXIsXG4gICAgbGZvV2F2ZTogc3RyaW5nXG4gICkge1xuICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gdGhpcy5jdHguY3VycmVudFRpbWU7XG4gICAgY29uc3QgbGZvID0gdGhpcy5jdHguY3JlYXRlT3NjaWxsYXRvcigpO1xuXG4gICAgbGZvLnR5cGUgPSA8T3NjaWxsYXRvclR5cGU+bGZvV2F2ZTtcbiAgICBsZm8uZnJlcXVlbmN5LnZhbHVlID0gbGZvRnJlcTtcblxuICAgIGxmby5zdGFydChjdXJyZW50VGltZSArIHN0YXJ0VGltZSk7XG4gICAgbGZvLnN0b3AoY3VycmVudFRpbWUgKyBub3RlTGVuZ3RoICsgc3RhcnRUaW1lKTtcblxuICAgIGNvbnN0IGdhaW5Ob2RlID0gdGhpcy5jdHguY3JlYXRlR2FpbigpO1xuICAgIGdhaW5Ob2RlLmdhaW4udmFsdWUgPSBsZm9BbW91bnQ7XG5cbiAgICByZXR1cm4gbGZvLmNvbm5lY3QoZ2Fpbk5vZGUpO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBPc2NpbGxhdG9yIHtcbiAgcHJpdmF0ZSBjdHg6IEF1ZGlvQ29udGV4dDtcbiAgcHJpdmF0ZSBjdXN0b21XYXZlZm9ybTogUGVyaW9kaWNXYXZlO1xuXG4gIGNvbnN0cnVjdG9yKGN0eDogQXVkaW9Db250ZXh0KSB7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gICAgY29uc3Qgc2luZVRlcm1zID0gbmV3IEZsb2F0MzJBcnJheShbMCwgMCwgMSwgMCwgMV0pO1xuICAgIGNvbnN0IGNvc2luZVRlcm1zID0gbmV3IEZsb2F0MzJBcnJheShzaW5lVGVybXMubGVuZ3RoKTtcbiAgICB0aGlzLmN1c3RvbVdhdmVmb3JtID0gdGhpcy5jdHguY3JlYXRlUGVyaW9kaWNXYXZlKGNvc2luZVRlcm1zLCBzaW5lVGVybXMpO1xuICB9XG5cbiAgbm9kZShcbiAgICBzdGFydFRpbWU6IG51bWJlcixcbiAgICBub3RlTGVuZ3RoOiBudW1iZXIsXG4gICAgb3NjaWxsYXRvcldhdmU6IHN0cmluZyxcbiAgICBmcmVxdWVuY3k6IG51bWJlcixcbiAgICBkZXR1bmU6IG51bWJlclxuICApOiBPc2NpbGxhdG9yTm9kZSB7XG4gICAgY29uc3QgY3VycmVudFRpbWUgPSB0aGlzLmN0eC5jdXJyZW50VGltZTtcbiAgICBjb25zdCBvc2NpbGxhdG9yID0gdGhpcy5jdHguY3JlYXRlT3NjaWxsYXRvcigpO1xuXG4gICAgaWYgKG9zY2lsbGF0b3JXYXZlID09IFwiY3VzdG9tXCIpIHtcbiAgICAgIG9zY2lsbGF0b3Iuc2V0UGVyaW9kaWNXYXZlKHRoaXMuY3VzdG9tV2F2ZWZvcm0pOyAvLyBUT0RPOiBBZGQgbW9yZSBjdXN0b20gV2F2ZWZvcm1zXG4gICAgfSBlbHNlIHtcbiAgICAgIG9zY2lsbGF0b3IudHlwZSA9IDxPc2NpbGxhdG9yVHlwZT5vc2NpbGxhdG9yV2F2ZTtcbiAgICB9XG5cbiAgICBvc2NpbGxhdG9yLmZyZXF1ZW5jeS52YWx1ZSA9IGZyZXF1ZW5jeTtcbiAgICBvc2NpbGxhdG9yLmRldHVuZS5zZXRWYWx1ZUF0VGltZShkZXR1bmUsIGN1cnJlbnRUaW1lICsgc3RhcnRUaW1lKTtcblxuICAgIG9zY2lsbGF0b3Iuc3RhcnQoY3VycmVudFRpbWUgKyBzdGFydFRpbWUpO1xuICAgIG9zY2lsbGF0b3Iuc3RvcChjdXJyZW50VGltZSArIG5vdGVMZW5ndGggKyBzdGFydFRpbWUpO1xuXG4gICAgcmV0dXJuIG9zY2lsbGF0b3I7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFZlbG9jaXR5IHtcbiAgcHJpdmF0ZSBjdHg6IEF1ZGlvQ29udGV4dDtcblxuICBjb25zdHJ1Y3RvcihjdHg6IEF1ZGlvQ29udGV4dCkge1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICB9XG5cbiAgbm9kZShzdGFydFRpbWU6IG51bWJlciwgdmVsb2NpdHk6IG51bWJlcik6IEdhaW5Ob2RlIHtcbiAgICBjb25zdCB2ZWxvY2l0eUdhaW4gPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XG4gICAgdmVsb2NpdHlHYWluLmdhaW4uc2V0VmFsdWVBdFRpbWUoXG4gICAgICB2ZWxvY2l0eSxcbiAgICAgIHRoaXMuY3R4LmN1cnJlbnRUaW1lICsgc3RhcnRUaW1lXG4gICAgKTtcbiAgICByZXR1cm4gdmVsb2NpdHlHYWluO1xuICB9XG59XG4iLCJpbXBvcnQgdXJuSkIgZnJvbSBcIi4vY29tcG9zaXRpb24tZW5naW5lL3JhbmRvbVwiO1xuaW1wb3J0IE5vdGVUYWJsZSBmcm9tIFwiLi9jb21wb3NpdGlvbi1lbmdpbmUvbm90ZS10YWJsZVwiO1xuaW1wb3J0IEF1ZGlvRW5naW5lIGZyb20gXCIuL2F1ZGlvLWVuZ2luZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wb3NpdGlvbkVuZ2luZSB7XG4gIC8qKlxuICAgKiBDb21wb3NpdGlvbkVuZ2luZSBpcyBhIHN1YnN5c3RlbSB0aGF0IGRlY2lkZXMgd2hpY2ggbm90ZXMgdG8gcGxheSBhbmQgd2hlbi5cbiAgICpcbiAgICogSXQgaGFzIGFuIGF1ZGlvRW5naW5lIHByb3BlcnR5IHdoaWNoIGV4cG9zZXMgYSBub3RlUHJlc3NlZCgpIG1ldGhvZFxuICAgKlxuICAgKiBDb21wb3NpdGlvbkVuZ2luZSBpcyByZXNwb25zaWJsZSBmb3Igd2hhdCBnb2VzIGluIGFzIHRoZSBhcmd1bWVudHMgdG8gbm90ZVByZXNzZWQoKVxuICAgKlxuICAgKi9cbiAgcHVibGljIGNob3JkU3BlZWQ6IG51bWJlcjtcbiAgcHVibGljIGNob3JkVm9pY2VzOiBHZW5lcmF0b3JbXTtcbiAgcHVibGljIHN3aXBlVm9pY2VzOiBHZW5lcmF0b3JbXTtcbiAgcHVibGljIGdsb2JhbFJvb3Q6IG51bWJlcjtcbiAgcHVibGljIG9zY2lhbGx0b3JUeXBlOiBzdHJpbmc7XG4gIHB1YmxpYyBkZWNheVRpbWU6IG51bWJlcjtcbiAgcHVibGljIGRldHVuZTogbnVtYmVyO1xuXG4gIHByaXZhdGUgbm90ZVRhYmxlOiBOb3RlVGFibGU7XG4gIHByaXZhdGUgYXVkaW9FbmdpbmU6IEF1ZGlvRW5naW5lO1xuXG4gIGNvbnN0cnVjdG9yKGF1ZGlvRW5naW5lOiBBdWRpb0VuZ2luZSkge1xuICAgIHRoaXMuZGVjYXlUaW1lID0gMjtcbiAgICB0aGlzLmNob3JkU3BlZWQgPSB0aGlzLmRlY2F5VGltZSAqIDEwMDA7IC8vbXNcbiAgICB0aGlzLmNob3JkVm9pY2VzID0gW3VybkpCKDcpLCB1cm5KQig3KSwgdXJuSkIoNyksIHVybkpCKDcpXTtcbiAgICB0aGlzLnN3aXBlVm9pY2VzID0gW3VybkpCKDcpLCB1cm5KQig3KSwgdXJuSkIoNyksIHVybkpCKDcpXTtcblxuICAgIHRoaXMuYXVkaW9FbmdpbmUgPSBhdWRpb0VuZ2luZTtcblxuICAgIHRoaXMubm90ZVRhYmxlID0gbmV3IE5vdGVUYWJsZSgpO1xuICAgIHRoaXMuZGV0dW5lID0gMDtcbiAgICB0aGlzLmdsb2JhbFJvb3QgPSAyO1xuXG4gICAgdGhpcy5vc2NpYWxsdG9yVHlwZSA9IFwic2F3dG9vdGhcIjtcbiAgfVxuXG4gIHNldERlY2F5VGltZShkZWNheVRpbWU6IHN0cmluZykge1xuICAgIHRoaXMuZGVjYXlUaW1lID0gcGFyc2VGbG9hdChkZWNheVRpbWUpO1xuICAgIHRoaXMuY2hvcmRTcGVlZCA9IHRoaXMuZGVjYXlUaW1lICogMTAwMDsgLy9tc1xuICB9XG5cbiAgbm90ZVByZXNzZWQoXG4gICAgbm90ZTogbnVtYmVyLFxuICAgIG9jdGF2ZTogbnVtYmVyLFxuICAgIHN0YXJ0VGltZTogbnVtYmVyLFxuICAgIHZlbG9jaXR5OiBudW1iZXJcbiAgKSB7XG4gICAgY29uc3QgZnJlcXVlbmN5ID0gdGhpcy5ub3RlVGFibGUuZ2V0Tm90ZUZyZXF1ZW5jeShub3RlLCBvY3RhdmUpO1xuXG4gICAgdGhpcy5hdWRpb0VuZ2luZS5wbGF5VG9uZShcbiAgICAgIHN0YXJ0VGltZSxcbiAgICAgIHRoaXMuZGVjYXlUaW1lLFxuICAgICAgZnJlcXVlbmN5LFxuICAgICAgLXRoaXMuZGV0dW5lLFxuICAgICAgdGhpcy5vc2NpYWxsdG9yVHlwZSxcbiAgICAgIHZlbG9jaXR5XG4gICAgKTtcbiAgICB0aGlzLmF1ZGlvRW5naW5lLnBsYXlUb25lKFxuICAgICAgc3RhcnRUaW1lLFxuICAgICAgdGhpcy5kZWNheVRpbWUsXG4gICAgICBmcmVxdWVuY3ksXG4gICAgICB0aGlzLmRldHVuZSxcbiAgICAgIHRoaXMub3NjaWFsbHRvclR5cGUsXG4gICAgICB2ZWxvY2l0eVxuICAgICk7XG4gIH1cbn1cbiIsInR5cGUgT2N0YXZlID0ge1xuICBba2V5OiBzdHJpbmddOiBudW1iZXI7XG4gIEM6IG51bWJlcjtcbiAgXCJDI1wiOiBudW1iZXI7XG4gIEQ6IG51bWJlcjtcbiAgXCJEI1wiOiBudW1iZXI7XG4gIEU6IG51bWJlcjtcbiAgRjogbnVtYmVyO1xuICBcIkYjXCI6IG51bWJlcjtcbiAgRzogbnVtYmVyO1xuICBcIkcjXCI6IG51bWJlcjtcbiAgQTogbnVtYmVyO1xuICBcIkEjXCI6IG51bWJlcjtcbiAgQjogbnVtYmVyO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm90ZVRhYmxlIHtcbiAgbm90ZUZyZXF1ZW5jaWVzOiBPY3RhdmVbXTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm5vdGVGcmVxdWVuY2llcyA9IFtcbiAgICAgIHtcbiAgICAgICAgQTogNTUuMCxcbiAgICAgICAgXCJBI1wiOiA1OC4yNzA0NzAxODk3NjEyMzksXG4gICAgICAgIEI6IDYxLjczNTQxMjY1NzAxNTUxMyxcbiAgICAgICAgQzogMzIuNzAzMTk1NjYyNTc0ODI5LFxuICAgICAgICBcIkMjXCI6IDM0LjY0NzgyODg3MjEwOTAxMixcbiAgICAgICAgRDogMzYuNzA4MDk1OTg5Njc1OTQ1LFxuICAgICAgICBcIkQjXCI6IDM4Ljg5MDg3Mjk2NTI2MDExMyxcbiAgICAgICAgRTogNDEuMjAzNDQ0NjE0MTA4NzQxLFxuICAgICAgICBGOiA0My42NTM1Mjg5MjkxMjU0ODUsXG4gICAgICAgIFwiRiNcIjogNDYuMjQ5MzAyODM4OTU0Mjk5LFxuICAgICAgICBHOiA0OC45OTk0Mjk0OTc3MTg2NjEsXG4gICAgICAgIFwiRyNcIjogNTEuOTEzMDg3MTk3NDkzMTQyXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBBOiAxMTAuMCxcbiAgICAgICAgXCJBI1wiOiAxMTYuNTQwOTQwMzc5NTIyNDc5LFxuICAgICAgICBCOiAxMjMuNDcwODI1MzE0MDMxMDI3LFxuICAgICAgICBDOiA2NS40MDYzOTEzMjUxNDk2NTgsXG4gICAgICAgIFwiQyNcIjogNjkuMjk1NjU3NzQ0MjE4MDI0LFxuICAgICAgICBEOiA3My40MTYxOTE5NzkzNTE4OSxcbiAgICAgICAgXCJEI1wiOiA3Ny43ODE3NDU5MzA1MjAyMjcsXG4gICAgICAgIEU6IDgyLjQwNjg4OTIyODIxNzQ4MixcbiAgICAgICAgRjogODcuMzA3MDU3ODU4MjUwOTcxLFxuICAgICAgICBcIkYjXCI6IDkyLjQ5ODYwNTY3NzkwODU5OSxcbiAgICAgICAgRzogOTcuOTk4ODU4OTk1NDM3MzIzLFxuICAgICAgICBcIkcjXCI6IDEwMy44MjYxNzQzOTQ5ODYyODRcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIEE6IDIyMC4wLFxuICAgICAgICBcIkEjXCI6IDIzMy4wODE4ODA3NTkwNDQ5NTgsXG4gICAgICAgIEI6IDI0Ni45NDE2NTA2MjgwNjIwNTUsXG4gICAgICAgIEM6IDEzMC44MTI3ODI2NTAyOTkzMTcsXG4gICAgICAgIFwiQyNcIjogMTM4LjU5MTMxNTQ4ODQzNjA0OCxcbiAgICAgICAgRDogMTQ2LjgzMjM4Mzk1ODcwMzc4LFxuICAgICAgICBcIkQjXCI6IDE1NS41NjM0OTE4NjEwNDA0NTUsXG4gICAgICAgIEU6IDE2NC44MTM3Nzg0NTY0MzQ5NjQsXG4gICAgICAgIEY6IDE3NC42MTQxMTU3MTY1MDE5NDIsXG4gICAgICAgIFwiRiNcIjogMTg0Ljk5NzIxMTM1NTgxNzE5OSxcbiAgICAgICAgRzogMTk1Ljk5NzcxNzk5MDg3NDY0NyxcbiAgICAgICAgXCJHI1wiOiAyMDcuNjUyMzQ4Nzg5OTcyNTY5XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBBOiA0NDAuMCxcbiAgICAgICAgXCJBI1wiOiA0NjYuMTYzNzYxNTE4MDg5OTE2LFxuICAgICAgICBCOiA0OTMuODgzMzAxMjU2MTI0MTExLFxuICAgICAgICBDOiAyNjEuNjI1NTY1MzAwNTk4NjM0LFxuICAgICAgICBcIkMjXCI6IDI3Ny4xODI2MzA5NzY4NzIwOTYsXG4gICAgICAgIEQ6IDI5My42NjQ3Njc5MTc0MDc1NixcbiAgICAgICAgXCJEI1wiOiAzMTEuMTI2OTgzNzIyMDgwOTEsXG4gICAgICAgIEU6IDMyOS42Mjc1NTY5MTI4Njk5MjksXG4gICAgICAgIEY6IDM0OS4yMjgyMzE0MzMwMDM4ODQsXG4gICAgICAgIFwiRiNcIjogMzY5Ljk5NDQyMjcxMTYzNDM5OCxcbiAgICAgICAgRzogMzkxLjk5NTQzNTk4MTc0OTI5NCxcbiAgICAgICAgXCJHI1wiOiA0MTUuMzA0Njk3NTc5OTQ1MTM4XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBBOiA4ODAuMCxcbiAgICAgICAgXCJBI1wiOiA5MzIuMzI3NTIzMDM2MTc5ODMyLFxuICAgICAgICBCOiA5ODcuNzY2NjAyNTEyMjQ4MjIzLFxuICAgICAgICBDOiA1MjMuMjUxMTMwNjAxMTk3MjY5LFxuICAgICAgICBcIkMjXCI6IDU1NC4zNjUyNjE5NTM3NDQxOTIsXG4gICAgICAgIEQ6IDU4Ny4zMjk1MzU4MzQ4MTUxMixcbiAgICAgICAgXCJEI1wiOiA2MjIuMjUzOTY3NDQ0MTYxODIxLFxuICAgICAgICBFOiA2NTkuMjU1MTEzODI1NzM5ODU5LFxuICAgICAgICBGOiA2OTguNDU2NDYyODY2MDA3NzY4LFxuICAgICAgICBcIkYjXCI6IDczOS45ODg4NDU0MjMyNjg3OTcsXG4gICAgICAgIEc6IDc4My45OTA4NzE5NjM0OTg1ODgsXG4gICAgICAgIFwiRyNcIjogODMwLjYwOTM5NTE1OTg5MDI3N1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgQTogMTc2MC4wLFxuICAgICAgICBcIkEjXCI6IDE4NjQuNjU1MDQ2MDcyMzU5NjY1LFxuICAgICAgICBCOiAxOTc1LjUzMzIwNTAyNDQ5NjQ0NyxcbiAgICAgICAgQzogMTA0Ni41MDIyNjEyMDIzOTQ1MzgsXG4gICAgICAgIFwiQyNcIjogMTEwOC43MzA1MjM5MDc0ODgzODQsXG4gICAgICAgIEQ6IDExNzQuNjU5MDcxNjY5NjMwMjQxLFxuICAgICAgICBcIkQjXCI6IDEyNDQuNTA3OTM0ODg4MzIzNjQyLFxuICAgICAgICBFOiAxMzE4LjUxMDIyNzY1MTQ3OTcxOCxcbiAgICAgICAgRjogMTM5Ni45MTI5MjU3MzIwMTU1MzcsXG4gICAgICAgIFwiRiNcIjogMTQ3OS45Nzc2OTA4NDY1Mzc1OTUsXG4gICAgICAgIEc6IDE1NjcuOTgxNzQzOTI2OTk3MTc2LFxuICAgICAgICBcIkcjXCI6IDE2NjEuMjE4NzkwMzE5NzgwNTU0XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBBOiAzNTIwLjAsXG4gICAgICAgIFwiQSNcIjogMzcyOS4zMTAwOTIxNDQ3MTkzMzEsXG4gICAgICAgIEI6IDM5NTEuMDY2NDEwMDQ4OTkyODk0LFxuICAgICAgICBDOiAyMDkzLjAwNDUyMjQwNDc4OTA3NyxcbiAgICAgICAgXCJDI1wiOiAyMjE3LjQ2MTA0NzgxNDk3Njc2OSxcbiAgICAgICAgRDogMjM0OS4zMTgxNDMzMzkyNjA0ODIsXG4gICAgICAgIFwiRCNcIjogMjQ4OS4wMTU4Njk3NzY2NDcyODUsXG4gICAgICAgIEU6IDI2MzcuMDIwNDU1MzAyOTU5NDM3LFxuICAgICAgICBGOiAyNzkzLjgyNTg1MTQ2NDAzMTA3NSxcbiAgICAgICAgXCJGI1wiOiAyOTU5Ljk1NTM4MTY5MzA3NTE5MSxcbiAgICAgICAgRzogMzEzNS45NjM0ODc4NTM5OTQzNTIsXG4gICAgICAgIFwiRyNcIjogMzMyMi40Mzc1ODA2Mzk1NjExMDhcbiAgICAgIH1cbiAgICBdO1xuICB9XG5cbiAgZ2V0Tm90ZUZyZXF1ZW5jeShub3RlOiBudW1iZXIsIG9jdGF2ZTogbnVtYmVyKSB7XG4gICAgY29uc3Qgc3RyaW5nTm90ZSA9IE9iamVjdC5rZXlzKHRoaXMubm90ZUZyZXF1ZW5jaWVzW29jdGF2ZV0pW25vdGVdO1xuICAgIHJldHVybiB0aGlzLm5vdGVGcmVxdWVuY2llc1tvY3RhdmVdW3N0cmluZ05vdGVdO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiogdXJuSkIobGVuZ3RoOiBudW1iZXIpIHtcbiAgbGV0IGFycmF5ID0gcmFuZEFycmF5KGxlbmd0aCk7XG4gIGxldCBpbmRleCA9IDA7XG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICB5aWVsZCBhcnJheVtpbmRleF07XG4gICAgaW5kZXggPSBpbmRleCArIDE7XG5cbiAgICBpZiAoaW5kZXggPT09IGxlbmd0aCkge1xuICAgICAgYXJyYXkgPSByYW5kQXJyYXkobGVuZ3RoKTtcbiAgICAgIGluZGV4ID0gMDtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmFuZEFycmF5KGxlbmd0aDogbnVtYmVyKSB7XG4gIGxldCBhcnJheTogbnVtYmVyW10gPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgYXJyYXlbaV0gPSBpO1xuICB9XG5cbiAgLy8gRmlzaGVyLVlhdGVzIHNodWZmbGluZyBhbGdvcml0aG1cbiAgZm9yIChsZXQgaSA9IGFycmF5Lmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaSk7XG4gICAgY29uc3QgdGVtcCA9IGFycmF5W2ldO1xuICAgIGFycmF5W2ldID0gYXJyYXlbal07XG4gICAgYXJyYXlbal0gPSB0ZW1wO1xuICB9XG5cbiAgcmV0dXJuIGFycmF5O1xufVxuIiwiZXhwb3J0IHR5cGUgQ29udHJvbFZhbHVlcyA9IHtcbiAgbWFzdGVyR2Fpbjogc3RyaW5nO1xuICBzZXRNYXN0ZXJGaWx0ZXJWYWx1ZTogc3RyaW5nO1xuICBtYXN0ZXJDb250cm9sU3RhdGU6IGJvb2xlYW47XG4gIHNldERlY2F5VGltZTogc3RyaW5nO1xuICBjaG9yZE9jdGF2ZTogbnVtYmVyO1xuICBzZXRMZm9GcmVxdWVuY3k6IHN0cmluZztcbiAgZmlsdGVyRW52ZWxvcGVROiBudW1iZXI7XG4gIGRldHVuZTogbnVtYmVyO1xuICBzZXRGaWx0ZXJFbnZlbG9wZVN0YXJ0RnJlcXVlbmN5OiBzdHJpbmc7XG4gIGxmb1dhdmU6IHN0cmluZztcbiAgYW1wbGl0dWRlQXR0YWNrOiBudW1iZXI7XG4gIHNldEZpbHRlckVudmVsb3BlU3VzdGFpbjogc3RyaW5nO1xuICBvc2NpYWxsdG9yVHlwZTogc3RyaW5nO1xuICBzY2FsZTogc3RyaW5nO1xuICBzZXRCbGVuZE1vZGU6IHN0cmluZztcbiAgbGZvQW1vdW50OiBudW1iZXI7XG4gIGFtcGxpdHVkZVJlbGVhc2U6IG51bWJlcjtcbiAgc3dpcGVGcmVxdWVuY3k6IG51bWJlcjtcbiAgc3dpcGVPY3RhdmU6IG51bWJlcjtcbiAgY2hvcmRWZWxvY2l0eTogbnVtYmVyO1xuICBzd2lwZVZlbG9jaXR5OiBudW1iZXI7XG4gIHN1c3RhaW46IGJvb2xlYW47XG59O1xuXG5jb25zdCBJTklUX0NPTlRST0xfVkFMVUVTOiBDb250cm9sVmFsdWVzID0ge1xuICBtYXN0ZXJHYWluOiBcIjEuMFwiLFxuICBzZXRNYXN0ZXJGaWx0ZXJWYWx1ZTogXCIxLjBcIixcbiAgbWFzdGVyQ29udHJvbFN0YXRlOiBmYWxzZSxcbiAgc2V0RGVjYXlUaW1lOiBcIjRcIixcbiAgY2hvcmRPY3RhdmU6IDMsXG4gIHNldExmb0ZyZXF1ZW5jeTogXCIwLjFcIixcbiAgZmlsdGVyRW52ZWxvcGVROiAwLjEsXG4gIGRldHVuZTogMCxcbiAgc2V0RmlsdGVyRW52ZWxvcGVTdGFydEZyZXF1ZW5jeTogXCIxODUwMFwiLFxuICBsZm9XYXZlOiBcInNpbmVcIixcbiAgYW1wbGl0dWRlQXR0YWNrOiAwLjI1LFxuICBzZXRGaWx0ZXJFbnZlbG9wZVN1c3RhaW46IFwiMzAwXCIsXG4gIG9zY2lhbGx0b3JUeXBlOiBcInRyaWFuZ2xlXCIsXG4gIHNjYWxlOiBcIkx5ZGlhblwiLFxuICBzZXRCbGVuZE1vZGU6IFwic291cmNlLW92ZXJcIixcbiAgbGZvQW1vdW50OiAyLFxuICBhbXBsaXR1ZGVSZWxlYXNlOiAwLjQsXG4gIHN3aXBlRnJlcXVlbmN5OiAwLjQsXG4gIHN3aXBlT2N0YXZlOiAzLFxuICBjaG9yZFZlbG9jaXR5OiAxLjAsXG4gIHN3aXBlVmVsb2NpdHk6IDEuMCxcbiAgc3VzdGFpbjogdHJ1ZSxcbn07XG5cbmV4cG9ydCBjbGFzcyBIYXNoU3RvcmFnZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRyeSB7XG4gICAgICBpZiAodGhpcy5pc0VtcHR5KHRoaXMuZGVjb2RlKHdpbmRvdy5sb2NhdGlvbi5oYXNoKSkpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSB0aGlzLmVuY29kZShJTklUX0NPTlRST0xfVkFMVUVTKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHRoaXMuZW5jb2RlKElOSVRfQ09OVFJPTF9WQUxVRVMpO1xuICAgIH1cbiAgfVxuXG4gIGlzRXF1YWwgPSAoYTogYW55LCBiOiBhbnkpID0+IEpTT04uc3RyaW5naWZ5KGEpID09PSBKU09OLnN0cmluZ2lmeShiKTtcbiAgaXNFbXB0eSA9IChhOiBhbnkpID0+IGEubGVuZ3RoID09PSAwO1xuICBzdGF0ZSgpOiBDb250cm9sVmFsdWVzIHtcbiAgICByZXR1cm4gdGhpcy5kZWNvZGUod2luZG93LmxvY2F0aW9uLmhhc2gpO1xuICB9XG5cbiAgZW5jb2RlKHN0YXRlOiBDb250cm9sVmFsdWVzKSB7XG4gICAgcmV0dXJuIGJ0b2EoSlNPTi5zdHJpbmdpZnkoc3RhdGUpKTtcbiAgfVxuICBkZWNvZGUoaGFzaDogYW55KTogYW55IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShhdG9iKGhhc2guc3Vic3RyaW5nKDEpKSk7XG4gIH1cblxuICB1cGRhdGUoZGF0YTogYW55KSB7XG4gICAgY29uc3QgX3N0YXRlID0gdGhpcy5zdGF0ZSgpO1xuICAgIGNvbnN0IHVwZGF0ZWQgPSB7IC4uLl9zdGF0ZSwgLi4uZGF0YSB9O1xuICAgIGlmICh0aGlzLmlzRXF1YWwodXBkYXRlZCwgX3N0YXRlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHRoaXMuZW5jb2RlKHVwZGF0ZWQpO1xuICAgICAgY29uc29sZS5sb2coX3N0YXRlKTtcbiAgICAgIHJldHVybiB1cGRhdGVkO1xuICAgIH1cbiAgfVxuXG4gIHNldE1hc3RlckdhaW4oZTogc3RyaW5nKSB7XG4gICAgdGhpcy51cGRhdGUoeyBtYXN0ZXJHYWluOiBlIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgU3F1YXJlcyBmcm9tIFwiLi9ncmFwaGljcy1lbmdpbmUvc3F1YXJlXCI7XG4vKipcbiAqXG4gKiBXcmFwcyB0aGUgQ2FudmFzIGNvbnRleHRcbiAqXG4gKiBUaGlzIGNsYXNzIGlzIHJlc3BvbnNpYmxlIGZvciBsYXlpbmcgb3V0IHRoZSBzcXVhcmVzIG9uIHRoZSBjYW52YXMuXG4gKlxuICogQ2FsbCBkcmF3KCkgdG8gZHJhdyB0byB0aGUgY2FudmFzLlxuICpcbiAqIEl0IHBhc3NlcyB0aGUgY2FudmFzIGNvbnRleCBpbnRvIGBTcXVhcmVzYHNcbiAqXG4gKiBgU3F1YXJlc2BzIGRyYXcgdGhlbXNlbHZlcyBvbiB0aGUgc2NyZWVuLlxuICovXG5jbGFzcyBHcmFwaGljc0VuZ2luZSB7XG4gIHByaXZhdGUgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgcHJpdmF0ZSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgcHJpdmF0ZSBzcXVhcmVPcmlnaW46IFtudW1iZXIsIG51bWJlcl07XG4gIHByaXZhdGUgc3F1YXJlU2l6ZTogbnVtYmVyO1xuICBwcml2YXRlIHNxdWFyZXM6IFNxdWFyZXNbXTtcbiAgcHJpdmF0ZSB1bml0U3F1YXJlOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xuICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgIHRoaXMuY3R4ID0gPENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRD50aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgdGhpcy51bml0U3F1YXJlID0gMzM7XG4gICAgdGhpcy5zcXVhcmVPcmlnaW4gPSA8W251bWJlciwgbnVtYmVyXT5bdGhpcy51bml0U3F1YXJlLCB0aGlzLnVuaXRTcXVhcmVdO1xuICAgIHRoaXMuc3F1YXJlU2l6ZSA9IDxudW1iZXI+dGhpcy51bml0U3F1YXJlICogMjtcbiAgICB0aGlzLnNxdWFyZXMgPSA8U3F1YXJlc1tdPltcbiAgICAgIG5ldyBTcXVhcmVzKFxuICAgICAgICB0aGlzLmN0eCxcbiAgICAgICAgW1xuICAgICAgICAgIHRoaXMuc3F1YXJlT3JpZ2luWzBdLFxuICAgICAgICAgIHRoaXMuc3F1YXJlT3JpZ2luWzFdLFxuICAgICAgICAgIHRoaXMuc3F1YXJlU2l6ZSxcbiAgICAgICAgICB0aGlzLnNxdWFyZVNpemVcbiAgICAgICAgXSxcbiAgICAgICAgMFxuICAgICAgKSxcbiAgICAgIG5ldyBTcXVhcmVzKFxuICAgICAgICB0aGlzLmN0eCxcbiAgICAgICAgW1xuICAgICAgICAgIHRoaXMuc3F1YXJlT3JpZ2luWzBdLFxuICAgICAgICAgIHRoaXMuc3F1YXJlT3JpZ2luWzFdICsgdGhpcy51bml0U3F1YXJlLFxuICAgICAgICAgIHRoaXMuc3F1YXJlU2l6ZSxcbiAgICAgICAgICB0aGlzLnNxdWFyZVNpemVcbiAgICAgICAgXSxcbiAgICAgICAgMVxuICAgICAgKSxcbiAgICAgIG5ldyBTcXVhcmVzKFxuICAgICAgICB0aGlzLmN0eCxcbiAgICAgICAgW1xuICAgICAgICAgIHRoaXMuc3F1YXJlT3JpZ2luWzBdICsgdGhpcy51bml0U3F1YXJlLFxuICAgICAgICAgIHRoaXMuc3F1YXJlT3JpZ2luWzFdLFxuICAgICAgICAgIHRoaXMuc3F1YXJlU2l6ZSxcbiAgICAgICAgICB0aGlzLnNxdWFyZVNpemVcbiAgICAgICAgXSxcbiAgICAgICAgMlxuICAgICAgKSxcbiAgICAgIG5ldyBTcXVhcmVzKFxuICAgICAgICB0aGlzLmN0eCxcbiAgICAgICAgW1xuICAgICAgICAgIHRoaXMuc3F1YXJlT3JpZ2luWzBdICsgdGhpcy51bml0U3F1YXJlLFxuICAgICAgICAgIHRoaXMuc3F1YXJlT3JpZ2luWzFdICsgdGhpcy51bml0U3F1YXJlLFxuICAgICAgICAgIHRoaXMuc3F1YXJlU2l6ZSxcbiAgICAgICAgICB0aGlzLnNxdWFyZVNpemVcbiAgICAgICAgXSxcbiAgICAgICAgM1xuICAgICAgKSxcbiAgICAgIG5ldyBTcXVhcmVzKFxuICAgICAgICB0aGlzLmN0eCxcbiAgICAgICAgW1xuICAgICAgICAgIHRoaXMuc3F1YXJlT3JpZ2luWzBdICsgdGhpcy51bml0U3F1YXJlICogNCxcbiAgICAgICAgICB0aGlzLnNxdWFyZU9yaWdpblsxXSxcbiAgICAgICAgICB0aGlzLnNxdWFyZVNpemUsXG4gICAgICAgICAgdGhpcy5zcXVhcmVTaXplXG4gICAgICAgIF0sXG4gICAgICAgIDRcbiAgICAgICksXG4gICAgICBuZXcgU3F1YXJlcyhcbiAgICAgICAgdGhpcy5jdHgsXG4gICAgICAgIFtcbiAgICAgICAgICB0aGlzLnNxdWFyZU9yaWdpblswXSArIHRoaXMudW5pdFNxdWFyZSAqIDQsXG4gICAgICAgICAgdGhpcy5zcXVhcmVPcmlnaW5bMV0gKyB0aGlzLnVuaXRTcXVhcmUsXG4gICAgICAgICAgdGhpcy5zcXVhcmVTaXplLFxuICAgICAgICAgIHRoaXMuc3F1YXJlU2l6ZVxuICAgICAgICBdLFxuICAgICAgICA1XG4gICAgICApLFxuICAgICAgbmV3IFNxdWFyZXMoXG4gICAgICAgIHRoaXMuY3R4LFxuICAgICAgICBbXG4gICAgICAgICAgdGhpcy5zcXVhcmVPcmlnaW5bMF0gKyB0aGlzLnVuaXRTcXVhcmUgKiA1LFxuICAgICAgICAgIHRoaXMuc3F1YXJlT3JpZ2luWzFdLFxuICAgICAgICAgIHRoaXMuc3F1YXJlU2l6ZSxcbiAgICAgICAgICB0aGlzLnNxdWFyZVNpemVcbiAgICAgICAgXSxcbiAgICAgICAgNlxuICAgICAgKSxcbiAgICAgIG5ldyBTcXVhcmVzKFxuICAgICAgICB0aGlzLmN0eCxcbiAgICAgICAgW1xuICAgICAgICAgIHRoaXMuc3F1YXJlT3JpZ2luWzBdICsgdGhpcy51bml0U3F1YXJlICogNSxcbiAgICAgICAgICB0aGlzLnNxdWFyZU9yaWdpblsxXSArIHRoaXMudW5pdFNxdWFyZSxcbiAgICAgICAgICB0aGlzLnNxdWFyZVNpemUsXG4gICAgICAgICAgdGhpcy5zcXVhcmVTaXplXG4gICAgICAgIF0sXG4gICAgICAgIDdcbiAgICAgIClcbiAgICBdO1xuICB9XG5cbiAgcHJpdmF0ZSBjbGVhclJlY3QoKSB7XG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuICB9XG5cbiAgc2V0QmxlbmRNb2RlKGJsZW5kTW9kZTogc3RyaW5nKSB7XG4gICAgdGhpcy5jdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gYmxlbmRNb2RlO1xuICB9XG5cbiAgZHJhdygpIHtcbiAgICB0aGlzLmNsZWFyUmVjdCgpO1xuICAgIHRoaXMuc3F1YXJlcy5mb3JFYWNoKGN1YmUgPT4gY3ViZS5kcmF3KCkpO1xuICB9XG5cbiAgcGxheShpbmRleDogbnVtYmVyLCBjb2xvckluZGV4OiBudW1iZXIsIHZlbG9jaXR5OiBudW1iZXIpIHtcbiAgICB0aGlzLnNxdWFyZXNbaW5kZXhdLnBsYXkoY29sb3JJbmRleCwgdmVsb2NpdHkpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdyYXBoaWNzRW5naW5lO1xuIiwidHlwZSBTcXVhcmVQb3NpdGlvbiA9IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdO1xudHlwZSBSR0IgPSBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XG50eXBlIFJHQkEgPSBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcblxuY29uc3QgQ29sb3JzOiBSR0JbXSA9IFtcbiAgWzI1NSwgMCwgMF0sXG4gIFsyMDYsIDE1NCwgMjU1XSxcbiAgWzI1NSwgMjU1LCAwXSxcbiAgWzEwMSwgMTAxLCAxNTNdLFxuICBbMjI3LCAyNTEsIDI1NV0sXG4gIFsxNzIsIDI4LCAyXSxcbiAgWzAsIDIwNCwgMjU1XSxcbiAgWzI1NSwgMTAxLCAxXSxcbiAgWzI1NSwgMCwgMjU1XSxcbiAgWzUxLCAyMDQsIDUxXSxcbiAgWzE0MCwgMTM4LCAxNDBdLFxuICBbMCwgMCwgMjU0XVxuXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3F1YXJlIHtcbiAgLyoqXG4gICAqIEEgU3F1YXJlIHRoYXQgZHJhd3MgaXRzZWxmIG9uIHRoZSBzY3JlZW4gYW5kIGZhZGVzIG91dC5cbiAgICovXG4gIHByaXZhdGUgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIHByaXZhdGUgcG9zaXRpb246IFNxdWFyZVBvc2l0aW9uO1xuICBwcml2YXRlIGFscGhhOiBudW1iZXI7XG4gIHByaXZhdGUgbm90ZTogbnVtYmVyO1xuICBwcml2YXRlIGFscGhhU2NhbGFyOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgcG9zaXRpb246IFNxdWFyZVBvc2l0aW9uLFxuICAgIG5vdGU6IG51bWJlclxuICApIHtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgdGhpcy5ub3RlID0gbm90ZTtcbiAgICB0aGlzLmFscGhhID0gMDtcbiAgICB0aGlzLmFscGhhU2NhbGFyID0gMTAwO1xuICB9XG5cbiAgcGxheShkZWdyZWU6IG51bWJlciwgdmVsb2NpdHk6IG51bWJlcikge1xuICAgIHRoaXMuYWxwaGEgPSBNYXRoLnJvdW5kKHZlbG9jaXR5KTtcbiAgICB0aGlzLm5vdGUgPSBkZWdyZWU7XG4gIH1cblxuICBkcmF3KCkge1xuICAgIHRoaXMuZGVjcmVtZW50QWxwaGEoKTtcbiAgICB0aGlzLmRyYXdSZWN0KCk7XG4gIH1cblxuICBwcml2YXRlIGRyYXdSZWN0KCk6IHZvaWQge1xuICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3IoKTtcbiAgICB0aGlzLmN0eC5maWxsUmVjdCguLi50aGlzLnBvc2l0aW9uKTtcbiAgfVxuXG4gIHByaXZhdGUgZGVjcmVtZW50QWxwaGEoKTogdm9pZCB7XG4gICAgdGhpcy5hbHBoYSA9IHRoaXMuYWxwaGEgPiAwID8gdGhpcy5hbHBoYSAtIDEgOiB0aGlzLmFscGhhO1xuICB9XG5cbiAgcHJpdmF0ZSBjb2xvcigpOiBzdHJpbmcge1xuICAgIHJldHVybiBgcmdiYSgke3RoaXMucmdiYSgpLmpvaW4oXCIsXCIpfSlgO1xuICB9XG5cbiAgcHJpdmF0ZSByZ2JhKCk6IFJHQkEge1xuICAgIGNvbnN0IFtyLCBnLCBiXSA9IENvbG9yc1t0aGlzLm5vdGVdO1xuICAgIHJldHVybiBbciwgZywgYiwgdGhpcy5hbHBoYSAvIHRoaXMuYWxwaGFTY2FsYXJdO1xuICB9XG59XG4iLCJ0eXBlIERlZ3JlZXMgPSBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcblxudHlwZSBTY2FsZSA9IHtcbiAgW2tleTogc3RyaW5nXTogRGVncmVlcztcbiAgSW9uaWFuOiBEZWdyZWVzO1xuICBMeWRpYW46IERlZ3JlZXM7XG4gIExvY3JpYW46IERlZ3JlZXM7XG4gIFBocnlnaWFuOiBEZWdyZWVzO1xuICBBZW9sZWFuOiBEZWdyZWVzO1xuICBEb3JpYW46IERlZ3JlZXM7XG4gIE1peG9seWRpYW46IERlZ3JlZXM7XG59O1xuXG5leHBvcnQgZGVmYXVsdCA8U2NhbGU+e1xuICBJb25pYW46IFswLCAyLCA0LCA1LCA3LCA5LCAxMV0sXG4gIEx5ZGlhbjogWzAsIDIsIDQsIDYsIDcsIDksIDExXSxcbiAgTG9jcmlhbjogWzAsIDEsIDMsIDUsIDYsIDgsIDEwXSxcbiAgUGhyeWdpYW46IFswLCAxLCAzLCA1LCA3LCA4LCAxMF0sXG4gIEFlb2xlYW46IFswLCAyLCAzLCA1LCA3LCA4LCAxMF0sXG4gIERvcmlhbjogWzAsIDIsIDMsIDUsIDcsIDksIDEwXSxcbiAgTWl4b2x5ZGlhbjogWzAsIDIsIDQsIDUsIDcsIDksIDEwXVxufTtcbiIsImltcG9ydCBDdWJlQm94IGZyb20gXCIuL2N1YmUtYm94XCI7XG5cbmltcG9ydCB7IENvbnRyb2xWYWx1ZXMsIEhhc2hTdG9yYWdlIH0gZnJvbSBcIi4vY3ViZS1ib3gvY29udHJvbC12YWx1ZXNcIjtcblxuY29uc3QgYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XG5jb25zdCBjdWJlQm94ID0gbmV3IEN1YmVCb3goY2FudmFzLCBhdWRpb0NvbnRleHQpO1xuY29uc3QgaGFzaFN0b3JhZ2UgPSBuZXcgSGFzaFN0b3JhZ2UoKTtcblxuY29uc3Qgc2VsID0gKGE6IHN0cmluZyk6IEhUTUxJbnB1dEVsZW1lbnQgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihhKTtcblxuZnVuY3Rpb24gZHJhdyhub3c6IG51bWJlcikge1xuICBjdWJlQm94LnRpY2sobm93KTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xufVxuXG5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG5cbmNvbnN0IHNsaWRlciA9IChzOiBzdHJpbmcsIG9uSW5wdXQ6IEZ1bmN0aW9uLCBvbkNoYW5nZTogRnVuY3Rpb24pID0+IHtcbiAgY29uc3QgZWxlbSA9IHNlbChzKTtcbiAgZWxlbS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIG9uSW5wdXQgYXMgYW55LCBmYWxzZSk7XG4gIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIG9uQ2hhbmdlIGFzIGFueSwgZmFsc2UpO1xufTtcblxuY29uc3Qgc2wgPSAobmFtZTogc3RyaW5nLCBvbklucHV0OiBGdW5jdGlvbiwgb25DaGFuZ2U6IEZ1bmN0aW9uKSA9PiB7XG4gIHNsaWRlcihcbiAgICBgaW5wdXRbbmFtZT0nJHtuYW1lfSddYCxcbiAgICBmdW5jdGlvbih0aGlzOiBIVE1MSW5wdXRFbGVtZW50KSB7XG4gICAgICBvbklucHV0KHRoaXMudmFsdWUpO1xuICAgIH0sXG4gICAgZnVuY3Rpb24odGhpczogSFRNTElucHV0RWxlbWVudCkge1xuICAgICAgb25DaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgfVxuICApO1xufTtcblxuY29uc3Qgc3MgPSAobmFtZTogc3RyaW5nLCBvbklucHV0OiBGdW5jdGlvbiwgb25DaGFuZ2U6IEZ1bmN0aW9uKSA9PiB7XG4gIHNsaWRlcihcbiAgICBgc2VsZWN0W25hbWU9JyR7bmFtZX0nXWAsXG4gICAgZnVuY3Rpb24odGhpczogSFRNTElucHV0RWxlbWVudCkge1xuICAgICAgb25JbnB1dCh0aGlzLnZhbHVlKTtcbiAgICB9LFxuICAgIGZ1bmN0aW9uKHRoaXM6IEhUTUxJbnB1dEVsZW1lbnQpIHtcbiAgICAgIG9uQ2hhbmdlKHRoaXMudmFsdWUpO1xuICAgIH1cbiAgKTtcbn07XG5cbmNvbnN0IHNjID0gKG5hbWU6IHN0cmluZywgb25JbnB1dDogRnVuY3Rpb24sIG9uQ2hhbmdlOiBGdW5jdGlvbikgPT4ge1xuICBzbGlkZXIoXG4gICAgYGlucHV0W25hbWU9JyR7bmFtZX0nXWAsXG4gICAgZnVuY3Rpb24odGhpczogSFRNTElucHV0RWxlbWVudCkge1xuICAgICAgb25JbnB1dCh0aGlzLmNoZWNrZWQpO1xuICAgIH0sXG4gICAgZnVuY3Rpb24odGhpczogSFRNTElucHV0RWxlbWVudCkge1xuICAgICAgb25DaGFuZ2UodGhpcy5jaGVja2VkKTtcbiAgICB9XG4gICk7XG59O1xuXG5zbChcbiAgXCJtYXN0ZXJHYWluXCIsXG4gIChlOiBzdHJpbmcpID0+IGhhc2hTdG9yYWdlLnVwZGF0ZSh7IG1hc3RlckdhaW46IGUgfSksXG4gIChlOiBzdHJpbmcpID0+IGN1YmVCb3guYXVkaW9FbmdpbmUuc2V0TWFzdGVyR2FpbihlKVxuKTtcblxuc2woXG4gIFwic2V0TWFzdGVyRmlsdGVyVmFsdWVcIixcbiAgKGU6IHN0cmluZykgPT4gaGFzaFN0b3JhZ2UudXBkYXRlKHsgc2V0TWFzdGVyRmlsdGVyVmFsdWU6IGUgfSksXG4gIChlOiBzdHJpbmcpID0+IGN1YmVCb3guYXVkaW9FbmdpbmUuc2V0TWFzdGVyRmlsdGVyVmFsdWUoZSlcbik7XG5cbnNjKFxuICBcIm1hc3RlckNvbnRyb2xTdGF0ZVwiLFxuICAoZTogYm9vbGVhbikgPT4ge1xuICAgIGN1YmVCb3gubWFzdGVyQ29udHJvbFN0YXRlID0gZTtcbiAgICBoYXNoU3RvcmFnZS51cGRhdGUoeyBtYXN0ZXJDb250cm9sU3RhdGU6IGUgfSk7XG4gIH0sXG4gICgpID0+IHt9XG4pO1xuXG5zbChcbiAgXCJjaG9yZE9jdGF2ZVwiLFxuICAoZTogc3RyaW5nKSA9PiBoYXNoU3RvcmFnZS51cGRhdGUoeyBjaG9yZE9jdGF2ZTogcGFyc2VGbG9hdChlKSB9KSxcbiAgKGU6IHN0cmluZykgPT4gKGN1YmVCb3guY2hvcmRPY3RhdmUgPSBwYXJzZUZsb2F0KGUpKVxuKTtcblxuc2woXG4gIFwic2V0RGVjYXlUaW1lXCIsXG4gIChlOiBudW1iZXIpID0+IGhhc2hTdG9yYWdlLnVwZGF0ZSh7IHNldERlY2F5VGltZTogZSB9KSxcbiAgKGU6IG51bWJlcikgPT4gY3ViZUJveC5jb21wb3NpdGlvbkVuZ2luZS5zZXREZWNheVRpbWUoZS50b1N0cmluZygpKVxuKTtcbnNsKFxuICBcImZpbHRlckVudmVsb3BlUVwiLFxuICAoZTogbnVtYmVyKSA9PiBoYXNoU3RvcmFnZS51cGRhdGUoeyBmaWx0ZXJFbnZlbG9wZVE6IGUgfSksXG4gIChlOiBudW1iZXIpID0+IChjdWJlQm94LmF1ZGlvRW5naW5lLmZpbHRlckVudmVsb3BlUSA9IGUpXG4pO1xuXG5zbChcbiAgXCJkZXR1bmVcIixcbiAgKGU6IG51bWJlcikgPT4gaGFzaFN0b3JhZ2UudXBkYXRlKHsgZGV0dW5lOiBlIH0pLFxuICAoZTogbnVtYmVyKSA9PiAoY3ViZUJveC5jb21wb3NpdGlvbkVuZ2luZS5kZXR1bmUgPSBlKVxuKTtcblxuc2woXG4gIFwic2V0RmlsdGVyRW52ZWxvcGVTdGFydEZyZXF1ZW5jeVwiLFxuICAoZTogbnVtYmVyKSA9PiBoYXNoU3RvcmFnZS51cGRhdGUoeyBzZXRGaWx0ZXJFbnZlbG9wZVN0YXJ0RnJlcXVlbmN5OiBlIH0pLFxuICAoZTogbnVtYmVyKSA9PlxuICAgIGN1YmVCb3guYXVkaW9FbmdpbmUuc2V0RmlsdGVyRW52ZWxvcGVTdGFydEZyZXF1ZW5jeShlLnRvU3RyaW5nKCkpXG4pO1xuXG5zcyhcbiAgXCJsZm9XYXZlXCIsXG4gIChlOiBzdHJpbmcpID0+IGhhc2hTdG9yYWdlLnVwZGF0ZSh7IGxmb1dhdmU6IGUgfSksXG4gIChlOiBzdHJpbmcpID0+IChjdWJlQm94LmF1ZGlvRW5naW5lLmxmb1dhdmUgPSBlKVxuKTtcblxuc2woXG4gIFwiYW1wbGl0dWRlQXR0YWNrXCIsXG4gIChlOiBzdHJpbmcpID0+IGhhc2hTdG9yYWdlLnVwZGF0ZSh7IGFtcGxpdHVkZUF0dGFjazogcGFyc2VGbG9hdChlKSB9KSxcbiAgKGU6IHN0cmluZykgPT4gKGN1YmVCb3guYXVkaW9FbmdpbmUuYW1wbGl0dWRlQXR0YWNrID0gcGFyc2VGbG9hdChlKSlcbik7XG5cbnNsKFxuICBcInNldEZpbHRlckVudmVsb3BlU3VzdGFpblwiLFxuICAoZTogbnVtYmVyKSA9PiBoYXNoU3RvcmFnZS51cGRhdGUoeyBzZXRGaWx0ZXJFbnZlbG9wZVN1c3RhaW46IGUgfSksXG4gIChlOiBudW1iZXIpID0+IGN1YmVCb3guYXVkaW9FbmdpbmUuc2V0RmlsdGVyRW52ZWxvcGVTdXN0YWluKGUudG9TdHJpbmcoKSlcbik7XG5cbnNzKFxuICBcIm9zY2lhbGx0b3JUeXBlXCIsXG4gIChlOiBzdHJpbmcpID0+IGhhc2hTdG9yYWdlLnVwZGF0ZSh7IG9zY2lhbGx0b3JUeXBlOiBlIH0pLFxuICAoZTogc3RyaW5nKSA9PiAoY3ViZUJveC5jb21wb3NpdGlvbkVuZ2luZS5vc2NpYWxsdG9yVHlwZSA9IGUpXG4pO1xuXG5zcyhcbiAgXCJzY2FsZVwiLFxuICAoZTogc3RyaW5nKSA9PiBoYXNoU3RvcmFnZS51cGRhdGUoeyBzY2FsZTogZSB9KSxcbiAgKGU6IHN0cmluZykgPT4gKGN1YmVCb3guc2NhbGUgPSBlKVxuKTtcblxuc3MoXG4gIFwic2V0QmxlbmRNb2RlXCIsXG4gIChlOiBzdHJpbmcpID0+IGhhc2hTdG9yYWdlLnVwZGF0ZSh7IHNldEJsZW5kTW9kZTogZSB9KSxcbiAgKGU6IHN0cmluZykgPT4gY3ViZUJveC5ncmFwaGljc0VuZ2luZS5zZXRCbGVuZE1vZGUoZSlcbik7XG5cbnNsKFxuICBcImxmb0Ftb3VudFwiLFxuICAoZTogbnVtYmVyKSA9PiBoYXNoU3RvcmFnZS51cGRhdGUoeyBsZm9BbW91bnQ6IGUgfSksXG4gIChlOiBudW1iZXIpID0+IChjdWJlQm94LmF1ZGlvRW5naW5lLmxmb0Ftb3VudCA9IGUpXG4pO1xuXG5zbChcbiAgXCJhbXBsaXR1ZGVSZWxlYXNlXCIsXG4gIChlOiBudW1iZXIpID0+IGhhc2hTdG9yYWdlLnVwZGF0ZSh7IGFtcGxpdHVkZVJlbGVhc2U6IGUgfSksXG4gIChlOiBudW1iZXIpID0+XG4gICAgKGN1YmVCb3guYXVkaW9FbmdpbmUuYW1wbGl0dWRlUmVsZWFzZSA9IHBhcnNlRmxvYXQoZS50b1N0cmluZygpKSlcbik7XG5cbnNsKFxuICBcInN3aXBlRnJlcXVlbmN5XCIsXG4gIChlOiBudW1iZXIpID0+IGhhc2hTdG9yYWdlLnVwZGF0ZSh7IHN3aXBlRnJlcXVlbmN5OiBlIH0pLFxuICAoZTogbnVtYmVyKSA9PiAoY3ViZUJveC5zd2lwZUZyZXF1ZW5jeSA9IGUpXG4pO1xuXG5zbChcbiAgXCJzd2lwZU9jdGF2ZVwiLFxuICAoZTogbnVtYmVyKSA9PiBoYXNoU3RvcmFnZS51cGRhdGUoeyBzd2lwZU9jdGF2ZTogZSB9KSxcbiAgKGU6IG51bWJlcikgPT4gKGN1YmVCb3guc3dpcGVPY3RhdmUgPSBlKVxuKTtcblxuc2woXG4gIFwiY2hvcmRWZWxvY2l0eVwiLFxuICAoZTogbnVtYmVyKSA9PiBoYXNoU3RvcmFnZS51cGRhdGUoeyBjaG9yZFZlbG9jaXR5OiBlIH0pLFxuICAoZTogbnVtYmVyKSA9PiAoY3ViZUJveC5jaG9yZFZlbG9jaXR5ID0gZSlcbik7XG5cbnNsKFxuICBcInN3aXBlVmVsb2NpdHlcIixcbiAgKGU6IG51bWJlcikgPT4gaGFzaFN0b3JhZ2UudXBkYXRlKHsgc3dpcGVWZWxvY2l0eTogZSB9KSxcbiAgKGU6IG51bWJlcikgPT4gKGN1YmVCb3guc3dpcGVWZWxvY2l0eSA9IGUpXG4pO1xuXG5zYyhcbiAgXCJzdXN0YWluXCIsXG4gIChlOiBib29sZWFuKSA9PiBoYXNoU3RvcmFnZS51cGRhdGUoeyBzdXN0YWluOiBlIH0pLFxuICAoZTogYm9vbGVhbikgPT4gKGN1YmVCb3guYXVkaW9FbmdpbmUuc3VzdGFpbiA9IGUpXG4pO1xuXG5zbChcbiAgXCJzZXRMZm9GcmVxdWVuY3lcIixcbiAgKGU6IHN0cmluZykgPT4gaGFzaFN0b3JhZ2UudXBkYXRlKHsgc2V0TGZvRnJlcXVlbmN5OiBlIH0pLFxuICAoZTogc3RyaW5nKSA9PiBjdWJlQm94LmF1ZGlvRW5naW5lLnNldExmb0ZyZXF1ZW5jeShlKVxuKTtcblxuc2MoXG4gIFwiaGlkZVwiLFxuICAoZTogYm9vbGVhbikgPT4ge1xuICAgIGRlYnVnZ2VyO1xuICAgIHNlbChcIi5zZXR0aW5nc0JhclwiKS5oaWRkZW4gPSB0cnVlO1xuICB9LFxuICAoZTogYm9vbGVhbikgPT4gKGN1YmVCb3guYXVkaW9FbmdpbmUuc3VzdGFpbiA9IGUpXG4pO1xuXG5zZWwoXCJpbnB1dFtuYW1lPSdoaWRlJ11cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gIGRvY3VtZW50XG4gICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2V0dGluZ3NCYXIgPiBkaXZcIilcbiAgICAuZm9yRWFjaCgoZTogSFRNTEVsZW1lbnQpID0+IChlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIikpO1xuICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICBcIi5zZXR0aW5nc0JhciA+IGRpdjpudGgtY2hpbGQoMSlcIlxuICApIGFzIEhUTUxFbGVtZW50KS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xufSk7XG5cbnNlbChcImlucHV0W25hbWU9J3Nob3cnXVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgZG9jdW1lbnRcbiAgICAucXVlcnlTZWxlY3RvckFsbChcIi5zZXR0aW5nc0JhciA+IGRpdlwiKVxuICAgIC5mb3JFYWNoKChlOiBIVE1MRWxlbWVudCkgPT4gKGUuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIikpO1xuICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICBcIi5zZXR0aW5nc0JhciA+IGRpdjpudGgtY2hpbGQoMSlcIlxuICApIGFzIEhUTUxFbGVtZW50KS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG59KTtcblxuZnVuY3Rpb24gdG9nZ2xlRnVsbFNjcmVlbigpIHtcbiAgaWYgKCFkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCkge1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbigpO1xuICB9IGVsc2Uge1xuICAgIGlmIChkb2N1bWVudC5leGl0RnVsbHNjcmVlbikge1xuICAgICAgZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4oKTtcbiAgICB9XG4gIH1cbn1cblxuc2MoXG4gIFwiZnVsbHNjcmVlblwiLFxuICAoZTogYm9vbGVhbikgPT4ge1xuICAgIHRvZ2dsZUZ1bGxTY3JlZW4oKTtcbiAgfSxcbiAgKGU6IGJvb2xlYW4pID0+IHt9XG4pO1xuXG5zZWwoXCJpbnB1dFtuYW1lPSdmdWxsc2NyZWVuJ11cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gIGRvY3VtZW50XG4gICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2V0dGluZ3NCYXIgPiBkaXZcIilcbiAgICAuZm9yRWFjaCgoZTogSFRNTEVsZW1lbnQpID0+IChlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIikpO1xuICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICBcIi5zZXR0aW5nc0JhciA+IGRpdjpudGgtY2hpbGQoMSlcIlxuICApIGFzIEhUTUxFbGVtZW50KS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xufSk7XG5cbmNvbnN0IHJvdXRlID0gKHN0YXRlOiBDb250cm9sVmFsdWVzKSA9PiB7XG4gIGN1YmVCb3guYXVkaW9FbmdpbmUuc2V0TWFzdGVyR2FpbihzdGF0ZS5tYXN0ZXJHYWluKTtcbiAgc2VsKFwiaW5wdXRbbmFtZT0nbWFzdGVyR2FpbiddXCIpLnZhbHVlID0gc3RhdGUubWFzdGVyR2FpbjtcblxuICBjdWJlQm94LmF1ZGlvRW5naW5lLnNldE1hc3RlckZpbHRlclZhbHVlKHN0YXRlLnNldE1hc3RlckZpbHRlclZhbHVlKTtcbiAgc2VsKFwiaW5wdXRbbmFtZT0nc2V0TWFzdGVyRmlsdGVyVmFsdWUnXVwiKS52YWx1ZSA9IHN0YXRlLnNldE1hc3RlckZpbHRlclZhbHVlO1xuXG4gIGN1YmVCb3gubWFzdGVyQ29udHJvbFN0YXRlID0gc3RhdGUubWFzdGVyQ29udHJvbFN0YXRlO1xuICBzZWwoXCJpbnB1dFtuYW1lPSdtYXN0ZXJDb250cm9sU3RhdGUnXVwiKS5jaGVja2VkID0gc3RhdGUubWFzdGVyQ29udHJvbFN0YXRlO1xuXG4gIGN1YmVCb3guY29tcG9zaXRpb25FbmdpbmUuc2V0RGVjYXlUaW1lKHN0YXRlLnNldERlY2F5VGltZSk7XG4gIHNlbChcImlucHV0W25hbWU9J3NldERlY2F5VGltZSddXCIpLnZhbHVlID0gc3RhdGUuc2V0RGVjYXlUaW1lO1xuXG4gIGN1YmVCb3guY2hvcmRPY3RhdmUgPSBzdGF0ZS5jaG9yZE9jdGF2ZTtcbiAgc2VsKFwiaW5wdXRbbmFtZT0nY2hvcmRPY3RhdmUnXVwiKS52YWx1ZSA9IHN0YXRlLmNob3JkT2N0YXZlLnRvU3RyaW5nKCk7XG5cbiAgY3ViZUJveC5hdWRpb0VuZ2luZS5zZXRMZm9GcmVxdWVuY3koc3RhdGUuc2V0TGZvRnJlcXVlbmN5KTtcbiAgc2VsKFwiaW5wdXRbbmFtZT0nc2V0TGZvRnJlcXVlbmN5J11cIikudmFsdWUgPSBzdGF0ZS5zZXRMZm9GcmVxdWVuY3k7XG5cbiAgY3ViZUJveC5hdWRpb0VuZ2luZS5maWx0ZXJFbnZlbG9wZVEgPSBzdGF0ZS5maWx0ZXJFbnZlbG9wZVE7XG4gIHNlbChcImlucHV0W25hbWU9J2ZpbHRlckVudmVsb3BlUSddXCIpLnZhbHVlID0gc3RhdGUuZmlsdGVyRW52ZWxvcGVRLnRvU3RyaW5nKCk7XG5cbiAgY3ViZUJveC5jb21wb3NpdGlvbkVuZ2luZS5kZXR1bmUgPSBzdGF0ZS5kZXR1bmU7XG4gIHNlbChcImlucHV0W25hbWU9J2RldHVuZSddXCIpLnZhbHVlID0gc3RhdGUuZGV0dW5lLnRvU3RyaW5nKCk7XG5cbiAgY3ViZUJveC5hdWRpb0VuZ2luZS5zZXRGaWx0ZXJFbnZlbG9wZVN0YXJ0RnJlcXVlbmN5KFxuICAgIHN0YXRlLnNldEZpbHRlckVudmVsb3BlU3RhcnRGcmVxdWVuY3lcbiAgKTtcbiAgc2VsKFwiaW5wdXRbbmFtZT0nc2V0RmlsdGVyRW52ZWxvcGVTdGFydEZyZXF1ZW5jeSddXCIpLnZhbHVlID1cbiAgICBzdGF0ZS5zZXRGaWx0ZXJFbnZlbG9wZVN0YXJ0RnJlcXVlbmN5O1xuXG4gIGN1YmVCb3guYXVkaW9FbmdpbmUubGZvV2F2ZSA9IHN0YXRlLmxmb1dhdmU7XG4gIHNlbChcInNlbGVjdFtuYW1lPSdsZm9XYXZlJ11cIikudmFsdWUgPSBzdGF0ZS5sZm9XYXZlO1xuXG4gIGN1YmVCb3guYXVkaW9FbmdpbmUuYW1wbGl0dWRlQXR0YWNrID0gc3RhdGUuYW1wbGl0dWRlQXR0YWNrO1xuICBzZWwoXCJpbnB1dFtuYW1lPSdhbXBsaXR1ZGVBdHRhY2snXVwiKS52YWx1ZSA9IHN0YXRlLmFtcGxpdHVkZUF0dGFjay50b1N0cmluZygpO1xuXG4gIGN1YmVCb3guYXVkaW9FbmdpbmUuc2V0RmlsdGVyRW52ZWxvcGVTdXN0YWluKHN0YXRlLnNldEZpbHRlckVudmVsb3BlU3VzdGFpbik7XG4gIHNlbChcbiAgICBcImlucHV0W25hbWU9J3NldEZpbHRlckVudmVsb3BlU3VzdGFpbiddXCJcbiAgKS52YWx1ZSA9IHN0YXRlLnNldEZpbHRlckVudmVsb3BlU3VzdGFpbi50b1N0cmluZygpO1xuXG4gIGN1YmVCb3guY29tcG9zaXRpb25FbmdpbmUub3NjaWFsbHRvclR5cGUgPSBzdGF0ZS5vc2NpYWxsdG9yVHlwZTtcbiAgc2VsKFwic2VsZWN0W25hbWU9J29zY2lhbGx0b3JUeXBlJ11cIikudmFsdWUgPSBzdGF0ZS5vc2NpYWxsdG9yVHlwZTtcblxuICBjdWJlQm94LnNjYWxlID0gc3RhdGUuc2NhbGU7XG4gIHNlbChcInNlbGVjdFtuYW1lPSdzY2FsZSddXCIpLnZhbHVlID0gc3RhdGUuc2NhbGU7XG5cbiAgY3ViZUJveC5ncmFwaGljc0VuZ2luZS5zZXRCbGVuZE1vZGUoc3RhdGUuc2V0QmxlbmRNb2RlKTtcbiAgc2VsKFwic2VsZWN0W25hbWU9J3NldEJsZW5kTW9kZSddXCIpLnZhbHVlID0gc3RhdGUuc2V0QmxlbmRNb2RlO1xuXG4gIGN1YmVCb3guYXVkaW9FbmdpbmUubGZvQW1vdW50ID0gc3RhdGUubGZvQW1vdW50O1xuICBzZWwoXCJpbnB1dFtuYW1lPSdsZm9BbW91bnQnXVwiKS52YWx1ZSA9IHN0YXRlLmxmb0Ftb3VudC50b1N0cmluZygpO1xuXG4gIGN1YmVCb3guYXVkaW9FbmdpbmUuYW1wbGl0dWRlUmVsZWFzZSA9IHBhcnNlRmxvYXQoXG4gICAgc3RhdGUuYW1wbGl0dWRlUmVsZWFzZS50b1N0cmluZygpXG4gICk7XG4gIHNlbChcbiAgICBcImlucHV0W25hbWU9J2FtcGxpdHVkZVJlbGVhc2UnXVwiXG4gICkudmFsdWUgPSBzdGF0ZS5hbXBsaXR1ZGVSZWxlYXNlLnRvU3RyaW5nKCk7XG5cbiAgY3ViZUJveC5zd2lwZUZyZXF1ZW5jeSA9IHN0YXRlLnN3aXBlRnJlcXVlbmN5O1xuICBzZWwoXCJpbnB1dFtuYW1lPSdzd2lwZUZyZXF1ZW5jeSddXCIpLnZhbHVlID0gc3RhdGUuc3dpcGVGcmVxdWVuY3kudG9TdHJpbmcoKTtcblxuICBjdWJlQm94LnN3aXBlT2N0YXZlID0gc3RhdGUuc3dpcGVPY3RhdmU7XG4gIHNlbChcImlucHV0W25hbWU9J3N3aXBlT2N0YXZlJ11cIikudmFsdWUgPSBzdGF0ZS5zd2lwZU9jdGF2ZS50b1N0cmluZygpO1xuXG4gIGN1YmVCb3guY2hvcmRWZWxvY2l0eSA9IHN0YXRlLmNob3JkVmVsb2NpdHk7XG4gIHNlbChcImlucHV0W25hbWU9J2Nob3JkVmVsb2NpdHknXVwiKS52YWx1ZSA9IHN0YXRlLmNob3JkVmVsb2NpdHkudG9TdHJpbmcoKTtcblxuICBjdWJlQm94LnN3aXBlVmVsb2NpdHkgPSBzdGF0ZS5zd2lwZVZlbG9jaXR5O1xuICBzZWwoXCJpbnB1dFtuYW1lPSdzd2lwZVZlbG9jaXR5J11cIikudmFsdWUgPSBzdGF0ZS5zd2lwZVZlbG9jaXR5LnRvU3RyaW5nKCk7XG5cbiAgY3ViZUJveC5hdWRpb0VuZ2luZS5zdXN0YWluID0gc3RhdGUuc3VzdGFpbjtcbiAgc2VsKFwiaW5wdXRbbmFtZT0nc3VzdGFpbiddXCIpLnZhbHVlID0gc3RhdGUuc3VzdGFpbi50b1N0cmluZygpO1xufTtcblxuLy8gcm91dGUgb25jZSBvbiBwYWdlIGxvYWRcbnJvdXRlKGhhc2hTdG9yYWdlLnN0YXRlKCkpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJoYXNoY2hhbmdlXCIsICgpID0+IHJvdXRlKGhhc2hTdG9yYWdlLnN0YXRlKCkpLCBmYWxzZSk7XG4iXSwic291cmNlUm9vdCI6IiJ9