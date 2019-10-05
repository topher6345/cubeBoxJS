import Cube from "./cube";

const CubeBox: any = {};
CubeBox.CANVAS = <HTMLCanvasElement>document.getElementById("canvas");
CubeBox.CTX = <CanvasRenderingContext2D>CubeBox.CANVAS.getContext("2d");
CubeBox.CUBE_ORIGIN = <[number, number]>[33, 33];
CubeBox.CUBE_SIZE = <number>66;
CubeBox.CUBES = <Cube[]>[
  new Cube(
    CubeBox.CTX,
    [
      CubeBox.CUBE_ORIGIN[0] + 0,
      CubeBox.CUBE_ORIGIN[1] + 0,
      CubeBox.CUBE_SIZE,
      CubeBox.CUBE_SIZE
    ],
    0
  ),
  new Cube(
    CubeBox.CTX,
    [
      CubeBox.CUBE_ORIGIN[0] + 0,
      CubeBox.CUBE_ORIGIN[1] + 33,
      CubeBox.CUBE_SIZE,
      CubeBox.CUBE_SIZE
    ],
    1
  ),
  new Cube(
    CubeBox.CTX,
    [
      CubeBox.CUBE_ORIGIN[0] + 33,
      CubeBox.CUBE_ORIGIN[1] + 0,
      CubeBox.CUBE_SIZE,
      CubeBox.CUBE_SIZE
    ],
    2
  ),
  new Cube(
    CubeBox.CTX,
    [
      CubeBox.CUBE_ORIGIN[0] + 33,
      CubeBox.CUBE_ORIGIN[1] + 33,
      CubeBox.CUBE_SIZE,
      CubeBox.CUBE_SIZE
    ],
    3
  ),
  new Cube(
    CubeBox.CTX,
    [
      CubeBox.CUBE_ORIGIN[0] + 66 + 66,
      CubeBox.CUBE_ORIGIN[1] + 0,
      CubeBox.CUBE_SIZE,
      CubeBox.CUBE_SIZE
    ],
    4
  ),
  new Cube(
    CubeBox.CTX,
    [
      CubeBox.CUBE_ORIGIN[0] + 66 + 66,
      CubeBox.CUBE_ORIGIN[1] + 33,
      CubeBox.CUBE_SIZE,
      CubeBox.CUBE_SIZE
    ],
    5
  ),
  new Cube(
    CubeBox.CTX,
    [
      CubeBox.CUBE_ORIGIN[0] + 99 + 66,
      CubeBox.CUBE_ORIGIN[1] + 0,
      CubeBox.CUBE_SIZE,
      CubeBox.CUBE_SIZE
    ],
    6
  ),
  new Cube(
    CubeBox.CTX,
    [
      CubeBox.CUBE_ORIGIN[0] + 99 + 66,
      CubeBox.CUBE_ORIGIN[1] + 33,
      CubeBox.CUBE_SIZE,
      CubeBox.CUBE_SIZE
    ],
    7
  )
];
CubeBox.clearRect = () => {
  CubeBox.CTX.clearRect(0, 0, CubeBox.CANVAS.width, CubeBox.CANVAS.height);
};

export default CubeBox;
