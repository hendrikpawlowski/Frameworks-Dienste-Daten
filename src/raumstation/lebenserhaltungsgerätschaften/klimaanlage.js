const amqp = require('amqplib/callback_api');
const fs = require('fs');


// this function sends temperatures for various food to earth
exports.start = function () {

  setInterval(function () {

    getTemperature('kartoffel', (temperatur) => {

      const message = {
        versorgungsmittel: 'temperatur',
        raum: 'kartoffel',
        temperatur: temperatur
      }

      amqp.connect('amqp://localhost', function (err, conn) {

        conn.createChannel(function (err, ch) {

          var exchangeName = 'fromMars';

          ch.assertExchange(exchangeName, 'direct', { durable: false });
          ch.publish(exchangeName, 'versorgung', new Buffer(JSON.stringify(message)));

          console.log("SENT: " + JSON.stringify(message));

          setTimeout(function () {
            conn.close();
          }, 500);
        });
      })
    });
  }, 2000)
}

// Mithilfe dieser Methode greift der versorgungsRoboter auf die klimaanlage zu und kann so die Temperatur verändern
exports.changeTemperature = function (amount, raumName) {

  fs.readFile('../versorgungsmittel/temperatur.json', 'UTF-8', (err, data) => {

    let x = JSON.parse(data);

    for (let i = 0; i < x.räume.length; i++) {
      if (x.räume[i].bezeichnung === raumName) {
        console.log("T: " + x.räume[i].temperatur);

        console.log(x.räume[i].temperatur + amount);

        x.räume[i].temperatur += amount;
        
        fs.writeFile('../versorgungsmittel/temperatur.json', JSON.stringify(x), (err) => {
          if (err) throw err;
        })
      }
    }
  })
}

// Mithilfe dieser Methode bekommt man für einen bestimmten Raum die Temperatur
const getTemperature = function (raumName, callback) {

  fs.readFile('../versorgungsmittel/temperatur.json', 'UTF-8', (err, data) => {

    let token = false;
    const räume = JSON.parse(data).räume;

    for (let i = 0; i < räume.length; i++) {
      if (räume[i].bezeichnung === raumName) {
        callback(räume[i].temperatur);
        token = true;
      }
    }

    if (!token) {
      callback(-1);
    }
  })
}