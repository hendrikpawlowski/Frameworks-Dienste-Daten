const fs = require('fs');
const hf = require('../../ourModules/helpFunctions');


exports.start = function () {

  setInterval(function () {

    getTemperature('kartoffel', (temperatur) => {

      const message = {
        versorgungsmittel: 'temperatur',
        raum: 'kartoffel',
        temperatur: temperatur
      }

      hf.produce('fromMars', 'versorgung', message);

    });
  }, 2000)
}

// Mithilfe dieser Methode greift der versorgungsRoboter auf die klimaanlage zu und kann so die Temperatur verändern
exports.changeTemperature = function (amount, raumName) {

  fs.readFile('./versorgungsmittel/temperatur.json', 'UTF-8', (err, data) => {

    let x = JSON.parse(data);

    for (let i = 0; i < x.räume.length; i++) {
      if (x.räume[i].bezeichnung === raumName) {

        x.räume[i].temperatur += new Number(amount);
        x.räume[i].temperatur = new Number(x.räume[i].temperatur.toFixed(2));

        fs.writeFile('./versorgungsmittel/temperatur.json', JSON.stringify(x), (err) => {
          if (err) throw err;
        })
      }
    }
  })
}

// Mithilfe dieser Methode bekommt man für einen bestimmten Raum die Temperatur
const getTemperature = function (raumName, callback) {

  fs.readFile('./versorgungsmittel/temperatur.json', 'UTF-8', (err, data) => {

    if (err) throw err;

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