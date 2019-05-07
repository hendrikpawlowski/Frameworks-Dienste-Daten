const request = require('request');
const hf = require('../ourModules/helpFunctions');

const botanikAPIOptions = {
  method: 'GET', url: 'http://trefle.io/api/plants/129834', auth: {
    bearer: 'SUNjdmpQS2FvMFVsNmVPaHdUcXJZUT09'
  }
}

hf.consume('fromMars', 'versorgung', (data) => {

  if (data.versorgungsmittel === 'temperatur') {
    checkTemperature(data);
  }
});

const checkTemperature = function (message) {

  let x = new Promise((resolve, reject) => {

    request(botanikAPIOptions, function (error, response, body) {

      if (error) console.log(error);

      const data = JSON.parse(body);
      const min_temp = data.main_species.growth.temperature_minimum.deg_c;

      if (message.temperatur < min_temp) {
        var messageToMars = message;
        messageToMars.effekt = 'increase';
        messageToMars.wert = (min_temp - message.temperatur).toFixed(2);
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
    hf.produce('fromEarth', 'versorgung', message);
  }).catch((message) => {
    hf.produce(message);
  })
}