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

export default CompositionEngine;
