function* plantId(i) {
  while (i < 300) {
    yield i++;
  }
}

const gen = plantId(295);
let id = gen.next();

while (!id.done) {
  console.log(id.value);
  id = gen.next();
}
