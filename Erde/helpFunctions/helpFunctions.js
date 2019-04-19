
// Help Functions

exports.getFoodByName = function (name, array) {

    for(var i = 0; i < array.length; i++) {
        if(array[i].name == name) {
            return array[i];
        }
    }

    return false;
}