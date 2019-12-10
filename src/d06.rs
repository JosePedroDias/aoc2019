use std::cell::RefCell;
use std::rc::Rc;

#[derive(Debug, Clone)]
struct Node {
    name: String,
    //children: Vec<&'a Node>,
    children: RefCell<Vec<&'static Node>>,
}

impl Node {
    fn new(name: String) -> Node {
        Node {
            name,
            children: RefCell::new(Vec::new()),
        }
    }

    fn find(&self, name: &String) -> Option<&Node> {
        if *name == self.name {
            return Some(self);
        }
        for child in self.children.borrow_mut() {
            let potential_result = child.find(name);
            match potential_result {
                None => (),
                _ => {
                    println!("{} found", name);
                    return potential_result;
                }
            }
        }
        println!("{} not found", name);
        None
    }
}

pub fn run() {
    let file_string: String = std::fs::read_to_string("input/06.txt").unwrap();
    let lines: Vec<(&str, &str)> = file_string
        .lines()
        .map(|line| {
            let mut it = line.split_terminator(')');
            let a = it.next().unwrap();
            let b = it.next().unwrap();
            (a, b)
        })
        .collect();

    let root_name = lines[0].0;
    let n0 = Node::new(root_name.to_string());

    for pair in lines.iter() {
        let (a, b) = pair;
        //println!("{} {}", a, b);

        let mut n1 = match n0.find(&a.to_string()) {
            Some(n) => *n,
            _ => Node::new(a.to_string()),
        };

        let n2 = match n0.find(&b.to_string()) {
            Some(n) => *n,
            _ => Node::new(b.to_string()),
        };
        n1.children.borrow_mut().push(Rc::new(n2));
    }

    println!("{:#?}", n0);
}

#[cfg(test)]
mod tests {}
