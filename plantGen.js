function* plantId(i) {
  while (i < 300) {
    yield i++;
  }
}

function iterate(gen) {
  const id = gen.next();
  if (id.done) {
    return;
  }
  console.log(id.value);
  iterate(gen);
}

const gen = plantId(295);
iterate(gen);
