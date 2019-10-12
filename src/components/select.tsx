import * as React from "react";

interface SelectProps extends React.Props<any> {
  callback: Function;
  options: string[];
}

export default class Select extends React.Component<SelectProps> {
  options: Array<any>;
  callback: Function;

  constructor(props: any) {
    super(props);
    this.options = props.options;
    this.callback = props.callback;
  }

  render() {
    return (
      <select onChange={e => this.callback(e.target.value)}>
        {this.options.map(value => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    );
  }
}
