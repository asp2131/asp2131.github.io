const s = require('node-dht-sensor');

s.initialize(22, 17); 
const i = setInterval(read, 2000);

function read() {
  const r = s.read();
  console.log(r);
  console.log(`Temperature: ${r.temperature.toFixed(2)} C,\n 
              Humidity: ${r.humidity.toFixed(2)} %`);
};

process.on('SIGINT', function () {
  clearInterval(i);
  
  function wrap() {
    return function () {
      console.log("Bye, bye!");
      process.exit();
    };
  }
  wrap()();
});

