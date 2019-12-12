const fs = require('fs');
const assert = require('assert');

/*
apply gravity to update velocity (for every pair of entities and each coord, -1, 0 or 1 by comparison)
apply velocity to update position
*/

const RGX = /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/;

// order being irrelevant
function combinations(n) {
  const arr = [];
  for (let i = 0, j; i < n; ++i) {
    for (j = 0; j < n; ++j) {
      if (i < j) {
        arr.push([i, j]);
      }
    }
  }
  return arr;
}

function step() {}

function ent(pos) {
  return {
    pos,
    vel: [0, 0, 0]
  };
}

function energy() {}

function main() {
  const file = fs.readFileSync('input/12.txt').toString();
  const lines = file.split('\n').map((s) => {
    const m = RGX.exec(s);
    return [m[1], m[2], m[3]].map(parseFloat);
  });
  console.log(lines);
}

function test() {
  (() => {
    assert.deepEqual(combinations(2), [[0, 1]]);
    assert.deepEqual(combinations(3), [
      [0, 1],
      [0, 2],
      [1, 2]
    ]);
    assert.deepEqual(combinations(4), [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 2],
      [1, 3],
      [2, 3]
    ]);
  })();
}

test();
main();
