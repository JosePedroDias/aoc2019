const OPS = {
  1: ['ADD', 4],
  2: ['MUL', 4],
  3: ['STO', 2],
  4: ['OUT', 2],
  5: ['JIT', 3],
  6: ['JIF', 3],
  7: ['LTH', 4],
  8: ['EQU', 4],
  9: ['RBO', 2],
  99: ['HALT', 1]
};

const OP_ADD = 1;
const OP_MUL = 2;
const OP_STO = 3;
const OP_OUT = 4;
const OP_JIT = 5;
const OP_JIF = 6;
const OP_LTH = 7;
const OP_EQU = 8;
const OP_RBO = 9;
const OP_HALT = 99;

const MODE_POSITION = 0;
const MODE_IMMEDIATE = 1;
const MODE_RELATIVE = 2;

const VALID_MODES = [MODE_POSITION, MODE_IMMEDIATE, MODE_RELATIVE];

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

export function updateStat(st, v) {
  if (st === 'opcode') {
    console.log('');
  }
  console.log(`${st}: ${v}`);
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
    if (mA === MODE_POSITION) {
      aa = a;
      a = data[a];
    } else if (mA === MODE_RELATIVE) {
      aa = a;
      a = data[a + p.relBase];
    } // else immediate
  }
  if (num > 2) {
    b = data[i + 2];
    if (mB === MODE_POSITION) {
      bb = b;
      b = data[b];
    } else if (mB === MODE_RELATIVE) {
      bb = b;
      b = data[b + p.relBase];
    }
  }
  if (num > 3) {
    c = data[i + 3];
    if (mC === MODE_POSITION) {
      cc = c;
      c = data[c];
    } else if (mC === MODE_RELATIVE) {
      cc = c;
      c = data[c + p.relBase];
    }
  }

  let jumped = false;

  if (op === OP_ADD) {
    // ADD a + b => c
    const v = a + b;
    data[cc] = v;
    updateCellValue && updateCellValue(cc, v);
  } else if (op === OP_MUL) {
    // MUL a * b => c
    const v = a * b;
    data[cc] = v;
    updateCellValue && updateCellValue(cc, v);
  } else if (op === OP_STO) {
    // STO a
    const v = getInput();
    data[aa] = v;
    updateCellValue && updateCellValue(aa, v);
  } else if (op === OP_OUT) {
    // OUT a
    log(data[aa]);
  } else if (op === OP_JIT) {
    // JIT a b
    if (a) {
      p.index = b;
      jumped = true;
    }
  } else if (op === OP_JIF) {
    // JIF a b
    if (!a) {
      p.index = b;
      jumped = true;
    }
  } else if (op === OP_LTH) {
    // LTH a < b ? 1/0 => c
    const v = a < b ? 1 : 0;
    data[cc] = v;
    updateCellValue && updateCellValue(cc, v);
  } else if (op === OP_EQU) {
    // EQU a == b ? 1/0 => c
    const v = a === b ? 1 : 0;
    data[cc] = v;
    updateCellValue && updateCellValue(cc, v);
  } else if (op === OP_RBO) {
    // RBO a => relBase += a
    p.relBase += a;
  }

  if (!jumped) {
    p.index += num;
  }

  if (updateStat) {
    updateStat('opcode', `${opName} (${op}) | modes:${mA}${mB}${mC}`);
    updateStat('offset', `${p.relBase}`);
    updateStat('index', `${p.index}`);
    updateStat('a', `${a} (${aa})`);
    updateStat('b', `${b} (${bb})`);
    updateStat('c', `${c} (${cc})`);
  }

  return data[p.index] !== OP_HALT;
}

export function createProgram(values, extendMemory) {
  let mem = values.slice();

  // extend memory to 11x its original source code, zero initializing the remaining 10x
  if (extendMemory) {
    let mem2 = new Array(mem.length * 10).fill(0);
    mem = mem.concat(mem2);
  }

  return {
    index: 0,
    relBase: 0,
    cells: mem
  };
}

export function runProgram(
  values,
  { getInput, log, highlightCells, updateCellValue, updateStat, extendMemory }
) {
  const p = createProgram(values, extendMemory);
  while (
    stepProgram(p, getInput, log, highlightCells, updateCellValue, updateStat)
  );
  return p.cells;
}
