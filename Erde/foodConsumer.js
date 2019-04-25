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

amqp.connect(
    'amqp://localhost',
    function (err, conn) {
        conn.createChannel(function (err, ch) {
            var exchangeName = 'fromMars'

            ch.assertExchange(exchangeName, 'direct', { durable: false })

            ch.assertQueue('', { exclusive: true }, function (err, q) {
                console.log('Waiting for messages in %s', '')
                ch.bindQueue('', exchangeName, 'food')

                ch.consume('', function (msg) {

                    if (msg.content) {
                        var marsFood = JSON.parse(msg.content)

                        let x = new Promise((resolve, reject) => {
                            requestFunction.requestAPI(
                                botanikAPIOptions,
                                earthFoodArray => {
                                    // marsFood = {"name": --- , "temp": ---} || marsFood = {"name": --- , "humidity": ---}
                                    // earthFood = {"name": --- , "minTemperature": --- , "maxTemperature": ---}
                                    const earthFood = helpFunction.getFoodByName(
                                        marsFood.name,
                                        earthFoodArray
                                    )

                                    if (marsFood.temp != undefined) {
                                        resolve(checkTemp(marsFood.temp, earthFood))
                                    } else if (marsFood.humidity != undefined) {
                                        resolve(checkHumidity(marsFood.humidity, earthFood))
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

// const check = function (marsFood) {

//     requestFunction.requestAPI(botanikAPIOptions, (earthFoodArray) => {

//         // marsFood = {"name": --- , "temp": ---} || marsFood = {"name": --- , "humidity": ---}
//         // earthFood = {"name": --- , "minTemperature": --- , "maxTemperature": ---}
//         const earthFood = helpFunction.getFoodByName(marsFood.name, earthFoodArray);

//         if (marsFood.temp != undefined) {
//             return checkTemp(marsFood.temp, earthFood);
//         } else if (marsFood.humidity != undefined) {
//             return checkHumidity(marsFood.humidity, earthFood);
//         } else {
//             return "Failed";
//         }
//     })
// }

const checkTemp = function (marsFoodTemp, earthFood) {
    const minTemp = earthFood.minTemperature
    const maxTemp = earthFood.maxTemperature

    if (marsFoodTemp < minTemp) {
        return (
            earthFood.name +
            ': Increase temperature for ' +
            (minTemp - marsFoodTemp) +
            ' degrees'
        )
    } else if (marsFoodTemp > maxTemp) {
        return (
            earthFood.name +
            ': Decrease temperature for ' +
            (marsFoodTemp - maxTemp) +
            ' degrees'
        )
    } else return earthFood.name + ': temperature OK'
}

const checkHumidity = function (marsFoodHumidity, earthFood) {
    const minHum = earthFood.minHumidity
    const maxHum = earthFood.maxHumidity

    if (marsFoodHumidity < minHum) {
        return (
            earthFood.name +
            ': Increase humidity for ' +
            (minHum - marsFoodHumidity) +
            '%'
        )
    } else if (marsFoodHumidity > maxHum) {
        return (
            earthFood.name +
            ': Decrease humidity for ' +
            (marsFoodHumidity - maxHum) +
            '%'
        )
    } else return earthFood.name + ': humidity OK'
}
