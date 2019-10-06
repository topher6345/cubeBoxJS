let masterControlState = true;

import { SCALES } from "./scales";
import { urnJB } from "./random";
import fetchBuffer from "./fetch-buffer";
import Cube from "./cube";
import { createNoteTable, Octave } from "./note-table";
import CubeBox from "./cube-box";
import CompositionEngine from "./composition-engine";

const AudioEngine: any = {};
AudioEngine.AUDIO_CONTEXT = new AudioContext();
AudioEngine.convolver = AudioEngine.AUDIO_CONTEXT.createConvolver();
AudioEngine.convolver.buffer = fetchBuffer(
  "media/concert-crowd.ogg",
  AudioEngine.AUDIO_CONTEXT
);
AudioEngine.MASTER_GAIN_NODE = <GainNode>AudioEngine.AUDIO_CONTEXT.createGain();
AudioEngine.MASTER_GAIN_NODE.connect(AudioEngine.AUDIO_CONTEXT.destination);
AudioEngine.MASTER_BIQUAD_FILTER = AudioEngine.AUDIO_CONTEXT.createBiquadFilter();
AudioEngine.MASTER_BIQUAD_FILTER.type = "lowpass";
AudioEngine.MASTER_BIQUAD_FILTER.frequency.setValueAtTime(
  12000,
  AudioEngine.AUDIO_CONTEXT.currentTime
);
AudioEngine.MASTER_BIQUAD_FILTER.Q.value = 0.01;

AudioEngine.MASTER_BIQUAD_FILTER.connect(AudioEngine.MASTER_GAIN_NODE);

AudioEngine.sineTerms = new Float32Array([0, 0, 1, 0, 1]);
AudioEngine.cosineTerms = new Float32Array(AudioEngine.sineTerms.length);

AudioEngine.customWaveform = <PeriodicWave>(
  AudioEngine.AUDIO_CONTEXT.createPeriodicWave(
    AudioEngine.cosineTerms,
    AudioEngine.sineTerms
  )
);

AudioEngine.playTone = function(freq: number, detune: number, delay: number) {
  const expZero = 0.00000001;
  const lfoFreq = 0.01;
  const osc: OscillatorNode = AudioEngine.AUDIO_CONTEXT.createOscillator();
  const sine = AudioEngine.AUDIO_CONTEXT.createOscillator();
  sine.type = "sine";
  sine.frequency.value = lfoFreq;

  const sineGain = AudioEngine.AUDIO_CONTEXT.createGain();
  sineGain.gain.value = 3;
  const ADSRNode = AudioEngine.AUDIO_CONTEXT.createGain();
  const biquadFilter = AudioEngine.AUDIO_CONTEXT.createBiquadFilter();
  const biquadFilterQValue = 0.01;
  const biquadFilterInitCutoffFreq = 12000;
  const biquadFilterADSRS = 1000;

  biquadFilter.type = "lowpass";
  biquadFilter.frequency.setValueAtTime(
    biquadFilterInitCutoffFreq,
    AudioEngine.AUDIO_CONTEXT.currentTime
  );
  biquadFilter.Q.value = biquadFilterQValue;

  biquadFilter.frequency.exponentialRampToValueAtTime(
    biquadFilterADSRS,
    AudioEngine.AUDIO_CONTEXT.currentTime + delay + 1
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
  biquadFilter.connect(AudioEngine.MASTER_BIQUAD_FILTER);

  const type: string = UI.wavePicker.options[UI.wavePicker.selectedIndex].value;

  if (type == "custom") {
    osc.setPeriodicWave(AudioEngine.customWaveform);
  } else {
    osc.type = <OscillatorType>type;
  }

  ADSRNode.gain.cancelScheduledValues(
    AudioEngine.AUDIO_CONTEXT.currentTime + delay
  );
  ADSRNode.gain.setValueAtTime(
    0,
    AudioEngine.AUDIO_CONTEXT.currentTime + delay
  );
  ADSRNode.gain.linearRampToValueAtTime(
    1,
    AudioEngine.AUDIO_CONTEXT.currentTime + delay + 0.1
  );

  osc.frequency.value = freq;
  osc.detune.setValueAtTime(
    detune,
    AudioEngine.AUDIO_CONTEXT.currentTime + delay
  );
  sine.start(AudioEngine.AUDIO_CONTEXT.currentTime + delay);
  osc.start(AudioEngine.AUDIO_CONTEXT.currentTime + delay);

  ADSRNode.gain.exponentialRampToValueAtTime(
    expZero,
    AudioEngine.AUDIO_CONTEXT.currentTime +
      delay +
      CompositionEngine.decayTime +
      0.2
  );
  osc.stop(
    AudioEngine.AUDIO_CONTEXT.currentTime + CompositionEngine.decayTime + delay
  );
  sine.stop(
    AudioEngine.AUDIO_CONTEXT.currentTime + CompositionEngine.decayTime + delay
  );
};

AudioEngine.notePressed = function(
  note: number,
  octave: number,
  delay: number
) {
  const stringNote: string = Object.keys(
    CompositionEngine.NOTE_FREQUENCIES[octave]
  )[note];
  const frequency =
    CompositionEngine.NOTE_FREQUENCIES[octave][stringNote.toString()];

  AudioEngine.playTone(frequency, -5, delay);
  AudioEngine.playTone(frequency, 5, delay);
};

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
    AudioEngine.MASTER_GAIN_NODE.gain.value = parseFloat(
      UI.volumeControl.value
    );
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
    AudioEngine.MASTER_BIQUAD_FILTER.frequency.setValueAtTime(
      parseFloat(UI.filterControl.value),
      AudioEngine.AUDIO_CONTEXT.currentTime
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
