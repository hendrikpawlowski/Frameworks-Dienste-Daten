const hf = require('../ourModules/helpFunctions');
const cf = require('../ourModules/checkFunctions');


hf.consume('fromMars', 'versorgung', (data) => {

  if (data.versorgungsmittel === 'temperatur') {
    cf.checkTemperature(data);
  }
});