const amqp = require('amqplib/callback_api')

exports.send = function (data) {
    amqp.connect(
        'amqp://localhost',
        function (err, conn) {
            conn.createChannel(function (err, ch) {
                var exchangeName = 'fromEarth'

                ch.assertExchange(exchangeName, 'direct', { durable: false })
                ch.publish(exchangeName, 'responseToMars', new Buffer(JSON.stringify(data)))
            })

            setTimeout(function () {
                conn.close()
            }, 500)
        }
    )
}
