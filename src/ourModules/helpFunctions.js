const amqp = require('amqplib/callback_api')


exports.getFoodByName = function (name, array) {

  for (var i = 0; i < array.length; i++) {
    if (array[i].name == name) {
      return array[i];
    }
  }

  return false;
}

exports.checkTemp = function (marsFoodTemp, earthFood) {
  const minTemp = earthFood.minTemperature
  const maxTemp = earthFood.maxTemperature

  if (marsFoodTemp < minTemp) {
    return (
      earthFood.name +
      ': Increase temperature for ' +
      (minTemp - marsFoodTemp) +
      ' degrees'
    )
  } else if (marsFoodTemp > maxTemp) {
    return (
      earthFood.name +
      ': Decrease temperature for ' +
      (marsFoodTemp - maxTemp) +
      ' degrees'
    )
  } else return earthFood.name + ': temperature OK'
}

exports.checkHumidity = function (marsFoodHumidity, earthFood) {
  const minHum = earthFood.minHumidity
  const maxHum = earthFood.maxHumidity

  if (marsFoodHumidity < minHum) {
    return (
      earthFood.name + ': Increase humidity for ' + (minHum - marsFoodHumidity) + '%')
  } else if (marsFoodHumidity > maxHum) {
    return (
      earthFood.name + ': Decrease humidity for ' + (marsFoodHumidity - maxHum) + '%')
  } else return earthFood.name + ': humidity OK'
}

exports.produce = function (exchangeName, bindingKey, data) {

  amqp.connect('amqp://localhost', function (err, conn) {

    conn.createChannel(function (err, ch) {

      ch.assertExchange(exchangeName, 'direct', { durable: false })
      ch.publish(exchangeName, bindingKey, new Buffer(JSON.stringify(data)))
      console.log("SENT: " + JSON.stringify(data));
    })

    setTimeout(function () {
      conn.close()
    }, 500)
  }
  )
}

exports.consume = function (exchangeName, routingKey, callback) {

  amqp.connect('amqp://localhost', function (err, conn) {

    conn.createChannel(function (err, ch) {

      ch.assertExchange(exchangeName, 'direct', { durable: false });

      ch.assertQueue('', { exclusive: true }, function (err, q) {
        // console.log('Waiting for messages in %s', '')
        ch.bindQueue('', exchangeName, routingKey);

        ch.consume('', function (msg) {

          console.log("RECEIVED: " + msg.content);

          callback(JSON.parse(msg.content));
        },
          { noAck: true }
        )
      })
    })
  })
}