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
            <span>Volume: </span>
            <Slider
              callback={(e: string) => cubeBox.audioEngine.setMasterGain(e)}
            />
            <span>Filter Freq: </span>
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
            <span>Decay time</span>
            <Slider
              callback={(e: string) =>
                cubeBox.compositionEngine.setDecayTime(e)
              }
              min={0.5}
              max={8.0}
              step={0.5}
            />
            <span>Octave</span>
            <Slider
              callback={(e: number) =>
                (cubeBox.compositionEngine.globalRoot = e)
              }
              min={0}
              max={6}
              step={1}
            />
            <span>Vibrato Rate</span>
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
            <span>Filter Envelope Q</span>
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
            <span>Filter Envelope</span>
            <Slider
              callback={(e: string) => {
                cubeBox.audioEngine.setFilterEnvelopeStartFrequency(e);
              }}
              min={0.0}
              max={1.0}
              step={0.01}
            />
          </div>
        </div>
        <div className="right">
          <div>
            <span>Current waveform: </span>
            <Select
              callback={(e: string) => {
                cubeBox.compositionEngine.oscialltorType = e;
              }}
              options={["sine", "square", "sawtooth", "custom", "triangle"]}
            />
            <span>Current scale: </span>
            <Select
              callback={(e: string) => {
                cubeBox.scale = e;
              }}
              options={[
                "Ionian",
                "Lydian",
                "Locrian",
                "Phrygian",
                "Aeolean",
                "Dorian",
                "Mixolydian"
              ]}
            />
            <span>Blend Mode: </span>
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
            <span>Vibrato Amount</span>
            <Slider
              callback={(e: number) => {
                cubeBox.audioEngine.frequencyModulationAmount = e;
              }}
              min={0.0}
              max={10.0}
              step={0.01}
            />
            <span>amplitudeRelease</span>
            <Slider
              callback={(e: string) => {
                cubeBox.audioEngine.amplitudeRelease = parseFloat(e);
              }}
              min={0.2}
              max={3}
              step={0.01}
            />
            <span>Swipe Space</span>
            <Slider
              callback={(e: string) => {
                cubeBox.swipeFrequency = parseFloat(e);
              }}
              min={0.2}
              max={3}
              step={0.1}
            />
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
