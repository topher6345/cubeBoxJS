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
  masterGain: "1.0",
  setMasterFilterValue: "1.0",
  masterControlState: false,
  setDecayTime: "1.0",
  chordOctave: 4,
  setLfoFrequency: "0.1",
  filterEnvelopeQ: 0.1,
  detune: 0.0,
  setFilterEnvelopeStartFrequency: "100",
  lfoWave: "sawtooth",
  amplitudeAttack: 0.04,
  setFilterEnvelopeSustain: "300",
  oscialltorType: "square",
  scale: "Lydian",
  setBlendMode: "source-over",
  lfoAmount: 0.1,
  amplitudeRelease: 0.1,
  swipeFrequency: 0.1,
  swipeOctave: 3,
  chordVelocity: 0.1,
  swipeVelocity: 0.1,
  sustain: false
};

export class HashStorage {
  constructor() {
    if (this.isEmpty(this.decode(window.location.hash))) {
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
      return updated;
    }
  }

  setMasterGain(e: string) {
    this.update({ masterGain: e });
  }
}

