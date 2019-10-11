import * as React from "react";

interface SelectProps extends React.Props<any> {
  name: string;
  callback: Function;
  options: string[];
}

export default class Select extends React.Component<SelectProps> {
  options: Array<any>;
  name: string;
  callback: Function;

  constructor(props: any) {
    super(props);
    this.name = props.name;
    this.options = props.options;
    this.callback = props.callback;
  }

  render() {
    return (
      <select name={this.name}>
        {this.options.map(value => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    );
  }
}
