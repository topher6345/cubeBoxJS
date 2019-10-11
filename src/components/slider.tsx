import * as React from "react";

interface SliderProps extends React.Props<any> {
  name: string;
  callback: Function;
}

class Slider extends React.Component<SliderProps> {
  name: string;
  callback: Function;

  constructor(props: any) {
    super(props);
    this.name = props.name;
    this.callback = props.callback;
  }

  render() {
    return (
      <input
        type="range"
        min="0.0"
        max="1.0"
        step="0.01"
        onChange={e => this.callback(e)}
        name={this.name}
      />
    );
  }
}

export default Slider;
