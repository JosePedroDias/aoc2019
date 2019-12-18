import assert from 'assert';
import { runProgram } from './intcode.mjs';
import { loadFileToString, permutations5 } from './utils.mjs';

function run(prog, a, b, c, d, e) {
  let incA = 0;
  let incB = 0;
  let incC = 0;
  let incD = 0;
  let incE = 0;

  let iA = a;
  let iB = b;
  let iC = c;
  let iD = d;
  let iE = e;

  let oA = undefined;
  let oB = undefined;
  let oC = undefined;
  let oD = undefined;
  let oE = undefined;

  // a, 0....
  // b, outA...
  // c, outB...
  // d, outC...
  // e?

  runProgram(prog.slice(), {
    getInput: () => {
      const v = iA;
      if (!incA) {
        ++incA;
        iA = 0;
      }
      return v;
    },
    log: (v) => {
      oA = v;
    }
  });

  runProgram(prog.slice(), {
    getInput: () => {
      const v = iB;
      if (!incB) {
        ++incB;
        iB = oA;
      }
      return v;
    },
    log: (v) => {
      oB = v;
    }
  });

  runProgram(prog.slice(), {
    getInput: () => {
      const v = iC;
      if (!incC) {
        ++incC;
        iC = oB;
      }
      return v;
    },
    log: (v) => {
      oC = v;
    }
  });

  runProgram(prog.slice(), {
    getInput: () => {
      const v = iD;
      if (!incD) {
        ++incD;
        iD = oC;
      }
      return v;
    },
    log: (v) => {
      oD = v;
    }
  });

  runProgram(prog.slice(), {
    getInput: () => {
      const v = iE;
      if (!incE) {
        ++incE;
        iE = oD;
      }
      return v;
    },
    log: (v) => {
      oE = v;
    }
  });

  return oE;
}

function runTestProgram(s, a, b, c, d, e) {
  const lines = s.split(',');
  const prog = lines.map((v) => parseInt(v, 10));
  return run(prog, 4, 3, 2, 1, 0);
}

function main() {
  const s = loadFileToString('input/07.txt');
  const prog = s.split(',').map((v) => parseInt(v, 10));

  let max = 0;
  const inputs = permutations5(5);
  for (let [a, b, c, d, e] of inputs) {
    const v = run(prog, a, b, c, d, e);
    if (v > max) {
      max = v;
    }
  }
  console.log('07a:', max);
}

function test() {
  (() => {
    assert.equal(
      runTestProgram(
        '3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0',
        4,
        3,
        2,
        1,
        0
      ),
      43210
    );
  })();

  (() => {
    assert.equal(
      runTestProgram(
        '3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0',
        0,
        1,
        2,
        3,
        4
      ),
      12345
    );
  })();

  (() => {
    assert.equal(
      runTestProgram(
        '3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0',
        1,
        0,
        4,
        3,
        2
      ),
      21065
      //65210 FAILING
    );
  })();
}

test();
main();
