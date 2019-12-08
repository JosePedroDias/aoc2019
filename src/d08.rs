const W: usize = 26;
const H: usize = 6;

pub fn run() {
    let file_string: String = std::fs::read_to_string("input/08.txt").unwrap();
    let data: Vec<u8> = file_string
        .chars()
        .map(|ch: char| ch.to_digit(10).unwrap() as u8)
        .collect();

    let L: usize = data.len() / W / H;
    //println!("num layers:{}", L);

    let mut smallest_value = std::usize::MAX;
    let mut answer: usize = 0;
    let mut layer: usize = 0;

    let mut i: usize = 0;
    for l in 0..L {
        let mut num_zeros = 0;
        let mut num_ones = 0;
        let mut num_twos = 0;
        for _ in 0..H {
            for _ in 0..W {
                let v: u8 = data[i];
                match v {
                    0 => num_zeros += 1,
                    1 => num_ones += 1,
                    2 => num_twos += 1,
                    _ => (),
                }
                if l == 13 {
                    print!("{}", v);
                }
                i += 1;
            }
            if l == 13 {
                println!("");
            }
        }
        if num_zeros < smallest_value {
            smallest_value = num_zeros;
            layer = l;
            answer = num_ones * num_twos;
        }
    }

    println!("08a: layer:{} answer:{}", layer, answer);
}

#[cfg(test)]
mod tests {}
