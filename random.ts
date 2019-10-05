export function* urnJB(length: number) {
  let array = randArray(length);
  let i = 0;
  while (true) {
    yield array[i];
    i = i + 1;
    if (i === length) {
      array = randArray(length);
      i = 0;
    }
  }
}

export function randArray(length: number) {
  let array: number[] = [];

  for (let i = 0; i < length; i++) {
    array[i] = i;
  }

  // Fisher-Yates shuffling algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}
