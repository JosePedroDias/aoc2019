# Advent of Code 2019

This time I will try to make it till the end, hopefully learning a bit about rust as well.  
Very newbie code ahead, be advised.

## setup stuff (rust)

Using visual studio code for development in linux and osx.

- [rustup](https://rustup.rs/) and `rustup update`
- extensions
  - Rust (rls)
  - CodeLLDB
- optional
  - [clippy](https://github.com/rust-lang/rust-clippy)

## run it (rust)

To calculate the answers do:

    cargo run --release

To run the tests for each day do:

    cargo test

If one wants to see IO (prints) do instead:

    cargo test -- --nocapture

To measure time spent computing solutions...

    multitime -q -n 10 target/release/aoc2019

## setup stuff (js)

install recentish node version (I suggest using nvm)

## run it (js)

runs the tests and computes the answers of day `day`

    node js/d<day>.js

## Other solutions for reference:

- <https://github.com/BurntSushi/advent-of-code>
- <https://www.forrestthewoods.com/blog/learning-rust-via-advent-of-code/adventofcode2018_forrestsmith_rust>

## Rust references

- <https://doc.rust-lang.org/rust-by-example/index.html>
- <https://cheats.rs/>
- <https://doc.rust-lang.org/book/ch15-05-interior-mutability.html>
- <https://github.com/rust-lang/rustlings/tree/master/exercises>

## EXERCISES

| day | stars | title                                                     | lang |
| --- | ----- | --------------------------------------------------------- | ---- |
| 01  | `**`  | The Tyranny of the Rocket Equation (fuel operations)      | rust |
| 02  | `**`  | 1202 Program Alarm (intcode add, mul)                     | rust |
| 03  | `**`  | Crossed Wires (manhattan distance on 2 wires)             | rust |
| 04  | `**`  | Secure Container (password rules)                         | rust |
| 05  | `**`  | Sunny with a Chance of Asteroids (intcode 2: i/o, modes)  | js   |
| 06  | `__`  | Universal Orbit Map (tree)                                | js   |
| 07  | `*_`  | Amplification Circuit (intcode 3:dynamic io, perms, loop) | js   |
| 08  | `**`  | Space Image Format (decode layer of images)               | rust |
| 09  | `__`  | Sensor Boost (intcode 4:?)                                | js   |
| 10  | `*_`  | Monitoring Station                                        | js   |
| 11  | `__`  | Space Police (intcode 5:?)                                | js   |
| 12  | `__`  | The N-Body Problem                                        | js   |
| 13  | `__`  | Care Package (intcode 6:?)                                | js   |
| 14  | `__`  | Space Stoichiometry                                       | js   |
| 15  | `__`  | Oxygen System (intcode 7:?)                               | js   |
| 16  | `__`  | Flawed Frequency Transmission                             | js   |
| 17  | `__`  | Set and Forget                                            | js   |
| 18  | `__`  | ?                                                         | js   |
| 19  | `__`  | ?                                                         | js   |
| 20  | `__`  | ?                                                         | js   |
| 21  | `__`  | ?                                                         | js   |
| 22  | `__`  | ?                                                         | js   |
| 23  | `__`  | ?                                                         | js   |
| 24  | `__`  | ?                                                         | js   |
| 25  | `__`  | ?                                                         | js   |

## Intcode Interpreter

One can run my intcode interpreter [here](https://josepedrodias.github.io/aoc2019/html/intcode-interpreter.html).

You can make use of input files such as [02](input/02.txt) or [05](input/05.txt) to test.
