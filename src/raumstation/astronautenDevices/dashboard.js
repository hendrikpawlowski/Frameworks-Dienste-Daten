const hf = require('../../ourModules/helpFunctions');


hf.consume('fromMars', 'alarm', (data) => {

  if (data.versorgungsmittel === 'luftdruck') {
    console.log("\nALARM\nLuftdruckabfall in Raum " + data.raum + "!\nEvakuieren Sie sofort!");
  }
})