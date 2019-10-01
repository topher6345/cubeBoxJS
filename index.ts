const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById("canvas")
);
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

interface ALPHAS {
  foo: number;
  bar: number;
}

var alphas = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

type CubePosition = [number, number, number, number];
type RGBA = [number, number, number, number];
type RGB = [number, number, number];

const Scriabin: Array<RGB> = [
  [255, 0, 0],
  [206, 154, 255],
  [255, 255, 0],
  [101, 101, 153],
  [227, 251, 255],
  [172, 28, 2],
  [0, 204, 255],
  [255, 101, 1],
  [255, 0, 255],
  [51, 204, 51],
  [140, 138, 140],
  [0, 0, 254]
];

type Cubes = [
  CubePosition,
  CubePosition,
  CubePosition,
  CubePosition,
  CubePosition,
  CubePosition,
  CubePosition,
  CubePosition
];

const cubeOrigin = [0, 0];
const cubeSize = 50;

const cubes = [
  [cubeOrigin[0] + 0, cubeOrigin[1] + 0, cubeSize, cubeSize],
  [cubeOrigin[0] + 0, cubeOrigin[1] + 25, cubeSize, cubeSize],
  [cubeOrigin[0] + 25, cubeOrigin[1] + 0, cubeSize, cubeSize],
  [cubeOrigin[0] + 25, cubeOrigin[1] + 25, cubeSize, cubeSize],
  [cubeOrigin[0] + 100, cubeOrigin[1] + 0, cubeSize, cubeSize],
  [cubeOrigin[0] + 100, cubeOrigin[1] + 25, cubeSize, cubeSize],
  [cubeOrigin[0] + 125, cubeOrigin[1] + 0, cubeSize, cubeSize],
  [cubeOrigin[0] + 125, cubeOrigin[1] + 25, cubeSize, cubeSize]
  // [cubeOrigin[0] + 300 + 0, 300 + cubeOrigin[1] + 25, cubeSize, cubeSize],
  // [cubeOrigin[0] + 300 + 25, 300 + cubeOrigin[1] + 0, cubeSize, cubeSize],
  // [cubeOrigin[0] + 300 + 25, 300 + cubeOrigin[1] + 25, cubeSize, cubeSize]
];

function drawCube(
  position: CubePosition,
  rgba: RGBA,
  ctx: CanvasRenderingContext2D
) {
  ctx.fillStyle = `rgba(${rgba.join(",")})`;
  const [x, y, xw, yw] = position;
  ctx.fillRect(x, y, xw, yw);
}

function draw(time: number, ctx: CanvasRenderingContext2D) {
  for (let i = 0; i < 8; i++) {
    let [r, g, b] = Scriabin[i];
    let pos: CubePosition = <CubePosition>cubes[i];

    alphas[i] = alphas[i] > 0 ? alphas[i] - 1 : alphas[i];
    drawCube(pos, [r, g, b, alphas[i] / 1000], ctx);
  }
}
function main(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw(time, ctx);
  requestAnimationFrame(main);
  return;
}

for (let i = 0; i < 8; i++) {
  document.getElementById(`foo-${i}`).onclick = e => {
    alphas[i] = 700;
  };
}

requestAnimationFrame(main);
