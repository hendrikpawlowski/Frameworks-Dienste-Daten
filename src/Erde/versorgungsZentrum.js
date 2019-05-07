const amqp = require('amqplib/callback_api');
const request = require('request');
const responseToMars = require('./helpFunctions/responseToMars');

const botanikAPIOptions = {
  method: 'GET', url: 'http://trefle.io/api/plants/129834', auth: {
    bearer: 'SUNjdmpQS2FvMFVsNmVPaHdUcXJZUT09'
  }
}


amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(function (err, ch) {
    var exchangeName = 'fromMars';

    ch.assertExchange(exchangeName, 'direct', { durable: false });

    ch.assertQueue('', { exclusive: true }, function (err, q) {
      // console.log('Waiting for messages in %s', '')
      ch.bindQueue('', exchangeName, 'versorgung');

      ch.consume('', function (msg) {

        console.log("RECEIVED: " + msg.content);

        var data = JSON.parse(msg.content);

        if (data.versorgungsmittel === 'temperatur') {
          console.log('checkTemperature');
          checkTemperature(data);
        }

        //   let x = new Promise((resolve, reject) => {
        //     /*requestFunction.requestAPI(botanikAPIOptions, earthFoodArray => {
        //         // marsFood = {"name": --- , "temp": ---} || marsFood = {"name": --- , "humidity": ---}
        //         // earthFood = {"name": --- , "minTemperature": --- , "maxTemperature": ---}
        //         const earthFood = helpFunction.getFoodByName(
        //             marsFood.name,
        //             earthFoodArray
        //         )



        //         if (marsFood.temp != undefined) {
        //             resolve(helpFunction.checkTemp(marsFood.temp, earthFood))
        //         } else if (marsFood.humidity != undefined) {
        //             resolve(helpFunction.checkHumidity(marsFood.humidity, earthFood))
        //         } else {
        //             reject('Failed')
        //         }
        //     }
        //     )*/

        /*
        let x = new Promise((resolve, reject) => {

          request(botanikAPIOptions, function (error, response, body) {

            if (error) console.log(error);

            const data = JSON.parse(body);
            //console.log(data.main_species.growth);
            // const min_temp = data.main_species.growth.temperature_minimum.deg_c;
            // if (marsFood.temp < min_temp) {
            //   var tempMsg = {
            //     type: "temperature",
            //     effect: min_temp - marsFood.temp
            //   }
            //   resolve(tempMsg);
            //   //resolve("Increase temperature by " + (min_temp-marsFood.temp) + " degrees")
            // } else if (marsFood.temp >= min_temp) {
            //   resolve("Everything ok!")
            // } else {
            //   reject("Failed!")
            // }
          })
        })
        */
        //     });
        //   });

        //   x.then((response) => {
        //     responseToMars.send(response);
        //     // console.log(responseToMars)
        //   }).catch(message => {
        //     console.log(message)
      },
        { noAck: true }
      )
    })
  })
})

const checkTemperature = function (message) {

  let x = new Promise((resolve, reject) => {

    request(botanikAPIOptions, function (error, response, body) {

      if (error) console.log(error);

      const data = JSON.parse(body);
      const min_temp = data.main_species.growth.temperature_minimum.deg_c;

      if (message.temperatur < min_temp) {
        var messageToMars = message;
        messageToMars.effekt = 'Increase';
        messageToMars.wert = (min_temp - message.temperatur).toFixed(2)
        console.log('min_temp: ' + min_temp);
        console.log('temp: ' + message.temperatur);
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
    responseToMars.send(message);
  }).catch((message) => {
    responseToMars.send(message);
  })
}