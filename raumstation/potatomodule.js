const amqp = require('amqplib/callback_api');


setInterval(function () {

    amqp.connect('amqp://localhost', function (err, conn) {

        conn.createChannel(function (err, ch) {

            var exchangeName = 'messages';

            ch.assertExchange(exchangeName, 'direct', { durable: false });
            ch.publish(exchangeName, 'botaniker', new Buffer(potatotemp));
            console.log("Sent " + potatotemp);
        });

        setTimeout(function () {
            conn.close();
        }, 500);
    });

    var potatotemp = (Math.random() * 40).toFixed(0);
}, 2000)