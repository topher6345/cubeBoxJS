import * as React from "react";

interface ToggleProps extends React.Props<any> {
  callback: Function;
}

export default class Toggle extends React.Component<ToggleProps> {
  callback: Function;

  constructor(props: any) {
    super(props);
    this.callback = props.callback;
  }

  render() {
    return (
      <input type="checkbox" onChange={e => this.callback(e.target.checked)} />
    );
  }
}
