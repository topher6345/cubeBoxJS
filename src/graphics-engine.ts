import Squares from "./graphics-engine/square";

class GraphicsEngine {
  /**
   *
   * An instance wraps the Canvas context
   *
   * This class is responsible for laying out the squares on the canvas.
   *
   * Call draw() to draw to the canvas.
   *
   * It passes the canvas contex into `Squares`s
   *
   * `Squares`s draw themselves on the screen.
   */
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private squareOrigin: [number, number];
  private squareSize: number;
  private squares: Squares[];
  private unitSquare: number;

  constructor() {
    this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
    this.unitSquare = 33;
    this.squareOrigin = <[number, number]>[this.unitSquare, this.unitSquare];
    this.squareSize = <number>this.unitSquare * 2;
    this.squares = <Squares[]>[
      new Squares(
        this.ctx,
        [
          this.squareOrigin[0],
          this.squareOrigin[1],
          this.squareSize,
          this.squareSize
        ],
        0
      ),
      new Squares(
        this.ctx,
        [
          this.squareOrigin[0],
          this.squareOrigin[1] + this.unitSquare,
          this.squareSize,
          this.squareSize
        ],
        1
      ),
      new Squares(
        this.ctx,
        [
          this.squareOrigin[0] + this.unitSquare,
          this.squareOrigin[1],
          this.squareSize,
          this.squareSize
        ],
        2
      ),
      new Squares(
        this.ctx,
        [
          this.squareOrigin[0] + this.unitSquare,
          this.squareOrigin[1] + this.unitSquare,
          this.squareSize,
          this.squareSize
        ],
        3
      ),
      new Squares(
        this.ctx,
        [
          this.squareOrigin[0] + this.unitSquare * 4,
          this.squareOrigin[1],
          this.squareSize,
          this.squareSize
        ],
        4
      ),
      new Squares(
        this.ctx,
        [
          this.squareOrigin[0] + this.unitSquare * 4,
          this.squareOrigin[1] + this.unitSquare,
          this.squareSize,
          this.squareSize
        ],
        5
      ),
      new Squares(
        this.ctx,
        [
          this.squareOrigin[0] + this.unitSquare * 5,
          this.squareOrigin[1],
          this.squareSize,
          this.squareSize
        ],
        6
      ),
      new Squares(
        this.ctx,
        [
          this.squareOrigin[0] + this.unitSquare * 5,
          this.squareOrigin[1] + this.unitSquare,
          this.squareSize,
          this.squareSize
        ],
        7
      )
    ];
  }

  private clearRect() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setBlendMode(blendMode: string) {
    this.ctx.globalCompositeOperation = blendMode;
  }

  draw() {
    this.clearRect();
    this.squares.forEach(cube => cube.draw());
  }

  play(index: number, colorIndex: number) {
    this.squares[index].play(colorIndex);
  }
}

export default new GraphicsEngine();
