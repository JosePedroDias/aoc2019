const fs = require('fs');
const assert = require('assert');
const { runProgram, getInputN, log } = require('./intcode');

const in1 = getInputN(1);
const in5 = getInputN(5);

function main() {
  const file = fs.readFileSync('input/05.txt').toString();
  const lines = file.split(',');
  const values = lines.map((v) => parseInt(v, 10));

  console.log('\n05a:');
  runProgram(values, in1, log);

  console.log('\n05b:');
  runProgram(values, in5, log);
}

function test() {
  (() => {
    const v = runProgram([1002, 4, 3, 4, 33], in1, log);
    assert.deepEqual(v, [1002, 4, 3, 4, 99]);
  })();
}

test();
main();
