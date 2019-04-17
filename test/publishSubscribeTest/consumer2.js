var amqp = require('amqplib/callback_api');


amqp.connect('amqp://localhost', function (err, conn) {

    conn.createChannel(function (err, ch) {

        var exchangeName = 'messages';

        ch.assertExchange(exchangeName, 'fanout', { durable: false });

        ch.assertQueue('chat1', { exclusive: true }, function (err, q) {
            console.log("Waiting for messages in %s", q.queue);
            ch.bindQueue(q.queue, exchangeName, '');

            ch.consume(q.queue, function (msg) {
                if (msg.content) {
                    console.log(" [x] %s", msg.content.toString());
                }
            }, { noAck: true });
        });
    });
});