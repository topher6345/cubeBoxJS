type SquarePosition = [number, number, number, number];
type RGB = [number, number, number];

export default class Square {
  /**
   * A Square that draws itself on the screen and fades out.
   */
  private ctx: CanvasRenderingContext2D;
  private position: SquarePosition;
  private alpha: number;
  private colors: Array<RGB>;
  private note: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    position: SquarePosition,
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
    this.ctx.fillStyle = `rgba(${rgba.join(",")})`;
    const [x, y, xw, yw] = this.position;
    this.ctx.fillRect(x, y, xw, yw);
  }

  play(degree: number, velocity: number) {
    this.alpha = Math.round(velocity);
    this.note = degree;
  }
}
