type Degrees = [number, number, number, number, number, number, number];

interface Scale {
  [key: string]: Degrees;
  Ionian: Degrees;
  Lydian: Degrees;
  Locrian: Degrees;
  Phrygian: Degrees;
  Aeolean: Degrees;
  Dorian: Degrees;
  Mixolydian: Degrees;
}

export const SCALES: Scale = {
  Ionian: [0, 2, 4, 5, 7, 9, 11],
  Lydian: [0, 2, 4, 6, 7, 9, 11],
  Locrian: [0, 1, 3, 5, 6, 8, 10],
  Phrygian: [0, 1, 3, 5, 7, 8, 10],
  Aeolean: [0, 2, 3, 5, 7, 8, 10],
  Dorian: [0, 2, 3, 5, 7, 9, 10],
  Mixolydian: [0, 2, 4, 5, 7, 9, 10]
};
