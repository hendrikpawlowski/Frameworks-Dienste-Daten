const http = require('http');


exports.requestAPI = function (options, callback) {

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