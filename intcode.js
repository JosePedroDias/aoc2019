'use strict';

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
  return 1;
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
  }

  opcodeEl.innerHTML = `${o} | ${mC} ${mB} ${mA} | ${opName} (${op})`;
  aEl.innerHTML = `${a} (${aa})`;
  bEl.innerHTML = `${b} (${bb})`;
  cEl.innerHTML = `${c} (${cc})`;

  index += num;

  return data[index] !== 99;
}

function run() {
  let t;
  function runStep() {
    if (!step()) {
      clearInterval(t);
    }
  }
  t = setInterval(runStep, 250);
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
