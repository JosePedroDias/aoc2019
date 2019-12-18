import assert from 'assert';
import { loadFileToString } from './utils.mjs';
import { runProgram, getInputN, log, updateStat } from './intcode.mjs';

const in1 = getInputN(1);
const in5 = getInputN(5);

function main() {
  const s = loadFileToString('input/05.txt');
  const prog = s.split(',').map((v) => parseInt(v, 10));

  console.log('\n05a:');
  runProgram(prog, { getInput: in1, log: log /*updateStat*/ });

  console.log('\n05b:');
  runProgram(prog, { getInput: in5, log: log });
}

function test() {
  (() => {
    const v = runProgram([1002, 4, 3, 4, 33], { getInput: in1, log: log });
    assert.deepEqual(v, [1002, 4, 3, 4, 99]);
  })();
}

test();
main();
