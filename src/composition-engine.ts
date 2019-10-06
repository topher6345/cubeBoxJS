import { urnJB } from "./composition-engine/random";
import { noteFreq, Octave } from "./composition-engine/note-table";
import AudioEngine from "./audio-engine";

export default class CompositionEngine {
  /**
   * CompositionEngine is a subsystem that decides which notes to play and when.
   *
   * It has an audioEngine property which exposes a notePressed() method
   *
   * CompositionEngine is responsible for what goes in as the arguments to notePressed()
   *
   */
  public chordSpeed: number;
  public chordVoices: Generator[];
  public swipeVoices: Generator[];
  public globalRoot: number;
  public oscialltorType: string;
  public decayTime: number;
  public detune: number;

  private noteFrequencies: Octave[];

  private audioEngine: AudioEngine;

  constructor(audioEngine: AudioEngine, oscialltorType: string) {
    this.noteFrequencies = noteFreq;
    this.decayTime = 4;
    this.chordSpeed = this.decayTime * 1000; //ms
    this.chordVoices = [urnJB(7), urnJB(7), urnJB(7), urnJB(7)];
    this.swipeVoices = [urnJB(7), urnJB(7), urnJB(7), urnJB(7)];

    this.oscialltorType = oscialltorType;
    this.audioEngine = audioEngine;
    this.detune = 0;
  }

  setDecayTime(decayTime: number) {
    this.decayTime = decayTime;
    this.chordSpeed = this.decayTime * 1000; //ms
  }

  notePressed(note: number, octave: number, delay: number) {
    const stringNote: string = Object.keys(this.noteFrequencies[octave])[note];
    const frequency = this.noteFrequencies[octave][stringNote.toString()];

    this.audioEngine.playTone(
      frequency,
      -this.detune,
      delay,
      this.decayTime,
      this.oscialltorType
    );
    this.audioEngine.playTone(
      frequency,
      this.detune,
      delay,
      this.decayTime,
      this.oscialltorType
    );
  }
}
