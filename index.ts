const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById("canvas")
);
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

type CubePosition = [number, number, number, number];
type RGB = [number, number, number];

class Cube {
  ctx: CanvasRenderingContext2D;
  position: CubePosition;
  alpha: number;
  colors: Array<RGB>;
  note: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    position: CubePosition,
    note: number
  ) {
    this.ctx = ctx;
    this.position = position;
    this.alpha = 0;
    this.colors = [
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
    this.note = note;
  }

  draw() {
    this.alpha = this.alpha > 0 ? this.alpha - 1 : this.alpha;

    const rgba = [...this.colors[this.note], this.alpha / 100];
    ctx.fillStyle = `rgba(${rgba.join(",")})`;
    const [x, y, xw, yw] = this.position;
    ctx.fillRect(x, y, xw, yw);
  }

  activate() {
    this.alpha = 70;
    this.note = Math.floor(Math.random() * 12);
  }
}

const cubeOrigin: [number, number] = [0, 0];
const cubeSize: number = 50;

const cubes: Cube[] = [
  new Cube(ctx, [cubeOrigin[0] + 0, cubeOrigin[1] + 0, cubeSize, cubeSize], 0),
  new Cube(ctx, [cubeOrigin[0] + 0, cubeOrigin[1] + 25, cubeSize, cubeSize], 1),
  new Cube(ctx, [cubeOrigin[0] + 25, cubeOrigin[1] + 0, cubeSize, cubeSize], 2),
  new Cube(
    ctx,
    [cubeOrigin[0] + 25, cubeOrigin[1] + 25, cubeSize, cubeSize],
    3
  ),
  new Cube(
    ctx,
    [cubeOrigin[0] + 100, cubeOrigin[1] + 0, cubeSize, cubeSize],
    4
  ),
  new Cube(
    ctx,
    [cubeOrigin[0] + 100, cubeOrigin[1] + 25, cubeSize, cubeSize],
    5
  ),
  new Cube(
    ctx,
    [cubeOrigin[0] + 125, cubeOrigin[1] + 0, cubeSize, cubeSize],
    6
  ),
  new Cube(
    ctx,
    [cubeOrigin[0] + 125, cubeOrigin[1] + 25, cubeSize, cubeSize],
    7
  )
];

function main(_time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cubes.forEach(cube => cube.draw());
  requestAnimationFrame(main);
  return;
}

function logKey(e) {
  switch (e.code) {
    case "KeyA":
      cubes[0].activate();
      break;
    case "KeyS":
      cubes[1].activate();
      break;
    case "KeyD":
      cubes[2].activate();
      break;
    case "KeyF":
      cubes[3].activate();
      break;
    case "KeyJ":
      cubes[4].activate();
      break;
    case "KeyK":
      cubes[5].activate();
      break;
    case "KeyL":
      cubes[6].activate();
      break;
    case "Semicolon":
      cubes[7].activate();
      break;
    default:
      break;
  }
}
document.addEventListener("keydown", logKey);

requestAnimationFrame(main);
