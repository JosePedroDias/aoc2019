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

fn step(p: &mut Program) -> Result<(), &'static str> {
    //println!("step #{}", p.index);

    let opcode = p.cells[p.index];
    if opcode == ADD || opcode == MUL {
        let src1 = p.cells[p.index + 1] as usize;
        let src2 = p.cells[p.index + 2] as usize;
        let dst = p.cells[p.index + 3] as usize;
        let a = p.cells[src1];
        let b = p.cells[src2];
        let result: u32 = match opcode {
            ADD => a + b,
            MUL => a * b,
            _ => panic!("?!"),
        };

        /*let op = match opcode {
            ADD => '+',
            MUL => '*',
            _ => panic!("?!"),
        };
        println!("{} <- {} {} {}", result, a, op, b);*/

        p.cells[dst] = result;
    } else if opcode == END {
        return Err("should have not reached step of END!");
    } else {
        return Err("unsupported opcode!");
    }
    p.index += 4;
    return Ok(());
}

fn run_program(mut p: &mut Program) -> Result<(), &'static str> {
    loop {
        if at_end(&p) {
            return Ok(());
        }
        let res = step(&mut p);
        if res.is_err() {
            return res;
        }
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

    // patching program
    program.cells[1] = 12;
    program.cells[2] = 2;

    let res = run_program(&mut program);
    match res {
        Err(s) => println!("program failed with: {}", s),
        _ => (),
    };

    //println!("02 ...: {}", res.;

    println!("02a: {}", program.cells[0]);
    //println!("{:#?}", program);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_step_1() {
        let mut p = Program {
            index: 0,
            cells: [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50].to_vec(),
        };
        assert!(step(&mut p).is_ok());
        assert_eq!(
            p.cells,
            [1, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50].to_vec()
        );
        assert_eq!(p.index, 4);
    }

    #[test]
    fn test_step_2() {
        let mut p = Program {
            index: 4,
            cells: [1, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50].to_vec(),
        };
        assert!(step(&mut p).is_ok());
        assert_eq!(
            p.cells,
            [3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50].to_vec()
        );
        assert_eq!(p.index, 8);
    }

    #[test]
    fn test_step_3() {
        let mut p = Program {
            index: 8,
            cells: [3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50].to_vec(),
        };
        assert!(step(&mut p).is_err());
    }
}
