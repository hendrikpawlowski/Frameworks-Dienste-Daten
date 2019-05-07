const amqp = require('amqplib/callback_api');

/*data = {
    name: "potatoe",
    //temp: (Math.random() * 40).toFixed(0)
    temp: -20
}*/

exports.start = function () {

    setInterval(function () {

        amqp.connect('amqp://localhost', function (err, conn) {

            conn.createChannel(function (err, ch) {

                var exchangeName = 'fromMars';

                ch.assertExchange(exchangeName, 'direct', { durable: false });
                ch.publish(exchangeName, 'food', new Buffer(JSON.stringify(potato.getData())));
                console.log("SENT: " + JSON.stringify(potato.getData()));
            });

            setTimeout(function () {
                conn.close();
            }, 500);
        });
    }, 2000)
}