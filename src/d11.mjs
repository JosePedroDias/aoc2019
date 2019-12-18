import assert from 'assert';
import { runProgram, updateStat } from './intcode.mjs';
import { loadFileToString } from './utils.mjs';

function main() {
  const s = loadFileToString('input/11.txt');
  const prog = s.split(',').map((v) => parseInt(v, 10));

  let step = 0;
  const cam = {};
  const pos = [0, 0];
  let orientation = 0; // up
  // direction 0 => left, 1 => right
  const deltas = [
    [0, -1], // up
    [-1, 0], // left
    [0, 1], // down
    [1, 0] // right
  ];
  let dPos = deltas[orientation];

  function rotate(orient, signal) {
    const dt = signal ? -1 : 1;
    return (orient + 4 + dt) % 4;
  }

  // in: curr cam color
  // out: 1) cam robot is over; 2) turn dir (0=left, 1=right)
  // turn and move forward

  runProgram(prog, {
    getInput: () => {
      return cam[pos.join(',')] || 0;
    },
    log: (v) => {
      if (step % 2 === 0) {
        cam[pos.join(',')] = v;
      } else {
        orientation = rotate(orientation, v);
        dPos = deltas[orientation];
        pos[0] += dPos[0];
        pos[1] += dPos[1];
      }
      ++step;
    }
  });

  const visited = Object.values(cam);
  const whiteCellsCount = visited.filter((v) => v === 1).length;

  console.log(`11a: ${whiteCellsCount} / ${visited.length}`);
}

function test() {
  (() => {})();
}

test();
main();
