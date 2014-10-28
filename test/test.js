var karth = require('../karth');

var config = {
  mysql: {
    connectionLimit:1,
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "root",
    database: "playunlock",
    flushInterval: 10,
    batchSize: 500,
    checkInterval: 3000
  }
};

var source = karth.getSource(config);

source.subscribe(
  function (x) {
      console.log('Next: ' + JSON.stringify(x));
  },
  function (err) {
      console.log('Error: ' + err);
  },
  function () {
      console.log('Completed');
  });