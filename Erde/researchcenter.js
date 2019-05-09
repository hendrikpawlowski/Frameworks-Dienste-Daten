const amqp = require('amqplib/callback_api');
const helpFunctions = require('../src/ourModules/helpFunctions')
var researchResults = require('./researchResults')
const fs = require('fs');
const inquirer = require('inquirer')

var questions = [{
    type: 'type',
    name: 'name',
    message: "Geben Sie die x-Koordinate ein: "
}, {type: 'type',
    name: 'name2',
    message: "Geben Sie die y-Koordinate ein: "}]

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

                    //Es wird nachgeschaut, ob die erhaltene Position bereits analysiert wurde
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
                        console.log("Ergebnis wurde gespeichert!")
                    } else {
                        console.log("Position wurde bereits analysiert!")
                    }
                        var newPosition = {
                            x: 0,
                            y: 0
                        }
                        /*readline.question(`Geben Sie die x-Koordinate ein:`, (x) => {
                            newPosition.x = x;
                            readline.question(`Geben Sie die y-Koordinate ein:`, (y) => {
                                newPosition.y = y;

                                ch.publish(exchangeName, 'orderFromEarth', new Buffer(JSON.stringify(newPosition)))
                                console.log("SENT: " + JSON.stringify(newPosition))
                                readline.close()
                            })
                        })*/

                    inquirer.prompt(questions).then(answers => {
                        newPosition.x = answers['name']
                        newPosition.y = answers['name2']
                        ch.publish(exchangeName, 'orderFromEarth', new Buffer(JSON.stringify(newPosition)))
                        console.log("SENT: " + JSON.stringify(newPosition))
                    })

                }, { noAck: true })
            })
        })
    }
)