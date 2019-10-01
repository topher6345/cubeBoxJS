const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById("canvas")
);
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

interface ALPHAS {
  foo: number;
  bar: number;
}

var alphas: ALPHAS = {
  foo: 100,
  bar: 100
};

const FRAME_PERIOD = 13;

type CubePosition = [number, number, number, number];
type RGBA = [number, number, number, number];

function cube(
  position: CubePosition,
  rgba: RGBA,
  ctx: CanvasRenderingContext2D
) {
  ctx.fillStyle = `rgba(${rgba.join(",")})`;
  const [x, y, xw, yw] = position;
  ctx.fillRect(x, y, xw, yw);
}

function draw(time, ctx: CanvasRenderingContext2D) {
  alphas.foo = alphas.foo - 1;

  cube([10, 10, 100, 100], [0, 255, 0, alphas.foo / 100], ctx);

  alphas.bar = alphas.bar - 1;
  cube([50, 10, 150, 100], [255, 0, 0, alphas.bar / 100], ctx);
}
var lastTime = 0;
function main(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw(time, ctx);
  requestAnimationFrame(main);
  return;
}

requestAnimationFrame(main);
