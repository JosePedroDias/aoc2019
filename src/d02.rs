/*
99 - - -   HALT
1 a b to   ADD
2 a b to   MUL
move 4 positions at a time

replace position 1 with the value 12 and
replace position 2 with the value 2.

What value is left at position 0 after the program halts?
*/

const ADD: u32 = 1;
const MUL: u32 = 2;
const END: u32 = 99;

#[derive(Debug)]
struct Program {
    index: usize,
    cells: Vec<u32>,
}

fn at_end(p: &Program) -> bool {
    let opcode: u32 = p.cells[p.index];
    return opcode == END;
}

fn step(p: &mut Program) {
    let opcode = p.cells[p.index];
    if opcode == ADD {
        let a = p.cells[p.index + 1] as usize;
        let b = p.cells[p.index + 2] as usize;
        let dst = p.cells[p.index + 3] as usize;
        p.cells[dst] = p.cells[a] + p.cells[b];
    } else if opcode == MUL {
        let a = p.cells[p.index + 1] as usize;
        let b = p.cells[p.index + 2] as usize;
        let dst = p.cells[p.index + 3] as usize;
        p.cells[dst] = p.cells[a] * p.cells[b];
    } else if opcode == END {
        panic!("should have not reached step of END!");
    } else {
        panic!("unsupported opcode: {}!", opcode);
    }
}

fn run_program(p: &mut Program) {
    loop {
        if at_end(&p) {
            return;
        }
        step(&mut p);
    }
}

pub fn run() {
    let file_string: String = std::fs::read_to_string("input/02.txt").unwrap();
    let lines = file_string.split_terminator(',');
    let values: Vec<u32> = lines.map(|line| line.parse::<u32>().unwrap()).collect();
    let mut program = Program {
        index: 0,
        cells: values,
    };
    let b = at_end(&program);
    println!("{}", b);
    step(&mut program);
    run_program(&mut program);
    println!("{:#?}", program);
}

#[cfg(test)]
mod tests {
    //use super::*;
}
