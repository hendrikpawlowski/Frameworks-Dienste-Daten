var amqp = require('amqplib/callback_api');
const readline = require('readline');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('FromEarth: Please enter your message: ', (msg) => {

    const newMessage = {
        message: msg
    }

    // Connect to RabbitMQ - Server
    amqp.connect('amqp://localhost', function (err, conn) {

        conn.createChannel(function (err, ch) {

            var queue = 'fromEarth';

            // asserts a queue into existence
            // if durable is true, the queue will survive a restart
            ch.assertQueue(queue, { durable: false });

            // sends msg to queue
            ch.sendToQueue(queue, new Buffer(JSON.stringify(newMessage)));
            console.log(newMessage, " sent");
        });

        setTimeout(function () { conn.close(); process.exit(0) }, 500);
    });

    rl.close();
});