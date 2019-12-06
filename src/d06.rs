pub fn run() {
    let file_string: String = std::fs::read_to_string("input/06.txt").unwrap();
    let lines: Vec<(&str, &str)> = file_string
        .lines()
        .map(|line| {
            let mut it = line.split_terminator(')');
            let a = it.next().unwrap();
            let b = it.next().unwrap();
            return (a, b);
        })
        .collect();

    println!("06a: {:#?}", lines);
}

#[cfg(test)]
mod tests {}
