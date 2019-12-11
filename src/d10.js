const fs = require('fs');
const assert = require('assert');

const R2D = 180 / 3.1415927;

function parseMatrix(mtx) {
  const w = mtx[0].length;
  const h = mtx.length;
  const asteroids = [];
  for (let y = 0; y < h; ++y) {
    for (let x = 0; x < w; ++x) {
      if (mtx[y][x] === '#') {
        asteroids.push([x, y]);
      }
    }
  }
  return { w, h, asteroids };
}

function round(n, factor) {
  return n;
  //return Math.round(n * factor) / factor;
}

function angleDist(pos0, pos1) {
  const dx = pos0[0] - pos1[0];
  const dy = pos0[1] - pos1[1];
  //const dist = Math.sqrt(dx * dx + dy * dy);
  const dist = round(Math.sqrt(dx * dx + dy * dy), 10);
  //const angle = Math.atan2(dy, dx);
  const angle = round(Math.atan2(dy, dx) * R2D, 10);
  return { dist, angle };
}

function visibleAsteroids({ asteroids, pos }) {
  const visibleSoFar = new Map();
  for (let ast of asteroids) {
    if (ast[0] === pos[0] && ast[1] === pos[1]) {
      continue;
    }
    const { angle, dist } = angleDist(pos, ast);
    if (visibleSoFar.has(angle)) {
      if (dist < visibleSoFar.get(angle)) {
        visibleSoFar.set(angle, dist);
        //console.log('same angle: closer');
      } else {
        //console.log('same angle: farther');
      }
    } else {
      //console.log(`new angle: ${angle} with dist: ${dist}`);
      visibleSoFar.set(angle, dist);
    }
  }
  //console.log(`-> ${pos} has ${visibleSoFar.size}`);
  return visibleSoFar.size;
}

function arrContains(arr, pos) {
  const set = new Set();
  arr.forEach((pos) => {
    set.add(pos.join(','));
  });
  return set.has(pos.join(','));
}

function findBestPosition({ w, h, asteroids }) {
  let visibles = 0;
  let bestPosition;
  for (let y = 0; y < h; ++y) {
    for (let x = 0; x < w; ++x) {
      const pos = [x, y];
      if (!arrContains(asteroids, pos)) {
        //console.log(`skipped ${pos}: occupied`);
        continue;
      }
      //console.log(`pos ${pos}...`);
      const tmp = visibleAsteroids({ asteroids, pos });
      if (tmp > visibles) {
        visibles = tmp;
        bestPosition = pos;
      }
    }
  }
  return { position: bestPosition, visible: visibles };
}

function main() {
  const file = fs.readFileSync('input/10.txt').toString();
  const mtx = file.split('\n');

  const { w, h, asteroids } = parseMatrix(mtx);
  const { position, visible } = findBestPosition({ w, h, asteroids });
  console.log(position, visible);
}

function test() {
  const mtx = `.#..#
.....
#####
....#
...##`.split('\n');
  const { w, h, asteroids } = parseMatrix(mtx);
  assert.equal(w, 5);
  assert.equal(h, 5);
  assert.deepEqual(asteroids, [
    [1, 0],
    [4, 0],
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 2],
    [4, 3],
    [3, 4],
    [4, 4]
  ]);

  const { position, visible } = findBestPosition({ w, h, asteroids });
  assert.deepEqual(position, [3, 4]);
  assert.equal(visible, 8);
}

test();
main();
