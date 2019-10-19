import * as ReactDOM from "react-dom";
import * as React from "react";

import CubeBox from "./cube-box";

import Slider from "./components/slider";
import Select from "./components/select";
import Toggle from "./components/toggle";

const audioContext = new AudioContext();
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const cubeBox = new CubeBox(canvas, audioContext);

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
              callback={(e: string) => cubeBox.audioEngine.setMasterGain(e)}
            />
            <span>fltr</span>
            <Slider
              callback={(e: string) =>
                cubeBox.audioEngine.setMasterFilterValue(e)
              }
            />
            <span>On/Off</span>
            <Toggle
              callback={(e: boolean) => {
                cubeBox.masterControlState = e;
              }}
            />
          </div>
          <div>
            <span>speed</span>
            <Slider
              callback={(e: string) =>
                cubeBox.compositionEngine.setDecayTime(e)
              }
              min={0.5}
              max={8.0}
              step={0.5}
            />
            <span>chord oct.</span>
            <Slider
              callback={(e: string) => (cubeBox.chordOctave = parseInt(e))}
              min={0}
              max={6}
              step={1}
            />
            <span>vib. rate</span>
            <Slider
              callback={(e: string) => {
                cubeBox.audioEngine.setLfoFrequency(e);
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
                cubeBox.audioEngine.filterEnvelopeQ = e;
              }}
              min={0.0}
              max={20.0}
              step={0.01}
            />
            <span>Detune</span>
            <Slider
              callback={(e: number) => {
                cubeBox.compositionEngine.detune = e;
              }}
              min={0.0}
              max={50.0}
              step={1}
            />
            <span>fltr env</span>
            <Slider
              callback={(e: string) => {
                cubeBox.audioEngine.setFilterEnvelopeStartFrequency(e);
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
                cubeBox.audioEngine.frequencyModulationType = e;
              }}
              options={["square", "sawtooth", "triangle", "sine"]}
            />
            <span>amp attack</span>
            <Slider
              callback={(e: string) => {
                cubeBox.audioEngine.amplitudeAttack = parseFloat(e);
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
                cubeBox.compositionEngine.oscialltorType = e;
              }}
              options={["square", "sawtooth", "custom", "triangle", "sine"]}
            />
            <span>scale</span>
            <Select
              callback={(e: string) => {
                cubeBox.scale = e;
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
                cubeBox.graphicsEngine.setBlendMode(e);
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
                cubeBox.audioEngine.frequencyModulationAmount = e;
              }}
              min={0.0}
              max={10.0}
              step={0.01}
            />
            <span>apm rel</span>
            <Slider
              callback={(e: string) => {
                cubeBox.audioEngine.amplitudeRelease = parseFloat(e);
              }}
              min={0.2}
              max={3}
              step={0.01}
            />
            <span>swipe speed</span>
            <Slider
              callback={(e: string) => {
                cubeBox.swipeFrequency = parseFloat(e);
              }}
              min={0.2}
              max={3}
              step={0.1}
            />
            <div>
              <span>swipe oct.</span>
              <Slider
                callback={(e: string) => (cubeBox.swipeOctave = parseInt(e))}
                min={0}
                max={6}
                step={1}
              />
              <span>chord vel.</span>
              <Slider
                callback={(e: string) =>
                  (cubeBox.chordVelocity = parseFloat(e))
                }
                min={0.0}
                max={1.0}
                step={0.01}
              />
              <span>swipe vel.</span>
              <Slider
                callback={(e: string) => {
                  cubeBox.swipeVelocity = parseFloat(e);
                }}
                min={0.0}
                max={1.0}
                step={0.01}
              />
              <span>Sustain</span>
              <Toggle
                callback={(e: boolean) => {
                  cubeBox.audioEngine.exponentialEnvelope = !e;
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
