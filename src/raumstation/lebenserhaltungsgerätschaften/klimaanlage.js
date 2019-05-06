const amqp = require('amqplib/callback_api');
const temperatur = require('../versorgungsmittel/temperatur.json');


// this function sends temperatures for various food to earth
exports.start = function () {

  // setInterval(function () {

  // const data = {
  //   name: "potatoe",
  //   humidity: ((Math.random() * 100).toFixed(0))
  // }

  amqp.connect('amqp://localhost', function (err, conn) {

    conn.createChannel(function (err, ch) {

      var exchangeName = 'fromMars';

      ch.assertExchange(exchangeName, 'direct', { durable: false });
      ch.publish(exchangeName, 'food', new Buffer(JSON.stringify(data)));
      console.log("SENT: " + JSON.stringify(data));
    });

    setTimeout(function () {
      conn.close();
    }, 500);
  });

  // }, 5000)
}

const setTemperature = function (temp, raumName) {

  let raum = getRaumByName(raumName);
  if(raum === -1) return 'raum nicht gefunden';

  raum.temperatur = temp;
}

// Mithilfe dieser Methode bekommt man für einen bestimmten Raum die Temperatur
const getTemperature = function (raumName) {

  const temp = temperatur.daten;

  if (getRaumByName(raumName) === -1) return 'raum nicht gefunden'

  return getRaumByName(raumName).temperatur;

  return 'not found';
}

// Hilfsmethode um einen bestimmten Raum als js-Object zu bekommen
const getRaumByName = function (raumName) {

  const räume = temperatur.räume;

  for (let i = 0; i < räume.length; i++) {
    if (räume[i].bezeichnung === raumName) {
      return räume[i];
    }
  }

  return -1;
}
setTemperature(30, 'kartoffel')
console.log('\nTemperatur für Kartoffeln: ' + getTemperature("kartoffel"));