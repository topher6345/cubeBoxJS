let masterControlState = true;

import { SCALES } from "./scales";
import cubeBox from "./cube-box";
import CompositionEngine from "./composition-engine";

class AudioEngine {
  ctx: AudioContext;
  masterGain: GainNode;
  masterFilter: BiquadFilterNode;
  sineTerms: Float32Array;
  cosineTerms: Float32Array;
  customWaveform: PeriodicWave;

  constructor() {
    this.ctx = new AudioContext();
    this.masterGain = <GainNode>this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterFilter = this.ctx.createBiquadFilter();
    this.masterFilter.type = "lowpass";
    this.masterFilter.frequency.setValueAtTime(12000, this.ctx.currentTime);
    this.masterFilter.Q.value = 0.01;

    this.masterFilter.connect(this.masterGain);

    this.sineTerms = new Float32Array([0, 0, 1, 0, 1]);
    this.cosineTerms = new Float32Array(this.sineTerms.length);
    this.masterFilter.connect(this.masterGain);

    this.customWaveform = <PeriodicWave>(
      this.ctx.createPeriodicWave(this.cosineTerms, this.sineTerms)
    );
  }

  playTone(freq: number, detune: number, delay: number, decayTime: number) {
    const expZero = 0.00000001;
    const lfoFreq = 0.01;
    const osc: OscillatorNode = this.ctx.createOscillator();
    const sine = this.ctx.createOscillator();
    sine.type = "sine";
    sine.frequency.value = lfoFreq;

    const sineGain = this.ctx.createGain();
    sineGain.gain.value = 3;
    const ADSRNode = this.ctx.createGain();
    const biquadFilter = this.ctx.createBiquadFilter();
    const biquadFilterQValue = 0.01;
    const biquadFilterInitCutoffFreq = 12000;
    const filterEnvelopeSustain = 1000;
    const currentTime = this.ctx.currentTime;

    biquadFilter.type = "lowpass";
    biquadFilter.frequency.setValueAtTime(
      biquadFilterInitCutoffFreq,
      currentTime
    );
    biquadFilter.Q.value = biquadFilterQValue;

    biquadFilter.frequency.exponentialRampToValueAtTime(
      filterEnvelopeSustain,
      currentTime + delay + 1
    );

    // sine -> sineGain
    //            |
    //          frequency
    //            |
    //           osc -> ADSRNode -> biquatFilter -> masterFilter
    sine.connect(sineGain);
    sineGain.connect(osc.frequency);
    osc.connect(ADSRNode);
    ADSRNode.connect(biquadFilter);
    biquadFilter.connect(this.masterFilter);

    const type: string =
      UI.wavePicker.options[UI.wavePicker.selectedIndex].value;

    if (type == "custom") {
      osc.setPeriodicWave(this.customWaveform);
    } else {
      osc.type = <OscillatorType>type;
    }

    ADSRNode.gain.cancelScheduledValues(currentTime + delay);
    ADSRNode.gain.setValueAtTime(0, currentTime + delay);
    ADSRNode.gain.linearRampToValueAtTime(1, currentTime + delay + 0.1);

    osc.frequency.value = freq;
    osc.detune.setValueAtTime(detune, currentTime + delay);
    sine.start(currentTime + delay);
    osc.start(currentTime + delay);

    ADSRNode.gain.exponentialRampToValueAtTime(
      expZero,
      currentTime + delay + decayTime + 0.2
    );
    osc.stop(currentTime + decayTime + delay);
    sine.stop(currentTime + decayTime + delay);
  }
}

const audioEngine = new AudioEngine();

CompositionEngine.audioEngine = audioEngine;

const UI: any = {};
UI.wavePicker = <HTMLSelectElement>(
  document.querySelector("select[name='waveform']")
);

UI.volumeControl = <HTMLInputElement>(
  document.querySelector("input[name='volume']")
);
UI.volumeControl.addEventListener(
  "change",
  () => {
    audioEngine.masterGain.gain.value = parseFloat(UI.volumeControl.value);
  },
  false
);

UI.masterControl = <HTMLInputElement>(
  document.querySelector("input[name='masterClock']")
);
UI.masterControl.addEventListener(
  "change",
  () => {
    masterControlState = UI.masterControl.checked;
  },
  false
);

UI.scalePicker = <HTMLSelectElement>(
  document.querySelector("select[name='scale']")
);

UI.filterControl = <HTMLInputElement>(
  document.querySelector("input[name='filter']")
);
UI.filterControl.addEventListener(
  "change",
  () => {
    audioEngine.masterFilter.frequency.setValueAtTime(
      parseFloat(UI.filterControl.value),
      audioEngine.ctx.currentTime
    );
  },
  false
);

let then: number = null;
function main(now: number) {
  if (!then) then = now;

  // Every chordSpeed milliseconds
  if (
    (!then || now - then > CompositionEngine.chordSpeed) &&
    masterControlState
  ) {
    CompositionEngine.chordVoices.forEach((voice: Generator, index: number) => {
      const scaleDegree = voice.next().value;
      if (scaleDegree) {
        const colorIndex = SCALES[UI.scalePicker.value][scaleDegree];
        CompositionEngine.notePressed(
          colorIndex,
          CompositionEngine.globalRoot,
          0
        );
        cubeBox.play(index, colorIndex);
      }
    });

    CompositionEngine.swipeVoices.forEach((voice: Generator, index: number) => {
      const scaleDegree = voice.next().value;
      const swipeFrequency = 0.4;
      if (scaleDegree) {
        const colorIndex = SCALES[UI.scalePicker.value][scaleDegree];
        CompositionEngine.notePressed(
          colorIndex,
          CompositionEngine.globalRoot,
          index * swipeFrequency
        );
        setTimeout(
          () => cubeBox.play(index + 4, colorIndex),
          index * swipeFrequency * 1000
        );
      }
    });
    then = now;
  }
  cubeBox.draw();
  requestAnimationFrame(main);
  return;
}

requestAnimationFrame(main);
