import * as React from "react";
import Slider from "./components/slider";
import Select from "./components/select";

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
        <Slider name="foobar" callback={console.log} />
        <Select name="bas" callback={console.log} options={this.options} />
      </>
    );
  }
}

export default <Foo />;
