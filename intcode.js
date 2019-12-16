'use strict';

const STEP_MS = 25;

function q(s) {
  return document.querySelector(s);
}

function parse(s) {
  return s.split(',').map((t) => parseInt(t, 10));
}

const inputEl = q('input');
const stepEl = q('.step');
const runEl = q('.run');
const memoryEl = q('.memory');
const indexEl = q('.index');
const opcodeEl = q('.opcode');
const aEl = q('.a');
const bEl = q('.b');
const cEl = q('.c');

const cells = [];

let index = 0;
let data;

const OPS = {
  1: ['ADD', 4],
  2: ['MUL', 4],
  3: ['STO', 2],
  4: ['OUT', 2],
  5: ['JIT', 3],
  6: ['JIF', 3],
  7: ['LTH', 4],
  8: ['EQU', 4],
  99: ['HALT', 1]
};

function updateCell(i, v) {
  cells[i].innerHTML = v;
  console.log(`cell #${i} set to ${v}`);
}

function log(msg) {
  const el = document.createElement('div');
  el.appendChild(document.createTextNode(msg));
  document.body.appendChild(el);
}

function getInput() {
  //return 1;
  return 5;
}

function step() {
  const o = data[index];

  const os = ('0000' + o).split('').map((s) => parseInt(s, 10));
  const op = os.pop() + os.pop() * 10;
  const mA = !!os.pop();
  const mB = !!os.pop();
  const mC = !!os.pop();

  const [opName, num] = OPS[op];

  cells.forEach((el, i) => {
    el.classList.toggle('selected', i >= index && i < index + num);
  });

  let a = '';
  let b = '';
  let c = '';
  let aa = '';
  let bb = '';
  let cc = '';

  if (num > 1) {
    a = data[index + 1];
    if (!mA) {
      aa = a;
      a = data[a];
    }
  }
  if (num > 2) {
    b = data[index + 2];
    if (!mB) {
      bb = b;
      b = data[b];
    }
  }
  if (num > 3) {
    c = data[index + 3];
    if (!mC) {
      cc = c;
      c = data[c];
    }
  }

  let jumped = false;
  if (op === 1) {
    // ADD a + b => c
    data[cc] = a + b;
    updateCell(cc, data[cc]);
  } else if (op === 2) {
    // MUL a + b => c
    data[cc] = a * b;
    updateCell(cc, data[cc]);
  } else if (op === 3) {
    // STO a
    data[aa] = getInput();
    updateCell(aa, data[aa]);
  } else if (op === 4) {
    // OUT a
    log(data[aa]);
  } else if (op === 5) {
    // JIT a b
    if (a) {
      index = b;
      jumped = true;
    }
  } else if (op === 6) {
    // JIF a b
    if (!a) {
      index = b;
      jumped = true;
    }
  } else if (op === 7) {
    // LTH a < b ? 1/0 => c
    const v = a < b ? 1 : 0;
    data[cc] = v;
    updateCell(cc, data[cc]);
  } else if (op === 8) {
    // EQU a == b ? 1/0 => c
    const v = a === b ? 1 : 0;
    data[cc] = v;
    updateCell(cc, data[cc]);
  }

  opcodeEl.innerHTML = `${o} | ${mC} ${mB} ${mA} | ${opName} (${op})`;
  aEl.innerHTML = `${a} (${aa})`;
  bEl.innerHTML = `${b} (${bb})`;
  cEl.innerHTML = `${c} (${cc})`;

  if (!jumped) {
    index += num;
  }

  return data[index] !== 99;
}

function run() {
  let t;
  function runStep() {
    if (!step()) {
      clearInterval(t);
    }
  }
  t = setInterval(runStep, STEP_MS);
}

function process(data_) {
  data = parse(data_);
  data.forEach((dd, i) => {
    const el = document.createElement('span');
    el.className = 'cell';
    el.title = i;
    el.appendChild(document.createTextNode(dd));
    memoryEl.appendChild(el);
    cells.push(el);
  });
}

///////////////////////////

function onFile(ev) {
  const f = ev.target.files[0];
  const reader = new FileReader();
  reader.addEventListener('load', (ev2) => {
    process(ev2.target.result);
  });
  reader.readAsText(f);
}

inputEl.addEventListener('change', onFile);
stepEl.addEventListener('click', step);
runEl.addEventListener('click', run);
