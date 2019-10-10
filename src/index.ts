import * as ReactDOM from "react-dom";
import Foo from "./index.new";
import CubeBox from "./cube-box";

const cubeBox = new CubeBox();

function draw(now: number) {
  cubeBox.tick(now);
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
debugger;
ReactDOM.render(Foo, document.getElementById("foobaz"));
