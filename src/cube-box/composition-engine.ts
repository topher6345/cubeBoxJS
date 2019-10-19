import urnJB from "./composition-engine/random";
import NoteTable from "./composition-engine/note-table";
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

  private noteTable: NoteTable;
  private audioEngine: AudioEngine;

  constructor(audioEngine: AudioEngine) {
    this.decayTime = 4;
    this.chordSpeed = this.decayTime * 1000; //ms
    this.chordVoices = [urnJB(7), urnJB(7), urnJB(7), urnJB(7)];
    this.swipeVoices = [urnJB(7), urnJB(7), urnJB(7), urnJB(7)];

    this.audioEngine = audioEngine;

    this.noteTable = new NoteTable();
    this.detune = 0;
    this.globalRoot = 3;

    this.oscialltorType = "sawtooth";
  }

  setDecayTime(decayTime: string) {
    this.decayTime = parseFloat(decayTime);
    this.chordSpeed = this.decayTime * 1000; //ms
  }

  notePressed(
    note: number,
    octave: number,
    startTime: number,
    velocity: number
  ) {
    const frequency = this.noteTable.getNoteFrequency(note, octave);

    this.audioEngine.playTone(
      startTime,
      this.decayTime,
      frequency,
      -this.detune,
      this.oscialltorType,
      velocity
    );
    this.audioEngine.playTone(
      startTime,
      this.decayTime,
      frequency,
      this.detune,
      this.oscialltorType,
      velocity
    );
  }
}
