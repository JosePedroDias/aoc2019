import fs from 'fs';
import assert from 'assert';

function parse(s) {
  const lines = s.split('\n');
  return lines.map((l) => l.split(')'));
}

// DAG connectedness
// https://algs4.cs.princeton.edu/42digraph/
// https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/

function process(pairs) {
  //console.log(pairs);

  const edges_ = new Set();
  const dag = new Map();

  pairs.forEach(([a, b]) => {
    edges_.add(a);
    edges_.add(b);

    if (!dag.has(a)) {
      s = new Set();
      dag.set(a, s);
    } else {
      s = dag.get(a);
    }
    s.add(b);
  });

  function isOrbiting(a, b) {
    const s = dag.get(a);
    if (!s) {
      return false;
    }
    return s.has(b);
  }

  function orbitsOf(a) {
    const s = dag.has(a);
    if (!s) {
      return [];
    }
    return Array.from(dag.get(a));
    //return dag.get(a);
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

  //console.log(dag);

  const edges = Array.from(edges_);
  const L = edges.length;
  //console.log(edges);
  console.log(L);

  let i = 0;

  function dfsAux(a, visited) {
    visited.add(a);
    for (let b of orbitsOf(a)) {
      if (!visited.has(b)) {
        ++i;
        console.log(`${a} ${b}`);
        dfsAux(b, visited);
      }
    }
  }

  dfsAux('COM', new Set());

  /*for (let a = 0; a < L; ++a) {
    for (let b = 0; b < L; ++b) {
      if (a === b) {
        continue;
      }
      const A = edges[a];
      const B = edges[b];
      if (isIndirectlyOrbiting(A, B)) {
        ++i;
        //console.log(`#${i} ${A} -> ${B}`);
      }
    }
  }*/

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
