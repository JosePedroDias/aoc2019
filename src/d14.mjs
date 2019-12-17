import fs from 'fs';
import assert from 'assert';

function parse(s) {
  function part(s) {
    const [l, r] = s.split(' ');
    return { n: parseInt(l, 10), s: r };
  }

  const lines = s.split('\n');
  return lines.map((li) => {
    const [from, to] = li.split(' => ');
    const froms = from.split(', ');
    return { l: froms.map(part), r: part(to) };
  });
}

function resultingInSubstance(sts, subst) {
  return sts.filter((st) => st.r.s === subst);
}

function fromSubstance(sts, subst) {
  return sts.filter((st) => st.l.some((o) => o.s === subst));
}

function handleRequirement(req) {
  const mul = req.r.n;
  return req.l.map((o) => ({ n: mul * o.n, s: o.s }));
}

function compute(sts) {
  const reqs = resultingInSubstance(sts, 'FUEL');
  const step = reqs.map(handleRequirement);
  console.log(step);
}

function main() {
  const fileS = fs.readFileSync('input/14.txt').toString();
  const sts = parse(fileS);
  const reqs = resultingInSubstance(sts, 'FUEL');
  console.log(JSON.stringify(reqs, null, 2));
  //console.log(JSON.stringify(statements, null, 2));
}

function test() {
  (() => {
    const ex1 = `10 ORE => 10 A
1 ORE => 1 B
7 A, 1 B => 1 C
7 A, 1 C => 1 D
7 A, 1 D => 1 E
7 A, 1 E => 1 FUEL`;
    const sts = parse(ex1);
    assert.deepEqual(sts, [
      {
        l: [{ n: 10, s: 'ORE' }],
        r: { n: 10, s: 'A' }
      },
      {
        l: [{ n: 1, s: 'ORE' }],
        r: { n: 1, s: 'B' }
      },
      {
        l: [
          { n: 7, s: 'A' },
          { n: 1, s: 'B' }
        ],
        r: { n: 1, s: 'C' }
      },
      {
        l: [
          { n: 7, s: 'A' },
          { n: 1, s: 'C' }
        ],
        r: { n: 1, s: 'D' }
      },
      {
        l: [
          { n: 7, s: 'A' },
          { n: 1, s: 'D' }
        ],
        r: { n: 1, s: 'E' }
      },
      {
        l: [
          { n: 7, s: 'A' },
          { n: 1, s: 'E' }
        ],
        r: { n: 1, s: 'FUEL' }
      }
    ]);

    const reqs = resultingInSubstance(sts, 'FUEL');
    assert.deepEqual(reqs, [
      {
        l: [
          { n: 7, s: 'A' },
          { n: 1, s: 'E' }
        ],
        r: { n: 1, s: 'FUEL' }
      }
    ]);

    const need = handleRequirement(reqs[0]);
    assert.deepEqual(need, [
      { n: 7, s: 'A' },
      { n: 1, s: 'E' }
    ]);

    const step = compute(sts);
  })();
}

test();
//main();
