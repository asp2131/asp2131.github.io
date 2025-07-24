# underpants-micro

### Build core functionality and practice higher-order functions

**Table of Contents**

- [Why?](#why)
- [Instructions](#instructions)
- [Walkthroughs and Hints](#walkthroughs-and-hints)
  - [identity](#identity)
  - [indexOf](#indexof)
  - [contains](#contains)
  - [each](#each)
  - [filter](#filter)
  - [reject](#reject)
  - [map](#map)
- [When Finished](#when-finished)

<br><br>

## Why?

This project serves as a refresher on core JavaScript techniques, designed specifically for students starting the Internet of Things course. Through implementing key functions, you’ll strengthen the fundamentals required for advanced topics. Let’s jump in and level up those coding skills! ⚡

<br><br>

## Instructions

- Open `index.html` in your browser to view the test results.
- Initially, all tests will fail; that’s your starting point! 😅
- Open `underpants.js` and follow the function-by-function instructions to build the required functionality. Refer to the walkthroughs and hints below for guidance.
- Keep coding until all tests pass! ✅

**Important:** While JavaScript methods like `forEach`, `map`, `reduce`, and `filter` exist in most browsers, **do not use them** for this project. Instead, focus on writing your own implementations to build a strong understanding of these concepts.

<br><br>

## Walkthroughs and Hints

Below are hints and walkthroughs for each function. Use them to guide your implementation, but remember to write the code yourself. 🚀

### `identity`

Assign the function to `_.identity` so it becomes a method of the `_` object. Follow the function definition instructions carefully.

<br>

### `indexOf`

Assign this function to the `_` object as `_.indexOf`. The steps here are similar to `identity`, so use it as a reference for setup.

**Note:** All functions will need to be assigned to the `_` object in this project. As such, this will not be mentioned again for the remaining functions.

<br>

### `contains`

- **Hint 1:** The `indexOf` function may be helpful here. It allows you to check if a value exists in an array.
- **Hint 2:** Remember, `return` stops a function’s execution. Use `return true` when a value is found, but place `return false` thoughtfully to ensure the function behaves correctly.

<br>

### `each`

`each` takes two parameters: an array and a function. When calling the function from within `each`, pass three arguments: the current element, its index, and the full array.

**Note:** While `each` can work with objects, focus solely on arrays for this project.

<br>

### `filter`

- **Hint 1:** Start by creating an empty array to store elements that pass the truth test.
- **Hint 2:** Break the function into three parts:
  1. Create the array to hold elements.
  2. Loop through the input array, test each element, and add passing elements to your new array.
  3. Return the new array.

<br>

### `reject`

Use your `filter` function here to assist here. `reject` should return an array of elements that **do not** pass the truth test, which means it is effectively the opposite of `filter`.

<br>

### `map`

`map` applies a given function to each element of an array and returns a new array containing the results. Consider it a combination of `each` and `filter` in that you do not need a condition, but you do need to store the results.

Breaking the process into three steps might help:

1. Create an empty array to hold results.
2. Loop through the input array, apply the function to each element, and store the results in your new array.
3. Return the array of transformed elements.

<br><br>

## When Finished

Push your work to GitHub! Use the following commands to commit and push your changes:

```bash
git commit -a -m "pushing changes to underpants"
git push
```
