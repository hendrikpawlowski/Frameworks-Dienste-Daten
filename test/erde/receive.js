var amqp = require('amqplib/callback_api');


// Connect to RabbitMQ - Server
amqp.connect('amqp://localhost', function (err, conn) {

    conn.createChannel(function (err, ch) {

        var queue = 'fromMars';

        ch.assertQueue(queue, { durable: false });

        console.log("Earth: Waiting for incoming messages");

        ch.consume(queue, function (msg) {
            console.log("Received %s", msg.content.toString());
        }, { noAck: true });
    });
});