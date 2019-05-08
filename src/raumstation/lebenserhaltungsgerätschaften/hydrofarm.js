const fs = require('fs');
const hf = require('../../ourModules/helpFunctions');


exports.start = function () {

  setInterval(function () {

    produceWasser();

    getWasser((wasser) => {

      const message = {
        versorgungsmittel: 'wasser',
        menge: wasser
      }

      hf.produce('fromMars', 'versorgung', message);
    });
  }, 3000)
}

// Mithilfe dieser Methode wird regelmäßig Wasser produziert
const produceWasser = function () {

  fs.readFile('./versorgungsmittel/wasser.json', 'UTF-8', (err, data) => {

    let x = JSON.parse(data);

    x.wasser += new Number(10);

    fs.writeFile('./versorgungsmittel/wasser.json', JSON.stringify(x), (err) => {
      if (err) throw err;
    })
  })
}

const getWasser = function (callback) {

  fs.readFile('./versorgungsmittel/wasser.json', 'UTF-8', (err, data) => {

    if (err) throw err;

    const wasser = JSON.parse(data).wasser;

    callback(wasser);
  })
}