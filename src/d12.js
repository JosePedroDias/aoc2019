const fs = require('fs');
const assert = require('assert');

const RGX = /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/;

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
    assert.equal(true, true);
  })();
}

test();
main();
