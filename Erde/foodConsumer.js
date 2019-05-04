const amqp = require('amqplib/callback_api');
const requestFunction = require('./helpFunctions/requestFunction');
const helpFunction = require('./helpFunctions/helpFunctions');
const responseToMars = require('./helpFunctions/responseToMars');
const request = require('request');

const botanikAPIOptions = {
    host: 'localhost',
    port: 3001,
    path: '/',
    method: 'GET'
};

const botanikAPIOptions2 = {
    host: 'http://trefle.io/',
    port: "",
    path: '/api/plants/129834',
    method: 'GET'
};



/*request({
    method: 'GET',
    url: 'http://trefle.io/api/plants/129834',
    auth: {
        bearer: 'SUNjdmpQS2FvMFVsNmVPaHdUcXJZUT09'
    }
}, function(error, response, body) {
    if (error) console.log(error);
    const data = JSON.parse(body)
    console.log(data.main_species.growth);
});*/


exports.start = function () {

    amqp.connect('amqp://localhost', function (err, conn) {
        conn.createChannel(function (err, ch) {
            var exchangeName = 'fromMars';

            ch.assertExchange(exchangeName, 'direct', { durable: false });

            ch.assertQueue('', { exclusive: true }, function (err, q) {
                // console.log('Waiting for messages in %s', '')
                ch.bindQueue('', exchangeName, 'food');

                ch.consume('', function (msg) {

                    console.log("RECEIVED: " + msg.content);

                    if (msg.content) {
                        var marsFood = JSON.parse(msg.content);

                        let x = new Promise((resolve, reject) => {
                            /*requestFunction.requestAPI(botanikAPIOptions, earthFoodArray => {
                                // marsFood = {"name": --- , "temp": ---} || marsFood = {"name": --- , "humidity": ---}
                                // earthFood = {"name": --- , "minTemperature": --- , "maxTemperature": ---}
                                const earthFood = helpFunction.getFoodByName(
                                    marsFood.name,
                                    earthFoodArray
                                )



                                if (marsFood.temp != undefined) {
                                    resolve(helpFunction.checkTemp(marsFood.temp, earthFood))
                                } else if (marsFood.humidity != undefined) {
                                    resolve(helpFunction.checkHumidity(marsFood.humidity, earthFood))
                                } else {
                                    reject('Failed')
                                }
                            }
                            )*/
                            request({
                                method: 'GET',
                                url: 'http://trefle.io/api/plants/129834',
                                auth: {
                                    bearer: 'SUNjdmpQS2FvMFVsNmVPaHdUcXJZUT09'
                                }
                            }, function(error, response, body) {
                                if (error) console.log(error);
                                const data = JSON.parse(body);
                                //console.log(data.main_species.growth);
                                const min_temp = data.main_species.growth.temperature_minimum.deg_c;
                                if (marsFood.temp < min_temp) {
                                    var tempMsg = {
                                        type: "temperature",
                                        effect: min_temp-marsFood.temp
                                    }
                                    resolve(tempMsg);
                                    //resolve("Increase temperature by " + (min_temp-marsFood.temp) + " degrees")
                                } else if (marsFood.temp >= min_temp) {
                                    resolve("Everything ok!")
                                } else {
                                    reject("Failed!")
                                }
                            });
                        });

                        x.then((response) => {
                            responseToMars.send(response);
                            // console.log(responseToMars)
                        }).catch(message => {
                            console.log(message)
                        })
                    }
                },
                    { noAck: true }
                )
            })
        })
    }
    )
};