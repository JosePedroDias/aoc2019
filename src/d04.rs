fn to_vec_of_u8(n: u32) -> Vec<u8> {
    let s: String = n.to_string();
    return s.chars().map(|c| c.to_digit(10).unwrap() as u8).collect();
}

fn is_password(n: u32) -> bool {
    let mut digits: Vec<u8> = to_vec_of_u8(n);
    let mut found_adjacent = false;
    let mut last_digit: u8 = digits.remove(0);
    for d_ in digits.iter() {
        let d: u8 = *d_;
        if d == last_digit {
            found_adjacent = true;
        }
        if d < last_digit {
            return false;
        }
        last_digit = d;
    }
    return found_adjacent;
}

fn is_password2(n: u32) -> bool {
    let mut digits: Vec<u8> = to_vec_of_u8(n);
    let mut found_adjacent_of_2 = false;
    let mut how_many_adj = 0;
    let mut last_digit: u8 = digits.remove(0);
    for d_ in digits.iter() {
        let d: u8 = *d_;
        if d == last_digit {
            how_many_adj += 1;
        } else {
            if how_many_adj == 1 {
                found_adjacent_of_2 = true;
            }
            how_many_adj = 0;
        }
        if d < last_digit {
            return false;
        }

        last_digit = d;
    }

    if how_many_adj == 1 {
        found_adjacent_of_2 = true;
    }

    return found_adjacent_of_2;
}

pub fn run() {
    let file_string: String = std::fs::read_to_string("input/04.txt").unwrap();
    let parts = file_string.split_terminator('-');
    let limits: Vec<u32> = parts.map(|part| part.parse::<u32>().unwrap()).collect();
    let min = limits[0];
    let max = limits[1];

    {
        let mut count = 0;
        for i in min..max + 1 {
            if is_password(i) {
                count += 1;
                //println!("{}", i);
            }
        }
        println!("04a: {}", count);
    }

    {
        let mut count = 0;
        for i in min..max + 1 {
            if is_password2(i) {
                count += 1;
                //println!("{}", i);
            }
        }
        println!("04b: {}", count);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_conversion() {
        assert_eq!(to_vec_of_u8(251), [2, 5, 1].to_vec());
    }

    #[test]
    fn test_is_password() {
        assert_eq!(is_password(111111), true);
        assert_eq!(is_password(223450), false);
        assert_eq!(is_password(123789), false);
    }

    #[test]
    fn test_is_password2() {
        assert_eq!(is_password2(112233), true);
        assert_eq!(is_password2(123444), false);
        assert_eq!(is_password2(111122), true);
        assert_eq!(is_password2(122223), false); // mine
    }
}
