import assert from 'assert';
import { runProgram, updateStat } from './intcode.mjs';
import { loadFileToString } from './utils.mjs';

function runTestProgram(s) {
  const prog = s.split(',').map((v) => parseInt(v, 10));
  const outs = [];
  runProgram(prog, {
    getInput: () => 0,
    log: (v) => {
      outs.push(v);
    },
    updateStat,
    extendMemory: true
  });

  return outs;
}

function main() {
  const s = loadFileToString('input/09.txt');
  const prog = s.split(',').map((v) => parseInt(v, 10));
}

function test() {
  (() => {
    assert.equal(
      runTestProgram(
        '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99'
      ),
      []
    );
    assert.deepEqual(runTestProgram('1102,34915192,34915192,7,4,7,99,0'), [
      1219070632396864
    ]);
    assert.deepEqual(runTestProgram('104,1125899906842624,99'), [
      1125899906842624
    ]);
  })();
}

test();
main();
