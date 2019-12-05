const ADD: i32 = 1;
const MUL: i32 = 2;
const INP: i32 = 3;
const OUT: i32 = 4;
const END: i32 = 99;

// const MODE_POS: i32 = 0;
const MODE_IMM: i32 = 1;

#[derive(Debug)]
struct Program {
    index: usize,
    cells: Vec<i32>,
}

fn create_program(values: Vec<i32>) -> Program {
    return Program {
        index: 0,
        cells: values,
    };
}

fn at_end(p: &Program) -> bool {
    let opcode: i32 = p.cells[p.index];
    return opcode == END;
}

fn lookup_cell(cells: &Vec<i32>, index: usize, mode: i32) -> i32 {
    if mode == MODE_IMM {
        return cells[index];
    } else {
        return cells[cells[index] as usize];
    };
}

/*fn shift_base10(i32 opcode, i32 unit) -> i32 {
    let v =
    opcode_xt % 1000 / 1000;
}*/

fn step(p: &mut Program) -> Result<(), &'static str> {
    let opcode_xt = p.cells[p.index];
    let opcode = opcode_xt % 100; // last 2 digits
    let mode1 = opcode_xt % 1000 / 1000; // 0=position, 1=immediate
    let mode2 = opcode_xt % 10000 / 10000;
    let mode3 = opcode_xt % 100000 / 100000;

    if opcode == INP || opcode == OUT {
        println!(
            "opcode_xt:{} opcode:{} | a1:{} m1:{}",
            opcode_xt,
            opcode,
            p.cells[p.index + 1],
            mode1
        );
    } else {
        println!(
            "opcode_xt:{} opcode:{} | a1:{} m1:{} | a2:{} m2:{} | a3:{} m3:{}",
            opcode_xt,
            opcode,
            p.cells[p.index + 1],
            mode1,
            p.cells[p.index + 2],
            mode2,
            p.cells[p.index + 3],
            mode3
        );
    }

    if opcode == INP || opcode == OUT {
        let a = lookup_cell(&p.cells, p.index + 1, mode1);

        let op = match opcode {
            INP => 'I',
            _ => 'O',
        };
        println!("step #{}: {} <- {}", p.index, op, a);

        if opcode == INP {
            let v = 1; // TODO HARDCODED INPUT
            println!("  IN {}", v);
            p.cells[a as usize] = v;
        } else {
            let v = p.cells[a as usize];
            println!("  OUT {}", v);
        }
        p.index += 2;
    } else if opcode == ADD || opcode == MUL {
        let a = lookup_cell(&p.cells, p.index + 1, mode1);
        let b = lookup_cell(&p.cells, p.index + 2, mode2);
        let dst = lookup_cell(&p.cells, p.index + 3, mode3);
        let result: i32 = match opcode {
            ADD => a + b,
            MUL => a * b,
            _ => panic!("?!"),
        };

        let op = match opcode {
            ADD => '+',
            _ => '*',
        };
        println!("step #{}: {} <- {} {} {}", p.index, result, a, op, b);

        p.cells[dst as usize] = result;
        p.index += 4;
    } else if opcode == END {
        return Err("should have not reached step of END!");
    } else {
        return Err("unsupported opcode!");
    }
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
    let file_string: String = std::fs::read_to_string("input/05.txt").unwrap();
    let lines = file_string.split_terminator(',');
    let values: Vec<i32> = lines.map(|line| line.parse::<i32>().unwrap()).collect();
    let mut program = create_program(values);

    {
        let res = run_program(&mut program);
        match res {
            Err(s) => println!("program failed with: {}", s),
            _ => (),
        };

        println!("05a: {}", program.cells[0]);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_step_1() {
        let mut p = create_program([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50].to_vec());
        assert!(step(&mut p).is_ok());
        assert_eq!(
            p.cells,
            [1, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50].to_vec()
        );
        assert_eq!(p.index, 4);
    }

    #[test]
    fn test_step_2() {
        let mut p = create_program([1, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50].to_vec());
        p.index = 4;
        assert!(step(&mut p).is_ok());
        assert_eq!(
            p.cells,
            [3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50].to_vec()
        );
        assert_eq!(p.index, 8);
    }

    #[test]
    fn test_step_3() {
        let mut p = create_program([3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50].to_vec());
        p.index = 8;
        assert!(step(&mut p).is_err());
    }

    #[test]
    fn test_run_program_1() {
        let mut p = create_program([1, 0, 0, 0, 99].to_vec());
        assert!(run_program(&mut p).is_ok());
        assert_eq!(p.cells, [2, 0, 0, 0, 99].to_vec());
    }

    #[test]
    fn test_run_program_2() {
        let mut p = create_program([2, 3, 0, 3, 99].to_vec());
        assert!(run_program(&mut p).is_ok());
        assert_eq!(p.cells, [2, 3, 0, 6, 99].to_vec());
    }

    #[test]
    fn test_run_program_3() {
        let mut p = create_program([2, 4, 4, 5, 99, 0].to_vec());
        assert!(run_program(&mut p).is_ok());
        assert_eq!(p.cells, [2, 4, 4, 5, 99, 9801].to_vec());
    }

    #[test]
    fn test_run_program_4() {
        let mut p = create_program([1, 1, 1, 4, 99, 5, 6, 0, 99].to_vec());
        assert!(run_program(&mut p).is_ok());
        assert_eq!(p.cells, [30, 1, 1, 4, 2, 5, 6, 0, 99].to_vec());
    }
}
