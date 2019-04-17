var amqp = require('amqplib/callback_api');
var http = require('http');


amqp.connect('amqp://localhost', function (err, conn) {

    conn.createChannel(function (err, ch) {

        var exchangeName = 'messages';

        ch.assertExchange(exchangeName, 'direct', { durable: false });

        ch.assertQueue('', { exclusive: true }, function (err, q) {
            console.log("Waiting for messages in %s", '');
            ch.bindQueue('', exchangeName,'botaniker');

            ch.consume('', function (msg) {
                if (msg.content) {
                    var potatoeTemp = msg.content;
                    console.log("Received Temperatur: " + potatoeTemp);

                    checkTemp(potatoeTemp);
                }
            }, { noAck: true });
        });
    });
});

const checkTemp = function (temp) {

    requestAPI (botanikAPIOptions, (data) => {
        
        for (var i = 0; i < data.infos.length; i++) {
            if(data.infos[i].name == "kartoffel") {
                var min = data.infos[i].minTemperatur;
                var max = data.infos[i].maxTemperatur;
            }
        }

        if(temp >= min && temp <= max) console.log("OK");
        else if(temp < min) console.log("Temperatur erhöhen um mindestens " + (min - temp) + " Grad Celsius");
        else console.log("Temperatur erniedrigen um mindestens " + (temp - max) + " Grad Celsius");
    })
}

const botanikAPIOptions = {
    host: "localhost",
    port: 3001,
    path: "/",
    method: "GET"
};

const requestAPI = function (options, callback) {

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