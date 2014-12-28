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

// 真真真真真真真真�
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

/* 真真真真真�                                               */
/*                                                                      */
/* @baseList:    config真真真真真真真真真真(json�) */
/* @webItemList: web真真真真真�(json�)                      */
/* @errorList:   真真真真真�(json�)                         */
function validateDataType(validTypeJson, webItemJson, errorJson){
    var isError = false;
    for(var itemName in validTypeJson){
        var itemTypeJson = validTypeJson[itemName];
        for(var typeNum in itemTypeJson){
            var type = itemTypeJson[typeNum];
            var webItemType = webItemJson[itemName];
            if(type == "require"){
                if(util.isUndefine(webItemType)){
                  // Error真真真真真真真真
                  isError = true;
                  logger.error('XXXXX', 'info =>'+ itemName + ', ' + webItemJson[itemName]);
                  break;
                }
                continue;
            }
            // NULL真真真�NULL真OK�
            if(util.isUndefine(webItemType)){
                continue; // OK
            }
            // STRING真真
            if(type == "string"){
                if(!isNaN(webItemType)){
                  // Error真真真真真真�
                  isError = true;
                  logger.error('XXXXX', 'info =>'+ itemName + ', ' + webItemJson[itemName]);
                  break;
                }
                continue;
            }
            // INTEGER真真
            if(type == "integer"){
                if(isNaN(webItemType)){
                    // Error真真真真真真真
                    isError = true;
                    logger.error('XXXXX', 'info =>'+ itemName + ', ' + webItemJson[itemName]);
                    break;
                }
                continue;
            }
            // Error�STRING�/INTEGER真真真真真真真真真�
            isError = true;
            logger.error('XXXXX', 'info =>'+ itemName + ', ' + type);
            break;
        }
    }
    // 真真�
    if (isError){
        errorJson[isError] = true;
        return;
    }
}

/* 真真真真真真真                                             */
/*                                                                          */
/* @baseList:    config真真真真真真真真真真真(json�) */
/* @webItemList: web真真真真真�(json�)                          */
/* @errorList:   真真真真真�(json�)                             */
function validateDataSize(validSizeJson, webItemJson, errorJson){
    var isError = false;
    for(var itemName in validSizeJson){
        var itemSize = validSizeJson[itemName];
        var webItemValue = webItemJson[itemName];
        if(util.isUndefine(webItemValue)){
            continue;
        }
        if(webItemValue.length < itemSize){
            // Error真真真真真真真真真真真�
            isError = true;
            logger.error('XXXXX', 'info =>'+ itemName + ', ' + itemSize);
            continue;
        }
    }
    // 真真�
    if (isError){
        errorJson[isError] = true;
        return;
    }
}

