export type ControlValues = {
  masterGain: string;
  setMasterFilterValue: string;
  masterControlState: boolean;
  setDecayTime: string;
  chordOctave: number;
  setLfoFrequency: string;
  filterEnvelopeQ: number;
  detune: number;
  setFilterEnvelopeStartFrequency: string;
  lfoWave: string;
  amplitudeAttack: number;
  setFilterEnvelopeSustain: string;
  oscialltorType: string;
  scale: string;
  setBlendMode: string;
  lfoAmount: number;
  amplitudeRelease: number;
  swipeFrequency: number;
  swipeOctave: number;
  chordVelocity: number;
  swipeVelocity: number;
  sustain: boolean;
};

const INIT_CONTROL_VALUES: ControlValues = {
  masterGain: "0.34",
  setMasterFilterValue: "0.22",
  masterControlState: true,
  setDecayTime: "4",
  chordOctave: 3,
  setLfoFrequency: "0.89",
  filterEnvelopeQ: 0.1,
  detune: "2",
  setFilterEnvelopeStartFrequency: "18500",
  lfoWave: "sine",
  amplitudeAttack: 0.15,
  setFilterEnvelopeSustain: "300",
  oscialltorType: "sawtooth",
  scale: "Lydian",
  setBlendMode: "source-over",
  lfoAmount: "0.87",
  amplitudeRelease: "2.29",
  swipeFrequency: "2.2",
  swipeOctave: "2",
  chordVelocity: "0.97",
  swipeVelocity: "0.88",
  sustain: true
};

export class HashStorage {
  constructor() {
    try {
      if (this.isEmpty(this.decode(window.location.hash))) {
        window.location.hash = this.encode(INIT_CONTROL_VALUES);
      }
    } catch (e) {
      window.location.hash = this.encode(INIT_CONTROL_VALUES);
    }
  }

  isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);
  isEmpty = (a: any) => a.length === 0;
  state(): ControlValues {
    return this.decode(window.location.hash);
  }

  encode(state: ControlValues) {
    return btoa(JSON.stringify(state));
  }
  decode(hash: any): any {
    return JSON.parse(atob(hash.substring(1)));
  }

  update(data: any) {
    const _state = this.state();
    const updated = { ..._state, ...data };
    if (this.isEqual(updated, _state)) {
      return false;
    } else {
      window.location.hash = this.encode(updated);
      console.log(_state);
      return updated;
    }
  }

  setMasterGain(e: string) {
    this.update({ masterGain: e });
  }
}
