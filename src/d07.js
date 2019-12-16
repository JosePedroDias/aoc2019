const fs = require('fs');
const assert = require('assert');
const { runProgram } = require('./intcode');

function run(prog, a, b, c, d, e) {
  let iA = undefined;
  let iB = b;
  let iC = c;
  let iD = d;
  let iE = e;

  let oA = undefined;
  let oB = undefined;
  let oC = undefined;
  let oD = undefined;
  let oE = undefined;

  function inA() {
    const v = iA;
    ia = 0;
    return v;
  }
  function inB() {
    return iB;
  }
  function inC() {
    return iC;
  }
  function inD() {
    return iD;
  }
  function inE() {
    return iE;
  }

  function outA(v) {
    oA = v;
  }
  function outB(v) {
    oB = v;
  }
  function outC(v) {
    oC = v;
  }
  function outD(v) {
    oD = v;
  }
  function outE(v) {
    oE = v;
  }

  // a, 0....
  // b, outA...
  // c, outB...
  // d, outC...
  // e?

  runProgram(prog, inA, outA);
  runProgram(prog, inB, outB);
  runProgram(prog, inC, outC);
  runProgram(prog, inD, outE);
  runProgram(prog, inE, outE);

  console.log(oE);

  return oE;
}

function main() {
  const file = fs.readFileSync('input/07.txt').toString();
  const lines = file.split(',');
  const prog = lines.map((v) => parseInt(v, 10));

  console.log('07a:');
  run(prog, 4, 3, 2, 1, 0);
}

function test() {
  (() => {})();
}

test();
main();
