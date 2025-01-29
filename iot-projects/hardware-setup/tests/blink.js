const onoff = require("onoff");

const g = onoff.Gpio;
const l1 = new g(16, "out");
const l2 = new g(21, "out");
let i;

i = setInterval(function () {
  const value = (l1.readSync() + 1) % 2;
  l1.write(value, function () {
    console.log(`Changed LED 1 state to: ${value}`);
    l2.write((value + 1) % 2, function () {
      console.log(`Changed LED 2 state to: ${(value + 1) % 2}`);
    });
  });
}, 1000);

process.on("SIGINT", function () {
  clearInterval(i);
  off(l1);
  off(l2);

  function wrap() {
    return function () {
      console.log("Bye, bye!");
      process.exit();
    };
  }
  wrap()();

  function off(l) {
    l.writeSync(0);
    return l.unexport();
  }
});
