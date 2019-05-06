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

exports.setTemperature = function (temp, raum) {
  // sets the temperature for potatoes
}

// Mithilfe dieser Methode bekommt man für einen bestimmten Raum die Temperatur
const getTemperature = function (raum) {

  const temp = temperatur.daten;

  for (let i = 0; i < temp.length; i++) {
    if (temp[i].raum == raum) {
      return temp[i].temperatur;
    }
  }

  return 'not found';
}
console.log('\nTemperatur für Kartoffeln: ' + getTemperature("kartoffel"));