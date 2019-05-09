const amqp = require('amqplib/callback_api');
const research = require('./research');
const helpFunctions = require('../../ourModules/helpFunctions');
const fs = require('fs');

amqp.connect('amqp://localhost', function (err, conn) {

    conn.createChannel(function (err, ch) {

        var exchangeName = 'fromMars';

        ch.assertExchange(exchangeName, 'direct', { durable: false });

        ch.assertQueue('', { exclusive: true }, function (err, q) {
            ch.bindQueue('', exchangeName, 'orderFromEarth')
        });

        var counter;
        var destination = {x:0, y:0};

        //Der Mars Rover beginnt sich in eine Richtung zu bewegen
        movement();

        function movement() {

            ch.consume('', function (msg) {
                console.log("RECEIVED: " + msg.content);
                const newPosition = JSON.parse(msg.content);
                destination.x = newPosition.x
                destination.y = newPosition.y
                movement()
            }, { noAck: true })

            if(destination.x === undefined && destination.y === undefined) {
                console.log("Waiting for new destination...")
            } else {
                var interval = setInterval(function () {

                    //Der Mars Rover bewegt sich
                    if (destination.x > research.position.x ) {
                        research.position.x++
                    }
                    if (destination.x < research.position.x) {
                        research.position.x--
                    }
                    if (destination.y > research.position.y) {
                        research.position.y++
                    }
                    if (destination.y < research.position.y) {
                        research.position.y--
                    }

                    /*console.log("destination.x: " + destination.x + typeof destination.x)
                    console.log("destination.y: " + destination.y + typeof destination.y)
                    console.log("research.position.x: " + research.position.x + typeof research.position.x)
                    console.log("research.position.y: " + research.position.y + typeof research.position.y)*/

                    saveResearch();
                    if (parseInt(destination.x) === research.position.x && parseInt(destination.y) === research.position.y) {
                        destination.x = undefined;
                        destination.y = undefined;
                        console.log("Destination reached!")
                        console.log("Activate analysis!")
                        research.analysis = analysis();

                        ch.publish(exchangeName, 'researchData', new Buffer(JSON.stringify(research)));
                        console.log("SENT: " + JSON.stringify(research));

                        clearInterval(interval)
                        console.log("Waiting for new destination...")
                    } else {
                        console.log("Moving... " + "[current position] -> x: " + research.position.x + " y: " + research.position.y)
                    }

                    if(counter % 5 === 0) {

                        //Der Roboter beginnt mit der Analyse der aktuellen Position
                        console.log("Activate analysis!");
                        research.analysis = analysis();

                        ch.publish(exchangeName, 'researchData', new Buffer(JSON.stringify(research)));
                        console.log("SENT: " + JSON.stringify(research));

                        ch.consume('', function (msg) {
                            console.log("RECEIVED: " + msg.content);
                            const newPosition = JSON.parse(msg.content);
                            destination.x = newPosition.x
                            destination.y = newPosition.y
                        }, { noAck: true })
                    }
                }, 1000)
            }
        }
    });
});


function analysis() {
    return {
        oxygen: (Math.random()*100).toFixed(2),
        carbon: (Math.random()*100).toFixed(2),
        nitrogen: (Math.random()*100).toFixed(2),
        unknown: (Math.random()*100).toFixed(2)
    };
}

function changePosition(x, y) {
    research.position.x = x;
    research.position.y = y;
    saveResearch();
}

function saveResearch() {
    fs.writeFile('./research.json', JSON.stringify(research), function (error) {
        if (error) throw error;
    });
}