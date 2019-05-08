const fs = require('fs');
const hf = require('../../ourModules/helpFunctions');


// this function sends temperatures for various food to earth
exports.start = function () {

  setInterval(function () {

    getLuftdruck('kartoffel', (luftdruck) => {

      const message = {
        versorgungsmittel: 'luftdruck',
        raum: 'kartoffel',
        luftdruck: luftdruck
      }

      hf.produce('fromMars', 'versorgung', message);
      hf.produce('versorgungsroboter', 'versorgung', message);
    });
  }, 4000)
}

// Mithilfe dieser Methode greift der versorgungsRoboter auf die klimaanlage zu und kann so die Temperatur verändern
exports.stabilizeLuftdruck = function (stabilize, raumName) {

  fs.readFile('./versorgungsmittel/luftdruck.json', 'UTF-8', (err, data) => {

    let x = JSON.parse(data);

    for (let i = 0; i < x.räume.length; i++) {
      if (x.räume[i].bezeichnung === raumName) {

        x.räume[i].luftdruck = new Number(stabilize);
        // x.räume[i].luftdruck = new Number(x.räume[i].luftdruck.toFixed(2));

        fs.writeFile('./versorgungsmittel/luftdruck.json', JSON.stringify(x), (err) => {
          if (err) throw err;
        })
      }
    }
  })
}

// Mithilfe dieser Methode bekommt man für einen bestimmten Raum den Luftdruck
const getLuftdruck = function (raumName, callback) {

  fs.readFile('./versorgungsmittel/luftdruck.json', 'UTF-8', (err, data) => {

    if (err) throw err;

    let token = false;
    const räume = JSON.parse(data).räume;

    for (let i = 0; i < räume.length; i++) {
      if (räume[i].bezeichnung === raumName) {
        callback(räume[i].luftdruck);
        token = true;
      }
    }

    if (!token) {
      callback(-1);
    }
  })
}