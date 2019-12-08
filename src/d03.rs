use std::collections::HashMap;
use std::collections::HashSet;

#[derive(Debug, Clone, Copy)]
struct Step {
    direction: char,
    length: u32,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct Coord {
    x: i32,
    y: i32,
}

fn manhattan_dist(x: i32, y: i32) -> u32 {
    (x.abs() + y.abs()) as u32
}

fn expand_line(steps: &Vec<Step>) -> Vec<Coord> {
    let mut x: i32 = 0;
    let mut y: i32 = 0;
    let mut vec = Vec::new();
    //vec.push(Coord { x: x, y: y });

    for step in steps.iter() {
        for _ in 0..step.length {
            let dx: i32 = match step.direction {
                'L' => -1,
                'R' => 1,
                _ => 0,
            };
            let dy: i32 = match step.direction {
                'U' => -1,
                'D' => 1,
                _ => 0,
            };
            x += dx;
            y += dy;
            vec.push(Coord { x, y });
        }
    }
    vec
}

pub fn run() {
    let file_string: String = std::fs::read_to_string("input/03.txt").unwrap();
    let lines: Vec<Vec<Step>> = file_string
        .lines()
        .map(|line| {
            line.split_terminator(',')
                .map(|item| Step {
                    direction: item.chars().nth(0).unwrap(),
                    length: (item[1..]).parse::<u32>().unwrap(),
                })
                .collect()
        })
        .collect();

    //println!("03: {:#?}", lines);

    {
        let mut shortest_dist: u32 = std::u32::MAX;
        let mut set: HashSet<Coord> = HashSet::new();

        for line in lines.iter() {
            let coords: Vec<Coord> = expand_line(&line);
            for coord in coords.iter() {
                if set.contains(coord) {
                    let dist = manhattan_dist(coord.x, coord.y);
                    if dist < shortest_dist {
                        shortest_dist = dist;
                    }
                }
                set.insert(*coord);
            }
        }
        println!("03a: {}", shortest_dist);
    }

    {
        let mut shortest_combined: usize = std::usize::MAX;
        let mut map: HashMap<Coord, usize> = HashMap::new();

        for (li, line) in lines.iter().enumerate() {
            let coords: Vec<Coord> = expand_line(&line);
            for (ci, coord) in coords.iter().enumerate() {
                if li == 0 {
                    if !map.contains_key(coord) {
                        map.insert(*coord, ci);
                    }
                } else if map.contains_key(coord) {
                    match map.get(coord) {
                        Some(&ci0) => {
                            let v = ci0 + ci + 2;
                            if v < shortest_combined {
                                shortest_combined = v;
                                //println!("{} {} => {}", ci0, ci, shortest_combined);
                            }
                        }
                        _ => (),
                    }
                }
            }
        }
        println!("03b: {}", shortest_combined);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_expand_line_1() {
        let steps = vec![Step {
            direction: 'D',
            length: 2,
        }];
        let coords = expand_line(&steps);
        assert_eq!(
            coords,
            vec![
                //Coord { x: 0, y: 0 },
                Coord { x: 0, y: 1 },
                Coord { x: 0, y: 2 }
            ]
        );
    }
}
