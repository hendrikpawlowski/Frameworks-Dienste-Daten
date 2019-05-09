const fs = require('fs');
const hf = require('../../ourModules/helpFunctions');


exports.start = function () {

  setInterval(function () {

    getLuftdruck((räume) => {

      for (let i = 0; i < räume.length; i++) {
        const message = {
          versorgungsmittel: 'luftdruck',
          raum: räume[i].bezeichnung,
          luftdruck: räume[i].luftdruck
        }

        hf.produce('fromMars', 'luftdruck', message);
      }
    });
  }, 4000)
}

// Mithilfe dieser Methode greift der versorgungsRoboter auf die klimaanlage zu und kann so die Temperatur verändern
exports.stabilizeLuftdruck = function (stabilize, raumName) {

  fs.readFile('./versorgungsmittel/luftdruck.json', 'UTF-8', (err, data) => {

    console.log("\n\nLUFTDRUCK STABILISIERT\n\n");
    if (err) throw err;

    let x = JSON.parse(data);

    for (let i = 0; i < x.räume.length; i++) {
      if (x.räume[i].bezeichnung === raumName) {

        x.räume[i].luftdruck = new Number(stabilize);

        fs.writeFile('./versorgungsmittel/luftdruck.json', JSON.stringify(x), (err) => {
          if (err) throw err;
        })
      }
    }
  })
}

// Mithilfe dieser Methode bekommt man für einen bestimmten Raum den Luftdruck
const getLuftdruck = function (callback) {

  fs.readFile('./versorgungsmittel/luftdruck.json', 'UTF-8', (err, data) => {


    const räume = JSON.parse(data).räume;
    callback(räume);
    // if (err) throw err;

    // let token = false;
    // const räume = JSON.parse(data).räume;

    // for (let i = 0; i < räume.length; i++) {
    //   if (räume[i].bezeichnung === raumName) {
    //     callback(räume[i].luftdruck);
    //     token = true;
    //   }
    // }

    // if (!token) {
    //   callback(-1);
    // }
  })
}