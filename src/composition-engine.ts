import { urnJB } from "./random";
import { createNoteTable, Octave } from "./note-table";

class CompositionEngine {
  NOTE_FREQUENCIES: Octave[];
  decayTime: number;
  chordSpeed: number;
  chordVoices: Generator[];
  swipeVoices: Generator[];
  globalRoot: number;
  audioEngine: any;

  constructor() {
    this.NOTE_FREQUENCIES = <Octave[]>createNoteTable();
    this.decayTime = 4;
    this.chordSpeed = this.decayTime * 1000; //ms
    this.chordVoices = <Array<Generator>>[
      urnJB(7),
      urnJB(7),
      urnJB(7),
      urnJB(7)
    ];
    this.swipeVoices = <Array<Generator>>[
      urnJB(7),
      urnJB(7),
      urnJB(7),
      urnJB(7)
    ];
    this.globalRoot = 3;
  }

  notePressed(note: number, octave: number, delay: number) {
    const stringNote: string = Object.keys(this.NOTE_FREQUENCIES[octave])[note];
    const frequency = this.NOTE_FREQUENCIES[octave][stringNote.toString()];

    this.audioEngine.playTone(frequency, -5, delay);
    this.audioEngine.playTone(frequency, 5, delay);
  }
}

export default new CompositionEngine();
