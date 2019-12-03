#[derive(Debug)]
struct Step {
    direction: char,
    length: u32,
}

pub fn run() {
    let file_string: String = std::fs::read_to_string("input/03.txt").unwrap();
    let lines: Vec<Vec<Step>> = file_string
        .lines()
        .map(|line| {
            line.split_terminator(',')
                .map(|item| {
                    return Step {
                        direction: item.chars().nth(0).unwrap(),
                        length: (item[1..]).parse::<u32>().unwrap(),
                    };
                })
                .collect()
        })
        .collect();
    println!("03a: {:#?}", lines);
}

#[cfg(test)]
mod tests {}
