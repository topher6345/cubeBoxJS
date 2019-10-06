import { urnJB } from "./random";
import { noteFreq, Octave } from "./note-table";

class CompositionEngine {
  NOTE_FREQUENCIES: Octave[];
  decayTime: number;
  chordSpeed: number;
  chordVoices: Generator[];
  swipeVoices: Generator[];
  globalRoot: number;
  audioEngine: any;

  constructor() {
    this.NOTE_FREQUENCIES = noteFreq;
    this.decayTime = 4;
    this.chordSpeed = this.decayTime * 1000; //ms
    this.chordVoices = [urnJB(7), urnJB(7), urnJB(7), urnJB(7)];
    this.swipeVoices = [urnJB(7), urnJB(7), urnJB(7), urnJB(7)];
    this.globalRoot = 3;
  }

  notePressed(note: number, octave: number, delay: number) {
    const stringNote: string = Object.keys(this.NOTE_FREQUENCIES[octave])[note];
    const frequency = this.NOTE_FREQUENCIES[octave][stringNote.toString()];

    this.audioEngine.playTone(frequency, -5, delay, this.decayTime);
    this.audioEngine.playTone(frequency, 5, delay, this.decayTime);
  }
}

export default new CompositionEngine();
