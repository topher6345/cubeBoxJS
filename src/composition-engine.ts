import { urnJB } from "./random";
import { createNoteTable, Octave } from "./note-table";

const CompositionEngine: any = {};
CompositionEngine.NOTE_FREQUENCIES = <Octave[]>createNoteTable();
CompositionEngine.decayTime = 4;
CompositionEngine.chordSpeed = CompositionEngine.decayTime * 1000; //ms
CompositionEngine.chordVoices = <Array<Generator>>[
  urnJB(7),
  urnJB(7),
  urnJB(7),
  urnJB(7)
];
CompositionEngine.swipeVoices = <Array<Generator>>[
  urnJB(7),
  urnJB(7),
  urnJB(7),
  urnJB(7)
];
CompositionEngine.globalRoot = 3;

CompositionEngine.notePressed = function(
  note: number,
  octave: number,
  delay: number
) {
  const stringNote: string = Object.keys(
    CompositionEngine.NOTE_FREQUENCIES[octave]
  )[note];
  const frequency =
    CompositionEngine.NOTE_FREQUENCIES[octave][stringNote.toString()];

  CompositionEngine.audioEngine.playTone(frequency, -5, delay);
  CompositionEngine.audioEngine.playTone(frequency, 5, delay);
};

export default CompositionEngine;
