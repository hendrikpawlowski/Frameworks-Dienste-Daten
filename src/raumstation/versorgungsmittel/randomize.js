const temperatur = require('./temperatur');
const fs = require('fs');


const setRandomTemperatures = function () {
  const räume = temperatur.räume;

  räume.forEach(element => {
    element.temperatur = ((Math.random() * 40) - 20).toFixed(0);
  });

  saveData();
}

const saveData = function () {
  fs.writeFile('temperatur.json', JSON.stringify(temperatur), function (error) {
      if (error) throw error;
  });
}

setRandomTemperatures();