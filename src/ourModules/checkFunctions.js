const request = require('request');
const hf = require('../ourModules/helpFunctions');

const botanikAPIOptions = {
  method: 'GET', url: 'http://trefle.io/api/plants/129834', auth: {
    bearer: 'SUNjdmpQS2FvMFVsNmVPaHdUcXJZUT09'
  }
}


exports.checkTemperature = function (message) {

  let x = new Promise((resolve, reject) => {

    request(botanikAPIOptions, function (error, response, body) {

      if (error) console.log(error);

      const data = JSON.parse(body);
      const min_temp = data.main_species.growth.temperature_minimum.deg_c;

      if (message.temperatur < min_temp) {
        var messageToMars = message;
        messageToMars.effekt = 'change';
        messageToMars.wert = (min_temp - message.temperatur + 1).toFixed(2);
        resolve(messageToMars);

      } else if (message.temperatur >= min_temp) {
        var messageToMars = message;
        messageToMars.effekt = 'everything ok'
        resolve(messageToMars)

      } else {
        reject("Failed!")
      }
    })
  })

  x.then((message) => {
    hf.produce('fromMars', 'temperaturAntwort', message);
  }).catch((message) => {
    hf.produce(message);
  })
}