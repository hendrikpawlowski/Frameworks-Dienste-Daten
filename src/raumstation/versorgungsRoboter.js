const hf = require('../ourModules/helpFunctions');
const klimaanlage = require('./lebenserhaltungsgerätschaften/klimaanlage');
const luftdruckRegler = require('./lebenserhaltungsgerätschaften/luftdruckRegler');

klimaanlage.start();
luftdruckRegler.start();


hf.consume('versorgungsroboter', 'versorgung', (data) => {

  if(data.versorgungsmittel === 'temperatur' && data.effekt === 'change') {
    klimaanlage.changeTemperature(data.wert, data.raum);
  }

  if(data.versorgungsmittel === 'luftdruck') {
    luftdruckRegler.stabilizeLuftdruck(1013, data.raum);
  }
})