const amqp = require('amqplib/callback_api')


amqp.connect('amqp://localhost',
    function (err, conn) {
        conn.createChannel(function (err, ch) {
            var exchangeName = 'fromEarth'

            ch.assertExchange(exchangeName, 'direct', { durable: false })

            ch.assertQueue('', { exclusive: true }, function (err, q) {
                ch.bindQueue('', exchangeName, 'messageToRobot')

                ch.consume('', function (msg) {
                    console.log("RECEIVED: " + msg.content);
                }, { noAck: true })
            })
        })
    }
)