type SquarePosition = [number, number, number, number];
type RGB = [number, number, number];
type RGBA = [number, number, number, number];

const Colors: RGB[] = [
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

export default class Square {
  /**
   * A Square that draws itself on the screen and fades out.
   */
  private ctx: CanvasRenderingContext2D;
  private position: SquarePosition;
  private alpha: number;
  private note: number;
  private alphaScalar: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    position: SquarePosition,
    note: number
  ) {
    this.ctx = ctx;
    this.position = position;
    this.note = note;
    this.alpha = 0;
    this.alphaScalar = 100;
  }

  play(degree: number, velocity: number) {
    this.alpha = Math.round(velocity);
    this.note = degree;
  }

  draw() {
    this.decrementAlpha();
    this.drawRect();
  }

  private drawRect(): void {
    this.ctx.fillStyle = this.color();
    this.ctx.fillRect(...this.position);
  }

  private decrementAlpha(): void {
    this.alpha = this.alpha > 0 ? this.alpha - 1 : this.alpha;
  }

  private color(): string {
    return `rgba(${this.rgba().join(",")})`;
  }

  private rgba(): RGBA {
    const [r, g, b] = Colors[this.note];
    return [r, g, b, this.alpha / this.alphaScalar];
  }
}
