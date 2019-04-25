const amqp = require('amqplib/callback_api')
const foodTempModule = require('./foodTempModule');
const foodHumidityModule = require('./foodHumidityModule');

foodTempModule.start();
foodHumidityModule.start();

amqp.connect('amqp://localhost',
    function (err, conn) {
        conn.createChannel(function (err, ch) {
            var exchangeName = 'fromEarth'

            ch.assertExchange(exchangeName, 'direct', { durable: false })

            ch.assertQueue('', { exclusive: true }, function (err, q) {
                console.log('Waiting for messages in %s', '')
                ch.bindQueue('', exchangeName, 'responseToMars')

                ch.consume('', function (msg) {
                    console.log("fromEarth: " + JSON.parse(msg.content));
                }, { noAck: true })
            })
        })
    }
)