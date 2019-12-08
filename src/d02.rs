const ADD: u32 = 1;
const MUL: u32 = 2;
const END: u32 = 99;

#[derive(Debug)]
struct Program {
    index: usize,
    cells: Vec<u32>,
}

fn create_program(values: Vec<u32>) -> Program {
    Program {
        index: 0,
        cells: values,
    }
}

fn clone_program(p: &Program) -> Program {
    Program {
        index: p.index,
        cells: p.cells.clone(),
    }
}

fn at_end(p: &Program) -> bool {
    let opcode: u32 = p.cells[p.index];
    opcode == END
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
    Ok(())
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
    let start_program = create_program(values);

    {
        let mut program = clone_program(&start_program);
        program.cells[1] = 12;
        program.cells[2] = 2;

        let res = run_program(&mut program);
        match res {
            Err(s) => println!("program failed with: {}", s),
            _ => (),
        };

        println!("02a: {}", program.cells[0]);
    }

    {
        const TARGET_OUTPUT: u32 = 19_690_720;
        const MAX_V: u32 = 100;
        for noun in 0..MAX_V {
            for verb in 0..MAX_V {
                let mut program = clone_program(&start_program);
                program.cells[1] = noun;
                program.cells[2] = verb;
                let res = run_program(&mut program);
                match res {
                    Err(s) => println!("program failed with: {}", s),
                    _ => (),
                };
                if program.cells[0] == TARGET_OUTPUT {
                    let answer = 100 * noun + verb;
                    println!("02b: {} (noun: {}, verb: {})", answer, noun, verb);
                    return;
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_step_1() {
        let mut p = create_program(vec![1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50]);
        assert!(step(&mut p).is_ok());
        assert_eq!(p.cells, vec![1, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
        assert_eq!(p.index, 4);
    }

    #[test]
    fn test_step_2() {
        let mut p = create_program(vec![1, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
        p.index = 4;
        assert!(step(&mut p).is_ok());
        assert_eq!(p.cells, vec![3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
        assert_eq!(p.index, 8);
    }

    #[test]
    fn test_step_3() {
        let mut p = create_program(vec![3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
        p.index = 8;
        assert!(step(&mut p).is_err());
    }

    #[test]
    fn test_run_program_1() {
        let mut p = create_program(vec![1, 0, 0, 0, 99]);
        assert!(run_program(&mut p).is_ok());
        assert_eq!(p.cells, vec![2, 0, 0, 0, 99]);
    }

    #[test]
    fn test_run_program_2() {
        let mut p = create_program(vec![2, 3, 0, 3, 99]);
        assert!(run_program(&mut p).is_ok());
        assert_eq!(p.cells, vec![2, 3, 0, 6, 99]);
    }

    #[test]
    fn test_run_program_3() {
        let mut p = create_program(vec![2, 4, 4, 5, 99, 0]);
        assert!(run_program(&mut p).is_ok());
        assert_eq!(p.cells, vec![2, 4, 4, 5, 99, 9801]);
    }

    #[test]
    fn test_run_program_4() {
        let mut p = create_program(vec![1, 1, 1, 4, 99, 5, 6, 0, 99]);
        assert!(run_program(&mut p).is_ok());
        assert_eq!(p.cells, vec![30, 1, 1, 4, 2, 5, 6, 0, 99]);
    }
}
