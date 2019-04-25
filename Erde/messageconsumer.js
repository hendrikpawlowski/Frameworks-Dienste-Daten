var amqp = require('./node_modules/amqplib/callback_api');


amqp.connect('amqp://localhost', function (err, conn) {

    conn.createChannel(function (err, ch) {

        var exchangeName = 'fromMars';

        ch.assertExchange(exchangeName, 'direct', { durable: false });

        ch.assertQueue('', { exclusive: true }, function (err, q) {
            console.log("Waiting for messages in");
            ch.bindQueue('', exchangeName,'messages');

            ch.consume('', function (msg) {
                if (msg.content) {
                    console.log("Nachricht vom Mars erhalten: %s", msg.content.toString());
                }
            }, { noAck: true });
        });
    });
});