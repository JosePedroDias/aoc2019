fn fuel1(v: i32) -> i32 {
    ((v as f32) / 3.0_f32).floor() as i32 - 2_i32
}

fn fuel2(v_: i32) -> i32 {
    let mut v: i32 = v_;
    let mut sum: i32 = 0;
    loop {
        v = fuel1(v);
        if v <= 0 {
            break;
        } else {
            sum += v;
        }
    }
    return sum;
}

pub fn run() {
    let file_string: String = std::fs::read_to_string("input/01.txt").unwrap();
    let lines = file_string.lines();
    let values = lines.map(|line| line.parse::<i32>().unwrap());

    let result1: i32 = values.clone().map(fuel1).sum();
    println!("{:#?}", result1);

    let result2: i32 = values.map(fuel2).sum();
    println!("{:#?}", result2);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_fuel1() {
        assert_eq!(fuel1(12), 2);
        assert_eq!(fuel1(14), 2);
        assert_eq!(fuel1(1969), 654);
        assert_eq!(fuel1(100756), 33583);
    }
    #[test]
    fn test_fuel2() {
        assert_eq!(fuel2(12), 2);
        assert_eq!(fuel2(1969), 966);
        assert_eq!(fuel2(100756), 50346);
    }
}
