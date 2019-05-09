const hf = require('../ourModules/helpFunctions');
const cf = require('../ourModules/checkFunctions');


hf.consume('fromMars', 'temperatur', (data) => {
  cf.checkTemperature(data);
});

hf.consume('fromMars', 'wasser', (data) => {
  // Die Daten, die ankommen, können als Protokolldaten verwendet werden
});