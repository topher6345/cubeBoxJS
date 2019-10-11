import * as ReactDOM from "react-dom";
import Foo from "./foobar";
import CubeBox from "./cube-box";

const cubeBox = new CubeBox();

function draw(now: number) {
  cubeBox.tick(now);
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
ReactDOM.render(Foo, document.getElementById("foobaz"));
