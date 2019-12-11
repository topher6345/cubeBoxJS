import * as React from "react";
import throttled from "../cube-box/throttled";
interface SliderProps extends React.Props<any> {
  callback: Function;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
}

const ThrottleRate = 1000;
class Slider extends React.Component<SliderProps> {
  private callback: Function;
  private min: number;
  private max: number;
  private step: number;
  private value: number;

  constructor(props: any) {
    super(props);
    this.callback = props.callback;
    this.min = props.min;
    this.max = props.max;
    this.step = props.step;
    this.value = props.value;
  }

  static defaultProps = {
    min: 0.0,
    max: 1.0,
    step: 0.01
  };

  render() {
    return (
      <input
        type="range"
        min={this.min.toString()}
        max={this.max.toString()}
        step={this.step.toString()}
        defaultValue={this.value}
        onChange={throttled(ThrottleRate, (e: any) =>
          this.callback(e.target.value)
        )}
      />
    );
  }
}

export default Slider;
