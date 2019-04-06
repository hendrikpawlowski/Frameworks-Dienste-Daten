var amqp = require('amqplib/callback_api');

var msg = 'lol';

// Connect to RabbitMQ - Server
amqp.connect('amqp://localhost', function (err, conn) {

    conn.createChannel(function (err, ch) {

        var queue = 'queueName';

        // asserts a queue into existence
        // if durable is true, the queue will survive a restart
        ch.assertQueue(queue, { durable: false });

        // sends msg to queue
        ch.sendToQueue(queue, new Buffer(msg));
        console.log(msg, " sent");
    });

    setTimeout(function () { conn.close(); process.exit(0) }, 500);
});