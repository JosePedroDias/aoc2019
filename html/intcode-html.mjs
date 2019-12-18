import { createProgram, stepProgram, log } from '../src/intcode.mjs';

function q(s) {
  return document.querySelector(s);
}

function parse(s) {
  return s.split(',').map((t) => parseInt(t, 10));
}

const fileEl = q('.file');
const stepMsEl = q('.step_ms');
const stepEl = q('.step');
const runEl = q('.run');
const memoryEl = q('.memory');

const statEls = {
  index: q('.index'),
  opcode: q('.opcode'),
  offset: q('.offset'),
  a: q('.a'),
  b: q('.b'),
  c: q('.c')
};

let p, cells, repeatInput;

function getInput() {
  if (repeatInput) {
    return repeatInput;
  }

  let v = prompt('Value? (end input with excl mark to keep providing this)', 0);
  if (v[v.length - 1] === '!') {
    repeatInput = v;
  }
  return parseInt(v, 10);
}

function highlightCells(arrIndices) {
  cells.forEach((el, idx) => {
    const isSelected = arrIndices.indexOf(idx) !== -1;
    el.classList.toggle('selected', isSelected);
  });
}

function updateCellValue(idx, val) {
  cells[idx].innerHTML = val;
  console.log(`cell #${idx} set to ${val}`);
}

function updateStat(stat, val) {
  const el = statEls[stat];
  if (!el) {
    return;
  }
  el.innerHTML = val;
}

function step() {
  try {
    return stepProgram(
      p,
      getInput,
      log,
      highlightCells,
      updateCellValue,
      updateStat
    );
  } catch (ex) {
    console.error(ex);
    window.alert(ex);
    return false;
  }
}

function run() {
  const stepMs = stepMsEl.value;
  let t;
  function runStep() {
    if (!step()) {
      clearInterval(t);
    }
  }
  t = setInterval(runStep, stepMs);
}

function process(data_) {
  const data = parse(data_);

  repeatInput = undefined;
  cells = [];
  p = createProgram(data);

  memoryEl.innerHTML = '';

  data.forEach((dd, i) => {
    const el = document.createElement('span');
    el.className = 'cell';
    el.title = i;
    el.appendChild(document.createTextNode(dd));
    memoryEl.appendChild(el);
    cells.push(el);
  });

  for (let k of Object.keys(statEls)) {
    updateStat(k, '');
  }
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

fileEl.addEventListener('change', onFile);
stepEl.addEventListener('click', step);
runEl.addEventListener('click', run);
