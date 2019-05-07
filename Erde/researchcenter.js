const amqp = require('amqplib/callback_api');
const helpFunctions = require('./helpFunctions/helpFunctions')
var researchResults = require('./researchResults')
const fs = require('fs');

amqp.connect('amqp://localhost',
    function (err, conn) {
        conn.createChannel(function (err, ch) {
            var exchangeName = 'fromMars'

            ch.assertExchange(exchangeName, 'direct', { durable: false })

            ch.assertQueue('', { exclusive: true }, function (err, q) {
                ch.bindQueue('', exchangeName, 'researchData')

                ch.consume('', function (msg) {
                    console.log("RECEIVED: " + msg.content);
                    var content = JSON.parse(msg.content)
                    if (helpFunctions.checkPosition(researchResults, content.position.x, content.position.y)) {
                        let newID = helpFunctions.generateNewID(researchResults)
                        const resultFromMars = {
                            id: newID,
                            content: content
                        }
                        researchResults.push(resultFromMars)
                        fs.writeFile('./researchResults.json', JSON.stringify(researchResults), function (error) {
                            if (error) throw error;
                        });
                        ch.publish(exchangeName, 'orderFromEarth', new Buffer("hold direction"))
                        console.log("SENT: hold direction")
                    } else {
                        ch.publish(exchangeName, 'orderFromEarth', new Buffer("change direction"))
                        console.log("SENT: change direction")
                    }
                }, { noAck: true })
            })
        })
    }
)