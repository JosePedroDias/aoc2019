import assert from 'assert';
import { loadFileToString } from './utils.mjs';

const KEYS = 'abcdefghijklmnopqrstuvwxyz'.split('');
const DOORS = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

function cloneMap(m) {
  return m.map((l) => l.slice());
}

function cloneArray(arr) {
  return arr.slice();
}

function clone(o) {
  return JSON.parse(JSON.stringify(o));
}

function immutableChangeMap(m, p, v) {
  const m2 = cloneMap(m);
  m2[p[1]][p[0]] = v;
  return m2;
}

function immutableAddToArray(arr, v) {
  const arr2 = arr.slice();
  arr2.push(v);
  return arr2;
}

function isClear(c) {
  return c === '.';
}

function isWall(c) {
  return c === '#';
}

function isEntrance(c) {
  return c === '@';
}

function isKey(c) {
  return KEYS.indexOf(c) !== -1;
}

function isDoor(c) {
  return DOORS.indexOf(c) !== -1;
}

function haveKeyTo(d, keys) {
  const k = d.toLowerCase();
  return keys.indexOf(k) !== -1;
}

function countKeys(map, W, H) {
  let numKeys = 0;
  for (let y = 0; y < H; ++y) {
    for (let x = 0; x < W; ++x) {
      if (isKey(map[y][x])) {
        ++numKeys;
      }
    }
  }
  return numKeys;
}

function findEntrance(map, W, H) {
  for (let y = 0; y < H; ++y) {
    for (let x = 0; x < W; ++x) {
      if (isEntrance(map[y][x])) {
        map[y][x] = '.';
        return [x, y];
      }
    }
  }
}

function logWay({ m, k, p, h }) {
  return `k:${k.length}`;
}

function logWays(ws) {
  return `(${ws.length}):` + ws.map(logWay).join(',');
}

function neighbours(map, keys, p) {
  const ps = [
    [p[0] - 1, p[1]],
    [p[0] + 1, p[1]],
    [p[0], p[1] - 1],
    [p[0], p[1] + 1]
  ];

  return ps
    .map((p) => ({ p: p, v: map[p[1]][p[0]] }))
    .filter((o) => !isWall(o.v))
    .filter((o) => isDoor(o.v) && haveKeyTo(o.v, keys));
}

function mapToString(map) {
  return map.map((l) => l.join('')).join('\n');
}

function solve(s) {
  let map = s.split('\n');
  const W = map[0].length;
  const H = map.length;
  map = map.map((l) => l.split(''));
  const p = findEntrance(map, W, H);
  const numKeys = countKeys(map, W, H);
  // m:map, k:keys, p:pos, h:history
  let ways = [{ m: map, k: [], p, h: [] }];

  function step(ways) {
    const ways2 = [];
    ways.forEach(({ m, k, p, h }) => {
      const ns = neighbours(m, k, p);
      ns.forEach(({ p, v }) => {
        if (isKey(v)) {
          ways2.push({
            m: immutableChangeMap(m, p, '.'),
            k: immutableAddToArray(k, v),
            p: p,
            h: immutableAddToArray(h, p)
          });

          if (k.length + 1 === numKeys) {
            const w = ways2[ways2.length - 1];
            throw w;
          }
        } else {
          ways2.push({
            m: cloneMap(m),
            k: cloneArray(k),
            p: p,
            h: immutableAddToArray(h, p)
          });
        }
      });
    });
    return ways2;
  }

  try {
    let i = 0;
    while (true) {
      ways = step(ways);
      console.log(++i, ways.length);
      //console.log(logWays(ways));
    }
  } catch (w) {
    return w;
  }
}

function main() {
  const s = loadFileToString('input/18.txt');
  //const w = solve(s);

  //console.log(ns);
  //console.log(numKeys);

  //console.log(mapToString(map));
  //console.log(p);
}

function test() {
  (() => {
    const s = `#########
#b.A.@.a#
#########`;
    const w = solve(s);
    //console.log('k', w.k);
    //console.log('h', w.h);
    assert.equal(w.h.length, 8);
  })();

  /*(() => {
    const s = `########################
#f.D.E.e.C.b.A.@.a.B.c.#
######################.#
#d.....................#
########################`;
    const w = solve(s);
    //console.log('k', w.k);
    //console.log('h', w.h);
    assert.equal(w.h.length, 8);
  })();*/
}

test();
main();
