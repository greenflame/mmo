function r(b) {
  return Math.floor(Math.random() * b);
}

function generate(w, h) {
  let map = [];

  for (let i = 0; i < h; i++) {
    map[i] = [];

    for (let j = 0; j < w; j++) {
      map[i][j] = Math.random() > 0.75 ? 'grass1' : 'grass2';
    }
  }

  for (let i = 0; i < w * h * 0.1; i++) {  // Trees
    map[r(h)][r(w)] = 'tree' + (r(3) + 1);
  }

  for (let i = 0; i < w * h * 0.05; i++) {  // Flowers
    map[r(h)][r(w)] = 'flower' + (r(2) + 1);
  }

  for (let i = 0; i < w * h * 0.005; i++) {  // Other
    map[r(h)][r(w)] = 'stone';
    map[r(h)][r(w)] = 'sand';
    map[r(h)][r(w)] = 'water';
  }

  return map;
}


module.exports = {
  generate: generate
};