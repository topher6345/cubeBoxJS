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
    constructor(canvas, visualizerCanvas, ctx) {
        this.audioEngine = new audio_engine_1.default(ctx, visualizerCanvas);
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
    constructor(ctx, visualizeCanvas) {
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
        this.analyser = this.ctx.createAnalyser();
        this.analyser.minDecibels = -90;
        this.analyser.maxDecibels = -0;
        this.analyser.smoothingTimeConstant = 0.85;
        this.analyser.fftSize = 2048;
        this.masterFilter
            .connect(this.compressor)
            .connect(this.masterGain)
            .connect(this.analyser)
            .connect(this.ctx.destination);
        this.visualize(visualizeCanvas);
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
    visualize(canvas) {
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;
        const canvasCtx = canvas.getContext("2d");
        const bufferLength = this.analyser.fftSize;
        const dataArray = new Uint8Array(bufferLength);
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
        const draw = () => {
            requestAnimationFrame(draw);
            this.analyser.getByteTimeDomainData(dataArray);
            canvasCtx.fillStyle = "rgba(200, 200, 200, 0.4)";
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = "rgba(0, 0, 0, 0.8)";
            canvasCtx.beginPath();
            const sliceWidth = (WIDTH * 1.0) / bufferLength;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * HEIGHT) / 2;
                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                }
                else {
                    canvasCtx.lineTo(x, y);
                }
                x += sliceWidth;
            }
            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();
        };
        draw();
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
        this.masterGain.gain.value = expon_1.default(input, 1.7, 0.0);
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
    masterGain: "0.34",
    setMasterFilterValue: "0.22",
    masterControlState: true,
    setDecayTime: "4",
    chordOctave: 3,
    setLfoFrequency: "0.89",
    filterEnvelopeQ: 0.1,
    detune: "2",
    setFilterEnvelopeStartFrequency: "18500",
    lfoWave: "sine",
    amplitudeAttack: 0.15,
    setFilterEnvelopeSustain: "300",
    oscialltorType: "sawtooth",
    scale: "Lydian",
    setBlendMode: "source-over",
    lfoAmount: "0.87",
    amplitudeRelease: "2.29",
    swipeFrequency: "2.2",
    swipeOctave: "2",
    chordVelocity: "0.97",
    swipeVelocity: "0.88",
    sustain: true
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
const visualizerCanvas = document.getElementById("visualizer");
const cubeBox = new cube_box_1.default(canvas, visualizerCanvas, audioContext);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2N1YmUtYm94LnRzIiwid2VicGFjazovLy8uL3NyYy9jdWJlLWJveC9hdWRpby1lbmdpbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2N1YmUtYm94L2F1ZGlvLWVuZ2luZS9hbXBsaXR1ZGUtZW52ZWxvcGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2N1YmUtYm94L2F1ZGlvLWVuZ2luZS9lbnZlbG9wZS1maWx0ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2N1YmUtYm94L2F1ZGlvLWVuZ2luZS9leHBvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY3ViZS1ib3gvYXVkaW8tZW5naW5lL2ZyZXF1ZW5jeS1tb2R1bGF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9jdWJlLWJveC9hdWRpby1lbmdpbmUvb3NjaWxsYXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY3ViZS1ib3gvYXVkaW8tZW5naW5lL3ZlbG9jaXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9jdWJlLWJveC9jb21wb3NpdGlvbi1lbmdpbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2N1YmUtYm94L2NvbXBvc2l0aW9uLWVuZ2luZS9ub3RlLXRhYmxlLnRzIiwid2VicGFjazovLy8uL3NyYy9jdWJlLWJveC9jb21wb3NpdGlvbi1lbmdpbmUvcmFuZG9tLnRzIiwid2VicGFjazovLy8uL3NyYy9jdWJlLWJveC9jb250cm9sLXZhbHVlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY3ViZS1ib3gvZ3JhcGhpY3MtZW5naW5lLnRzIiwid2VicGFjazovLy8uL3NyYy9jdWJlLWJveC9ncmFwaGljcy1lbmdpbmUvc3F1YXJlLnRzIiwid2VicGFjazovLy8uL3NyYy9jdWJlLWJveC9zY2FsZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FB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YyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBRTVFLE9BQU8sQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztJQUN4QyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUV0RSxPQUFPLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7SUFDNUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7SUFFMUUsT0FBTyxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO0lBQzVDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBRTFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7SUFDNUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDaEUsQ0FBQyxDQUFDO0FBRUYsMEJBQTBCO0FBQzFCLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUMzQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiaW1wb3J0IFNjYWxlcyBmcm9tIFwiLi9jdWJlLWJveC9zY2FsZXNcIjtcbmltcG9ydCBHcmFwaGljc0VuZ2luZSBmcm9tIFwiLi9jdWJlLWJveC9ncmFwaGljcy1lbmdpbmVcIjtcbmltcG9ydCBBdWRpb0VuZ2luZSBmcm9tIFwiLi9jdWJlLWJveC9hdWRpby1lbmdpbmVcIjtcbmltcG9ydCBDb21wb3NpdGlvbkVuZ2luZSBmcm9tIFwiLi9jdWJlLWJveC9jb21wb3NpdGlvbi1lbmdpbmVcIjtcblxuLyoqXG4gKlxuICogQ3ViZUJveFxuICpcbiAqIFJlc3BvbnNpYmxlIGZvciBkcmF3aW5nIHRvIHRoZSBzY3JlZW4gYW5kIHBsYXlpbmcgdGhlIHNvdW5kc1xuICpcbiAqIGV4cG9zZXMgc3Vic3lzdGVtcyB0byB0aGUgVUkgZm9yIGludGVyYWN0aW9uXG4gKlxuICogZXhwb3NlcyBvbmUgcHVibGljIG1ldGhvZCB0aWNrKCkgd2hpY2ggY2FuIGJlIGNhbGxlZCBhdCA2MGZwc1xuICpcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3ViZUJveCB7XG4gIGF1ZGlvRW5naW5lOiBBdWRpb0VuZ2luZTtcbiAgY29tcG9zaXRpb25FbmdpbmU6IENvbXBvc2l0aW9uRW5naW5lO1xuICBncmFwaGljc0VuZ2luZTogR3JhcGhpY3NFbmdpbmU7XG4gIG1hc3RlckNvbnRyb2xTdGF0ZTogYm9vbGVhbjtcbiAgc2NhbGU6IHN0cmluZztcbiAgc3dpcGVGcmVxdWVuY3k6IG51bWJlcjtcbiAgY2hvcmRPY3RhdmU6IG51bWJlcjtcbiAgc3dpcGVPY3RhdmU6IG51bWJlcjtcbiAgc3dpcGVWZWxvY2l0eTogbnVtYmVyO1xuICBjaG9yZFZlbG9jaXR5OiBudW1iZXI7XG5cbiAgcHJpdmF0ZSB0aGVuOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCxcbiAgICB2aXN1YWxpemVyQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCxcbiAgICBjdHg6IEF1ZGlvQ29udGV4dFxuICApIHtcbiAgICB0aGlzLmF1ZGlvRW5naW5lID0gbmV3IEF1ZGlvRW5naW5lKGN0eCwgdmlzdWFsaXplckNhbnZhcyk7XG4gICAgdGhpcy5ncmFwaGljc0VuZ2luZSA9IG5ldyBHcmFwaGljc0VuZ2luZShjYW52YXMpO1xuICAgIHRoaXMuY29tcG9zaXRpb25FbmdpbmUgPSBuZXcgQ29tcG9zaXRpb25FbmdpbmUodGhpcy5hdWRpb0VuZ2luZSk7XG4gICAgdGhpcy5tYXN0ZXJDb250cm9sU3RhdGUgPSBmYWxzZTtcbiAgICB0aGlzLnRoZW4gPSBudWxsO1xuICAgIHRoaXMuc2NhbGUgPSBcIkx5ZGlhblwiO1xuICAgIHRoaXMuc3dpcGVGcmVxdWVuY3kgPSAwLjQ7XG4gICAgdGhpcy5jaG9yZE9jdGF2ZSA9IDM7XG4gICAgdGhpcy5zd2lwZU9jdGF2ZSA9IDM7XG4gICAgdGhpcy5jaG9yZFZlbG9jaXR5ID0gMS4wO1xuICAgIHRoaXMuc3dpcGVWZWxvY2l0eSA9IDEuMDtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBFdmVyeSBjaG9yZFNwZWVkIG1pbGxpc2Vjb25kcyBjYWxsIHBsYXkoKVxuICAgKlxuICAgKi9cblxuICB0aWNrKG5vdzogbnVtYmVyKSB7XG4gICAgaWYgKCF0aGlzLnRoZW4pIHRoaXMudGhlbiA9IG5vdztcblxuICAgIGlmIChcbiAgICAgICF0aGlzLnRoZW4gfHxcbiAgICAgIChub3cgLSB0aGlzLnRoZW4gPiB0aGlzLmNvbXBvc2l0aW9uRW5naW5lLmNob3JkU3BlZWQgJiZcbiAgICAgICAgdGhpcy5tYXN0ZXJDb250cm9sU3RhdGUpXG4gICAgKSB7XG4gICAgICB0aGlzLnBsYXkoKTtcbiAgICAgIHRoaXMudGhlbiA9IG5vdztcbiAgICB9XG4gICAgdGhpcy5ncmFwaGljc0VuZ2luZS5kcmF3KCk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogcGxheSB0aGUgY2hvcmQgdm9pY2VzIChzb3VuZHMgYW5kIGNvbG9ycylcbiAgICpcbiAgICogcGxheSB0aGUgc3dpcGUgdm9pY2VzIChzb3VuZHMgYW5kIGNvbG9ycylcbiAgICpcbiAgICovXG4gIHByaXZhdGUgcGxheSgpIHtcbiAgICB0aGlzLmNvbXBvc2l0aW9uRW5naW5lLmNob3JkVm9pY2VzLmZvckVhY2goXG4gICAgICAodm9pY2U6IEdlbmVyYXRvciwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICBjb25zdCBzY2FsZURlZ3JlZSA9IHZvaWNlLm5leHQoKS52YWx1ZTtcbiAgICAgICAgaWYgKHNjYWxlRGVncmVlKSB7XG4gICAgICAgICAgY29uc3QgY29sb3JJbmRleCA9IFNjYWxlc1t0aGlzLnNjYWxlXVtzY2FsZURlZ3JlZV07XG4gICAgICAgICAgdGhpcy5jb21wb3NpdGlvbkVuZ2luZS5ub3RlUHJlc3NlZChcbiAgICAgICAgICAgIGNvbG9ySW5kZXgsXG4gICAgICAgICAgICB0aGlzLmNob3JkT2N0YXZlLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIHRoaXMuY2hvcmRWZWxvY2l0eVxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5ncmFwaGljc0VuZ2luZS5wbGF5KGluZGV4LCBjb2xvckluZGV4LCB0aGlzLmNob3JkVmVsb2NpdHkgKiAxMDApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcblxuICAgIHRoaXMuY29tcG9zaXRpb25FbmdpbmUuc3dpcGVWb2ljZXMuZm9yRWFjaChcbiAgICAgICh2b2ljZTogR2VuZXJhdG9yLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IHNjYWxlRGVncmVlID0gdm9pY2UubmV4dCgpLnZhbHVlO1xuICAgICAgICBpZiAoc2NhbGVEZWdyZWUpIHtcbiAgICAgICAgICBjb25zdCBjb2xvckluZGV4ID0gU2NhbGVzW3RoaXMuc2NhbGVdW3NjYWxlRGVncmVlXTtcbiAgICAgICAgICB0aGlzLmNvbXBvc2l0aW9uRW5naW5lLm5vdGVQcmVzc2VkKFxuICAgICAgICAgICAgY29sb3JJbmRleCxcbiAgICAgICAgICAgIHRoaXMuc3dpcGVPY3RhdmUsXG4gICAgICAgICAgICBpbmRleCAqIHRoaXMuc3dpcGVGcmVxdWVuY3ksXG4gICAgICAgICAgICB0aGlzLnN3aXBlVmVsb2NpdHlcbiAgICAgICAgICApO1xuICAgICAgICAgIHNldFRpbWVvdXQoXG4gICAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgICB0aGlzLmdyYXBoaWNzRW5naW5lLnBsYXkoXG4gICAgICAgICAgICAgICAgaW5kZXggKyA0LFxuICAgICAgICAgICAgICAgIGNvbG9ySW5kZXgsXG4gICAgICAgICAgICAgICAgdGhpcy5jaG9yZFZlbG9jaXR5ICogMTAwXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICBpbmRleCAqIHRoaXMuc3dpcGVGcmVxdWVuY3kgKiAxMDAwXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gIH1cbn1cbiIsIi8qKlxuICogQXVkaW9FbmdpbmUgaXMgYSBzdWJzeXN0ZW0gdGhhdCBoYW5kbGVzIGludGVyYWN0aW9uIHdpdGggdGhlIFdlYkF1ZGlvIEFQSS5cbiAqXG4gKiBBbiBpbnN0YW5jZSBpcyBpbml0aWFsaXplZCB3aGljaCB3cmFwcyB0aGUgZ2xvYmFsIGF1ZGlvIGNvbnRleHQuXG4gKlxuICogVGhlIGluc3RhbmNlIGV4cG9zZXMgYSBtZXRob2QgcGxheVRvbmUoKSB3aGljaCBwbGF5cyB0aGUgc291bmQuXG4gKlxuICovXG5cbmltcG9ydCBFbnZlbG9wZUZpbHRlciBmcm9tIFwiLi9hdWRpby1lbmdpbmUvZW52ZWxvcGUtZmlsdGVyXCI7XG5pbXBvcnQgQW1wbGl0dWRlRW52ZWxvcGUgZnJvbSBcIi4vYXVkaW8tZW5naW5lL2FtcGxpdHVkZS1lbnZlbG9wZVwiO1xuaW1wb3J0IE9zY2lsbGF0b3IgZnJvbSBcIi4vYXVkaW8tZW5naW5lL29zY2lsbGF0b3JcIjtcbmltcG9ydCBGZXF1ZW5jeU1vZHVsYXRpb24gZnJvbSBcIi4vYXVkaW8tZW5naW5lL2ZyZXF1ZW5jeS1tb2R1bGF0aW9uXCI7XG5pbXBvcnQgVmVsb2NpdHkgZnJvbSBcIi4vYXVkaW8tZW5naW5lL3ZlbG9jaXR5XCI7XG5pbXBvcnQgZXhwb25PdmVyIGZyb20gXCIuL2F1ZGlvLWVuZ2luZS9leHBvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdWRpb0VuZ2luZSB7XG4gIHByaXZhdGUgY3R4OiBBdWRpb0NvbnRleHQ7XG5cbiAgcHVibGljIG1hc3RlckZpbHRlcjogQmlxdWFkRmlsdGVyTm9kZTtcbiAgcHJpdmF0ZSBjb21wcmVzc29yOiBEeW5hbWljc0NvbXByZXNzb3JOb2RlO1xuICBwdWJsaWMgbWFzdGVyR2FpbjogR2Fpbk5vZGU7XG5cbiAgcHVibGljIGxmb0Ftb3VudDogbnVtYmVyO1xuICBwdWJsaWMgbGZvV2F2ZTogc3RyaW5nO1xuICBwdWJsaWMgbGZvRnJlcTogbnVtYmVyO1xuXG4gIHB1YmxpYyBmaWx0ZXJFbnZlbG9wZVE6IG51bWJlcjtcbiAgcHVibGljIGZpbHRlckVudmVsb3BlU3VzdGFpbjogbnVtYmVyO1xuICBwdWJsaWMgZmlsdGVyRW52ZWxvcGVTdGFydDogbnVtYmVyO1xuXG4gIHB1YmxpYyBhbXBsaXR1ZGVSZWxlYXNlOiBudW1iZXI7XG4gIHB1YmxpYyBzdXN0YWluOiBib29sZWFuO1xuICBwdWJsaWMgYW1wbGl0dWRlQXR0YWNrOiBudW1iZXI7XG4gIHByaXZhdGUgYW5hbHlzZXI6IEFuYWx5c2VyTm9kZTtcblxuICBjb25zdHJ1Y3RvcihjdHg6IEF1ZGlvQ29udGV4dCwgdmlzdWFsaXplQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuXG4gICAgdGhpcy5tYXN0ZXJGaWx0ZXIgPSB0aGlzLmN0eC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTtcbiAgICB0aGlzLm1hc3RlckZpbHRlci50eXBlID0gXCJsb3dwYXNzXCI7XG4gICAgdGhpcy5tYXN0ZXJGaWx0ZXIuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKDE4NTAwLCB0aGlzLmN0eC5jdXJyZW50VGltZSk7XG4gICAgdGhpcy5tYXN0ZXJGaWx0ZXIuUS52YWx1ZSA9IDAuMDE7XG5cbiAgICB0aGlzLmNvbXByZXNzb3IgPSBjdHguY3JlYXRlRHluYW1pY3NDb21wcmVzc29yKCk7XG4gICAgdGhpcy5jb21wcmVzc29yLnRocmVzaG9sZC5zZXRWYWx1ZUF0VGltZSgtNTAsIGN0eC5jdXJyZW50VGltZSk7XG4gICAgdGhpcy5jb21wcmVzc29yLmtuZWUuc2V0VmFsdWVBdFRpbWUoNDAsIGN0eC5jdXJyZW50VGltZSk7XG4gICAgdGhpcy5jb21wcmVzc29yLnJhdGlvLnNldFZhbHVlQXRUaW1lKDEyLCBjdHguY3VycmVudFRpbWUpO1xuICAgIHRoaXMuY29tcHJlc3Nvci5hdHRhY2suc2V0VmFsdWVBdFRpbWUoMCwgY3R4LmN1cnJlbnRUaW1lKTtcbiAgICB0aGlzLmNvbXByZXNzb3IucmVsZWFzZS5zZXRWYWx1ZUF0VGltZSgwLjI1LCBjdHguY3VycmVudFRpbWUpO1xuXG4gICAgdGhpcy5tYXN0ZXJHYWluID0gPEdhaW5Ob2RlPnRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcblxuICAgIHRoaXMuYW5hbHlzZXIgPSB0aGlzLmN0eC5jcmVhdGVBbmFseXNlcigpO1xuICAgIHRoaXMuYW5hbHlzZXIubWluRGVjaWJlbHMgPSAtOTA7XG4gICAgdGhpcy5hbmFseXNlci5tYXhEZWNpYmVscyA9IC0wO1xuICAgIHRoaXMuYW5hbHlzZXIuc21vb3RoaW5nVGltZUNvbnN0YW50ID0gMC44NTtcbiAgICB0aGlzLmFuYWx5c2VyLmZmdFNpemUgPSAyMDQ4O1xuXG4gICAgdGhpcy5tYXN0ZXJGaWx0ZXJcbiAgICAgIC5jb25uZWN0KHRoaXMuY29tcHJlc3NvcilcbiAgICAgIC5jb25uZWN0KHRoaXMubWFzdGVyR2FpbilcbiAgICAgIC5jb25uZWN0KHRoaXMuYW5hbHlzZXIpXG4gICAgICAuY29ubmVjdCh0aGlzLmN0eC5kZXN0aW5hdGlvbik7XG5cbiAgICB0aGlzLnZpc3VhbGl6ZSh2aXN1YWxpemVDYW52YXMpO1xuXG4gICAgdGhpcy5sZm9GcmVxID0gMC4xO1xuICAgIHRoaXMubGZvQW1vdW50ID0gMjtcbiAgICB0aGlzLmxmb1dhdmUgPSBcInNpbmVcIjtcblxuICAgIHRoaXMuZmlsdGVyRW52ZWxvcGVRID0gMC4xO1xuICAgIHRoaXMuZmlsdGVyRW52ZWxvcGVTdGFydCA9IDE4NTAwO1xuICAgIHRoaXMuZmlsdGVyRW52ZWxvcGVTdXN0YWluID0gMzAwO1xuXG4gICAgdGhpcy5hbXBsaXR1ZGVBdHRhY2sgPSAwLjI1O1xuICAgIHRoaXMuc3VzdGFpbiA9IHRydWU7XG4gICAgdGhpcy5hbXBsaXR1ZGVSZWxlYXNlID0gMC40O1xuICB9XG5cbiAgdmlzdWFsaXplKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpIHtcbiAgICBjb25zdCBXSURUSCA9IGNhbnZhcy53aWR0aDtcbiAgICBjb25zdCBIRUlHSFQgPSBjYW52YXMuaGVpZ2h0O1xuXG4gICAgY29uc3QgY2FudmFzQ3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIGNvbnN0IGJ1ZmZlckxlbmd0aCA9IHRoaXMuYW5hbHlzZXIuZmZ0U2l6ZTtcbiAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheShidWZmZXJMZW5ndGgpO1xuXG4gICAgY2FudmFzQ3R4LmNsZWFyUmVjdCgwLCAwLCBXSURUSCwgSEVJR0hUKTtcblxuICAgIGNvbnN0IGRyYXcgPSAoKSA9PiB7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG5cbiAgICAgIHRoaXMuYW5hbHlzZXIuZ2V0Qnl0ZVRpbWVEb21haW5EYXRhKGRhdGFBcnJheSk7XG5cbiAgICAgIGNhbnZhc0N0eC5maWxsU3R5bGUgPSBcInJnYmEoMjAwLCAyMDAsIDIwMCwgMC40KVwiO1xuICAgICAgY2FudmFzQ3R4LmZpbGxSZWN0KDAsIDAsIFdJRFRILCBIRUlHSFQpO1xuXG4gICAgICBjYW52YXNDdHgubGluZVdpZHRoID0gMjtcbiAgICAgIGNhbnZhc0N0eC5zdHJva2VTdHlsZSA9IFwicmdiYSgwLCAwLCAwLCAwLjgpXCI7XG5cbiAgICAgIGNhbnZhc0N0eC5iZWdpblBhdGgoKTtcblxuICAgICAgY29uc3Qgc2xpY2VXaWR0aCA9IChXSURUSCAqIDEuMCkgLyBidWZmZXJMZW5ndGg7XG4gICAgICBsZXQgeCA9IDA7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVmZmVyTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgdiA9IGRhdGFBcnJheVtpXSAvIDEyOC4wO1xuICAgICAgICBjb25zdCB5ID0gKHYgKiBIRUlHSFQpIC8gMjtcblxuICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgIGNhbnZhc0N0eC5tb3ZlVG8oeCwgeSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FudmFzQ3R4LmxpbmVUbyh4LCB5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHggKz0gc2xpY2VXaWR0aDtcbiAgICAgIH1cblxuICAgICAgY2FudmFzQ3R4LmxpbmVUbyhjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQgLyAyKTtcbiAgICAgIGNhbnZhc0N0eC5zdHJva2UoKTtcbiAgICB9O1xuXG4gICAgZHJhdygpO1xuICB9XG5cbiAgcGxheVRvbmUoXG4gICAgc3RhcnRUaW1lOiBudW1iZXIsXG4gICAgZGVjYXlUaW1lOiBudW1iZXIsXG4gICAgZnJlcTogbnVtYmVyLFxuICAgIGRldHVuZTogbnVtYmVyLFxuICAgIG9zY2lhbGx0b3JUeXBlOiBzdHJpbmcsXG4gICAgdmVsb2NpdHk6IG51bWJlclxuICApIHtcbiAgICAvKipcbiAgICAgKiBFdmVyeSBwbGF5VG9uZSgpIGludm9jYXRpb24gY3JlYXRlcyBhIG5ldyBvc2NpYWxsdG9yIGFuZCBkZXN0cm95cyBpdCB3aGVuIHRoZSBub3RlIGlzIGRvbmUuXG4gICAgICpcbiAgICAgKiBXZSBjYW4gZG8gdGhpcyBiZWNhdXNlIHBsYXlUb25lIHJlcXVpcmVzIGEgZGVjYXlUaW1lIGtub3duIGFoZWFkIG9mIHRpbWUuXG4gICAgICovXG4gICAgY29uc3Qgb3NjID0gbmV3IE9zY2lsbGF0b3IodGhpcy5jdHgpLm5vZGUoXG4gICAgICBzdGFydFRpbWUsXG4gICAgICBkZWNheVRpbWUsXG4gICAgICBvc2NpYWxsdG9yVHlwZSxcbiAgICAgIGZyZXEsXG4gICAgICBkZXR1bmVcbiAgICApO1xuXG4gICAgY29uc3QgbGZvID0gbmV3IEZlcXVlbmN5TW9kdWxhdGlvbih0aGlzLmN0eCkubm9kZShcbiAgICAgIHN0YXJ0VGltZSxcbiAgICAgIGRlY2F5VGltZSxcbiAgICAgIHRoaXMubGZvRnJlcSxcbiAgICAgIHRoaXMubGZvQW1vdW50LFxuICAgICAgdGhpcy5sZm9XYXZlXG4gICAgKTtcblxuICAgIGNvbnN0IGFtcEVudiA9IG5ldyBBbXBsaXR1ZGVFbnZlbG9wZSh0aGlzLmN0eCkubm9kZShcbiAgICAgIHN0YXJ0VGltZSxcbiAgICAgIGRlY2F5VGltZSxcbiAgICAgIHRoaXMuc3VzdGFpbixcbiAgICAgIHRoaXMuYW1wbGl0dWRlUmVsZWFzZSxcbiAgICAgIHRoaXMuYW1wbGl0dWRlQXR0YWNrXG4gICAgKTtcblxuICAgIGNvbnN0IGZpbHRlckVudiA9IG5ldyBFbnZlbG9wZUZpbHRlcih0aGlzLmN0eCkubm9kZShcbiAgICAgIHN0YXJ0VGltZSxcbiAgICAgIGRlY2F5VGltZSxcbiAgICAgIHRoaXMuZmlsdGVyRW52ZWxvcGVTdGFydCxcbiAgICAgIHRoaXMuZmlsdGVyRW52ZWxvcGVRLFxuICAgICAgdGhpcy5maWx0ZXJFbnZlbG9wZVN1c3RhaW5cbiAgICApO1xuXG4gICAgY29uc3QgdmVsb2NpdHlHYWluID0gbmV3IFZlbG9jaXR5KHRoaXMuY3R4KS5ub2RlKHN0YXJ0VGltZSwgdmVsb2NpdHkpO1xuXG4gICAgbGZvLmNvbm5lY3Qob3NjLmZyZXF1ZW5jeSk7XG4gICAgb3NjXG4gICAgICAuY29ubmVjdChhbXBFbnYpXG4gICAgICAuY29ubmVjdChmaWx0ZXJFbnYpXG4gICAgICAuY29ubmVjdCh2ZWxvY2l0eUdhaW4pXG4gICAgICAuY29ubmVjdCh0aGlzLm1hc3RlckZpbHRlcik7XG4gIH1cblxuICBzZXRNYXN0ZXJHYWluKGlucHV0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLm1hc3RlckdhaW4uZ2Fpbi52YWx1ZSA9IGV4cG9uT3ZlcihpbnB1dCwgMS43LCAwLjApO1xuICB9XG5cbiAgc2V0TWFzdGVyRmlsdGVyVmFsdWUoaW5wdXQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMubWFzdGVyRmlsdGVyLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZShcbiAgICAgIGV4cG9uT3ZlcihpbnB1dCwgMTg1MDAsIDIwKSxcbiAgICAgIHRoaXMuY3R4LmN1cnJlbnRUaW1lXG4gICAgKTtcbiAgfVxuXG4gIHNldExmb0ZyZXF1ZW5jeShpbnB1dDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5sZm9GcmVxID0gZXhwb25PdmVyKGlucHV0LCA4LCAwLjAwMSk7XG4gIH1cblxuICBzZXRGaWx0ZXJFbnZlbG9wZVN0YXJ0RnJlcXVlbmN5KGlucHV0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmZpbHRlckVudmVsb3BlU3RhcnQgPSBleHBvbk92ZXIoaW5wdXQsIDE4NTAwLCAxMDAwKTtcbiAgfVxuXG4gIHNldEZpbHRlckVudmVsb3BlU3VzdGFpbihpbnB1dDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5maWx0ZXJFbnZlbG9wZVN1c3RhaW4gPSBleHBvbk92ZXIoaW5wdXQsIDE4NTAwLCAxMCk7XG4gIH1cbn1cbiIsImNvbnN0IGV4cFplcm8gPSAwLjAwMDAwMDAxO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbXBsaXR1ZGVFbnZlbG9wZSB7XG4gIHByaXZhdGUgY3R4OiBBdWRpb0NvbnRleHQ7XG4gIGNvbnN0cnVjdG9yKGN0eDogQXVkaW9Db250ZXh0KSB7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gIH1cblxuICBub2RlKFxuICAgIHN0YXJ0VGltZTogbnVtYmVyLFxuICAgIG5vdGVMZW5ndGg6IG51bWJlcixcbiAgICBzdXN0YWluOiBib29sZWFuLFxuICAgIGFtcGxpdHVkZVJlbGVhc2U6IG51bWJlcixcbiAgICBhbXBsaXR1ZGVBdHRhY2s6IG51bWJlclxuICApOiBHYWluTm9kZSB7XG4gICAgY29uc3QgY3VycmVudFRpbWUgPSB0aGlzLmN0eC5jdXJyZW50VGltZTtcbiAgICBjb25zdCBwbGF5VGltZSA9IGN1cnJlbnRUaW1lICsgc3RhcnRUaW1lO1xuICAgIGNvbnN0IGdhaW5Ob2RlID0gdGhpcy5jdHguY3JlYXRlR2FpbigpO1xuXG4gICAgLy8gQW1wbGl0dWRlIFByZS1BdHRhY2tcbiAgICBnYWluTm9kZS5nYWluLmNhbmNlbFNjaGVkdWxlZFZhbHVlcyhwbGF5VGltZSk7XG4gICAgZ2Fpbk5vZGUuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCBwbGF5VGltZSk7XG5cbiAgICAvLyBBbXBsaXR1ZGUgQXR0YWNrXG4gICAgZ2Fpbk5vZGUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgxLCBwbGF5VGltZSArIGFtcGxpdHVkZUF0dGFjayk7XG5cbiAgICAvLyBBbXBsaXR1ZGUgRGVjYXlcbiAgICBpZiAoc3VzdGFpbikge1xuICAgICAgZ2Fpbk5vZGUuZ2Fpbi5leHBvbmVudGlhbFJhbXBUb1ZhbHVlQXRUaW1lKFxuICAgICAgICBleHBaZXJvLFxuICAgICAgICBwbGF5VGltZSArIG5vdGVMZW5ndGggKyBhbXBsaXR1ZGVSZWxlYXNlXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBnYWluTm9kZS5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKFxuICAgICAgICAwLFxuICAgICAgICBwbGF5VGltZSArIG5vdGVMZW5ndGggKyBhbXBsaXR1ZGVSZWxlYXNlXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBnYWluTm9kZTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW52ZWxvcGVGaWx0ZXIge1xuICBjdHg6IEF1ZGlvQ29udGV4dDtcblxuICBjb25zdHJ1Y3RvcihjdHg6IEF1ZGlvQ29udGV4dCkge1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICB9XG5cbiAgbm9kZShcbiAgICBzdGFydFRpbWU6IG51bWJlcixcbiAgICBub3RlTGVuZ3RoOiBudW1iZXIsXG4gICAgZmlsdGVyRW52ZWxvcGVTdGFydDogbnVtYmVyLFxuICAgIFE6IG51bWJlcixcbiAgICBzdXN0YWluOiBudW1iZXJcbiAgKTogQmlxdWFkRmlsdGVyTm9kZSB7XG4gICAgY29uc3QgY3VycmVudFRpbWUgPSB0aGlzLmN0eC5jdXJyZW50VGltZTtcbiAgICBjb25zdCBiaXF1YWRGaWx0ZXIgPSB0aGlzLmN0eC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTtcblxuICAgIGJpcXVhZEZpbHRlci50eXBlID0gXCJsb3dwYXNzXCI7XG4gICAgYmlxdWFkRmlsdGVyLlEudmFsdWUgPSBRO1xuICAgIGJpcXVhZEZpbHRlci5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoZmlsdGVyRW52ZWxvcGVTdGFydCwgY3VycmVudFRpbWUpO1xuICAgIGJpcXVhZEZpbHRlci5mcmVxdWVuY3kuZXhwb25lbnRpYWxSYW1wVG9WYWx1ZUF0VGltZShcbiAgICAgIHN1c3RhaW4sXG4gICAgICBjdXJyZW50VGltZSArIHN0YXJ0VGltZSArIG5vdGVMZW5ndGhcbiAgICApO1xuXG4gICAgcmV0dXJuIGJpcXVhZEZpbHRlcjtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgKGlucHV0OiBzdHJpbmcsIG1heDogbnVtYmVyLCBmbG9vcjogbnVtYmVyKSA9PiB7XG4gIHJldHVybiBleHBvbihpbnB1dCkgKiBtYXggKyBmbG9vcjtcbn07XG5cbmNvbnN0IGV4cG9uID0gKHg6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gIGxldCB2YWx1ZSA9IHBhcnNlRmxvYXQoeCk7XG4gIHZhbHVlID0gdmFsdWUgPCAwLjAgPyAwLjAgOiB2YWx1ZTtcbiAgdmFsdWUgPSB2YWx1ZSA+IDEuMCA/IDEuMCA6IHZhbHVlO1xuICByZXR1cm4gLU1hdGguc3FydCgtdmFsdWUgKyAxKSArIDE7XG59O1xuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmVxdWVuY3lNb2R1bGF0aW9uIHtcbiAgcHJpdmF0ZSBjdHg6IEF1ZGlvQ29udGV4dDtcblxuICBjb25zdHJ1Y3RvcihjdHg6IEF1ZGlvQ29udGV4dCkge1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICB9XG4gIG5vZGUoXG4gICAgc3RhcnRUaW1lOiBudW1iZXIsXG4gICAgbm90ZUxlbmd0aDogbnVtYmVyLFxuICAgIGxmb0ZyZXE6IG51bWJlcixcbiAgICBsZm9BbW91bnQ6IG51bWJlcixcbiAgICBsZm9XYXZlOiBzdHJpbmdcbiAgKSB7XG4gICAgY29uc3QgY3VycmVudFRpbWUgPSB0aGlzLmN0eC5jdXJyZW50VGltZTtcbiAgICBjb25zdCBsZm8gPSB0aGlzLmN0eC5jcmVhdGVPc2NpbGxhdG9yKCk7XG5cbiAgICBsZm8udHlwZSA9IDxPc2NpbGxhdG9yVHlwZT5sZm9XYXZlO1xuICAgIGxmby5mcmVxdWVuY3kudmFsdWUgPSBsZm9GcmVxO1xuXG4gICAgbGZvLnN0YXJ0KGN1cnJlbnRUaW1lICsgc3RhcnRUaW1lKTtcbiAgICBsZm8uc3RvcChjdXJyZW50VGltZSArIG5vdGVMZW5ndGggKyBzdGFydFRpbWUpO1xuXG4gICAgY29uc3QgZ2Fpbk5vZGUgPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XG4gICAgZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IGxmb0Ftb3VudDtcblxuICAgIHJldHVybiBsZm8uY29ubmVjdChnYWluTm9kZSk7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIE9zY2lsbGF0b3Ige1xuICBwcml2YXRlIGN0eDogQXVkaW9Db250ZXh0O1xuICBwcml2YXRlIGN1c3RvbVdhdmVmb3JtOiBQZXJpb2RpY1dhdmU7XG5cbiAgY29uc3RydWN0b3IoY3R4OiBBdWRpb0NvbnRleHQpIHtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICBjb25zdCBzaW5lVGVybXMgPSBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAxLCAwLCAxXSk7XG4gICAgY29uc3QgY29zaW5lVGVybXMgPSBuZXcgRmxvYXQzMkFycmF5KHNpbmVUZXJtcy5sZW5ndGgpO1xuICAgIHRoaXMuY3VzdG9tV2F2ZWZvcm0gPSB0aGlzLmN0eC5jcmVhdGVQZXJpb2RpY1dhdmUoY29zaW5lVGVybXMsIHNpbmVUZXJtcyk7XG4gIH1cblxuICBub2RlKFxuICAgIHN0YXJ0VGltZTogbnVtYmVyLFxuICAgIG5vdGVMZW5ndGg6IG51bWJlcixcbiAgICBvc2NpbGxhdG9yV2F2ZTogc3RyaW5nLFxuICAgIGZyZXF1ZW5jeTogbnVtYmVyLFxuICAgIGRldHVuZTogbnVtYmVyXG4gICk6IE9zY2lsbGF0b3JOb2RlIHtcbiAgICBjb25zdCBjdXJyZW50VGltZSA9IHRoaXMuY3R4LmN1cnJlbnRUaW1lO1xuICAgIGNvbnN0IG9zY2lsbGF0b3IgPSB0aGlzLmN0eC5jcmVhdGVPc2NpbGxhdG9yKCk7XG5cbiAgICBpZiAob3NjaWxsYXRvcldhdmUgPT0gXCJjdXN0b21cIikge1xuICAgICAgb3NjaWxsYXRvci5zZXRQZXJpb2RpY1dhdmUodGhpcy5jdXN0b21XYXZlZm9ybSk7IC8vIFRPRE86IEFkZCBtb3JlIGN1c3RvbSBXYXZlZm9ybXNcbiAgICB9IGVsc2Uge1xuICAgICAgb3NjaWxsYXRvci50eXBlID0gPE9zY2lsbGF0b3JUeXBlPm9zY2lsbGF0b3JXYXZlO1xuICAgIH1cblxuICAgIG9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gZnJlcXVlbmN5O1xuICAgIG9zY2lsbGF0b3IuZGV0dW5lLnNldFZhbHVlQXRUaW1lKGRldHVuZSwgY3VycmVudFRpbWUgKyBzdGFydFRpbWUpO1xuXG4gICAgb3NjaWxsYXRvci5zdGFydChjdXJyZW50VGltZSArIHN0YXJ0VGltZSk7XG4gICAgb3NjaWxsYXRvci5zdG9wKGN1cnJlbnRUaW1lICsgbm90ZUxlbmd0aCArIHN0YXJ0VGltZSk7XG5cbiAgICByZXR1cm4gb3NjaWxsYXRvcjtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVsb2NpdHkge1xuICBwcml2YXRlIGN0eDogQXVkaW9Db250ZXh0O1xuXG4gIGNvbnN0cnVjdG9yKGN0eDogQXVkaW9Db250ZXh0KSB7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gIH1cblxuICBub2RlKHN0YXJ0VGltZTogbnVtYmVyLCB2ZWxvY2l0eTogbnVtYmVyKTogR2Fpbk5vZGUge1xuICAgIGNvbnN0IHZlbG9jaXR5R2FpbiA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcbiAgICB2ZWxvY2l0eUdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZShcbiAgICAgIHZlbG9jaXR5LFxuICAgICAgdGhpcy5jdHguY3VycmVudFRpbWUgKyBzdGFydFRpbWVcbiAgICApO1xuICAgIHJldHVybiB2ZWxvY2l0eUdhaW47XG4gIH1cbn1cbiIsImltcG9ydCB1cm5KQiBmcm9tIFwiLi9jb21wb3NpdGlvbi1lbmdpbmUvcmFuZG9tXCI7XG5pbXBvcnQgTm90ZVRhYmxlIGZyb20gXCIuL2NvbXBvc2l0aW9uLWVuZ2luZS9ub3RlLXRhYmxlXCI7XG5pbXBvcnQgQXVkaW9FbmdpbmUgZnJvbSBcIi4vYXVkaW8tZW5naW5lXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvc2l0aW9uRW5naW5lIHtcbiAgLyoqXG4gICAqIENvbXBvc2l0aW9uRW5naW5lIGlzIGEgc3Vic3lzdGVtIHRoYXQgZGVjaWRlcyB3aGljaCBub3RlcyB0byBwbGF5IGFuZCB3aGVuLlxuICAgKlxuICAgKiBJdCBoYXMgYW4gYXVkaW9FbmdpbmUgcHJvcGVydHkgd2hpY2ggZXhwb3NlcyBhIG5vdGVQcmVzc2VkKCkgbWV0aG9kXG4gICAqXG4gICAqIENvbXBvc2l0aW9uRW5naW5lIGlzIHJlc3BvbnNpYmxlIGZvciB3aGF0IGdvZXMgaW4gYXMgdGhlIGFyZ3VtZW50cyB0byBub3RlUHJlc3NlZCgpXG4gICAqXG4gICAqL1xuICBwdWJsaWMgY2hvcmRTcGVlZDogbnVtYmVyO1xuICBwdWJsaWMgY2hvcmRWb2ljZXM6IEdlbmVyYXRvcltdO1xuICBwdWJsaWMgc3dpcGVWb2ljZXM6IEdlbmVyYXRvcltdO1xuICBwdWJsaWMgZ2xvYmFsUm9vdDogbnVtYmVyO1xuICBwdWJsaWMgb3NjaWFsbHRvclR5cGU6IHN0cmluZztcbiAgcHVibGljIGRlY2F5VGltZTogbnVtYmVyO1xuICBwdWJsaWMgZGV0dW5lOiBudW1iZXI7XG5cbiAgcHJpdmF0ZSBub3RlVGFibGU6IE5vdGVUYWJsZTtcbiAgcHJpdmF0ZSBhdWRpb0VuZ2luZTogQXVkaW9FbmdpbmU7XG5cbiAgY29uc3RydWN0b3IoYXVkaW9FbmdpbmU6IEF1ZGlvRW5naW5lKSB7XG4gICAgdGhpcy5kZWNheVRpbWUgPSAyO1xuICAgIHRoaXMuY2hvcmRTcGVlZCA9IHRoaXMuZGVjYXlUaW1lICogMTAwMDsgLy9tc1xuICAgIHRoaXMuY2hvcmRWb2ljZXMgPSBbdXJuSkIoNyksIHVybkpCKDcpLCB1cm5KQig3KSwgdXJuSkIoNyldO1xuICAgIHRoaXMuc3dpcGVWb2ljZXMgPSBbdXJuSkIoNyksIHVybkpCKDcpLCB1cm5KQig3KSwgdXJuSkIoNyldO1xuXG4gICAgdGhpcy5hdWRpb0VuZ2luZSA9IGF1ZGlvRW5naW5lO1xuXG4gICAgdGhpcy5ub3RlVGFibGUgPSBuZXcgTm90ZVRhYmxlKCk7XG4gICAgdGhpcy5kZXR1bmUgPSAwO1xuICAgIHRoaXMuZ2xvYmFsUm9vdCA9IDI7XG5cbiAgICB0aGlzLm9zY2lhbGx0b3JUeXBlID0gXCJzYXd0b290aFwiO1xuICB9XG5cbiAgc2V0RGVjYXlUaW1lKGRlY2F5VGltZTogc3RyaW5nKSB7XG4gICAgdGhpcy5kZWNheVRpbWUgPSBwYXJzZUZsb2F0KGRlY2F5VGltZSk7XG4gICAgdGhpcy5jaG9yZFNwZWVkID0gdGhpcy5kZWNheVRpbWUgKiAxMDAwOyAvL21zXG4gIH1cblxuICBub3RlUHJlc3NlZChcbiAgICBub3RlOiBudW1iZXIsXG4gICAgb2N0YXZlOiBudW1iZXIsXG4gICAgc3RhcnRUaW1lOiBudW1iZXIsXG4gICAgdmVsb2NpdHk6IG51bWJlclxuICApIHtcbiAgICBjb25zdCBmcmVxdWVuY3kgPSB0aGlzLm5vdGVUYWJsZS5nZXROb3RlRnJlcXVlbmN5KG5vdGUsIG9jdGF2ZSk7XG5cbiAgICB0aGlzLmF1ZGlvRW5naW5lLnBsYXlUb25lKFxuICAgICAgc3RhcnRUaW1lLFxuICAgICAgdGhpcy5kZWNheVRpbWUsXG4gICAgICBmcmVxdWVuY3ksXG4gICAgICAtdGhpcy5kZXR1bmUsXG4gICAgICB0aGlzLm9zY2lhbGx0b3JUeXBlLFxuICAgICAgdmVsb2NpdHlcbiAgICApO1xuICAgIHRoaXMuYXVkaW9FbmdpbmUucGxheVRvbmUoXG4gICAgICBzdGFydFRpbWUsXG4gICAgICB0aGlzLmRlY2F5VGltZSxcbiAgICAgIGZyZXF1ZW5jeSxcbiAgICAgIHRoaXMuZGV0dW5lLFxuICAgICAgdGhpcy5vc2NpYWxsdG9yVHlwZSxcbiAgICAgIHZlbG9jaXR5XG4gICAgKTtcbiAgfVxufVxuIiwidHlwZSBPY3RhdmUgPSB7XG4gIFtrZXk6IHN0cmluZ106IG51bWJlcjtcbiAgQzogbnVtYmVyO1xuICBcIkMjXCI6IG51bWJlcjtcbiAgRDogbnVtYmVyO1xuICBcIkQjXCI6IG51bWJlcjtcbiAgRTogbnVtYmVyO1xuICBGOiBudW1iZXI7XG4gIFwiRiNcIjogbnVtYmVyO1xuICBHOiBudW1iZXI7XG4gIFwiRyNcIjogbnVtYmVyO1xuICBBOiBudW1iZXI7XG4gIFwiQSNcIjogbnVtYmVyO1xuICBCOiBudW1iZXI7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb3RlVGFibGUge1xuICBub3RlRnJlcXVlbmNpZXM6IE9jdGF2ZVtdO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubm90ZUZyZXF1ZW5jaWVzID0gW1xuICAgICAge1xuICAgICAgICBBOiA1NS4wLFxuICAgICAgICBcIkEjXCI6IDU4LjI3MDQ3MDE4OTc2MTIzOSxcbiAgICAgICAgQjogNjEuNzM1NDEyNjU3MDE1NTEzLFxuICAgICAgICBDOiAzMi43MDMxOTU2NjI1NzQ4MjksXG4gICAgICAgIFwiQyNcIjogMzQuNjQ3ODI4ODcyMTA5MDEyLFxuICAgICAgICBEOiAzNi43MDgwOTU5ODk2NzU5NDUsXG4gICAgICAgIFwiRCNcIjogMzguODkwODcyOTY1MjYwMTEzLFxuICAgICAgICBFOiA0MS4yMDM0NDQ2MTQxMDg3NDEsXG4gICAgICAgIEY6IDQzLjY1MzUyODkyOTEyNTQ4NSxcbiAgICAgICAgXCJGI1wiOiA0Ni4yNDkzMDI4Mzg5NTQyOTksXG4gICAgICAgIEc6IDQ4Ljk5OTQyOTQ5NzcxODY2MSxcbiAgICAgICAgXCJHI1wiOiA1MS45MTMwODcxOTc0OTMxNDJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIEE6IDExMC4wLFxuICAgICAgICBcIkEjXCI6IDExNi41NDA5NDAzNzk1MjI0NzksXG4gICAgICAgIEI6IDEyMy40NzA4MjUzMTQwMzEwMjcsXG4gICAgICAgIEM6IDY1LjQwNjM5MTMyNTE0OTY1OCxcbiAgICAgICAgXCJDI1wiOiA2OS4yOTU2NTc3NDQyMTgwMjQsXG4gICAgICAgIEQ6IDczLjQxNjE5MTk3OTM1MTg5LFxuICAgICAgICBcIkQjXCI6IDc3Ljc4MTc0NTkzMDUyMDIyNyxcbiAgICAgICAgRTogODIuNDA2ODg5MjI4MjE3NDgyLFxuICAgICAgICBGOiA4Ny4zMDcwNTc4NTgyNTA5NzEsXG4gICAgICAgIFwiRiNcIjogOTIuNDk4NjA1Njc3OTA4NTk5LFxuICAgICAgICBHOiA5Ny45OTg4NTg5OTU0MzczMjMsXG4gICAgICAgIFwiRyNcIjogMTAzLjgyNjE3NDM5NDk4NjI4NFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgQTogMjIwLjAsXG4gICAgICAgIFwiQSNcIjogMjMzLjA4MTg4MDc1OTA0NDk1OCxcbiAgICAgICAgQjogMjQ2Ljk0MTY1MDYyODA2MjA1NSxcbiAgICAgICAgQzogMTMwLjgxMjc4MjY1MDI5OTMxNyxcbiAgICAgICAgXCJDI1wiOiAxMzguNTkxMzE1NDg4NDM2MDQ4LFxuICAgICAgICBEOiAxNDYuODMyMzgzOTU4NzAzNzgsXG4gICAgICAgIFwiRCNcIjogMTU1LjU2MzQ5MTg2MTA0MDQ1NSxcbiAgICAgICAgRTogMTY0LjgxMzc3ODQ1NjQzNDk2NCxcbiAgICAgICAgRjogMTc0LjYxNDExNTcxNjUwMTk0MixcbiAgICAgICAgXCJGI1wiOiAxODQuOTk3MjExMzU1ODE3MTk5LFxuICAgICAgICBHOiAxOTUuOTk3NzE3OTkwODc0NjQ3LFxuICAgICAgICBcIkcjXCI6IDIwNy42NTIzNDg3ODk5NzI1NjlcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIEE6IDQ0MC4wLFxuICAgICAgICBcIkEjXCI6IDQ2Ni4xNjM3NjE1MTgwODk5MTYsXG4gICAgICAgIEI6IDQ5My44ODMzMDEyNTYxMjQxMTEsXG4gICAgICAgIEM6IDI2MS42MjU1NjUzMDA1OTg2MzQsXG4gICAgICAgIFwiQyNcIjogMjc3LjE4MjYzMDk3Njg3MjA5NixcbiAgICAgICAgRDogMjkzLjY2NDc2NzkxNzQwNzU2LFxuICAgICAgICBcIkQjXCI6IDMxMS4xMjY5ODM3MjIwODA5MSxcbiAgICAgICAgRTogMzI5LjYyNzU1NjkxMjg2OTkyOSxcbiAgICAgICAgRjogMzQ5LjIyODIzMTQzMzAwMzg4NCxcbiAgICAgICAgXCJGI1wiOiAzNjkuOTk0NDIyNzExNjM0Mzk4LFxuICAgICAgICBHOiAzOTEuOTk1NDM1OTgxNzQ5Mjk0LFxuICAgICAgICBcIkcjXCI6IDQxNS4zMDQ2OTc1Nzk5NDUxMzhcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIEE6IDg4MC4wLFxuICAgICAgICBcIkEjXCI6IDkzMi4zMjc1MjMwMzYxNzk4MzIsXG4gICAgICAgIEI6IDk4Ny43NjY2MDI1MTIyNDgyMjMsXG4gICAgICAgIEM6IDUyMy4yNTExMzA2MDExOTcyNjksXG4gICAgICAgIFwiQyNcIjogNTU0LjM2NTI2MTk1Mzc0NDE5MixcbiAgICAgICAgRDogNTg3LjMyOTUzNTgzNDgxNTEyLFxuICAgICAgICBcIkQjXCI6IDYyMi4yNTM5Njc0NDQxNjE4MjEsXG4gICAgICAgIEU6IDY1OS4yNTUxMTM4MjU3Mzk4NTksXG4gICAgICAgIEY6IDY5OC40NTY0NjI4NjYwMDc3NjgsXG4gICAgICAgIFwiRiNcIjogNzM5Ljk4ODg0NTQyMzI2ODc5NyxcbiAgICAgICAgRzogNzgzLjk5MDg3MTk2MzQ5ODU4OCxcbiAgICAgICAgXCJHI1wiOiA4MzAuNjA5Mzk1MTU5ODkwMjc3XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBBOiAxNzYwLjAsXG4gICAgICAgIFwiQSNcIjogMTg2NC42NTUwNDYwNzIzNTk2NjUsXG4gICAgICAgIEI6IDE5NzUuNTMzMjA1MDI0NDk2NDQ3LFxuICAgICAgICBDOiAxMDQ2LjUwMjI2MTIwMjM5NDUzOCxcbiAgICAgICAgXCJDI1wiOiAxMTA4LjczMDUyMzkwNzQ4ODM4NCxcbiAgICAgICAgRDogMTE3NC42NTkwNzE2Njk2MzAyNDEsXG4gICAgICAgIFwiRCNcIjogMTI0NC41MDc5MzQ4ODgzMjM2NDIsXG4gICAgICAgIEU6IDEzMTguNTEwMjI3NjUxNDc5NzE4LFxuICAgICAgICBGOiAxMzk2LjkxMjkyNTczMjAxNTUzNyxcbiAgICAgICAgXCJGI1wiOiAxNDc5Ljk3NzY5MDg0NjUzNzU5NSxcbiAgICAgICAgRzogMTU2Ny45ODE3NDM5MjY5OTcxNzYsXG4gICAgICAgIFwiRyNcIjogMTY2MS4yMTg3OTAzMTk3ODA1NTRcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIEE6IDM1MjAuMCxcbiAgICAgICAgXCJBI1wiOiAzNzI5LjMxMDA5MjE0NDcxOTMzMSxcbiAgICAgICAgQjogMzk1MS4wNjY0MTAwNDg5OTI4OTQsXG4gICAgICAgIEM6IDIwOTMuMDA0NTIyNDA0Nzg5MDc3LFxuICAgICAgICBcIkMjXCI6IDIyMTcuNDYxMDQ3ODE0OTc2NzY5LFxuICAgICAgICBEOiAyMzQ5LjMxODE0MzMzOTI2MDQ4MixcbiAgICAgICAgXCJEI1wiOiAyNDg5LjAxNTg2OTc3NjY0NzI4NSxcbiAgICAgICAgRTogMjYzNy4wMjA0NTUzMDI5NTk0MzcsXG4gICAgICAgIEY6IDI3OTMuODI1ODUxNDY0MDMxMDc1LFxuICAgICAgICBcIkYjXCI6IDI5NTkuOTU1MzgxNjkzMDc1MTkxLFxuICAgICAgICBHOiAzMTM1Ljk2MzQ4Nzg1Mzk5NDM1MixcbiAgICAgICAgXCJHI1wiOiAzMzIyLjQzNzU4MDYzOTU2MTEwOFxuICAgICAgfVxuICAgIF07XG4gIH1cblxuICBnZXROb3RlRnJlcXVlbmN5KG5vdGU6IG51bWJlciwgb2N0YXZlOiBudW1iZXIpIHtcbiAgICBjb25zdCBzdHJpbmdOb3RlID0gT2JqZWN0LmtleXModGhpcy5ub3RlRnJlcXVlbmNpZXNbb2N0YXZlXSlbbm90ZV07XG4gICAgcmV0dXJuIHRoaXMubm90ZUZyZXF1ZW5jaWVzW29jdGF2ZV1bc3RyaW5nTm90ZV07XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKiB1cm5KQihsZW5ndGg6IG51bWJlcikge1xuICBsZXQgYXJyYXkgPSByYW5kQXJyYXkobGVuZ3RoKTtcbiAgbGV0IGluZGV4ID0gMDtcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHlpZWxkIGFycmF5W2luZGV4XTtcbiAgICBpbmRleCA9IGluZGV4ICsgMTtcblxuICAgIGlmIChpbmRleCA9PT0gbGVuZ3RoKSB7XG4gICAgICBhcnJheSA9IHJhbmRBcnJheShsZW5ndGgpO1xuICAgICAgaW5kZXggPSAwO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiByYW5kQXJyYXkobGVuZ3RoOiBudW1iZXIpIHtcbiAgbGV0IGFycmF5OiBudW1iZXJbXSA9IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBhcnJheVtpXSA9IGk7XG4gIH1cblxuICAvLyBGaXNoZXItWWF0ZXMgc2h1ZmZsaW5nIGFsZ29yaXRobVxuICBmb3IgKGxldCBpID0gYXJyYXkubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBpKTtcbiAgICBjb25zdCB0ZW1wID0gYXJyYXlbaV07XG4gICAgYXJyYXlbaV0gPSBhcnJheVtqXTtcbiAgICBhcnJheVtqXSA9IHRlbXA7XG4gIH1cblxuICByZXR1cm4gYXJyYXk7XG59XG4iLCJleHBvcnQgdHlwZSBDb250cm9sVmFsdWVzID0ge1xuICBtYXN0ZXJHYWluOiBzdHJpbmc7XG4gIHNldE1hc3RlckZpbHRlclZhbHVlOiBzdHJpbmc7XG4gIG1hc3RlckNvbnRyb2xTdGF0ZTogYm9vbGVhbjtcbiAgc2V0RGVjYXlUaW1lOiBzdHJpbmc7XG4gIGNob3JkT2N0YXZlOiBudW1iZXI7XG4gIHNldExmb0ZyZXF1ZW5jeTogc3RyaW5nO1xuICBmaWx0ZXJFbnZlbG9wZVE6IG51bWJlcjtcbiAgZGV0dW5lOiBudW1iZXI7XG4gIHNldEZpbHRlckVudmVsb3BlU3RhcnRGcmVxdWVuY3k6IHN0cmluZztcbiAgbGZvV2F2ZTogc3RyaW5nO1xuICBhbXBsaXR1ZGVBdHRhY2s6IG51bWJlcjtcbiAgc2V0RmlsdGVyRW52ZWxvcGVTdXN0YWluOiBzdHJpbmc7XG4gIG9zY2lhbGx0b3JUeXBlOiBzdHJpbmc7XG4gIHNjYWxlOiBzdHJpbmc7XG4gIHNldEJsZW5kTW9kZTogc3RyaW5nO1xuICBsZm9BbW91bnQ6IG51bWJlcjtcbiAgYW1wbGl0dWRlUmVsZWFzZTogbnVtYmVyO1xuICBzd2lwZUZyZXF1ZW5jeTogbnVtYmVyO1xuICBzd2lwZU9jdGF2ZTogbnVtYmVyO1xuICBjaG9yZFZlbG9jaXR5OiBudW1iZXI7XG4gIHN3aXBlVmVsb2NpdHk6IG51bWJlcjtcbiAgc3VzdGFpbjogYm9vbGVhbjtcbn07XG5cbmNvbnN0IElOSVRfQ09OVFJPTF9WQUxVRVM6IENvbnRyb2xWYWx1ZXMgPSB7XG4gIG1hc3RlckdhaW46IFwiMS4wXCIsXG4gIHNldE1hc3RlckZpbHRlclZhbHVlOiBcIjEuMFwiLFxuICBtYXN0ZXJDb250cm9sU3RhdGU6IGZhbHNlLFxuICBzZXREZWNheVRpbWU6IFwiNFwiLFxuICBjaG9yZE9jdGF2ZTogMyxcbiAgc2V0TGZvRnJlcXVlbmN5OiBcIjAuMVwiLFxuICBmaWx0ZXJFbnZlbG9wZVE6IDAuMSxcbiAgZGV0dW5lOiAwLFxuICBzZXRGaWx0ZXJFbnZlbG9wZVN0YXJ0RnJlcXVlbmN5OiBcIjE4NTAwXCIsXG4gIGxmb1dhdmU6IFwic2luZVwiLFxuICBhbXBsaXR1ZGVBdHRhY2s6IDAuMjUsXG4gIHNldEZpbHRlckVudmVsb3BlU3VzdGFpbjogXCIzMDBcIixcbiAgb3NjaWFsbHRvclR5cGU6IFwidHJpYW5nbGVcIixcbiAgc2NhbGU6IFwiTHlkaWFuXCIsXG4gIHNldEJsZW5kTW9kZTogXCJzb3VyY2Utb3ZlclwiLFxuICBsZm9BbW91bnQ6IDIsXG4gIGFtcGxpdHVkZVJlbGVhc2U6IDAuNCxcbiAgc3dpcGVGcmVxdWVuY3k6IDAuNCxcbiAgc3dpcGVPY3RhdmU6IDMsXG4gIGNob3JkVmVsb2NpdHk6IDEuMCxcbiAgc3dpcGVWZWxvY2l0eTogMS4wLFxuICBzdXN0YWluOiB0cnVlLFxufTtcblxuZXhwb3J0IGNsYXNzIEhhc2hTdG9yYWdlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICh0aGlzLmlzRW1wdHkodGhpcy5kZWNvZGUod2luZG93LmxvY2F0aW9uLmhhc2gpKSkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHRoaXMuZW5jb2RlKElOSVRfQ09OVFJPTF9WQUxVRVMpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gdGhpcy5lbmNvZGUoSU5JVF9DT05UUk9MX1ZBTFVFUyk7XG4gICAgfVxuICB9XG5cbiAgaXNFcXVhbCA9IChhOiBhbnksIGI6IGFueSkgPT4gSlNPTi5zdHJpbmdpZnkoYSkgPT09IEpTT04uc3RyaW5naWZ5KGIpO1xuICBpc0VtcHR5ID0gKGE6IGFueSkgPT4gYS5sZW5ndGggPT09IDA7XG4gIHN0YXRlKCk6IENvbnRyb2xWYWx1ZXMge1xuICAgIHJldHVybiB0aGlzLmRlY29kZSh3aW5kb3cubG9jYXRpb24uaGFzaCk7XG4gIH1cblxuICBlbmNvZGUoc3RhdGU6IENvbnRyb2xWYWx1ZXMpIHtcbiAgICByZXR1cm4gYnRvYShKU09OLnN0cmluZ2lmeShzdGF0ZSkpO1xuICB9XG4gIGRlY29kZShoYXNoOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGF0b2IoaGFzaC5zdWJzdHJpbmcoMSkpKTtcbiAgfVxuXG4gIHVwZGF0ZShkYXRhOiBhbnkpIHtcbiAgICBjb25zdCBfc3RhdGUgPSB0aGlzLnN0YXRlKCk7XG4gICAgY29uc3QgdXBkYXRlZCA9IHsgLi4uX3N0YXRlLCAuLi5kYXRhIH07XG4gICAgaWYgKHRoaXMuaXNFcXVhbCh1cGRhdGVkLCBfc3RhdGUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gdGhpcy5lbmNvZGUodXBkYXRlZCk7XG4gICAgICBjb25zb2xlLmxvZyhfc3RhdGUpO1xuICAgICAgcmV0dXJuIHVwZGF0ZWQ7XG4gICAgfVxuICB9XG5cbiAgc2V0TWFzdGVyR2FpbihlOiBzdHJpbmcpIHtcbiAgICB0aGlzLnVwZGF0ZSh7IG1hc3RlckdhaW46IGUgfSk7XG4gIH1cbn1cbiIsImltcG9ydCBTcXVhcmVzIGZyb20gXCIuL2dyYXBoaWNzLWVuZ2luZS9zcXVhcmVcIjtcbi8qKlxuICpcbiAqIFdyYXBzIHRoZSBDYW52YXMgY29udGV4dFxuICpcbiAqIFRoaXMgY2xhc3MgaXMgcmVzcG9uc2libGUgZm9yIGxheWluZyBvdXQgdGhlIHNxdWFyZXMgb24gdGhlIGNhbnZhcy5cbiAqXG4gKiBDYWxsIGRyYXcoKSB0byBkcmF3IHRvIHRoZSBjYW52YXMuXG4gKlxuICogSXQgcGFzc2VzIHRoZSBjYW52YXMgY29udGV4IGludG8gYFNxdWFyZXNgc1xuICpcbiAqIGBTcXVhcmVzYHMgZHJhdyB0aGVtc2VsdmVzIG9uIHRoZSBzY3JlZW4uXG4gKi9cbmNsYXNzIEdyYXBoaWNzRW5naW5lIHtcbiAgcHJpdmF0ZSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xuICBwcml2YXRlIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICBwcml2YXRlIHNxdWFyZU9yaWdpbjogW251bWJlciwgbnVtYmVyXTtcbiAgcHJpdmF0ZSBzcXVhcmVTaXplOiBudW1iZXI7XG4gIHByaXZhdGUgc3F1YXJlczogU3F1YXJlc1tdO1xuICBwcml2YXRlIHVuaXRTcXVhcmU6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KSB7XG4gICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgdGhpcy5jdHggPSA8Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEPnRoaXMuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICB0aGlzLnVuaXRTcXVhcmUgPSAzMztcbiAgICB0aGlzLnNxdWFyZU9yaWdpbiA9IDxbbnVtYmVyLCBudW1iZXJdPlt0aGlzLnVuaXRTcXVhcmUsIHRoaXMudW5pdFNxdWFyZV07XG4gICAgdGhpcy5zcXVhcmVTaXplID0gPG51bWJlcj50aGlzLnVuaXRTcXVhcmUgKiAyO1xuICAgIHRoaXMuc3F1YXJlcyA9IDxTcXVhcmVzW10+W1xuICAgICAgbmV3IFNxdWFyZXMoXG4gICAgICAgIHRoaXMuY3R4LFxuICAgICAgICBbXG4gICAgICAgICAgdGhpcy5zcXVhcmVPcmlnaW5bMF0sXG4gICAgICAgICAgdGhpcy5zcXVhcmVPcmlnaW5bMV0sXG4gICAgICAgICAgdGhpcy5zcXVhcmVTaXplLFxuICAgICAgICAgIHRoaXMuc3F1YXJlU2l6ZVxuICAgICAgICBdLFxuICAgICAgICAwXG4gICAgICApLFxuICAgICAgbmV3IFNxdWFyZXMoXG4gICAgICAgIHRoaXMuY3R4LFxuICAgICAgICBbXG4gICAgICAgICAgdGhpcy5zcXVhcmVPcmlnaW5bMF0sXG4gICAgICAgICAgdGhpcy5zcXVhcmVPcmlnaW5bMV0gKyB0aGlzLnVuaXRTcXVhcmUsXG4gICAgICAgICAgdGhpcy5zcXVhcmVTaXplLFxuICAgICAgICAgIHRoaXMuc3F1YXJlU2l6ZVxuICAgICAgICBdLFxuICAgICAgICAxXG4gICAgICApLFxuICAgICAgbmV3IFNxdWFyZXMoXG4gICAgICAgIHRoaXMuY3R4LFxuICAgICAgICBbXG4gICAgICAgICAgdGhpcy5zcXVhcmVPcmlnaW5bMF0gKyB0aGlzLnVuaXRTcXVhcmUsXG4gICAgICAgICAgdGhpcy5zcXVhcmVPcmlnaW5bMV0sXG4gICAgICAgICAgdGhpcy5zcXVhcmVTaXplLFxuICAgICAgICAgIHRoaXMuc3F1YXJlU2l6ZVxuICAgICAgICBdLFxuICAgICAgICAyXG4gICAgICApLFxuICAgICAgbmV3IFNxdWFyZXMoXG4gICAgICAgIHRoaXMuY3R4LFxuICAgICAgICBbXG4gICAgICAgICAgdGhpcy5zcXVhcmVPcmlnaW5bMF0gKyB0aGlzLnVuaXRTcXVhcmUsXG4gICAgICAgICAgdGhpcy5zcXVhcmVPcmlnaW5bMV0gKyB0aGlzLnVuaXRTcXVhcmUsXG4gICAgICAgICAgdGhpcy5zcXVhcmVTaXplLFxuICAgICAgICAgIHRoaXMuc3F1YXJlU2l6ZVxuICAgICAgICBdLFxuICAgICAgICAzXG4gICAgICApLFxuICAgICAgbmV3IFNxdWFyZXMoXG4gICAgICAgIHRoaXMuY3R4LFxuICAgICAgICBbXG4gICAgICAgICAgdGhpcy5zcXVhcmVPcmlnaW5bMF0gKyB0aGlzLnVuaXRTcXVhcmUgKiA0LFxuICAgICAgICAgIHRoaXMuc3F1YXJlT3JpZ2luWzFdLFxuICAgICAgICAgIHRoaXMuc3F1YXJlU2l6ZSxcbiAgICAgICAgICB0aGlzLnNxdWFyZVNpemVcbiAgICAgICAgXSxcbiAgICAgICAgNFxuICAgICAgKSxcbiAgICAgIG5ldyBTcXVhcmVzKFxuICAgICAgICB0aGlzLmN0eCxcbiAgICAgICAgW1xuICAgICAgICAgIHRoaXMuc3F1YXJlT3JpZ2luWzBdICsgdGhpcy51bml0U3F1YXJlICogNCxcbiAgICAgICAgICB0aGlzLnNxdWFyZU9yaWdpblsxXSArIHRoaXMudW5pdFNxdWFyZSxcbiAgICAgICAgICB0aGlzLnNxdWFyZVNpemUsXG4gICAgICAgICAgdGhpcy5zcXVhcmVTaXplXG4gICAgICAgIF0sXG4gICAgICAgIDVcbiAgICAgICksXG4gICAgICBuZXcgU3F1YXJlcyhcbiAgICAgICAgdGhpcy5jdHgsXG4gICAgICAgIFtcbiAgICAgICAgICB0aGlzLnNxdWFyZU9yaWdpblswXSArIHRoaXMudW5pdFNxdWFyZSAqIDUsXG4gICAgICAgICAgdGhpcy5zcXVhcmVPcmlnaW5bMV0sXG4gICAgICAgICAgdGhpcy5zcXVhcmVTaXplLFxuICAgICAgICAgIHRoaXMuc3F1YXJlU2l6ZVxuICAgICAgICBdLFxuICAgICAgICA2XG4gICAgICApLFxuICAgICAgbmV3IFNxdWFyZXMoXG4gICAgICAgIHRoaXMuY3R4LFxuICAgICAgICBbXG4gICAgICAgICAgdGhpcy5zcXVhcmVPcmlnaW5bMF0gKyB0aGlzLnVuaXRTcXVhcmUgKiA1LFxuICAgICAgICAgIHRoaXMuc3F1YXJlT3JpZ2luWzFdICsgdGhpcy51bml0U3F1YXJlLFxuICAgICAgICAgIHRoaXMuc3F1YXJlU2l6ZSxcbiAgICAgICAgICB0aGlzLnNxdWFyZVNpemVcbiAgICAgICAgXSxcbiAgICAgICAgN1xuICAgICAgKVxuICAgIF07XG4gIH1cblxuICBwcml2YXRlIGNsZWFyUmVjdCgpIHtcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gIH1cblxuICBzZXRCbGVuZE1vZGUoYmxlbmRNb2RlOiBzdHJpbmcpIHtcbiAgICB0aGlzLmN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBibGVuZE1vZGU7XG4gIH1cblxuICBkcmF3KCkge1xuICAgIHRoaXMuY2xlYXJSZWN0KCk7XG4gICAgdGhpcy5zcXVhcmVzLmZvckVhY2goY3ViZSA9PiBjdWJlLmRyYXcoKSk7XG4gIH1cblxuICBwbGF5KGluZGV4OiBudW1iZXIsIGNvbG9ySW5kZXg6IG51bWJlciwgdmVsb2NpdHk6IG51bWJlcikge1xuICAgIHRoaXMuc3F1YXJlc1tpbmRleF0ucGxheShjb2xvckluZGV4LCB2ZWxvY2l0eSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR3JhcGhpY3NFbmdpbmU7XG4iLCJ0eXBlIFNxdWFyZVBvc2l0aW9uID0gW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XG50eXBlIFJHQiA9IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcbnR5cGUgUkdCQSA9IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdO1xuXG5jb25zdCBDb2xvcnM6IFJHQltdID0gW1xuICBbMjU1LCAwLCAwXSxcbiAgWzIwNiwgMTU0LCAyNTVdLFxuICBbMjU1LCAyNTUsIDBdLFxuICBbMTAxLCAxMDEsIDE1M10sXG4gIFsyMjcsIDI1MSwgMjU1XSxcbiAgWzE3MiwgMjgsIDJdLFxuICBbMCwgMjA0LCAyNTVdLFxuICBbMjU1LCAxMDEsIDFdLFxuICBbMjU1LCAwLCAyNTVdLFxuICBbNTEsIDIwNCwgNTFdLFxuICBbMTQwLCAxMzgsIDE0MF0sXG4gIFswLCAwLCAyNTRdXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcXVhcmUge1xuICAvKipcbiAgICogQSBTcXVhcmUgdGhhdCBkcmF3cyBpdHNlbGYgb24gdGhlIHNjcmVlbiBhbmQgZmFkZXMgb3V0LlxuICAgKi9cbiAgcHJpdmF0ZSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgcHJpdmF0ZSBwb3NpdGlvbjogU3F1YXJlUG9zaXRpb247XG4gIHByaXZhdGUgYWxwaGE6IG51bWJlcjtcbiAgcHJpdmF0ZSBub3RlOiBudW1iZXI7XG4gIHByaXZhdGUgYWxwaGFTY2FsYXI6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgICBwb3NpdGlvbjogU3F1YXJlUG9zaXRpb24sXG4gICAgbm90ZTogbnVtYmVyXG4gICkge1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICB0aGlzLm5vdGUgPSBub3RlO1xuICAgIHRoaXMuYWxwaGEgPSAwO1xuICAgIHRoaXMuYWxwaGFTY2FsYXIgPSAxMDA7XG4gIH1cblxuICBwbGF5KGRlZ3JlZTogbnVtYmVyLCB2ZWxvY2l0eTogbnVtYmVyKSB7XG4gICAgdGhpcy5hbHBoYSA9IE1hdGgucm91bmQodmVsb2NpdHkpO1xuICAgIHRoaXMubm90ZSA9IGRlZ3JlZTtcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgdGhpcy5kZWNyZW1lbnRBbHBoYSgpO1xuICAgIHRoaXMuZHJhd1JlY3QoKTtcbiAgfVxuXG4gIHByaXZhdGUgZHJhd1JlY3QoKTogdm9pZCB7XG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcigpO1xuICAgIHRoaXMuY3R4LmZpbGxSZWN0KC4uLnRoaXMucG9zaXRpb24pO1xuICB9XG5cbiAgcHJpdmF0ZSBkZWNyZW1lbnRBbHBoYSgpOiB2b2lkIHtcbiAgICB0aGlzLmFscGhhID0gdGhpcy5hbHBoYSA+IDAgPyB0aGlzLmFscGhhIC0gMSA6IHRoaXMuYWxwaGE7XG4gIH1cblxuICBwcml2YXRlIGNvbG9yKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGByZ2JhKCR7dGhpcy5yZ2JhKCkuam9pbihcIixcIil9KWA7XG4gIH1cblxuICBwcml2YXRlIHJnYmEoKTogUkdCQSB7XG4gICAgY29uc3QgW3IsIGcsIGJdID0gQ29sb3JzW3RoaXMubm90ZV07XG4gICAgcmV0dXJuIFtyLCBnLCBiLCB0aGlzLmFscGhhIC8gdGhpcy5hbHBoYVNjYWxhcl07XG4gIH1cbn1cbiIsInR5cGUgRGVncmVlcyA9IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdO1xuXG50eXBlIFNjYWxlID0ge1xuICBba2V5OiBzdHJpbmddOiBEZWdyZWVzO1xuICBJb25pYW46IERlZ3JlZXM7XG4gIEx5ZGlhbjogRGVncmVlcztcbiAgTG9jcmlhbjogRGVncmVlcztcbiAgUGhyeWdpYW46IERlZ3JlZXM7XG4gIEFlb2xlYW46IERlZ3JlZXM7XG4gIERvcmlhbjogRGVncmVlcztcbiAgTWl4b2x5ZGlhbjogRGVncmVlcztcbn07XG5cbmV4cG9ydCBkZWZhdWx0IDxTY2FsZT57XG4gIElvbmlhbjogWzAsIDIsIDQsIDUsIDcsIDksIDExXSxcbiAgTHlkaWFuOiBbMCwgMiwgNCwgNiwgNywgOSwgMTFdLFxuICBMb2NyaWFuOiBbMCwgMSwgMywgNSwgNiwgOCwgMTBdLFxuICBQaHJ5Z2lhbjogWzAsIDEsIDMsIDUsIDcsIDgsIDEwXSxcbiAgQWVvbGVhbjogWzAsIDIsIDMsIDUsIDcsIDgsIDEwXSxcbiAgRG9yaWFuOiBbMCwgMiwgMywgNSwgNywgOSwgMTBdLFxuICBNaXhvbHlkaWFuOiBbMCwgMiwgNCwgNSwgNywgOSwgMTBdXG59O1xuIiwiaW1wb3J0IEN1YmVCb3ggZnJvbSBcIi4vY3ViZS1ib3hcIjtcblxuaW1wb3J0IHsgQ29udHJvbFZhbHVlcywgSGFzaFN0b3JhZ2UgfSBmcm9tIFwiLi9jdWJlLWJveC9jb250cm9sLXZhbHVlc1wiO1xuXG5jb25zdCBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcblxuY29uc3QgdmlzdWFsaXplckNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICBcInZpc3VhbGl6ZXJcIlxuKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbmNvbnN0IGN1YmVCb3ggPSBuZXcgQ3ViZUJveChjYW52YXMsIHZpc3VhbGl6ZXJDYW52YXMsIGF1ZGlvQ29udGV4dCk7XG5jb25zdCBoYXNoU3RvcmFnZSA9IG5ldyBIYXNoU3RvcmFnZSgpO1xuXG5jb25zdCBzZWwgPSAoYTogc3RyaW5nKTogSFRNTElucHV0RWxlbWVudCA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGEpO1xuXG5mdW5jdGlvbiBkcmF3KG5vdzogbnVtYmVyKSB7XG4gIGN1YmVCb3gudGljayhub3cpO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG59XG5cbnJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcblxuY29uc3Qgc2xpZGVyID0gKHM6IHN0cmluZywgb25JbnB1dDogRnVuY3Rpb24sIG9uQ2hhbmdlOiBGdW5jdGlvbikgPT4ge1xuICBjb25zdCBlbGVtID0gc2VsKHMpO1xuICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgb25JbnB1dCBhcyBhbnksIGZhbHNlKTtcbiAgZWxlbS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgb25DaGFuZ2UgYXMgYW55LCBmYWxzZSk7XG59O1xuXG5jb25zdCBzbCA9IChuYW1lOiBzdHJpbmcsIG9uSW5wdXQ6IEZ1bmN0aW9uLCBvbkNoYW5nZTogRnVuY3Rpb24pID0+IHtcbiAgc2xpZGVyKFxuICAgIGBpbnB1dFtuYW1lPScke25hbWV9J11gLFxuICAgIGZ1bmN0aW9uKHRoaXM6IEhUTUxJbnB1dEVsZW1lbnQpIHtcbiAgICAgIG9uSW5wdXQodGhpcy52YWx1ZSk7XG4gICAgfSxcbiAgICBmdW5jdGlvbih0aGlzOiBIVE1MSW5wdXRFbGVtZW50KSB7XG4gICAgICBvbkNoYW5nZSh0aGlzLnZhbHVlKTtcbiAgICB9XG4gICk7XG59O1xuXG5jb25zdCBzcyA9IChuYW1lOiBzdHJpbmcsIG9uSW5wdXQ6IEZ1bmN0aW9uLCBvbkNoYW5nZTogRnVuY3Rpb24pID0+IHtcbiAgc2xpZGVyKFxuICAgIGBzZWxlY3RbbmFtZT0nJHtuYW1lfSddYCxcbiAgICBmdW5jdGlvbih0aGlzOiBIVE1MSW5wdXRFbGVtZW50KSB7XG4gICAgICBvbklucHV0KHRoaXMudmFsdWUpO1xuICAgIH0sXG4gICAgZnVuY3Rpb24odGhpczogSFRNTElucHV0RWxlbWVudCkge1xuICAgICAgb25DaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgfVxuICApO1xufTtcblxuY29uc3Qgc2MgPSAobmFtZTogc3RyaW5nLCBvbklucHV0OiBGdW5jdGlvbiwgb25DaGFuZ2U6IEZ1bmN0aW9uKSA9PiB7XG4gIHNsaWRlcihcbiAgICBgaW5wdXRbbmFtZT0nJHtuYW1lfSddYCxcbiAgICBmdW5jdGlvbih0aGlzOiBIVE1MSW5wdXRFbGVtZW50KSB7XG4gICAgICBvbklucHV0KHRoaXMuY2hlY2tlZCk7XG4gICAgfSxcbiAgICBmdW5jdGlvbih0aGlzOiBIVE1MSW5wdXRFbGVtZW50KSB7XG4gICAgICBvbkNoYW5nZSh0aGlzLmNoZWNrZWQpO1xuICAgIH1cbiAgKTtcbn07XG5cbnNsKFxuICBcIm1hc3RlckdhaW5cIixcbiAgKGU6IHN0cmluZykgPT4gaGFzaFN0b3JhZ2UudXBkYXRlKHsgbWFzdGVyR2FpbjogZSB9KSxcbiAgKGU6IHN0cmluZykgPT4gY3ViZUJveC5hdWRpb0VuZ2luZS5zZXRNYXN0ZXJHYWluKGUpXG4pO1xuXG5zbChcbiAgXCJzZXRNYXN0ZXJGaWx0ZXJWYWx1ZVwiLFxuICAoZTogc3RyaW5nKSA9PiBoYXNoU3RvcmFnZS51cGRhdGUoeyBzZXRNYXN0ZXJGaWx0ZXJWYWx1ZTogZSB9KSxcbiAgKGU6IHN0cmluZykgPT4gY3ViZUJveC5hdWRpb0VuZ2luZS5zZXRNYXN0ZXJGaWx0ZXJWYWx1ZShlKVxuKTtcblxuc2MoXG4gIFwibWFzdGVyQ29udHJvbFN0YXRlXCIsXG4gIChlOiBib29sZWFuKSA9PiB7XG4gICAgY3ViZUJveC5tYXN0ZXJDb250cm9sU3RhdGUgPSBlO1xuICAgIGhhc2hTdG9yYWdlLnVwZGF0ZSh7IG1hc3RlckNvbnRyb2xTdGF0ZTogZSB9KTtcbiAgfSxcbiAgKCkgPT4ge31cbik7XG5cbnNsKFxuICBcImNob3JkT2N0YXZlXCIsXG4gIChlOiBzdHJpbmcpID0+IGhhc2hTdG9yYWdlLnVwZGF0ZSh7IGNob3JkT2N0YXZlOiBwYXJzZUZsb2F0KGUpIH0pLFxuICAoZTogc3RyaW5nKSA9PiAoY3ViZUJveC5jaG9yZE9jdGF2ZSA9IHBhcnNlRmxvYXQoZSkpXG4pO1xuXG5zbChcbiAgXCJzZXREZWNheVRpbWVcIixcbiAgKGU6IG51bWJlcikgPT4gaGFzaFN0b3JhZ2UudXBkYXRlKHsgc2V0RGVjYXlUaW1lOiBlIH0pLFxuICAoZTogbnVtYmVyKSA9PiBjdWJlQm94LmNvbXBvc2l0aW9uRW5naW5lLnNldERlY2F5VGltZShlLnRvU3RyaW5nKCkpXG4pO1xuc2woXG4gIFwiZmlsdGVyRW52ZWxvcGVRXCIsXG4gIChlOiBudW1iZXIpID0+IGhhc2hTdG9yYWdlLnVwZGF0ZSh7IGZpbHRlckVudmVsb3BlUTogZSB9KSxcbiAgKGU6IG51bWJlcikgPT4gKGN1YmVCb3guYXVkaW9FbmdpbmUuZmlsdGVyRW52ZWxvcGVRID0gZSlcbik7XG5cbnNsKFxuICBcImRldHVuZVwiLFxuICAoZTogbnVtYmVyKSA9PiBoYXNoU3RvcmFnZS51cGRhdGUoeyBkZXR1bmU6IGUgfSksXG4gIChlOiBudW1iZXIpID0+IChjdWJlQm94LmNvbXBvc2l0aW9uRW5naW5lLmRldHVuZSA9IGUpXG4pO1xuXG5zbChcbiAgXCJzZXRGaWx0ZXJFbnZlbG9wZVN0YXJ0RnJlcXVlbmN5XCIsXG4gIChlOiBudW1iZXIpID0+IGhhc2hTdG9yYWdlLnVwZGF0ZSh7IHNldEZpbHRlckVudmVsb3BlU3RhcnRGcmVxdWVuY3k6IGUgfSksXG4gIChlOiBudW1iZXIpID0+XG4gICAgY3ViZUJveC5hdWRpb0VuZ2luZS5zZXRGaWx0ZXJFbnZlbG9wZVN0YXJ0RnJlcXVlbmN5KGUudG9TdHJpbmcoKSlcbik7XG5cbnNzKFxuICBcImxmb1dhdmVcIixcbiAgKGU6IHN0cmluZykgPT4gaGFzaFN0b3JhZ2UudXBkYXRlKHsgbGZvV2F2ZTogZSB9KSxcbiAgKGU6IHN0cmluZykgPT4gKGN1YmVCb3guYXVkaW9FbmdpbmUubGZvV2F2ZSA9IGUpXG4pO1xuXG5zbChcbiAgXCJhbXBsaXR1ZGVBdHRhY2tcIixcbiAgKGU6IHN0cmluZykgPT4gaGFzaFN0b3JhZ2UudXBkYXRlKHsgYW1wbGl0dWRlQXR0YWNrOiBwYXJzZUZsb2F0KGUpIH0pLFxuICAoZTogc3RyaW5nKSA9PiAoY3ViZUJveC5hdWRpb0VuZ2luZS5hbXBsaXR1ZGVBdHRhY2sgPSBwYXJzZUZsb2F0KGUpKVxuKTtcblxuc2woXG4gIFwic2V0RmlsdGVyRW52ZWxvcGVTdXN0YWluXCIsXG4gIChlOiBudW1iZXIpID0+IGhhc2hTdG9yYWdlLnVwZGF0ZSh7IHNldEZpbHRlckVudmVsb3BlU3VzdGFpbjogZSB9KSxcbiAgKGU6IG51bWJlcikgPT4gY3ViZUJveC5hdWRpb0VuZ2luZS5zZXRGaWx0ZXJFbnZlbG9wZVN1c3RhaW4oZS50b1N0cmluZygpKVxuKTtcblxuc3MoXG4gIFwib3NjaWFsbHRvclR5cGVcIixcbiAgKGU6IHN0cmluZykgPT4gaGFzaFN0b3JhZ2UudXBkYXRlKHsgb3NjaWFsbHRvclR5cGU6IGUgfSksXG4gIChlOiBzdHJpbmcpID0+IChjdWJlQm94LmNvbXBvc2l0aW9uRW5naW5lLm9zY2lhbGx0b3JUeXBlID0gZSlcbik7XG5cbnNzKFxuICBcInNjYWxlXCIsXG4gIChlOiBzdHJpbmcpID0+IGhhc2hTdG9yYWdlLnVwZGF0ZSh7IHNjYWxlOiBlIH0pLFxuICAoZTogc3RyaW5nKSA9PiAoY3ViZUJveC5zY2FsZSA9IGUpXG4pO1xuXG5zcyhcbiAgXCJzZXRCbGVuZE1vZGVcIixcbiAgKGU6IHN0cmluZykgPT4gaGFzaFN0b3JhZ2UudXBkYXRlKHsgc2V0QmxlbmRNb2RlOiBlIH0pLFxuICAoZTogc3RyaW5nKSA9PiBjdWJlQm94LmdyYXBoaWNzRW5naW5lLnNldEJsZW5kTW9kZShlKVxuKTtcblxuc2woXG4gIFwibGZvQW1vdW50XCIsXG4gIChlOiBudW1iZXIpID0+IGhhc2hTdG9yYWdlLnVwZGF0ZSh7IGxmb0Ftb3VudDogZSB9KSxcbiAgKGU6IG51bWJlcikgPT4gKGN1YmVCb3guYXVkaW9FbmdpbmUubGZvQW1vdW50ID0gZSlcbik7XG5cbnNsKFxuICBcImFtcGxpdHVkZVJlbGVhc2VcIixcbiAgKGU6IG51bWJlcikgPT4gaGFzaFN0b3JhZ2UudXBkYXRlKHsgYW1wbGl0dWRlUmVsZWFzZTogZSB9KSxcbiAgKGU6IG51bWJlcikgPT5cbiAgICAoY3ViZUJveC5hdWRpb0VuZ2luZS5hbXBsaXR1ZGVSZWxlYXNlID0gcGFyc2VGbG9hdChlLnRvU3RyaW5nKCkpKVxuKTtcblxuc2woXG4gIFwic3dpcGVGcmVxdWVuY3lcIixcbiAgKGU6IG51bWJlcikgPT4gaGFzaFN0b3JhZ2UudXBkYXRlKHsgc3dpcGVGcmVxdWVuY3k6IGUgfSksXG4gIChlOiBudW1iZXIpID0+IChjdWJlQm94LnN3aXBlRnJlcXVlbmN5ID0gZSlcbik7XG5cbnNsKFxuICBcInN3aXBlT2N0YXZlXCIsXG4gIChlOiBudW1iZXIpID0+IGhhc2hTdG9yYWdlLnVwZGF0ZSh7IHN3aXBlT2N0YXZlOiBlIH0pLFxuICAoZTogbnVtYmVyKSA9PiAoY3ViZUJveC5zd2lwZU9jdGF2ZSA9IGUpXG4pO1xuXG5zbChcbiAgXCJjaG9yZFZlbG9jaXR5XCIsXG4gIChlOiBudW1iZXIpID0+IGhhc2hTdG9yYWdlLnVwZGF0ZSh7IGNob3JkVmVsb2NpdHk6IGUgfSksXG4gIChlOiBudW1iZXIpID0+IChjdWJlQm94LmNob3JkVmVsb2NpdHkgPSBlKVxuKTtcblxuc2woXG4gIFwic3dpcGVWZWxvY2l0eVwiLFxuICAoZTogbnVtYmVyKSA9PiBoYXNoU3RvcmFnZS51cGRhdGUoeyBzd2lwZVZlbG9jaXR5OiBlIH0pLFxuICAoZTogbnVtYmVyKSA9PiAoY3ViZUJveC5zd2lwZVZlbG9jaXR5ID0gZSlcbik7XG5cbnNjKFxuICBcInN1c3RhaW5cIixcbiAgKGU6IGJvb2xlYW4pID0+IGhhc2hTdG9yYWdlLnVwZGF0ZSh7IHN1c3RhaW46IGUgfSksXG4gIChlOiBib29sZWFuKSA9PiAoY3ViZUJveC5hdWRpb0VuZ2luZS5zdXN0YWluID0gZSlcbik7XG5cbnNsKFxuICBcInNldExmb0ZyZXF1ZW5jeVwiLFxuICAoZTogc3RyaW5nKSA9PiBoYXNoU3RvcmFnZS51cGRhdGUoeyBzZXRMZm9GcmVxdWVuY3k6IGUgfSksXG4gIChlOiBzdHJpbmcpID0+IGN1YmVCb3guYXVkaW9FbmdpbmUuc2V0TGZvRnJlcXVlbmN5KGUpXG4pO1xuXG5zYyhcbiAgXCJoaWRlXCIsXG4gIChlOiBib29sZWFuKSA9PiB7XG4gICAgZGVidWdnZXI7XG4gICAgc2VsKFwiLnNldHRpbmdzQmFyXCIpLmhpZGRlbiA9IHRydWU7XG4gIH0sXG4gIChlOiBib29sZWFuKSA9PiAoY3ViZUJveC5hdWRpb0VuZ2luZS5zdXN0YWluID0gZSlcbik7XG5cbnNlbChcImlucHV0W25hbWU9J2hpZGUnXVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgZG9jdW1lbnRcbiAgICAucXVlcnlTZWxlY3RvckFsbChcIi5zZXR0aW5nc0JhciA+IGRpdlwiKVxuICAgIC5mb3JFYWNoKChlOiBIVE1MRWxlbWVudCkgPT4gKGUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiKSk7XG4gIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgIFwiLnNldHRpbmdzQmFyID4gZGl2Om50aC1jaGlsZCgxKVwiXG4gICkgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG59KTtcblxuc2VsKFwiaW5wdXRbbmFtZT0nc2hvdyddXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICBkb2N1bWVudFxuICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLnNldHRpbmdzQmFyID4gZGl2XCIpXG4gICAgLmZvckVhY2goKGU6IEhUTUxFbGVtZW50KSA9PiAoZS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiKSk7XG4gIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgIFwiLnNldHRpbmdzQmFyID4gZGl2Om50aC1jaGlsZCgxKVwiXG4gICkgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbn0pO1xuXG5mdW5jdGlvbiB0b2dnbGVGdWxsU2NyZWVuKCkge1xuICBpZiAoIWRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50KSB7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKCk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKSB7XG4gICAgICBkb2N1bWVudC5leGl0RnVsbHNjcmVlbigpO1xuICAgIH1cbiAgfVxufVxuXG5zYyhcbiAgXCJmdWxsc2NyZWVuXCIsXG4gIChlOiBib29sZWFuKSA9PiB7XG4gICAgdG9nZ2xlRnVsbFNjcmVlbigpO1xuICB9LFxuICAoZTogYm9vbGVhbikgPT4ge31cbik7XG5cbnNlbChcImlucHV0W25hbWU9J2Z1bGxzY3JlZW4nXVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgZG9jdW1lbnRcbiAgICAucXVlcnlTZWxlY3RvckFsbChcIi5zZXR0aW5nc0JhciA+IGRpdlwiKVxuICAgIC5mb3JFYWNoKChlOiBIVE1MRWxlbWVudCkgPT4gKGUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiKSk7XG4gIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgIFwiLnNldHRpbmdzQmFyID4gZGl2Om50aC1jaGlsZCgxKVwiXG4gICkgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG59KTtcblxuY29uc3Qgcm91dGUgPSAoc3RhdGU6IENvbnRyb2xWYWx1ZXMpID0+IHtcbiAgY3ViZUJveC5hdWRpb0VuZ2luZS5zZXRNYXN0ZXJHYWluKHN0YXRlLm1hc3RlckdhaW4pO1xuICBzZWwoXCJpbnB1dFtuYW1lPSdtYXN0ZXJHYWluJ11cIikudmFsdWUgPSBzdGF0ZS5tYXN0ZXJHYWluO1xuXG4gIGN1YmVCb3guYXVkaW9FbmdpbmUuc2V0TWFzdGVyRmlsdGVyVmFsdWUoc3RhdGUuc2V0TWFzdGVyRmlsdGVyVmFsdWUpO1xuICBzZWwoXCJpbnB1dFtuYW1lPSdzZXRNYXN0ZXJGaWx0ZXJWYWx1ZSddXCIpLnZhbHVlID0gc3RhdGUuc2V0TWFzdGVyRmlsdGVyVmFsdWU7XG5cbiAgY3ViZUJveC5tYXN0ZXJDb250cm9sU3RhdGUgPSBzdGF0ZS5tYXN0ZXJDb250cm9sU3RhdGU7XG4gIHNlbChcImlucHV0W25hbWU9J21hc3RlckNvbnRyb2xTdGF0ZSddXCIpLmNoZWNrZWQgPSBzdGF0ZS5tYXN0ZXJDb250cm9sU3RhdGU7XG5cbiAgY3ViZUJveC5jb21wb3NpdGlvbkVuZ2luZS5zZXREZWNheVRpbWUoc3RhdGUuc2V0RGVjYXlUaW1lKTtcbiAgc2VsKFwiaW5wdXRbbmFtZT0nc2V0RGVjYXlUaW1lJ11cIikudmFsdWUgPSBzdGF0ZS5zZXREZWNheVRpbWU7XG5cbiAgY3ViZUJveC5jaG9yZE9jdGF2ZSA9IHN0YXRlLmNob3JkT2N0YXZlO1xuICBzZWwoXCJpbnB1dFtuYW1lPSdjaG9yZE9jdGF2ZSddXCIpLnZhbHVlID0gc3RhdGUuY2hvcmRPY3RhdmUudG9TdHJpbmcoKTtcblxuICBjdWJlQm94LmF1ZGlvRW5naW5lLnNldExmb0ZyZXF1ZW5jeShzdGF0ZS5zZXRMZm9GcmVxdWVuY3kpO1xuICBzZWwoXCJpbnB1dFtuYW1lPSdzZXRMZm9GcmVxdWVuY3knXVwiKS52YWx1ZSA9IHN0YXRlLnNldExmb0ZyZXF1ZW5jeTtcblxuICBjdWJlQm94LmF1ZGlvRW5naW5lLmZpbHRlckVudmVsb3BlUSA9IHN0YXRlLmZpbHRlckVudmVsb3BlUTtcbiAgc2VsKFwiaW5wdXRbbmFtZT0nZmlsdGVyRW52ZWxvcGVRJ11cIikudmFsdWUgPSBzdGF0ZS5maWx0ZXJFbnZlbG9wZVEudG9TdHJpbmcoKTtcblxuICBjdWJlQm94LmNvbXBvc2l0aW9uRW5naW5lLmRldHVuZSA9IHN0YXRlLmRldHVuZTtcbiAgc2VsKFwiaW5wdXRbbmFtZT0nZGV0dW5lJ11cIikudmFsdWUgPSBzdGF0ZS5kZXR1bmUudG9TdHJpbmcoKTtcblxuICBjdWJlQm94LmF1ZGlvRW5naW5lLnNldEZpbHRlckVudmVsb3BlU3RhcnRGcmVxdWVuY3koXG4gICAgc3RhdGUuc2V0RmlsdGVyRW52ZWxvcGVTdGFydEZyZXF1ZW5jeVxuICApO1xuICBzZWwoXCJpbnB1dFtuYW1lPSdzZXRGaWx0ZXJFbnZlbG9wZVN0YXJ0RnJlcXVlbmN5J11cIikudmFsdWUgPVxuICAgIHN0YXRlLnNldEZpbHRlckVudmVsb3BlU3RhcnRGcmVxdWVuY3k7XG5cbiAgY3ViZUJveC5hdWRpb0VuZ2luZS5sZm9XYXZlID0gc3RhdGUubGZvV2F2ZTtcbiAgc2VsKFwic2VsZWN0W25hbWU9J2xmb1dhdmUnXVwiKS52YWx1ZSA9IHN0YXRlLmxmb1dhdmU7XG5cbiAgY3ViZUJveC5hdWRpb0VuZ2luZS5hbXBsaXR1ZGVBdHRhY2sgPSBzdGF0ZS5hbXBsaXR1ZGVBdHRhY2s7XG4gIHNlbChcImlucHV0W25hbWU9J2FtcGxpdHVkZUF0dGFjayddXCIpLnZhbHVlID0gc3RhdGUuYW1wbGl0dWRlQXR0YWNrLnRvU3RyaW5nKCk7XG5cbiAgY3ViZUJveC5hdWRpb0VuZ2luZS5zZXRGaWx0ZXJFbnZlbG9wZVN1c3RhaW4oc3RhdGUuc2V0RmlsdGVyRW52ZWxvcGVTdXN0YWluKTtcbiAgc2VsKFxuICAgIFwiaW5wdXRbbmFtZT0nc2V0RmlsdGVyRW52ZWxvcGVTdXN0YWluJ11cIlxuICApLnZhbHVlID0gc3RhdGUuc2V0RmlsdGVyRW52ZWxvcGVTdXN0YWluLnRvU3RyaW5nKCk7XG5cbiAgY3ViZUJveC5jb21wb3NpdGlvbkVuZ2luZS5vc2NpYWxsdG9yVHlwZSA9IHN0YXRlLm9zY2lhbGx0b3JUeXBlO1xuICBzZWwoXCJzZWxlY3RbbmFtZT0nb3NjaWFsbHRvclR5cGUnXVwiKS52YWx1ZSA9IHN0YXRlLm9zY2lhbGx0b3JUeXBlO1xuXG4gIGN1YmVCb3guc2NhbGUgPSBzdGF0ZS5zY2FsZTtcbiAgc2VsKFwic2VsZWN0W25hbWU9J3NjYWxlJ11cIikudmFsdWUgPSBzdGF0ZS5zY2FsZTtcblxuICBjdWJlQm94LmdyYXBoaWNzRW5naW5lLnNldEJsZW5kTW9kZShzdGF0ZS5zZXRCbGVuZE1vZGUpO1xuICBzZWwoXCJzZWxlY3RbbmFtZT0nc2V0QmxlbmRNb2RlJ11cIikudmFsdWUgPSBzdGF0ZS5zZXRCbGVuZE1vZGU7XG5cbiAgY3ViZUJveC5hdWRpb0VuZ2luZS5sZm9BbW91bnQgPSBzdGF0ZS5sZm9BbW91bnQ7XG4gIHNlbChcImlucHV0W25hbWU9J2xmb0Ftb3VudCddXCIpLnZhbHVlID0gc3RhdGUubGZvQW1vdW50LnRvU3RyaW5nKCk7XG5cbiAgY3ViZUJveC5hdWRpb0VuZ2luZS5hbXBsaXR1ZGVSZWxlYXNlID0gcGFyc2VGbG9hdChcbiAgICBzdGF0ZS5hbXBsaXR1ZGVSZWxlYXNlLnRvU3RyaW5nKClcbiAgKTtcbiAgc2VsKFxuICAgIFwiaW5wdXRbbmFtZT0nYW1wbGl0dWRlUmVsZWFzZSddXCJcbiAgKS52YWx1ZSA9IHN0YXRlLmFtcGxpdHVkZVJlbGVhc2UudG9TdHJpbmcoKTtcblxuICBjdWJlQm94LnN3aXBlRnJlcXVlbmN5ID0gc3RhdGUuc3dpcGVGcmVxdWVuY3k7XG4gIHNlbChcImlucHV0W25hbWU9J3N3aXBlRnJlcXVlbmN5J11cIikudmFsdWUgPSBzdGF0ZS5zd2lwZUZyZXF1ZW5jeS50b1N0cmluZygpO1xuXG4gIGN1YmVCb3guc3dpcGVPY3RhdmUgPSBzdGF0ZS5zd2lwZU9jdGF2ZTtcbiAgc2VsKFwiaW5wdXRbbmFtZT0nc3dpcGVPY3RhdmUnXVwiKS52YWx1ZSA9IHN0YXRlLnN3aXBlT2N0YXZlLnRvU3RyaW5nKCk7XG5cbiAgY3ViZUJveC5jaG9yZFZlbG9jaXR5ID0gc3RhdGUuY2hvcmRWZWxvY2l0eTtcbiAgc2VsKFwiaW5wdXRbbmFtZT0nY2hvcmRWZWxvY2l0eSddXCIpLnZhbHVlID0gc3RhdGUuY2hvcmRWZWxvY2l0eS50b1N0cmluZygpO1xuXG4gIGN1YmVCb3guc3dpcGVWZWxvY2l0eSA9IHN0YXRlLnN3aXBlVmVsb2NpdHk7XG4gIHNlbChcImlucHV0W25hbWU9J3N3aXBlVmVsb2NpdHknXVwiKS52YWx1ZSA9IHN0YXRlLnN3aXBlVmVsb2NpdHkudG9TdHJpbmcoKTtcblxuICBjdWJlQm94LmF1ZGlvRW5naW5lLnN1c3RhaW4gPSBzdGF0ZS5zdXN0YWluO1xuICBzZWwoXCJpbnB1dFtuYW1lPSdzdXN0YWluJ11cIikudmFsdWUgPSBzdGF0ZS5zdXN0YWluLnRvU3RyaW5nKCk7XG59O1xuXG4vLyByb3V0ZSBvbmNlIG9uIHBhZ2UgbG9hZFxucm91dGUoaGFzaFN0b3JhZ2Uuc3RhdGUoKSk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImhhc2hjaGFuZ2VcIiwgKCkgPT4gcm91dGUoaGFzaFN0b3JhZ2Uuc3RhdGUoKSksIGZhbHNlKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=
