let masterControlState = true;

import { SCALES } from "./scales";
import CubeBox from "./cube-box";
import CompositionEngine from "./composition-engine";

const AudioEngine: any = {};
AudioEngine.ctx = new AudioContext();
AudioEngine.masterGain = <GainNode>AudioEngine.ctx.createGain();
AudioEngine.masterGain.connect(AudioEngine.ctx.destination);
AudioEngine.masterFilter = AudioEngine.ctx.createBiquadFilter();
AudioEngine.masterFilter.type = "lowpass";
AudioEngine.masterFilter.frequency.setValueAtTime(
  12000,
  AudioEngine.ctx.currentTime
);
AudioEngine.masterFilter.Q.value = 0.01;

AudioEngine.masterFilter.connect(AudioEngine.masterGain);

AudioEngine.sineTerms = new Float32Array([0, 0, 1, 0, 1]);
AudioEngine.cosineTerms = new Float32Array(AudioEngine.sineTerms.length);
AudioEngine.masterFilter.connect(AudioEngine.masterGain);

AudioEngine.customWaveform = <PeriodicWave>(
  AudioEngine.ctx.createPeriodicWave(
    AudioEngine.cosineTerms,
    AudioEngine.sineTerms
  )
);

AudioEngine.playTone = function(freq: number, detune: number, delay: number) {
  const expZero = 0.00000001;
  const lfoFreq = 0.01;
  const osc: OscillatorNode = AudioEngine.ctx.createOscillator();
  const sine = AudioEngine.ctx.createOscillator();
  sine.type = "sine";
  sine.frequency.value = lfoFreq;

  const sineGain = AudioEngine.ctx.createGain();
  sineGain.gain.value = 3;
  const ADSRNode = AudioEngine.ctx.createGain();
  const biquadFilter = AudioEngine.ctx.createBiquadFilter();
  const biquadFilterQValue = 0.01;
  const biquadFilterInitCutoffFreq = 12000;
  const biquadFilterADSRS = 1000;

  biquadFilter.type = "lowpass";
  biquadFilter.frequency.setValueAtTime(
    biquadFilterInitCutoffFreq,
    AudioEngine.ctx.currentTime
  );
  biquadFilter.Q.value = biquadFilterQValue;

  biquadFilter.frequency.exponentialRampToValueAtTime(
    biquadFilterADSRS,
    AudioEngine.ctx.currentTime + delay + 1
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
  biquadFilter.connect(AudioEngine.masterFilter);

  const type: string = UI.wavePicker.options[UI.wavePicker.selectedIndex].value;

  if (type == "custom") {
    osc.setPeriodicWave(AudioEngine.customWaveform);
  } else {
    osc.type = <OscillatorType>type;
  }

  ADSRNode.gain.cancelScheduledValues(AudioEngine.ctx.currentTime + delay);
  ADSRNode.gain.setValueAtTime(0, AudioEngine.ctx.currentTime + delay);
  ADSRNode.gain.linearRampToValueAtTime(
    1,
    AudioEngine.ctx.currentTime + delay + 0.1
  );

  osc.frequency.value = freq;
  osc.detune.setValueAtTime(detune, AudioEngine.ctx.currentTime + delay);
  sine.start(AudioEngine.ctx.currentTime + delay);
  osc.start(AudioEngine.ctx.currentTime + delay);

  ADSRNode.gain.exponentialRampToValueAtTime(
    expZero,
    AudioEngine.ctx.currentTime + delay + CompositionEngine.decayTime + 0.2
  );
  osc.stop(AudioEngine.ctx.currentTime + CompositionEngine.decayTime + delay);
  sine.stop(AudioEngine.ctx.currentTime + CompositionEngine.decayTime + delay);
};

CompositionEngine.audioEngine = AudioEngine;

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
    AudioEngine.masterGain.gain.value = parseFloat(UI.volumeControl.value);
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
    AudioEngine.masterFilter.frequency.setValueAtTime(
      parseFloat(UI.filterControl.value),
      AudioEngine.ctx.currentTime
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
        CubeBox.play(index, colorIndex);
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
          () => CubeBox.play(index + 4, colorIndex),
          index * swipeFrequency * 1000
        );
      }
    });
    then = now;
  }
  CubeBox.draw();
  requestAnimationFrame(main);
  return;
}

requestAnimationFrame(main);
