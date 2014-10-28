var Rx = require('Rx');
var mysql = require('./db/mysql');

function validateConfig(config) {
  if(!config || !config.mysql) {
    return 'Invalid Configuration';
  }

  return null;
}

exports.getStreams = function(config) {
  var invalidConfig = validateConfig(config);

  var eventStream = Rx.Observable.create(function (eventObserver) {
    if(invalidConfig) {
      return eventObserver.onError(invalidConfig);
    }

    if(config.mysql) {
      return mysql.eventStream(config, eventObserver);
    } else {
      eventObserver.onCompleted();
    }
  });

  var requestStream = Rx.Observable.create(function (requestObserver) {
    if(invalidConfig) {
      return requestObserver.onError(invalidConfig);
    }

    if(config.mysql) {
      return mysql.requestStream(config, requestObserver);
    } else {
      requestObserver.onCompleted();
    }
  });

  return {
    eventStream: eventStream,
    requestStream: requestStream
  };
};