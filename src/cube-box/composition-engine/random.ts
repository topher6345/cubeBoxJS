export default function* urnJB(length: number) {
  let array = randArray(length);
  let index = 0;

  while (true) {
    yield array[index];
    index = index + 1;

    if (index === length) {
      array = randArray(length);
      index = 0;
    }
  }
}

function randArray(length: number) {
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
