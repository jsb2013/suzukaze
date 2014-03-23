var sys = require("sys");

exports.isUndefine = function(value){
    if (value === undefined || value === null || value ==='' || value === 'null'){
        return true;
    }
    return false;
};

exports.isUndefineForList = function(value){
    if (value === undefined || value === null || value ==='' || value.length === 0){
        return true;
    }
    return false;
};

exports.convertJsonNullToBlank = function(json){
    var jsonHosei = {};
    for(var key in json){
        var value = json[key];
        if (value === undefined || value === null || value ===''){
            jsonHosei[key] = "";
            continue;
        }
        jsonHosei[key] = json[key];
        continue;
    }
    return jsonHosei;
};

exports.convertJsonNullToBlankForAllItem = function (json) {
    var jsonHosei = {};
    for (var key in json) {
        var itemList = json[key];
        for (var item in itemList) {
            var value = itemList[item];
            if (isUndefine(value)) {
                itemList[item] = "";
                continue;
            }
        }
    }
};

// データベースエラーメッセージの変換
exports.getErrorMsg = function(error){
    return sys.inspect(error);
};

function isUndefine(value){
    if (value === undefined || value === null || value ==='' || value === 'null'){
        return true;
    }
    return false;
};

exports.splitStringByDelimiter = function(string, delimiter){
    var splitList = [];

    if(!isUndefine(string)){
        splitList = string.split(delimiter);
    }
    return splitList;
}

exports.convertBlankToNull = function(value){
    if(isUndefine(value)){
        return null;
    }
    return value;
}