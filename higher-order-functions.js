function printModifiedString(string, modify) {
  // calls modify(string) and prints its returned value
  console.log(modify(string));
}


printModifiedString("asmr", function (string){
  return string + " is a very relaxing genre of whatever"
});











//  Make a function called print

// Takes in a number: base
function makeGreaterThanFunc(base) {
  // making a new function called newFunc
  function newFunc(num) {
    // compare the new num to the base number
    return num > base;
  }

  // returns the new function
  return newFunc;
}

var isGreaterThan10 = makeGreaterThanFunc(10);
var isGreaterThan20 = makeGreaterThanFunc(20);

isGreaterThan10(20);
isGreaterThan10(9.99);
isGreaterThan20(10.1);
isGreaterThan10(100);
