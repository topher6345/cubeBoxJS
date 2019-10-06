import { urnJB } from "./random";
import { noteFreq, Octave } from "./note-table";
import AudioEngine from "./audio-engine";

class CompositionEngine {
  public chordSpeed: number;
  public chordVoices: Generator[];
  public swipeVoices: Generator[];
  public globalRoot: number;
  public oscialltorType: string;

  private noteFrequencies: Octave[];
  private decayTime: number;
  private audioEngine: AudioEngine;

  constructor(audioEngine: AudioEngine, oscialltorType: string) {
    this.noteFrequencies = noteFreq;
    this.decayTime = 4;
    this.chordSpeed = this.decayTime * 1000; //ms
    this.chordVoices = [urnJB(7), urnJB(7), urnJB(7), urnJB(7)];
    this.swipeVoices = [urnJB(7), urnJB(7), urnJB(7), urnJB(7)];
    this.globalRoot = 3;
    this.oscialltorType = oscialltorType;
    this.audioEngine = audioEngine;
  }

  notePressed(note: number, octave: number, delay: number) {
    const stringNote: string = Object.keys(this.noteFrequencies[octave])[note];
    const frequency = this.noteFrequencies[octave][stringNote.toString()];

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
}

export default CompositionEngine;
