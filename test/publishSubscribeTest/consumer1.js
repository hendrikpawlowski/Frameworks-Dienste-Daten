var amqp = require('amqplib/callback_api');


amqp.connect('amqp://localhost', function (err, conn) {

    conn.createChannel(function (err, ch) {

        var exchangeName = 'messages';

        ch.assertExchange(exchangeName, 'direct', { durable: false });

        ch.assertQueue('', { exclusive: true }, function (err, q) {
            console.log("Waiting for messages in %s", '');
            ch.bindQueue('', exchangeName,'chat1');

            ch.consume('', function (msg) {
                if (msg.content) {
                    console.log(" [x] %s", msg.content.toString());
                }
            }, { noAck: true });
        });
    });
});