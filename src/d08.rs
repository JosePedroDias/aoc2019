const W: usize = 25;
const H: usize = 6;

const BLACK: u8 = 0;
const WHITE: u8 = 1;
const TRANSP: u8 = 2;

fn analyze(data: &[u8]) -> usize {
    let l: usize = data.len() / W / H;
    let mut smallest_value = std::usize::MAX;
    let mut answer: usize = 0;

    let mut i: usize = 0;
    for _ in 0..l {
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
                i += 1;
            }
        }
        if num_zeros < smallest_value {
            smallest_value = num_zeros;
            answer = num_ones * num_twos;
        }
    }

    return answer;
}

fn process(data: &[u8]) -> Vec<u8> {
    let l: usize = data.len() / W / H;
    let mut data2: Vec<u8> = vec![TRANSP; W * H];
    let mut i: usize = 0;
    for _ in 0..l {
        for y in 0..H {
            for x in 0..W {
                let v: u8 = data[i];
                let idx: usize = x + W * y;
                match v {
                    BLACK => data2[idx] = BLACK,
                    WHITE => data2[idx] = WHITE,
                    TRANSP => (),
                    _ => (),
                }
                i += 1;
            }
        }
    }

    data2
}

fn print_layer(data: &[u8]) {
    let mut i: usize = 0;
    for _ in 0..H {
        for _ in 0..W {
            let v: u8 = data[i];
            print!("{}", if v == WHITE { 'O' } else { ' ' });
            i += 1;
        }
        println!("");
    }
}

pub fn run() {
    let file_string: String = std::fs::read_to_string("input/08.txt").unwrap();
    let data: Vec<u8> = file_string
        .chars()
        .map(|ch: char| ch.to_digit(10).unwrap() as u8)
        .collect();

    let answer1 = analyze(&data);
    println!("08a: answer:{}", answer1);

    let data2: Vec<u8> = process(&data);
    print_layer(&data2);
}

#[cfg(test)]
mod tests {}
