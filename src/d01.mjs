import fs from 'fs';
import assert from 'assert';

function fuel1(v) {
  return Math.floor(v / 3) - 2;
}

function fuel2(v) {
  let sum = 0;
  while (true) {
    v = fuel1(v);
    if (v <= 0) {
      break;
    } else {
      sum += v;
    }
  }
  return sum;
}

function clone(o) {
  return JSON.parse(JSON.stringify(o));
}

function sum(arr) {
  return arr.reduce((prev, v) => v + prev, 0);
}

function main() {
  const file = fs.readFileSync('input/01.txt').toString();
  const lines = file.split('\n');
  const values = lines.map((line) => parseFloat(line));

  const result1 = sum(clone(values).map(fuel1));
  console.log(`01a: ${result1}`);

  const result2 = sum(values.map(fuel2));
  console.log(`01b: ${result2}`);
}

function test() {
  // fuel1
  (() => {
    assert.equal(fuel1(12), 2);
    assert.equal(fuel1(14), 2);
    assert.equal(fuel1(1969), 654);
    assert.equal(fuel1(100756), 33583);
  })();

  // fuel2
  (() => {
    assert.equal(fuel2(12), 2);
    assert.equal(fuel2(1969), 966);
    assert.equal(fuel2(100756), 50346);
  })();
}

test();
main();
