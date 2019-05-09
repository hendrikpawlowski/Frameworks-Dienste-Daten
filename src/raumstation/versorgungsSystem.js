const hf = require('../ourModules/helpFunctions');
const klimaanlage = require('./lebenserhaltungsgerätschaften/klimaanlage');
const luftdruckRegler = require('./lebenserhaltungsgerätschaften/luftdruckRegler');
const hydrofarm = require('./lebenserhaltungsgerätschaften/hydrofarm');

klimaanlage.start();
luftdruckRegler.start();
hydrofarm.start();


hf.consume('fromMars', 'luftdruck', (data) => {

  if (data.luftdruck < 900) {
    luftdruckRegler.stabilizeLuftdruck(1013, data.raum);
  }
})

hf.consume('fromMars', 'temperaturAntwort', (data) => {
  if (data.effekt === 'change') {
    klimaanlage.changeTemperature(data.wert, data.raum);
  }
})