const amqp = require('amqplib/callback_api');
const temperatur = require('../versorgungsmittel/temperatur.json');


// this function sends temperatures for various food to earth
const start = function () {

  setInterval(function () {

    // Dieser Aufruf soll die realen Temperaturschwankungen simulieren
    setRandomTemperatures();

    const data = {
      versorgungsmittel: 'temperatur',
      raum: 'kartoffel',
      temperatur: getTemperature('kartoffel')
    }

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

  }, 2000)
}

// Mithilfe dieser Methode greift der versorgungsRoboter auf die klimaanlage zu und kann so die Temperatur verändern
exports.changeTemperature = function (amount, raumName) {

  let raum = getRaumByName(raumName);
  if (raum === -1) return 'raum nicht gefunden';

  raum.temperatur = raum.temperatur + amount;
}

// Mithilfe dieser Methode bekommt man für einen bestimmten Raum die Temperatur
const getTemperature = function (raumName) {

  if (getRaumByName(raumName) === -1) return 'raum nicht gefunden'

  return getRaumByName(raumName).temperatur;
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

// Diese Methode ist dazu da um die realen Temperaturschwankungen zu simulieren, indem sie in jedem Raum
// die Temperatur zufällig zwischen -10 und 20 setzt
const setRandomTemperatures = function () {
  const räume = temperatur.räume;

  räume.forEach(element => {
    element.temperatur = ((Math.random() * 30) - 10).toFixed(0);
  });
}



start();