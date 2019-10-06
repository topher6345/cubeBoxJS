import Cube from "./cube";

const CubeBox: any = {};
const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
const cubeOrigin = <[number, number]>[33, 33];
const cubeSize = <number>66;
const cubes = <Cube[]>[
  new Cube(ctx, [cubeOrigin[0] + 0, cubeOrigin[1] + 0, cubeSize, cubeSize], 0),
  new Cube(ctx, [cubeOrigin[0] + 0, cubeOrigin[1] + 33, cubeSize, cubeSize], 1),
  new Cube(ctx, [cubeOrigin[0] + 33, cubeOrigin[1] + 0, cubeSize, cubeSize], 2),
  new Cube(
    ctx,
    [cubeOrigin[0] + 33, cubeOrigin[1] + 33, cubeSize, cubeSize],
    3
  ),
  new Cube(
    ctx,
    [cubeOrigin[0] + 66 + 66, cubeOrigin[1] + 0, cubeSize, cubeSize],
    4
  ),
  new Cube(
    ctx,
    [cubeOrigin[0] + 66 + 66, cubeOrigin[1] + 33, cubeSize, cubeSize],
    5
  ),
  new Cube(
    ctx,
    [cubeOrigin[0] + 99 + 66, cubeOrigin[1] + 0, cubeSize, cubeSize],
    6
  ),
  new Cube(
    ctx,
    [cubeOrigin[0] + 99 + 66, cubeOrigin[1] + 33, cubeSize, cubeSize],
    7
  )
];
CubeBox.clearRect = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

CubeBox.draw = () => {
  CubeBox.clearRect();
  (<Cube[]>cubes).forEach(cube => cube.draw());
};

CubeBox.play = (index: number, colorIndex: number) =>
  cubes[index].play(colorIndex);

export default CubeBox;
