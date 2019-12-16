const fs = require('fs');
const assert = require('assert');
const { runProgram, in1, in5, log } = require('./intcode');

function main() {
  const file = fs.readFileSync('input/05.txt').toString();
  const lines = file.split(',');
  const values = lines.map((v) => parseInt(v, 10));

  console.log('05a:');
  runProgram(values, in1, log);

  console.log('05b:');
  runProgram(values, in5, log);

  console.log('ALL DONE');
}

function test() {
  (() => {
    const v = runProgram([1002, 4, 3, 4, 33], in1, log);
    assert.deepEqual(v, [1002, 4, 3, 4, 99]);
  })();
}

test();
main();
