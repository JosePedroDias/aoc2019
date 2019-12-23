import { loadFileToString } from './utils.mjs';
import assert from 'assert';

function newDeck(n) {
  const arr = new Array(n);
  arr.fill(0);
  return arr.map((_, i) => i);
}

function cloneArr(arr) {
  return arr.slice();
}

function dealIntoNewStack(arr) {
  const n = arr.length;
  const arr2 = new Array(n);
  for (let i = 0; i < n; ++i) {
    arr2[n - i - 1] = arr[i];
  }
  return arr2;
}

function cutNCards(arr_, n) {
  const l = arr_.length;
  const p2 = cloneArr(arr_);
  let p1;
  if (n < 0) {
    p1 = p2.splice(l + n, -n);
    return p1.concat(p2);
  } else {
    p1 = p2.splice(0, n);
    return p2.concat(p1);
  }
}

function dealIncrementN(arr, n) {
  const l = arr.length;
  const arr2 = new Array(l);
  let c = 0;
  for (let i = 0; i < l; ++i) {
    arr2[c % l] = arr[i];
    c += n;
  }
  return arr2;
}

const tools = {
  new: dealIntoNewStack,
  increment: dealIncrementN,
  cut: cutNCards
};

function parse(s) {
  const lines = s.split('\n');
  return lines.map((l) => {
    const parts = l.split(' ');
    const last = parseInt(parts.pop(), 10);
    const op = parts.pop();
    return [op, last];
  });
}

function run_(arr, shuffle) {
  shuffle.forEach(([op, arg]) => {
    arr = tools[op](arr, arg);
  });
  return arr;
}

function run(s, n) {
  const arr = newDeck(n);
  const shuffle = parse(s);
  return run_(arr, shuffle);
}

function runTimes(s, n, t) {
  let arr = newDeck(n);
  const shuffle = parse(s);
  for (let i = 0; i < t; ++i) {
    arr = run_(arr, shuffle);
  }
  return arr;
}

function main() {
  const s = loadFileToString('input/22.txt');
  {
    const arr = run(s, 10007);
    const i = arr.indexOf(2019);
    console.log(`22a: ${i}`);
  }

  {
    const arr = runTimes(s, 119315717514047, 101741582076661);
    const i = arr[2020];
    console.log(`22b: ${i}`);
  }
}

function test() {
  (() => {
    const arr = newDeck(10);
    assert.deepEqual(arr, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  })();

  (() => {
    const a = newDeck(10);
    const b = dealIntoNewStack(a);
    assert.deepEqual(b, [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);

    const c = ['a', 'b', 'c'];
    const d = dealIntoNewStack(c);
    assert.deepEqual(d, ['c', 'b', 'a']);
  })();

  (() => {
    const a = newDeck(10);
    const b = cutNCards(a, 3);
    assert.deepEqual(b, [3, 4, 5, 6, 7, 8, 9, 0, 1, 2]);

    const c = cutNCards(a, -4);
    assert.deepEqual(c, [6, 7, 8, 9, 0, 1, 2, 3, 4, 5]);
  })();

  (() => {
    const a = newDeck(10);
    const b = dealIncrementN(a, 3);
    assert.deepEqual(b, [0, 7, 4, 1, 8, 5, 2, 9, 6, 3]);
  })();

  (() => {
    const a = newDeck(10);
    const b = dealIncrementN(a, 7);
    const c = dealIntoNewStack(b);
    const d = dealIntoNewStack(c);
    assert.deepEqual(d, [0, 3, 6, 9, 2, 5, 8, 1, 4, 7]);
  })();

  (() => {
    const a = newDeck(10);
    const b = cutNCards(a, 6);
    const c = dealIncrementN(b, 7);
    const d = dealIntoNewStack(c);
    assert.deepEqual(d, [3, 0, 7, 4, 1, 8, 5, 2, 9, 6]);
  })();

  (() => {
    const s = `deal with increment 7
deal with increment 9
cut -2`;
    const arr = run(s, 10);
    assert.deepEqual(arr, [6, 3, 0, 7, 4, 1, 8, 5, 2, 9]);
  })();

  (() => {
    const s = `deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1`;
    const arr = run(s, 10);
    assert.deepEqual(arr, [9, 2, 5, 8, 1, 4, 7, 0, 3, 6]);
  })();
}

test();
main();
