const fs = require('fs');
const assert = require('assert');

const ADD = 1;
const MUL = 2;
const STR = 3;
const OUT = 4;
const END = 99;

// 321OP
// |||LL opcode
// ||L__ mode 1st param (0=position, 1=immediate)
// |L___ mode 2nd param
// L____ mode 3rd param

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
  const opcode2 = p.cells[p.index];
  const opcode_str = '' + opcode2;
  let l = opcode_str.length;
  const opcode = parseInt(opcode_str.substr(l - 2), 10);
  const mode1stImm = opcode_str[l - 3] === '1';
  const mode2ndImm = opcode_str[l - 4] === '1';
  //const mode3rdImm = opcode_str[l - 5] === '1'; // always immediate?
  console.log(
    `opcode_str:${opcode_str} opcode:${opcode} m1:${mode1stImm} m2:${mode2ndImm} m3:${''} a:${
      p.cells[p.index + 1]
    } b:${p.cells[p.index + 2]} c:${p.cells[p.index + 3]}`
  );
  if (opcode === STR) {
    const dst = p.cells[p.cells[p.index + 1]];
    const result = 1;
    p.cells[dst] = result;
    console.log(`#${p.index}: IN[${dst}] <- ${result}`);
    p.index += 2;
  } else if (opcode === OUT) {
    const a = mode1stImm ? p.cells[p.index + 1] : p.cells[p.cells[p.index + 1]];
    console.log(`#${p.index}: OUT ${a}`);
    p.index += 2;
  } else if (opcode === ADD || opcode === MUL) {
    const a = mode1stImm ? p.cells[p.index + 1] : p.cells[p.cells[p.index + 1]];
    const b = mode2ndImm ? p.cells[p.index + 2] : p.cells[p.cells[p.index + 2]];
    let result;
    if (opcode === ADD) {
      result = a + b;
    } else if (opcode === MUL) {
      result = a * b;
    }
    const dst = p.cells[p.index + 3];
    p.cells[dst] = result;
    console.log(
      `#${p.index}: [${dst}] <- ${result} (${a} ${
        opcode === ADD ? '+' : '*'
      } ${b})`
    );
    p.index += 4;
  } else if (opcode === END) {
    throw 'Should not have reached step of END!';
  } else {
    throw `Unsupported opcode ${opcode} at index ${p.index}!`;
  }
}

function runProgram(p) {
  while (!atEnd(p)) {
    step(p);
  }
}

function main() {
  const file = fs.readFileSync('input/05.txt').toString();
  const lines = file.split(',');
  const values = lines.map((v) => parseInt(v, 10));
  const p1 = createProgram(values);

  runProgram(p1);
  console.log(`05a: ${p1.cells[0]}`);
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
//main();
