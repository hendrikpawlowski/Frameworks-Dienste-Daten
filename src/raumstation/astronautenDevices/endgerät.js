const readline = require('readline');
const hf = require('../../ourModules/helpFunctions')


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('\nIn welchem Raum möchten Sie die Temperatur anpassen?\n', (raum) => {
  rl.question('\nUm wie viel Grad möchten Sie die Temperatur verändern?\n', (grad) => {

    const message = {
      versorgungsmittel: "temperatur",
      raum: raum,
      effekt: "change",
      wert: grad
    }

    console.log("MESSAGE: " + JSON.stringify(message));

    hf.produce('fromMars', 'temperaturAntwort', message);
    rl.close();
  })
})