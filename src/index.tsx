import * as ReactDOM from "react-dom";
import * as React from "react";

import CubeBox from "./cube-box";

import Slider from "./components/slider";
import Select from "./components/select";
import Toggle from "./components/toggle";

const audioContext = new AudioContext();
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const cubeBox = new CubeBox(canvas, audioContext);

type ControlValues = {
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
      }

class HashStorage {
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

const hashStorage = new HashStorage();

const hashChange = () => {
  const state = hashStorage.state();
  console.log(state);
  cubeBox.audioEngine.setMasterGain(state.masterGain);
  cubeBox.audioEngine.setMasterFilterValue(state.setMasterFilterValue);
  cubeBox.masterControlState = state.masterControlState;
  cubeBox.compositionEngine.setDecayTime(state.setDecayTime);
  cubeBox.chordOctave = state.chordOctave;
  cubeBox.audioEngine.setLfoFrequency(state.setLfoFrequency);
  cubeBox.audioEngine.filterEnvelopeQ = state.filterEnvelopeQ;
  cubeBox.compositionEngine.detune = state.detune;
  cubeBox.audioEngine.setFilterEnvelopeStartFrequency(state.setFilterEnvelopeStartFrequency);
  cubeBox.audioEngine.lfoWave = state.lfoWave;
  cubeBox.audioEngine.amplitudeAttack = state.amplitudeAttack;
  cubeBox.audioEngine.setFilterEnvelopeSustain(state.setFilterEnvelopeSustain);
  cubeBox.compositionEngine.oscialltorType = state.oscialltorType;
  cubeBox.scale = state.scale;
  cubeBox.graphicsEngine.setBlendMode(state.setBlendMode);
  cubeBox.audioEngine.lfoAmount = state.lfoAmount;
  cubeBox.audioEngine.amplitudeRelease = state.amplitudeRelease;
  cubeBox.swipeFrequency = state.swipeFrequency;
  cubeBox.swipeOctave = state.swipeOctave;
  cubeBox.chordVelocity = state.chordVelocity
  cubeBox.swipeVelocity = state.swipeVelocity;
  cubeBox.audioEngine.sustain = state.sustain;
};
hashChange();

window.addEventListener("hashchange", hashChange, false);

class Foo extends React.Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <>
        <div className="left">
          <div>
            <span>vol</span>
            <Slider
              callback={(e: string) => hashStorage.update({ masterGain: e })}
            />
            <span>fltr</span>
            <Slider
              callback={(e: string) =>
                hashStorage.update({ setMasterFilterValue: e })
              }
            />
            <span>On/Off</span>
            <Toggle
              callback={(e: boolean) => {
                hashStorage.update({ masterControlState: e });
              }}
            />
          </div>
          <div>
            <span>speed</span>
            <Slider
              callback={(e: string) => hashStorage.update({ setDecayTime: e })}
              min={0.5}
              max={8.0}
              step={0.5}
            />
            <span>chord oct.</span>
            <Slider
              callback={(e: string) =>
                hashStorage.update({ chordOctave: parseInt(e) })
              }
              min={0}
              max={6}
              step={1}
            />
            <span>vib. rate</span>
            <Slider
              callback={(e: string) => {
                hashStorage.update({ setLfoFrequency: e });
              }}
              min={0.0}
              max={1.0}
              step={0.01}
            />
          </div>
          <div>
            <span>fltr Q</span>
            <Slider
              callback={(e: number) => {
                hashStorage.update({ filterEnvelopeQ: e });
              }}
              min={0.0}
              max={20.0}
              step={0.01}
            />
            <span>Detune</span>
            <Slider
              callback={(e: number) => {
                hashStorage.update({ detune: e });
              }}
              min={0.0}
              max={50.0}
              step={1}
            />
            <span>fltr env</span>
            <Slider
              callback={(e: string) => {
                hashStorage.update({ setFilterEnvelopeStartFrequency: e });
              }}
              min={0.0}
              max={1.0}
              step={0.01}
            />
          </div>
          <div>
            <span>vib shape</span>
            <Select
              callback={(e: string) => {
                hashStorage.update({ lfoWave: e });
              }}
              options={["sawtooth", "square", "triangle", "sine"]}
            />
            <span>amp attack</span>
            <Slider
              callback={(e: string) => {
                hashStorage.update({ amplitudeAttack: parseFloat(e) });
              }}
              min={0.01}
              max={0.5}
              step={0.01}
            />

            <span>fltr sustain</span>
            <Slider
              callback={(e: string) => {
                hashStorage.update({ setFilterEnvelopeSustain: e });
              }}
              min={0.01}
              max={0.5}
              step={0.01}
            />
          </div>
        </div>
        <div className="right">
          <div>
            <span>wave</span>
            <Select
              callback={(e: string) => {
                hashStorage.update({ oscialltorType: e });
              }}
              options={["square", "sawtooth", "custom", "triangle", "sine"]}
            />
            <span>scale</span>
            <Select
              callback={(e: string) => {
                hashStorage.update({ scale: e });
              }}
              options={[
                "Lydian",
                "Ionian",
                "Locrian",
                "Phrygian",
                "Aeolean",
                "Dorian",
                "Mixolydian"
              ]}
            />
            <span>blend</span>
            <Select
              callback={(e: string) => {
                hashStorage.update({ setBlendMode: e });
              }}
              options={[
                "source-over",
                "source-in",
                "source-out",
                "source-atop",
                "destination-over",
                "destination-in",
                "destination-out",
                "destination-atop",
                "lighter",
                "copy",
                "xor",
                "multiply",
                "screen",
                "overlay",
                "darken",
                "lighten",
                "color-dodge",
                "color-burn",
                "hard-light",
                "soft-light",
                "difference",
                "exclusion",
                "hue",
                "saturation",
                "color",
                "luminosity"
              ]}
            />
          </div>
          <div>
            <span>vib. depth</span>
            <Slider
              callback={(e: number) => {
                hashStorage.update({ lfoAmount: e });
              }}
              min={0.0}
              max={10.0}
              step={0.01}
            />
            <span>apm rel</span>
            <Slider
              callback={(e: number) => {
                hashStorage.update({ amplitudeRelease: e });
              }}
              min={0.2}
              max={3}
              step={0.01}
            />
            <span>swipe speed</span>
            <Slider
              callback={(e: number) => {
                hashStorage.update({ swipeFrequency: e });
              }}
              min={0.2}
              max={3}
              step={0.1}
            />
            <div>
              <span>swipe oct.</span>
              <Slider
                callback={(e: string) =>
                  hashStorage.update({ swipeOctave: parseInt(e) })}
                min={0}
                max={6}
                step={1}
              />
              <span>chord vel.</span>
              <Slider
                callback={(e: number) =>
                  hashStorage.update({ chordVelocity: e })
                }
                min={0.0}
                max={1.0}
                step={0.01}
              />
              <span>swipe vel.</span>
              <Slider
                callback={(e: number) => {
                  hashStorage.update({ swipeVelocity: e })
                }}
                min={0.0}
                max={1.0}
                step={0.01}
              />
              <span>Sustain</span>
              <Toggle
                callback={(e: boolean) => {
                  hashStorage.update({ sustain: !e })
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

function draw(now: number) {
  cubeBox.tick(now);
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
ReactDOM.render(<Foo />, document.getElementById("cubebox"));
