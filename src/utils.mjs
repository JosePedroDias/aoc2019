import fs from 'fs';

export function loadFileToString(path) {
  return fs.readFileSync(path).toString();
}

// permutation - order is important
export function permutations5(n) {
  let i, j, k, l, m;
  const arr = [];
  for (i = 0; i < n; ++i) {
    for (j = 0; j < n; ++j) {
      if (j === i) continue;
      for (k = 0; k < n; ++k) {
        if (k === i || k === j) continue;
        for (l = 0; l < n; ++l) {
          if (l === i || l === j || l === k) continue;
          for (m = 0; m < n; ++m) {
            if (m === i || m === j || m === k || m === l) continue;
            arr.push([i, j, k, l, m]);
          }
        }
      }
    }
  }
  return arr;
}

// combination - order is not important
export function combinations2(n) {
  const arr = [];
  for (let i = 0, j; i < n; ++i) {
    for (j = 0; j < n; ++j) {
      if (i !== j) {
        arr.push([i, j]);
      }
    }
  }
  return arr;
}

function test() {
  (() => {
    //console.log(combinations2(4));
  })();
  (() => {
    console.log(permutations5(3));
  })();
}

//test();
