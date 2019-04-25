const amqp = require('amqplib/callback_api')
const requestFunction = require('./helpFunctions/requestFunction')
const helpFunction = require('./helpFunctions/helpFunctions')
const responseToMars = require('./helpFunctions/responseToMars')

const botanikAPIOptions = {
    host: 'localhost',
    port: 3001,
    path: '/',
    method: 'GET'
}

exports.start = function () {

    amqp.connect('amqp://localhost', function (err, conn) {
        conn.createChannel(function (err, ch) {
            var exchangeName = 'fromMars'

            ch.assertExchange(exchangeName, 'direct', { durable: false })

            ch.assertQueue('', { exclusive: true }, function (err, q) {
                // console.log('Waiting for messages in %s', '')
                ch.bindQueue('', exchangeName, 'food')

                ch.consume('', function (msg) {

                    console.log("RECEIVED: " + msg.content);

                    if (msg.content) {
                        var marsFood = JSON.parse(msg.content)

                        let x = new Promise((resolve, reject) => {
                            requestFunction.requestAPI(botanikAPIOptions, earthFoodArray => {
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
                            )
                        })

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
}