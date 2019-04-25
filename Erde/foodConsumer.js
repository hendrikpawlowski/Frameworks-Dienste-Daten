const amqp = require('amqplib/callback_api');
const requestFunction = require('./helpFunctions/requestFunction');
const helpFunction = require('./helpFunctions/helpFunctions');


const botanikAPIOptions = {
    host: "localhost",
    port: 3001,
    path: "/",
    method: "GET"
};

amqp.connect('amqp://localhost', function (err, conn) {

    conn.createChannel(function (err, ch) {

        var exchangeName = 'fromMars';

        ch.assertExchange(exchangeName, 'direct', { durable: false });

        ch.assertQueue('', { exclusive: true }, function (err, q) {
            console.log("Waiting for messages in %s", '');
            ch.bindQueue('', exchangeName, 'food');

            ch.consume('', function (msg) {
                if (msg.content) {
                    var data = JSON.parse(msg.content);
                    // setTimeout(function () {
                    // console.log("Received: " + data);
                    // }, 5000);

                    check(data);
                }
            }, { noAck: true });
        });
    });
});

const check = function (marsFood) {

    requestFunction.requestAPI(botanikAPIOptions, (earthFoodArray) => {

        // marsFood = {"name": --- , "temp": ---} || marsFood = {"name": --- , "humidity": ---}
        // earthFood = {"name": --- , "minTemperature": --- , "maxTemperature": ---}
        const earthFood = helpFunction.getFoodByName(marsFood.name, earthFoodArray);

        if (marsFood.temp != undefined) {
            console.log("check: " + checkTemp(marsFood.temp, earthFood));
        } else if (marsFood.humidity != undefined) {
            console.log("check: " + checkHumidity(marsFood.humidity, earthFood));
        }
    })
}

const checkTemp = function (marsFoodTemp, earthFood) {

    const minTemp = earthFood.minTemperature;
    const maxTemp = earthFood.maxTemperature;

    if (marsFoodTemp < minTemp) return earthFood.name + ": Increase temperature for " + (minTemp - marsFoodTemp) + " degrees";
    else if (marsFoodTemp > maxTemp) return earthFood.name + ": Decrease temperature for " + (marsFoodTemp - maxTemp) + " degrees";
    else return earthFood.name + ": temperature OK"
}

const checkHumidity = function (marsFoodHumidity, earthFood) {

    const minHum = earthFood.minHumidity;
    const maxHum = earthFood.maxHumidity;

    if (marsFoodHumidity < minHum) return earthFood.name + ": Increase humidity for " + (minHum - marsFoodHumidity) + "%"
    else if (marsFoodHumidity > maxHum) return earthFood.name + ": Decrease humidity for " + (marsFoodHumidity - maxHum) + "%"
    else return earthFood.name + ": humidity OK"

}