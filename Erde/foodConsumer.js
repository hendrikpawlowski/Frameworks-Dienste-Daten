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

        var exchangeName = 'messages';

        ch.assertExchange(exchangeName, 'direct', { durable: false });

        ch.assertQueue('', { exclusive: true }, function (err, q) {
            console.log("Waiting for messages in %s", '');
            ch.bindQueue('', exchangeName, 'botaniker');

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
            // checkHumidity();
        }
    })
}

const checkTemp = function (marsFoodTemp, earthFood) {

    const minTemp = earthFood.minTemperature;
    const maxTemp = earthFood.maxTemperature;

    if (marsFoodTemp < minTemp) return earthFood.name + ": Higher temperature for " + (minTemp - marsFoodTemp) + " degrees";
    else if (marsFoodTemp > maxTemp) return earthFood.name + ": Lower temperature for " + (marsFoodTemp - maxTemp) + " degrees";
    else return earthFood.name + ": temperature OK"
}