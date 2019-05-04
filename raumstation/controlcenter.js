const amqp = require('amqplib/callback_api')
const foodTempModule = require('./foodTempModule');
const foodHumidityModule = require('./foodHumidityModule');

console.log("control center started");

foodTempModule.start();
//foodHumidityModule.start();

amqp.connect('amqp://localhost',
    function (err, conn) {
        conn.createChannel(function (err, ch) {
            var exchangeName = 'fromEarth'

            ch.assertExchange(exchangeName, 'direct', { durable: false })

            ch.assertQueue('', { exclusive: true }, function (err, q) {
                ch.bindQueue('', exchangeName, 'responseToMars')

                ch.consume('', function (msg) {
                    console.log("RECEIVED: " + JSON.parse(msg.content));
                    if (JSON.parse(msg.content) !== "Everything ok!") {
                        ch.publish(exchangeName, 'messageToRobot', new Buffer(JSON.parse(msg.content)))
                    }
                }, { noAck: true })
            })
        })
    }
)