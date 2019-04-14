const request = require('request');

let x = new Promise((resolve, reject) => {

    request("http://api.open-notify.org/astros.json", function (error, response, body) {

    const number = JSON.parse(body).number;

        if (number != 6) {
            reject('Failed');
        } else {
            resolve(number);
        }
    });
})

// then wird bei resolve ausgeführt und catch bei reject
x.then((data) => {
    console.log(data);
}).catch((message) => {
    console.log(message);
})