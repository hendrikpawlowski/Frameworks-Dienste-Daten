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

exports.generateNewID = function (array) {

    // Dieser token soll auf true gesetzt werden, wenn die ID des aktuellen Forschungsergebnisses mit dem Zähler übereinstmmt
    // So soll eine ID gefunden werden, die noch nicht verwendet wird

    var token = false;

    for (let i = 1; i < array.length + 2; i++) {

        for (let position = 0; position < array.length; position++) {

            // Wird die aktuelle ID schon verwendet, so wird der token auf true gesetzt
            if (array[position].id == i) {
                token = true;
            }

        }
        // Ist der token = false, so wird der aktuelle Zähler zurückgegeben
        if (!token) {
            return i;
        }
        // Der token wird wieder auf false gesetzt, um alles nocheinmal mit dem nächsten Zähler machen zu können
        token = false;
    }
}

exports.checkPosition = function (array, positionX, positionY) {
    for (let i=0; i< array.length; i++) {
        if (array[i].content.position.x === positionX && array[i].content.position.y === positionY) {
            return false;
        }
    }
    return true;
}
