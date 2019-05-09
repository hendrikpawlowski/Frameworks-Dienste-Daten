const hf = require('../../ourModules/helpFunctions');


hf.consume('fromMars', 'wasser', (data) => {
  console.log("Wasserstand: " + data.menge)
})

hf.consume('fromMars', 'luftdruck', (data) => {
  console.log("Luftdruck in Raum " + data.raum + ": " + data.luftdruck);
})

hf.consume('fromMars', 'temperatur', (data) => {
  console.log("Temperatur in Raum " + data.raum + ": " + data.temperatur)
})