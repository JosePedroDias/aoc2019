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
