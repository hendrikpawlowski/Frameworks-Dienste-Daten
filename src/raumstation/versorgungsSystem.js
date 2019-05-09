const hf = require('../ourModules/helpFunctions');
const klimaanlage = require('./lebenserhaltungsgerätschaften/klimaanlage');
const luftdruckRegler = require('./lebenserhaltungsgerätschaften/luftdruckRegler');
const hydrofarm = require('./lebenserhaltungsgerätschaften/hydrofarm');

klimaanlage.start();
luftdruckRegler.start();
hydrofarm.start();


hf.consume('fromMars', 'luftdruck', (data) => {

  if (data.luftdruck < 900) {
    // console.log("DATA: " + JSON.stringify(data));
    const alarm = {
      versorgungsmittel: 'luftdruck',
      raum: data.raum,
      evakuierung: true
    }
    hf.produce('fromMars', 'alarm', alarm);

    luftdruckRegler.stabilizeLuftdruck(1013, data.raum);
  }
})

hf.consume('fromMars', 'temperaturAntwort', (data) => {
  if (data.effekt === 'change') {
    klimaanlage.changeTemperature(data.wert, data.raum);
  }
})