const g = require("onoff").Gpio;
const s = new g(4, "in", "both");

s.watch((e, v) => {
  if (e) exit(e);
  return console.dir(v ? "there is someone!" : "not anymore!");
});

function exit() {
  s.unexport();

  function wrap() {
    return function () {
      console.dir("Bye, bye!");
      process.exit();
    };
  }
  wrap()();
}
process.on("SIGINT", exit);
