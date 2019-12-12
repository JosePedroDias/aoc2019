const fs = require('fs');
const assert = require('assert');

const STEPS = 10;

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

function step(ents, combs) {
  //console.log(ents);
  //console.log(combs);

  ents.forEach((e) => {
    console.log(
      `pos=<x=${e.pos[0]}, y=${e.pos[1]}, z=${e.pos[2]}>, vel=<x=${e.vel[0]}, y=${e.vel[1]}, z=${e.vel[2]}>`
    );
    e.vel = [0, 0, 0];
  });

  for (let [a, b] of combs) {
    const A = ents[a];
    const B = ents[b];
    for (let i = 0; i < 3; ++i) {
      A.vel[i] += A.pos[i] < B.pos[i] ? 1 : A.pos[i] > B.pos[i] ? -1 : 0;
    }
  }

  ents.forEach((e) => {
    for (let i = 0; i < 3; ++i) {
      e.pos[i] += e.vel[i];
    }
  });
}

function ent(pos) {
  return {
    pos,
    vel: [0, 0, 0]
  };
}

function sum(arr) {
  return arr.reduce((p, v) => p + v, 0);
}

function sumAbs(arr) {
  return arr.reduce((p, v) => p + Math.abs(v), 0);
}

// A moon's potential energy is the sum of the absolute values of its x, y, and z position coordinates.
// A moon's kinetic energy is the sum of the absolute values of its velocity coordinates.
function energy(ent) {
  const pot = sumAbs(ent.pos);
  const kin = sumAbs(ent.vel);
  const res = pot * kin;
  console.log(`pot:${pot} kin:${kin} tot:${res}`);
  return res;
}

function energySystem(ents) {
  return sum(ents.map(energy));
}

function parse(s) {
  const lines = s.split('\n').map((s) => {
    const m = RGX.exec(s);
    return [m[1], m[2], m[3]].map(parseFloat);
  });
  const ents = lines.map(ent);
  return ents;
}

function main() {
  //const fileS = fs.readFileSync('input/12.txt').toString();
  const fileS = `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`;

  const ents = parse(fileS);

  const combs = combinations(ents.length);
  for (let i = 0; i < STEPS; ++i) {
    console.log(`\nAfter ${i} steps:`);
    step(ents, combs);
  }

  const e = energySystem(ents);
  console.log(e);
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
