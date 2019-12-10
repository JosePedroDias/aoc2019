const fs = require('fs');
const assert = require('assert');

function parse(s) {
  const lines = s.split('\n');
  return lines.map((l) => l.split(')'));
}

function createMatrix(m, n) {
  const mtx = new Array(m).fill(0).map((_) => {
    const arr = new Array(n);
    arr.fill(0);
    return arr;
  });
  return mtx;
}

function mapMatrix(m, fn) {
  const d1 = m.length;
  const d2 = m[0].length;
  for (let a = 0; a < d1; ++a) {
    for (let b = 0; b < d2; ++b) {
      m[a][b] = fn(a, b);
    }
  }
}

// DAG connectedness https://algs4.cs.princeton.edu/42digraph/

function process(pairs) {
  //console.log(pairs);

  let set = new Set();
  pairs.forEach(([a, b]) => {
    set.add(a);
    set.add(b);
  });

  const edges = Array.from(set);
  const edgeIndexes = new Map();
  edges.forEach((e, i) => {
    edgeIndexes.set(e, i);
  });

  const L = edges.length;
  const m = createMatrix(L, L);
  mapMatrix(m, (m, n) => 0);

  pairs.forEach(([a, b]) => {
    const iA = edgeIndexes.get(a);
    const iB = edgeIndexes.get(b);
    m[iA][iB] = 1;
    //m[iB][iA] = 1;
  });

  //console.log(edgeIndexes);
  //console.log(m);

  function isOrbiting(i1, i2) {
    return m[i1][i2];
  }

  function orbitsOf(i1) {
    const arr = m[i1];
    return arr.reduce((p, v, i) => (v ? [...p, i] : p), []);
  }

  function isIndirectlyOrbiting(i1, i2) {
    if (isOrbiting(i1, i2)) {
      return true;
    }
    const orbsI1 = orbitsOf(i1);
    for (let i3 of orbsI1) {
      if (isIndirectlyOrbiting(i3, i2)) {
        return true;
      }
    }
  }

  let i = 0;
  for (let a = 0; a < L; ++a) {
    for (let b = 0; b < L; ++b) {
      if (a === b) {
        continue;
      }
      if (isIndirectlyOrbiting(a, b)) {
        ++i;
        //console.log(`#${i} ${edges[a]} -> ${edges[b]}`);
      }
    }
  }

  return i;
}

function main() {
  const fileS = fs.readFileSync('input/06.txt').toString();
  const pairs = parse(fileS);

  //console.log(pairs.length);
  //process(pairs);

  //console.log(`06a: ${process(pairs)}`);
}

function test() {
  const EX = `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L`;

  () => {
    assert.deepEqual(parse(EX), [
      ['COM', 'B'],
      ['B', 'C'],
      ['C', 'D'],
      ['D', 'E'],
      ['E', 'F'],
      ['B', 'G'],
      ['G', 'H'],
      ['D', 'I']
    ]);
  }; //();

  (() => {
    assert.equal(process(parse(EX)), 42);
  })();
}

test();
main();
