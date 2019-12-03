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
            _ => '*',
        };
        println!("step #{}: {} <- {} {} {}", p.index, result, a, op, b);*/

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

    println!("02a: {}", program.cells[0]);
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

    #[test]
    fn test_run_program_1() {
        let mut p = Program {
            index: 0,
            cells: [1, 0, 0, 0, 99].to_vec(),
        };
        assert!(run_program(&mut p).is_ok());
        assert_eq!(p.cells, [2, 0, 0, 0, 99].to_vec());
    }

    #[test]
    fn test_run_program_2() {
        let mut p = Program {
            index: 0,
            cells: [2, 3, 0, 3, 99].to_vec(),
        };
        assert!(run_program(&mut p).is_ok());
        assert_eq!(p.cells, [2, 3, 0, 6, 99].to_vec());
    }

    #[test]
    fn test_run_program_3() {
        let mut p = Program {
            index: 0,
            cells: [2, 4, 4, 5, 99, 0].to_vec(),
        };
        assert!(run_program(&mut p).is_ok());
        assert_eq!(p.cells, [2, 4, 4, 5, 99, 9801].to_vec());
    }

    #[test]
    fn test_run_program_4() {
        let mut p = Program {
            index: 0,
            cells: [1, 1, 1, 4, 99, 5, 6, 0, 99].to_vec(),
        };
        assert!(run_program(&mut p).is_ok());
        assert_eq!(p.cells, [30, 1, 1, 4, 2, 5, 6, 0, 99].to_vec());
    }
}
