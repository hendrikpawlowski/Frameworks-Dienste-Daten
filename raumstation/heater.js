const potato = require('./potato')

exports.heat = function(temperature) {
    potato.setTemp(potato.getData().temp + temperature)
}
