import * as React from "react";

interface SliderProps extends React.Props<any> {
  callback: Function;
  min?: number;
  max?: number;
  step?: number;
}

class Slider extends React.Component<SliderProps> {
  private callback: Function;
  private min: number;
  private max: number;
  private step: number;

  constructor(props: any) {
    super(props);
    this.callback = props.callback;
    this.min = props.min;
    this.max = props.max;
    this.step = props.step;
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
        onChange={e => this.callback(e.target.value)}
      />
    );
  }
}

export default Slider;
