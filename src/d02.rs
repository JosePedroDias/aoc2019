/*
99 - - -   HALT
1 a b to   ADD
2 a b to   MUL
move 4 positions at a time

replace position 1 with the value 12 and
replace position 2 with the value 2.

What value is left at position 0 after the program halts?
*/

const ADD: u32 = 1_u32;
const MUL: u32 = 2_u32;
const END: u32 = 99_u32;

fn step(prog: Vec<u32>, pos: usize) -> usize {
    let opcode = prog[pos];
    if opcode == ADD {
        let arg1 = prog[pos + 1] as usize;
        let arg2 = prog[pos + 2] as usize;
        let arg3 = prog[pos + 3] as usize;
    //prog[arg3] = prog[arg1] + prog[arg2];
    } else if opcode == MUL {
    } else if opcode == END {
    } else {
    }
    return pos;
}

pub fn run() {
    let file_string: String = std::fs::read_to_string("input/02.txt").unwrap();
    let lines = file_string.split_terminator(',');
    let prog: Vec<u32> = lines.map(|line| line.parse::<u32>().unwrap()).collect();
    //println!("{:#?}", prog);
    step(prog, 0);
}

/*
#[cfg(test)]
mod tests {
    use super::*;
}
*/
