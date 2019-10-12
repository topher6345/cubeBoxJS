import * as React from "react";
import Slider from "./components/slider";
import Select from "./components/select";
import Toggle from "./components/toggle";

class Foo extends React.Component {
  options: string[];
  constructor(props: any) {
    super(props);

    this.options = [
      "Ionian",
      "Lydian",
      "Locrian",
      "Phrygian",
      "Aeolean",
      "Dorian",
      "Mixolydian"
    ];
  }

  render() {
    return (
      <>
        <div className="left">
          <div>
            <span>Volume: </span>
            <Slider callback={console.log} />
            <Select callback={console.log} options={this.options} />
            <Toggle callback={console.log} /> On/Off
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
            callback={console.log}
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
            callback={console.log}
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

export default <Foo />;
