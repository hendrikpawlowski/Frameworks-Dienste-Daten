const amqp = require('amqplib/callback_api');
const heater = require('./heater')

amqp.connect('amqp://localhost',
  function (err, conn) {
    conn.createChannel(function (err, ch) {
      var exchangeName = 'fromEarth'

      ch.assertExchange(exchangeName, 'direct', { durable: false })

      ch.assertQueue('', { exclusive: true }, function (err, q) {
        ch.bindQueue('', exchangeName, 'messageToRobot')

        ch.consume('', function (msg) {
          console.log("RECEIVED: " + JSON.parse(msg.content).type);
          if (JSON.parse(msg.content).type === "temperature") {
            console.log("Heater activated!")
            heater.heat(JSON.parse(msg.content).effect)
          }
        }, { noAck: true })
      })
    })
  }
)