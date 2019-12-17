import fs from 'fs';
import assert from 'assert';

function main() {
  const file = fs.readFileSync('input/16.txt').toString();
  const lines = file.split('\n');
}

function test() {
  (() => {
    assert.equal(true, true);
  })();
}

test();
main();
