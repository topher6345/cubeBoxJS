import * as React from "react";

class Foo extends React.Component {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <input
        type="range"
        min="0.0"
        max="1.0"
        step="0.01"
        value="0.5"
        onChange={console.log}
        name="volumeControl2"
      />
    );
  }
}

export default <Foo />;
