import * as ReactDOM from "react-dom";
import CubeBox from "./cube-box";
import * as React from "react";
import Slider from "./components/slider";
import Select from "./components/select";
import Toggle from "./components/toggle";

interface FooProps extends React.Props<any> {
  cubeBox: CubeBox;
}
class Foo extends React.Component<FooProps> {
  cubeBox: CubeBox;
  constructor(props: any) {
    super(props);
    this.cubeBox = props.cubeBox;
  }

  setMasterGain(input: string, cubeBox: CubeBox) {
    cubeBox.audioEngine.masterGain.gain.value = this.expon(input);
  }

  private expon(x: string) {
    // Must be in range 0.0-1.0
    return -Math.sqrt(-parseFloat(x) + 1) + 1;
  }

  render() {
    return (
      <>
        <div className="left">
          <div>
            <span>Volume: </span>
            <Slider callback={this.setMasterGain} />
            <span>On/Off</span>
            <Toggle callback={console.log} />
          </div>
          <div>
            <span>Decay time</span>
            <Slider callback={console.log} min={0.5} max={8.0} step={0.5} />
            <span>Octave</span>
            <Slider callback={console.log} min={0} max={6} step={1} />
            <span>Vibrato Rate</span>
            <Slider callback={console.log} min={0.0} max={1.0} step={0.01} />
          </div>
          <div>
            <span>Filter Envelope Q</span>
            <Slider callback={console.log} min={0.0} max={20.0} step={0.01} />
            <span>Detune</span>
            <Slider callback={console.log} min={0.0} max={50.0} step={1} />
            <span>Filter Envelope</span>
            <Slider callback={console.log} min={0.0} max={1.0} step={0.01} />
          </div>
          <div>
            <span>Vibrato Amount</span>
            <Slider callback={console.log} min={0.0} max={10.0} step={0.01} />
            <span>amplitudeRelease</span>
            <Slider callback={console.log} min={0.2} max={3} step={0.01} />
          </div>
        </div>
        <div className="right">
          <span>Current waveform: </span>
          <Select
            callback={console.log}
            options={["sine", "square", "sawtooth", "custom", "triangle"]}
          />
          <span>Current scale: </span>
          <Select
            callback={this.cubeBox.updateScale}
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
            callback={this.cubeBox.graphicsEngine.setBlendMode}
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
      </>
    );
  }
}
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const cubeBox = new CubeBox(canvas);

function draw(now: number) {
  cubeBox.tick(now);
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
ReactDOM.render(<Foo cubeBox={cubeBox} />, document.getElementById("cubebox"));
