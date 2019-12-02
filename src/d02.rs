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

fn at_end(prog: &Vec<u32>, pos: usize) -> bool {
    let opcode = prog[pos];
    return opcode == END;
}

fn step(prog: &mut Vec<u32>, pos: usize) -> usize {
    let opcode = prog[pos];
    if opcode == ADD {
        let arg1 = prog[pos + 1] as usize;
        let arg2 = prog[pos + 2] as usize;
        let arg3 = prog[pos + 3] as usize;
        prog[arg3] = prog[arg1] + prog[arg2];
    } else if opcode == MUL {
        let arg1 = prog[pos + 1] as usize;
        let arg2 = prog[pos + 2] as usize;
        let arg3 = prog[pos + 3] as usize;
        prog[arg3] = prog[arg1] * prog[arg2];
    } else if opcode == END {
        panic!("should have not reached step of END!");
    } else {
        panic!("unsupported opcode: {}!", opcode);
    }
    return pos + 4;
}

fn run_prog(prog: &mut Vec<u32>) {
    let mut i = 0;
    loop {
        if at_end(&prog, i) {
            return;
        }
        i = step(&mut prog, i); // TODO STUCK HERE
    }
}

pub fn run() {
    let file_string: String = std::fs::read_to_string("input/02.txt").unwrap();
    let lines = file_string.split_terminator(',');
    let mut prog: Vec<u32> = lines.map(|line| line.parse::<u32>().unwrap()).collect();

    // patching program
    prog[1] = 12;
    prog[2] = 2;

    //println!("{:#?}", prog);
    //step(&mut prog, 0);

    run_prog(&mut prog);
    println!("{:#?}", prog);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_step_1() {
        let mut p1: Vec<u32> = [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50].to_vec();
        let mut i = 0;
        i = step(&mut p1, i);
        assert_eq!(p1, [1, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50].to_vec());
        assert_eq!(i, 4);
    }
}
