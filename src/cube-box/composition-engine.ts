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

  constructor(audioEngine: AudioEngine) {
    this.noteFrequencies = noteFreq;
    this.decayTime = 4;
    this.chordSpeed = this.decayTime * 1000; //ms
    this.chordVoices = [urnJB(7), urnJB(7), urnJB(7), urnJB(7)];
    this.swipeVoices = [urnJB(7), urnJB(7), urnJB(7), urnJB(7)];

    this.audioEngine = audioEngine;
    this.detune = 0;
    this.globalRoot = 3;
  }

  setDecayTime(decayTime: string) {
    this.decayTime = parseFloat(decayTime);
    this.chordSpeed = this.decayTime * 1000; //ms
  }

  notePressed(note: number, delay: number) {
    const stringNote = this.getStringNote(note);
    const frequency = this.getNoteFrequencies(stringNote);

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

  private getStringNote(note: number) {
    return Object.keys(this.noteFrequencies[this.globalRoot])[note];
  }

  private getNoteFrequencies(note: string) {
    return this.noteFrequencies[this.globalRoot][note];
  }
}
