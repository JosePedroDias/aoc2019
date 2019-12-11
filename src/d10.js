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
  return visibleSoFar;
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
      const tmp = visibleAsteroids({ asteroids, pos }).size;
      if (tmp > visibles) {
        visibles = tmp;
        bestPosition = pos;
      }
    }
  }
  return { pos: bestPosition, visible: visibles };
}

function vaporize({ asteroids, pos }) {
  let angle = 90;
  let i = 0;
  //while (true) {
  const vis = visibleAsteroids({ asteroids, pos });
  //vis. TODO
  console.log(vis);
}

function main() {
  const file = fs.readFileSync('input/10.txt').toString();
  const mtx = file.split('\n');

  const { w, h, asteroids } = parseMatrix(mtx);
  const { pos, visible } = findBestPosition({ w, h, asteroids });
  console.log('10a:', pos, visible);

  const destroyed = vaporize({ asteroids, pos });
  //const dest200th = destroyed[199];
  //console.log('10b:', dest200th[0] * 100 + dest200th[1]);
}

function test() {
  (() => {
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

    const { pos, visible } = findBestPosition({ w, h, asteroids });
    assert.deepEqual(pos, [3, 4]);
    assert.equal(visible, 8);
  })();

  (() => {
    const mtx = `.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.........###..
..#.#.....#....##`.split('\n');
    const { w, h, asteroids } = parseMatrix(mtx);
    assert.equal(w, 17);
    assert.equal(h, 5);
    assert.deepEqual(asteroids, [
      [1, 0],
      [6, 0],
      [7, 0],
      [8, 0],
      [9, 0],
      [10, 0],
      [14, 0],
      [0, 1],
      [1, 1],
      [5, 1],
      [6, 1],
      [8, 1],
      [9, 1],
      [10, 1],
      [11, 1],
      [12, 1],
      [15, 1],
      [16, 1],
      [0, 2],
      [1, 2],
      [5, 2],
      [9, 2],
      [11, 2],
      [12, 2],
      [13, 2],
      [14, 2],
      [15, 2],
      [2, 3],
      [12, 3],
      [13, 3],
      [14, 3],
      [2, 4],
      [4, 4],
      [10, 4],
      [15, 4],
      [16, 4]
    ]);

    const pos = [9, 3];
    const destroyed = vaporize({ asteroids, pos });
    assert.deepEqual(destroyed, []);
  })();
}

test();
main();
