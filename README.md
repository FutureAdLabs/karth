Karth
=====

Karth is a library to help clients consume event data from the Future Ad Labs ad server.

Karth is named after the river [Karth](http://www.uesp.net/wiki/Skyrim:Karth_River).

Usage
-----

var karth = require('karth');

var config = {};

var sources = karth.getStreams(config);

sources.eventStream.subscribe(
  function (x) {
      console.log('Next Event: ' + JSON.stringify(x));
  },
  function (err) {
      console.log('Error: ' + err);
  },
  function () {
      console.log('Completed');
  });

sources.requestStream.subscribe(
  function (x) {
      console.log('Next Request: ' + JSON.stringify(x));
  },
  function (err) {
      console.log('Error: ' + err);
  },
  function () {
      console.log('Completed');
  });


Config
------

The following are example configs:

{
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
}