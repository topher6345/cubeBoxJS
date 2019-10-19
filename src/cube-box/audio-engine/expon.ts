export default (input: string, max: number, floor: number) => {
  return expon(input) * max + floor;
};

const expon = (x: string): number => {
  let value = parseFloat(x);
  value = value < 0.0 ? 0.0 : value;
  value = value > 1.0 ? 1.0 : value;
  return -Math.sqrt(-value + 1) + 1;
};
