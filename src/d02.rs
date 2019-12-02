/*
99 - - -   HALT
1 a b to   ADD
2 a b to   MUL
move 4 positions at a time

replace position 1 with the value 12 and
replace position 2 with the value 2.

What value is left at position 0 after the program halts?
*/

pub fn run() {
    let file_string: String = std::fs::read_to_string("input/02.txt").unwrap();
    let lines = file_string.split_terminator(',');
    let prog: Vec<i32> = lines.map(|line| line.parse::<i32>().unwrap()).collect();
    println!("{:#?}", prog);
}

/*
#[cfg(test)]
mod tests {
    use super::*;
}
*/
