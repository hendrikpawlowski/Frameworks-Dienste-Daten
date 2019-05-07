const amqp = require('amqplib/callback_api');
const hf = require('../ourModules/helpFunctions');
const klimaanlage = require('./lebenserhaltungsgerätschaften/klimaanlage');

klimaanlage.start();


hf.consume('fromEarth', 'versorgung', (data) => {

  if(data.versorgungsmittel === 'temperatur' && data.effekt === 'increase') {
    klimaanlage.changeTemperature(data.wert, data.raum);
  }
})


// amqp.connect('amqp://localhost',
//   function (err, conn) {
//     conn.createChannel(function (err, ch) {
//       var exchangeName = 'fromEarth'

//       ch.assertExchange(exchangeName, 'direct', { durable: false })

//       ch.assertQueue('', { exclusive: true }, function (err, q) {
//         ch.bindQueue('', exchangeName, 'versorgung')

//         ch.consume('', function (msg) {
//           const message = JSON.parse(msg.content);
//           console.log("RECEIVED: " + msg.content);

          

//         }, { noAck: true })
//       })
//     })
//   }
// )