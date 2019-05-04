const amqp = require('amqplib/callback_api');


exports.start = function () {

    setInterval(function () {

        const data = {
            name: "potatoe",
            //temp: (Math.random() * 40).toFixed(0)
            temp: -10
        }

        amqp.connect('amqp://localhost', function (err, conn) {

            conn.createChannel(function (err, ch) {

                var exchangeName = 'fromMars';

                ch.assertExchange(exchangeName, 'direct', { durable: false });
                ch.publish(exchangeName, 'food', new Buffer(JSON.stringify(data)));
                console.log("SENT: " + JSON.stringify(data));
            });

            setTimeout(function () {
                conn.close();
            }, 500);
        });
    }, 8000)
}