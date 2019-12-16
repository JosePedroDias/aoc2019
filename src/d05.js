const fs = require('fs');
const assert = require('assert');

const ADD = 1;
const MUL = 2;
const STO = 3;
const OUT = 4;
const END = 99;

const OPS = {
  [ADD]: ['ADD', 4],
  [MUL]: ['MUL', 4],
  [STO]: ['STO', 2],
  [OUT]: ['OUT', 2],
  [END]: ['END', 1]
};

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

function log(msg) {
  console.log('LOG:', msg);
}

function getInput() {
  const v = 1;
  //console.log('INPUT:', v);
  return v;
}

function step(p) {
  const data = p.cells;
  const index = p.index;

  const o = data[index];

  const os = ('0000' + o).split('').map((s) => parseInt(s, 10));
  const op = os.pop() + os.pop() * 10;
  const mA = !!os.pop();
  const mB = !!os.pop();
  const mC = !!os.pop();

  const [opName, num] = OPS[op];

  let a = '';
  let b = '';
  let c = '';
  let aa = '';
  let bb = '';
  let cc = '';

  if (num > 1) {
    a = data[index + 1];
    if (!mA) {
      aa = a;
      a = data[a];
    }
  }
  if (num > 2) {
    b = data[index + 2];
    if (!mB) {
      bb = b;
      b = data[b];
    }
  }
  if (num > 3) {
    c = data[index + 3];
    if (!mC) {
      cc = c;
      c = data[c];
    }
  }

  if (op === 1) {
    // ADD a + b => c
    data[cc] = a + b;
  } else if (op === 2) {
    // MUL a + b => c
    data[cc] = a * b;
  } else if (op === 3) {
    // STO a
    data[aa] = getInput();
  } else if (op === 4) {
    // OUT a
    log(data[aa]);
  }

  //console.log(`OP: ${o} | ${mC} ${mB} ${mA} | ${opName} (${op})`);
  //console.log(`A: ${a} (${aa})`);
  //console.log(`B: ${b} (${bb})`);
  //console.log(`C: ${c} (${cc})`);

  p.index += num;

  return data[p.index] !== END;
}

function runProgram(p) {
  while (!step(p));
}

function main() {
  const file = fs.readFileSync('input/05.txt').toString();
  const lines = file.split(',');
  const values = lines.map((v) => parseInt(v, 10));
  const p1 = createProgram(values);

  runProgram(p1);
  //console.log(`05a: ${p1.cells[0]}`);
  console.log('ALL DONE');
}

function test() {
  // runProgram
  (() => {
    const p = createProgram([1002, 4, 3, 4, 33]);
    runProgram(p);
    assert.deepEqual(p.cells, [1002, 4, 3, 4, 99]);
  })();
}

test();
main();
