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

const VALID_MODES = [0, 1];

const VALID_OPS = Object.keys(OPS).map((s) => parseInt(s, 10));

export function log(msg) {
  console.log('LOG:', msg);
}

export function getInputN(n) {
  return function() {
    //console.log('INPUT:', n);
    return n;
  };
}

export function stepProgram(
  p,
  getInput,
  log,
  highlightCells,
  updateCellValue,
  updateStat
) {
  const data = p.cells;
  const i = p.index;

  //console.log(`\n---------\nindex: ${i}zn`);

  const o = data[i];

  const os = ('0000' + o).split('').map((s) => parseInt(s, 10));
  const op = os.pop() + os.pop() * 10;
  const mA = os.pop();
  const mB = os.pop();
  const mC = os.pop();

  if (VALID_OPS.indexOf(op) === -1) {
    throw `at index ${i} found unsupported op ${op}!`;
  }

  if (VALID_MODES.indexOf(mA) === -1) {
    throw `at index ${i} found unsupported mode ${mA} for 1st argument!`;
  }
  if (VALID_MODES.indexOf(mB) === -1) {
    throw `at index ${i} found unsupported mode ${mB} for 2nd argument!`;
  }
  if (VALID_MODES.indexOf(mC) === -1) {
    throw `at index ${i} found unsupported mode ${mC} for 3rd argument!`;
  }

  const [opName, num] = OPS[op];

  if (highlightCells) {
    const arr = [];
    for (let x = i; x < i + num; ++x) {
      arr.push(x);
    }
    highlightCells(arr);
  }

  let a = '';
  let b = '';
  let c = '';
  let aa = '';
  let bb = '';
  let cc = '';

  if (num > 1) {
    a = data[i + 1];
    if (mA === 0) {
      aa = a;
      a = data[a];
    }
  }
  if (num > 2) {
    b = data[i + 2];
    if (mB === 0) {
      bb = b;
      b = data[b];
    }
  }
  if (num > 3) {
    c = data[i + 3];
    if (mC === 0) {
      cc = c;
      c = data[c];
    }
  }

  let jumped = false;

  if (op === 1) {
    // ADD a + b => c
    data[cc] = a + b;
    updateCellValue && updateCellValue(cc, data[cc]);
  } else if (op === 2) {
    // MUL a + b => c
    data[cc] = a * b;
    updateCellValue && updateCellValue(cc, data[cc]);
  } else if (op === 3) {
    // STO a
    data[aa] = getInput();
    updateCellValue && updateCellValue(aa, data[aa]);
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
    updateCellValue && updateCellValue(cc, data[cc]);
  } else if (op === 8) {
    // EQU a == b ? 1/0 => c
    const v = a === b ? 1 : 0;
    data[cc] = v;
    updateCellValue && updateCellValue(cc, data[cc]);
  }

  if (!jumped) {
    p.index += num;
  }

  if (updateStat) {
    updateStat('opcode', `${opName} (${op}) | ${mC} ${mB} ${mA}`);
    updateStat('index', `${p.index}`);
    updateStat('a', `${a} (${aa})`);
    updateStat('b', `${b} (${bb})`);
    updateStat('c', `${c} (${cc})`);
  }

  return data[p.index] !== 99;
}

export function runProgram(values, getInput, log) {
  const p = {
    index: 0,
    cells: values.slice()
  };
  while (stepProgram(p, getInput, log));
  return p.cells;
}
