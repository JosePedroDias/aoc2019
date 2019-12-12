# Advent of Code 2019

This time I will try to make it till the end, hopefully learning a bit about rust as well.  
Very newbie code ahead, be advised.

## setup stuff

Using visual studio code for development in linux and osx.

- [rustup](https://rustup.rs/) and `rustup update`
- extensions
  - Rust (rls)
  - CodeLLDB
- optional
  - [clippy](https://github.com/rust-lang/rust-clippy)

## run it

To calculate the answers do:

    cargo run --release

To run the tests for each day do:

    cargo test

If one wants to see IO (prints) do instead:

    cargo test -- --nocapture

To measure time spent computing solutions...

    multitime -q -n 10 target/release/aoc2019

## Other solutions for reference:

- <https://github.com/BurntSushi/advent-of-code>
- <https://www.forrestthewoods.com/blog/learning-rust-via-advent-of-code/adventofcode2018_forrestsmith_rust>

## Rust references

- <https://doc.rust-lang.org/rust-by-example/index.html>
- <https://cheats.rs/>
- <https://doc.rust-lang.org/book/ch15-05-interior-mutability.html>
- <https://github.com/rust-lang/rustlings/tree/master/exercises>

## EXERCISES

- 01 `**` - The Tyranny of the Rocket Equation (fuel operations)
- 02 `**` - 1202 Program Alarm (intcode add, mul)
- 03 `**` - Crossed Wires (manhattan distance on 2 wires)
- 04 `**` - Secure Container (password rules)
- 05 - Sunny with a Chance of Asteroids (intcode 2: in, out, immediate mode)
- 06 - Universal Orbit Map (tree)
- 07 - Amplification Circuit (intcode 3:?)
- 08 `**` - Space Image Format (decode layer of images)
- 09 - Sensor Boost (intcode 4:?)
- 10 `*` - Monitoring Station
- 11 - Space Police
- 12 - The N-Body Problem
