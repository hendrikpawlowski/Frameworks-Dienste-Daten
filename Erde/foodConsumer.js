const amqp = require('amqplib/callback_api');
const requestFunction = require('./requestFunction');


const botanikAPIOptions = {
    host: "localhost",
    port: 3001,
    path: "/",
    method: "GET"
};

amqp.connect('amqp://localhost', function (err, conn) {

    conn.createChannel(function (err, ch) {

        var exchangeName = 'messages';

        ch.assertExchange(exchangeName, 'direct', { durable: false });

        ch.assertQueue('', { exclusive: true }, function (err, q) {
            console.log("Waiting for messages in %s", '');
            ch.bindQueue('', exchangeName, 'botaniker');

            ch.consume('', function (msg) {
                if (msg.content) {
                    var data = JSON.parse(msg.content);
                    // setTimeout(function () {
                    // console.log("Received: " + data);
                    // }, 5000);

                    check(data);
                }
            }, { noAck: true });
        });
    });
});

const check = function (marsData) {

    requestFunction.requestAPI(botanikAPIOptions, (earthData) => {

        // console.log("EARTH: " + JSON.stringify(earthData));

        for (x in marsData.potatoe) {

            switch (x) {
                case "humidity":
                    // return checkTemp(marsData.potatoe.temp, earthData.infos.potatoe);
                    console.log(checkTemp(marsData.potatoe.temp, earthData.infos.potatoe));
                    // console.log("Lol: humidity")
                    break;
                case "temp":
                    // return checkHumidity(marsData.potatoe.humidity);
                    // console.log("Lol: temp")
                    break;
            }
        }

        // for (var i = 0; i < data.infos.length; i++) {
        //     if (data.infos[i].name == "kartoffel") {
        //         var min = data.infos[i].minTemperatur;
        //         var max = data.infos[i].maxTemperatur;
        //     }
        // }

        // if (temp >= min && temp <= max) console.log("OK");
        // else if (temp < min) console.log("Temperatur erhöhen um mindestens " + (min - temp) + " Grad Celsius");
        // else console.log("Temperatur erniedrigen um mindestens " + (temp - max) + " Grad Celsius");
    })
}

const checkTemp = function (marsTemp, potatoe) {
    console.log(potatoe);

    // if (marsTemp < potatoe.minTemp) return "Potatoe: Higher temperature for " + (potatoe.minTemp - marsTemp) + " degrees";
    // else if (marsTemp > potatoe.maxTemp) return "Potatoe: Lower temperature for " + (marsTemp - potatoe.maxTemp) + " degrees";
    // else return "Potatoe: temperature OK"
}