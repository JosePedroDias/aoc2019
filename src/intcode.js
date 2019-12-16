const OPS = {
  1: ['ADD', 4],
  2: ['MUL', 4],
  3: ['STO', 2],
  4: ['OUT', 2],
  5: ['JIT', 3],
  6: ['JIF', 3],
  7: ['LTH', 4],
  8: ['EQU', 4],
  99: ['END', 1]
};

const VALID_OPS = Object.keys(OPS).map((s) => parseInt(s, 10));

function log(msg) {
  console.log('LOG:', msg);
}

function getInputN(n) {
  return function() {
    //console.log('INPUT:', n);
    return n;
  };
}

function step(p, getInput, log) {
  const data = p.cells;
  const i = p.index;

  //console.log(`\n---------\nindex: ${i}zn`);

  const o = data[i];

  const os = ('0000' + o).split('').map((s) => parseInt(s, 10));
  const op = os.pop() + os.pop() * 10;
  const mA = !!os.pop();
  const mB = !!os.pop();
  const mC = !!os.pop();

  if (VALID_OPS.indexOf(op) === -1) {
    throw `at index ${i} found unsupported op ${op}!`;
  }

  const [opName, num] = OPS[op];

  let a = '';
  let b = '';
  let c = '';
  let aa = '';
  let bb = '';
  let cc = '';

  if (num > 1) {
    a = data[i + 1];
    if (!mA) {
      aa = a;
      a = data[a];
    }
  }
  if (num > 2) {
    b = data[i + 2];
    if (!mB) {
      bb = b;
      b = data[b];
    }
  }
  if (num > 3) {
    c = data[i + 3];
    if (!mC) {
      cc = c;
      c = data[c];
    }
  }

  let jumped = false;

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
  } else if (op === 5) {
    // JIT a b
    if (a) {
      p.index = b;
      jumped = true;
    }
  } else if (op === 6) {
    // JIF a b
    if (!a) {
      p.index = b;
      jumped = true;
    }
  } else if (op === 7) {
    // LTH a < b ? 1/0 => c
    const v = a < b ? 1 : 0;
    data[cc] = v;
  } else if (op === 8) {
    // EQU a == b ? 1/0 => c
    const v = a === b ? 1 : 0;
    data[cc] = v;
  }

  /*console.log(`OP: ${o} | ${mC} ${mB} ${mA} | ${opName} (${op})`);
  console.log(`A: ${a} (${aa})`);
  console.log(`B: ${b} (${bb})`);
  console.log(`C: ${c} (${cc})`);*/

  if (!jumped) {
    p.index += num;
  }

  return data[p.index] !== 99;
}

function runProgram(values, getInput, log) {
  const p = {
    index: 0,
    cells: values.slice()
  };
  while (step(p, getInput, log));
  return p.cells;
}

module.exports = {
  runProgram,
  getInputN,
  log
};
