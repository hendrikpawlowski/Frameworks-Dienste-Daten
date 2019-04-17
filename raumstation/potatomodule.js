const amqp = require('amqplib/callback_api');
const http = require('http');


const options = {
    host: "localhost",
    port: 3001,
    path: "/",
    method: "GET"
};

const requestBotanik = function (options, callback) {

    var request = http.request(options, function (res2) {

        var body = "";

        res2.on("data", function (content) {
            body += content;
        });

        res2.on("end", function () {
            const data = JSON.parse(body).daten;
            callback(data);
        });

    });
    // Server konnte nicht erreicht werden
    request.on("error", function (err) {
        console.log("Server " + options.host + ":" + options.port + "" + options.path + " wurde nicht erreicht");
    });
    request.end();
};

var potatotemp = 0;

setInterval(function () {
    potatotemp = (Math.random()*100).toFixed(0);
    console.log(potatotemp);
    }, 500)

requestBotanik(options, function (botanikInformationen) {
    if(potatotemp < botanikInformationen.Infos[0].minTemperatur || potatotemp > botanikInformationen.Infos[0].maxTemperatur) {
        amqp.connect('amqp://localhost', function (err, conn) {

            conn.createChannel(function (err, ch) {

                var exchangeName = 'messages';

                ch.assertExchange(exchangeName, 'direct', { durable: false });
                ch.publish(exchangeName, 'botaniker' , new Buffer(potatotemp));
                console.log("Sent " + potatotemp);
            });

            setTimeout(function () { conn.close(); process.exit(0) }, 500);
        });
    }
})







