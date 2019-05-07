const amqp = require('amqplib/callback_api')
const research = require('./research')
const helpFunctions = require('../Erde/helpFunctions/helpFunctions')
const fs = require('fs')

amqp.connect('amqp://localhost', function (err, conn) {

    conn.createChannel(function (err, ch) {

        var exchangeName = 'fromMars';

        ch.assertExchange(exchangeName, 'direct', { durable: false });

        ch.assertQueue('', { exclusive: true }, function (err, q) {
            ch.bindQueue('', exchangeName, 'orderFromEarth')
        })
        var counter

        movement()
        function movement() {

            counter = 0
            var interval = setInterval(function () {
                research.position.y++
                saveResearch()

                counter++
                console.log("Moved to positon \ny = " + research.position.y + "\nx= " + research.position.x)
                if(counter === 5) {
                    clearInterval(interval)
                    console.log("Activate analysis!")
                    research.analysis = analysis()

                    ch.publish(exchangeName, 'researchData', new Buffer(JSON.stringify(research)));
                    console.log("SENT: " + research);

                    ch.consume('', function (msg) {
                        console.log("RECEIVED: " + msg.content);
                        if ((String) (msg.content) === "hold direction") {
                            movement()
                        } else if ((String) (msg.content) === "change direction") {
                            changePosition(research.position.x+1, research.position.y)
                            movement()
                        }
                        }, { noAck: true })
                }
            }, 1000)
        }
    });
});


function analysis() {
    let result = {
        /*oxygen: Math.random()*100,
        carbon: Math.random()*100,
        nitrogen: Math.random()*100,
        unknown: Math.random()*100*/
    }
    return result
}

function changePosition(x, y) {
    research.position.x = x
    research.position.y = y
    saveResearch()
}

function saveResearch() {
    fs.writeFile('./research.json', JSON.stringify(research), function (error) {
        if (error) throw error;
    });
}