import fs from 'fs';
import assert from 'assert';

const ADD = 1;
const MUL = 2;
const END = 99;

function createProgram(values) {
  return {
    index: 0,
    cells: values
  };
}

function cloneProgram(p) {
  return {
    index: p.index,
    cells: p.cells.slice()
  };
}

function atEnd(p) {
  return p.cells[p.index] === END;
}

function step(p) {
  const opcode = p.cells[p.index];
  if (opcode === ADD || opcode === MUL) {
    const src1 = p.cells[p.index + 1];
    const src2 = p.cells[p.index + 2];
    const dst = p.cells[p.index + 3];
    const a = p.cells[src1];
    const b = p.cells[src2];
    let result;
    if (opcode === ADD) {
      result = a + b;
    } else if (opcode === MUL) {
      result = a * b;
    }
    p.cells[dst] = result;
  } else if (opcode === END) {
    throw 'Should not have reached step of END!';
  } else {
    throw 'Unsupported opcode!';
  }
  p.index += 4;
}

function runProgram(p) {
  while (!atEnd(p)) {
    step(p);
  }
}

function main() {
  const file = fs.readFileSync('input/02.txt').toString();
  const lines = file.split(',');
  const values = lines.map((v) => parseInt(v, 10));
  const startProgram = createProgram(values);

  const p1 = cloneProgram(startProgram);
  p1.cells[1] = 12;
  p1.cells[2] = 2;

  runProgram(p1);
  console.log(`02a: ${p1.cells[0]}`);

  const TARGET_OUTPUT = 19690720;
  const MAX_V = 100;

  loop1: for (let noun = 0; noun < MAX_V; ++noun) {
    for (let verb = 0; verb < MAX_V; ++verb) {
      const p = cloneProgram(startProgram);
      p.cells[1] = noun;
      p.cells[2] = verb;
      runProgram(p);
      if (p.cells[0] === TARGET_OUTPUT) {
        const answer = 100 * noun + verb;
        console.log(`02b: ${answer} (noun:${noun}, verb:${verb})`);
        break loop1;
      }
    }
  }
}

function test() {
  // step
  (() => {
    const p = createProgram([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50]);
    assert.equal(atEnd(p), false);
    step(p);
    assert.deepEqual(p.cells, [1, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
    assert.equal(p.index, 4);
  })();
  (() => {
    const p = createProgram([1, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
    p.index = 4;
    assert.equal(atEnd(p), false);
    step(p);
    assert.deepEqual(p.cells, [3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
    assert.equal(p.index, 8);
  })();
  (() => {
    const p = createProgram([3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
    p.index = 8;
    assert.equal(atEnd(p), true);
    assert.throws(() => {
      step(p);
    });
  })();

  // runProgram
  (() => {
    const p = createProgram([1, 0, 0, 0, 99]);
    runProgram(p);
    assert.deepEqual(p.cells, [2, 0, 0, 0, 99]);
  })();
  (() => {
    const p = createProgram([2, 3, 0, 3, 99]);
    runProgram(p);
    assert.deepEqual(p.cells, [2, 3, 0, 6, 99]);
  })();
  (() => {
    const p = createProgram([2, 4, 4, 5, 99, 0]);
    runProgram(p);
    assert.deepEqual(p.cells, [2, 4, 4, 5, 99, 9801]);
  })();
  (() => {
    const p = createProgram([1, 1, 1, 4, 99, 5, 6, 0, 99]);
    runProgram(p);
    assert.deepEqual(p.cells, [30, 1, 1, 4, 2, 5, 6, 0, 99]);
  })();
}

test();
main();
