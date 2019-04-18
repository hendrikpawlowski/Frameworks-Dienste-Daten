const amqp = require('amqplib/callback_api');


exports.start = function () {

    setInterval(function () {

        const data = {
            potatoe: {
                temp: (Math.random() * 40).toFixed(0)
            }
        }

        amqp.connect('amqp://localhost', function (err, conn) {

            conn.createChannel(function (err, ch) {

                var exchangeName = 'messages';

                ch.assertExchange(exchangeName, 'direct', { durable: false });
                ch.publish(exchangeName, 'botaniker', new Buffer(JSON.stringify(data)));
                console.log("Sent " + JSON.stringify(data));
            });

            setTimeout(function () {
                conn.close();
            }, 500);
        });

    }, 2000)
}