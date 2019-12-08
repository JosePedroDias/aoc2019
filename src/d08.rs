const W: usize = 25;
const H: usize = 6;

const BLACK: u8 = 0;
const WHITE: u8 = 1;
const TRANSP: u8 = 2;

fn analyze(data: &[u8], w: usize, h: usize) -> usize {
    let l: usize = data.len() / w / h;
    let mut smallest_value = std::usize::MAX;
    let mut answer: usize = 0;

    let mut i: usize = 0;
    for _ in 0..l {
        let mut num_zeros = 0;
        let mut num_ones = 0;
        let mut num_twos = 0;
        for _ in 0..h {
            for _ in 0..w {
                match data[i] {
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

    answer
}

fn process(data: &[u8], w: usize, h: usize) -> Vec<u8> {
    let l: usize = data.len() / w / h;
    let page_size = w * h;
    let mut data2: Vec<u8> = vec![TRANSP; page_size];
    for li in (0..l).rev() {
        let mut i = li * page_size;
        for y in 0..h {
            for x in 0..w {
                let idx: usize = x + w * y;
                match data[i] {
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

    let answer1 = analyze(&data, W, H);
    println!("08a: answer:{}", answer1);

    println!("08b:");
    let data2: Vec<u8> = process(&data, W, H);
    print_layer(&data2);
    //println!("{:#?}", data2);
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn test_analyze() {
        let w = 3;
        let h = 2;
        let data = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2];
        assert_eq!(analyze(&data, w, h), 1);
    }

    #[test]
    fn test_process() {
        let w = 2;
        let h = 2;
        let data = vec![0, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 2, 0, 0, 0, 0];
        assert_eq!(process(&data, w, h), vec![0, 1, 1, 0]);
    }
}
