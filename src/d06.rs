use std::rc::Rc;
//use std::collections::HashMap;

#[derive(Debug, Clone)]
struct Node {
    parent: Option<Box<Node>>,
    name: String,
    children: Vec<Rc<Node>>,
}

impl Node {
    fn new(name: String) -> Box<Node> {
        Box::new(Node {
            parent: None,
            name,
            children: Vec::new(),
        })
    }

    fn find(&self, name: &String) -> Option<Box<Node>> {
        if *name == self.name {
            return Some(Box::new((*self).clone()));
        }
        for child in self.children.iter() {
            let potential_result = child.find(name);
            match potential_result {
                None => (),
                _ => return potential_result,
            }
        }
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

    //println!("06a: {:#?}", lines);
    //let mut lookup: HashMap<&str, Box<Node>> = HashMap::new();

    /*
    COM)B
    B)C
    C)D
    D)E
    E)F
    B)G
    G)H
    D)I
    E)J
    J)K
    K)L
    */

    for pair in lines.iter() {
        let (a, b) = pair;
        println!("{} {}", a, b);
        let mut n1 = Node::new(a.to_string());
        let n2 = Node::new(b.to_string());
        n1.children.push(Rc::new(*n2));
        //lookup.insert("COM", n);
        //lookup.insert("B", b);
        //lookup
    }
}

#[cfg(test)]
mod tests {}
