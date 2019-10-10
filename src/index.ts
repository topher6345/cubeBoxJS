import CubeBox from "./cube-box";

const cubeBox = new CubeBox();

function draw(now: number) {
  cubeBox.tick(now);
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
