const amqp = require('amqplib/callback_api');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


rl.question('Nachricht an die Erde: ', (msg) => {

    amqp.connect('amqp://localhost', function (err, conn) {

        conn.createChannel(function (err, ch) {

            var exchangeName = 'fromMars';

            ch.assertExchange(exchangeName, 'direct', { durable: false });
            ch.publish(exchangeName, 'messages' , new Buffer(msg));
            console.log("Sent " + msg);
        });

        setTimeout(function () { conn.close(); process.exit(0) }, 500);
    });
})