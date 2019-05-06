var data = {
    name: "potatoe",
    //temp: (Math.random() * 40).toFixed(0)
    temp: -20
}

exports.getData = function () {
    console.log("hi ich bins TEMP: " + data.temp)
    return data;
}

exports.setTemp = function (newTemp) {
    data.temp = newTemp;
}