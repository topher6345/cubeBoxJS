import Cube from "./cube-box/cube";

class CubeBox {
  /**
   *
   * An instance wraps the Canvas context
   *
   * This class is responsible for laying out the cubes on the canvas.
   *
   * Call draw() to draw to the canvas.
   *
   * It passes the canvas contex into `Cube`s
   *
   * `Cube`s draw themselves on the screen.
   */
  private canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  private cubeOrigin: [number, number];
  private cubeSize: number;
  private cubes: Cube[];

  constructor() {
    this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
    this.cubeOrigin = <[number, number]>[33, 33];
    this.cubeSize = <number>66;
    this.cubes = <Cube[]>[
      new Cube(
        this.ctx,
        [
          this.cubeOrigin[0] + 0,
          this.cubeOrigin[1] + 0,
          this.cubeSize,
          this.cubeSize
        ],
        0
      ),
      new Cube(
        this.ctx,
        [
          this.cubeOrigin[0] + 0,
          this.cubeOrigin[1] + 33,
          this.cubeSize,
          this.cubeSize
        ],
        1
      ),
      new Cube(
        this.ctx,
        [
          this.cubeOrigin[0] + 33,
          this.cubeOrigin[1] + 0,
          this.cubeSize,
          this.cubeSize
        ],
        2
      ),
      new Cube(
        this.ctx,
        [
          this.cubeOrigin[0] + 33,
          this.cubeOrigin[1] + 33,
          this.cubeSize,
          this.cubeSize
        ],
        3
      ),
      new Cube(
        this.ctx,
        [
          this.cubeOrigin[0] + 66 + 66,
          this.cubeOrigin[1] + 0,
          this.cubeSize,
          this.cubeSize
        ],
        4
      ),
      new Cube(
        this.ctx,
        [
          this.cubeOrigin[0] + 66 + 66,
          this.cubeOrigin[1] + 33,
          this.cubeSize,
          this.cubeSize
        ],
        5
      ),
      new Cube(
        this.ctx,
        [
          this.cubeOrigin[0] + 99 + 66,
          this.cubeOrigin[1] + 0,
          this.cubeSize,
          this.cubeSize
        ],
        6
      ),
      new Cube(
        this.ctx,
        [
          this.cubeOrigin[0] + 99 + 66,
          this.cubeOrigin[1] + 33,
          this.cubeSize,
          this.cubeSize
        ],
        7
      )
    ];
  }

  private clearRect() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw() {
    this.clearRect();
    this.cubes.forEach(cube => cube.draw());
  }

  play(index: number, colorIndex: number) {
    this.cubes[index].play(colorIndex);
  }
}

export default new CubeBox();
