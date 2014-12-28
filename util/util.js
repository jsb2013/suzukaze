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

// ¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿
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

/* ¿¿¿¿¿¿¿¿¿¿¿                                               */
/*                                                                      */
/* @baseList:    config¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿(json¿) */
/* @webItemList: web¿¿¿¿¿¿¿¿¿¿¿(json¿)                      */
/* @errorList:   ¿¿¿¿¿¿¿¿¿¿¿(json¿)                         */
function validateDataType(validTypeJson, webItemJson, errorJson){
    var isError = false;
    for(var itemName in validTypeJson){
        var itemTypeJson = validTypeJson[itemName];
        for(var typeNum in itemTypeJson){
            var type = itemTypeJson[typeNum];
            var webItemType = webItemJson[itemName];
            if(type == "require"){
                if(util.isUndefine(webItemType)){
                  // Error¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿
                  isError = true;
                  logger.error('XXXXX', 'info =>'+ itemName + ', ' + webItemJson[itemName]);
                  break;
                }
                continue;
            }
            // NULL¿¿¿¿¿¿¿NULL¿¿OK¿
            if(util.isUndefine(webItemType)){
                continue; // OK
            }
            // STRING¿¿¿¿
            if(type == "string"){
                if(!isNaN(webItemType)){
                  // Error¿¿¿¿¿¿¿¿¿¿¿¿¿
                  isError = true;
                  logger.error('XXXXX', 'info =>'+ itemName + ', ' + webItemJson[itemName]);
                  break;
                }
                continue;
            }
            // INTEGER¿¿¿¿
            if(type == "integer"){
                if(isNaN(webItemType)){
                    // Error¿¿¿¿¿¿¿¿¿¿¿¿¿¿
                    isError = true;
                    logger.error('XXXXX', 'info =>'+ itemName + ', ' + webItemJson[itemName]);
                    break;
                }
                continue;
            }
            // Error¿STRING¿/INTEGER¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿
            isError = true;
            logger.error('XXXXX', 'info =>'+ itemName + ', ' + type);
            break;
        }
    }
    // ¿¿¿¿¿
    if (isError){
        errorJson[isError] = true;
        return;
    }
}

/* ¿¿¿¿¿¿¿¿¿¿¿¿¿¿                                             */
/*                                                                          */
/* @baseList:    config¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿(json¿) */
/* @webItemList: web¿¿¿¿¿¿¿¿¿¿¿(json¿)                          */
/* @errorList:   ¿¿¿¿¿¿¿¿¿¿¿(json¿)                             */
function validateDataSize(validSizeJson, webItemJson, errorJson){
    var isError = false;
    for(var itemName in validSizeJson){
        var itemSize = validSizeJson[itemName];
        var webItemValue = webItemJson[itemName];
        if(util.isUndefine(webItemValue)){
            continue;
        }
        if(webItemValue.length < itemSize){
            // Error¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿
            isError = true;
            logger.error('XXXXX', 'info =>'+ itemName + ', ' + itemSize);
            continue;
        }
    }
    // ¿¿¿¿¿
    if (isError){
        errorJson[isError] = true;
        return;
    }
}

