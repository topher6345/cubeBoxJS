import { urnJB } from "./random";
import { noteFreq, Octave } from "./note-table";
import AudioEngine from "./audio-engine";
import { SCALES } from "./scales";

class CompositionEngine {
  NOTE_FREQUENCIES: Octave[];
  decayTime: number;
  chordSpeed: number;
  chordVoices: Generator[];
  swipeVoices: Generator[];
  globalRoot: number;
  audioEngine: any;
  oscialltorType: string;

  constructor(audioEngine: AudioEngine, oscialltorType: string) {
    this.NOTE_FREQUENCIES = noteFreq;
    this.decayTime = 4;
    this.chordSpeed = this.decayTime * 1000; //ms
    this.chordVoices = [urnJB(7), urnJB(7), urnJB(7), urnJB(7)];
    this.swipeVoices = [urnJB(7), urnJB(7), urnJB(7), urnJB(7)];
    this.globalRoot = 3;
    this.oscialltorType = oscialltorType;
    this.audioEngine = audioEngine;
  }

  notePressed(note: number, octave: number, delay: number) {
    const stringNote: string = Object.keys(this.NOTE_FREQUENCIES[octave])[note];
    const frequency = this.NOTE_FREQUENCIES[octave][stringNote.toString()];

    this.audioEngine.playTone(
      frequency,
      -5,
      delay,
      this.decayTime,
      this.oscialltorType
    );
    this.audioEngine.playTone(
      frequency,
      5,
      delay,
      this.decayTime,
      this.oscialltorType
    );
  }

  playAllChordVoices(scalePickerValue: string, callback: any) {
    this.chordVoices.forEach((voice: Generator, index: number) => {
      const scaleDegree = voice.next().value;
      if (scaleDegree) {
        const colorIndex = SCALES[scalePickerValue][scaleDegree];
        this.notePressed(colorIndex, this.globalRoot, 0);
        callback(index, colorIndex);
      }
    });
  }

  playAllSwipeVoices(scalePickerValue: string, callback: any) {
    this.swipeVoices.forEach((voice: Generator, index: number) => {
      const scaleDegree = voice.next().value;
      const swipeFrequency = 0.4;
      if (scaleDegree) {
        const colorIndex = SCALES[scalePickerValue][scaleDegree];
        this.notePressed(colorIndex, this.globalRoot, index * swipeFrequency);
        setTimeout(
          () => callback(index + 4, colorIndex),
          index * swipeFrequency * 1000
        );
      }
    });
  }
}

export default CompositionEngine;
