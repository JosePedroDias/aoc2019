import fs from 'fs';
import assert from 'assert';
import deepEqual from 'deep-equal';

const { combinations } = require('./utils');

const STEPS = 1000;

/*
apply gravity to update velocity (for every pair of entities and each coord, -1, 0 or 1 by comparison)
apply velocity to update position
*/

const RGX = /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/;

function _(n) {
  if (n >= 0) {
    return ' ' + n;
  }
  return n;
}

function step(ents, combs) {
  // print and reset vel
  ents.forEach((e) => {
    /*console.log(
      `pos=<x=${_(e.pos[0])}, y=${_(e.pos[1])}, z=${_(e.pos[2])}>, vel=<x=${_(
        e.vel[0]
      )}, y=${_(e.vel[1])}, z=${_(e.vel[2])}>`
    );*/
  });

  // vel with gravity
  for (let [a, b] of combs) {
    const A = ents[a];
    const B = ents[b];
    for (let i = 0; i < 3; ++i) {
      A.vel[i] += A.pos[i] < B.pos[i] ? 1 : A.pos[i] > B.pos[i] ? -1 : 0;
    }
  }

  // pos update with vel
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
  //console.log(`pot:${pot} kin:${kin} tot:${res}`);
  return res;
}

function energySystem(ents) {
  return sum(ents.map(energy));
}

function clone(o) {
  return JSON.parse(JSON.stringify(o));
}

function parse(s) {
  const lines = s.split('\n').map((s) => {
    const m = RGX.exec(s);
    return [m[1], m[2], m[3]].map(parseFloat);
  });
  const ents = lines.map(ent);
  return ents;
}

function simulate(ents, steps) {
  const combs = combinations(ents.length);
  for (let i = 0; i < steps; ++i) {
    //console.log(`\nAfter ${i} steps:`);
    step(ents, combs);
  }
}

function simulateUntilEqual(ents) {
  const combs = combinations(ents.length);
  const ents0 = clone(ents);

  let i = 0;
  const opts = { strict: true };
  do {
    //console.log(`\nAfter ${i} steps:`);
    step(ents, combs);
    ++i;
  } while (!deepEqual(ents, ents0, opts));

  return i;
}

function main() {
  const fileS = fs.readFileSync('input/12.txt').toString();

  let ents = parse(fileS);
  const ents0 = clone(ents);

  simulate(ents, 1000);

  const e = energySystem(ents);
  console.log('12a:', e);

  //const i = simulateUntilEqual(ents0);
  //console.log('12b:', i);
}

function test() {
  (() => {
    assert.deepEqual(combinations(2), [
      [0, 1],
      [1, 0]
    ]);
    assert.deepEqual(combinations(3), [
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 2],
      [2, 0],
      [2, 1]
    ]);
    assert.deepEqual(combinations(4), [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 0],
      [1, 2],
      [1, 3],
      [2, 0],
      [2, 1],
      [2, 3],
      [3, 0],
      [3, 1],
      [3, 2]
    ]);
  })();

  (() => {
    const fileS = `<x=-1, y=0, z=2>
    <x=2, y=-10, z=-7>
    <x=4, y=-8, z=8>
    <x=3, y=5, z=-1>`;

    let ents = parse(fileS);

    simulate(ents, 10);

    const e = energySystem(ents);
    assert.equal(e, 179);
  })();

  (() => {
    const fileS = `<x=-8, y=-10, z=0>
    <x=5, y=5, z=10>
    <x=2, y=-7, z=3>
    <x=9, y=-8, z=-3>`;

    let ents = parse(fileS);

    simulate(ents, 100);

    const e = energySystem(ents);
    assert.equal(e, 1940);
  })();

  (() => {
    const fileS = `<x=-1, y=0, z=2>
    <x=2, y=-10, z=-7>
    <x=4, y=-8, z=8>
    <x=3, y=5, z=-1>`;

    let ents = parse(fileS);

    const i = simulateUntilEqual(ents);
    assert.equal(i, 2772);
  })();

  (() => {
    const fileS = `<x=-8, y=-10, z=0>
    <x=5, y=5, z=10>
    <x=2, y=-7, z=3>
    <x=9, y=-8, z=-3>`;

    let ents = parse(fileS);

    //const i = simulateUntilEqual(ents);
    //assert.equal(i, 4686774924);
  })();
}

test();
main();
