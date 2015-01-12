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

// ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ
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

/* ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ                                               */
/*                                                                      */
/* @baseList:    config��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ(json��ｿ) */
/* @webItemList: web��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ(json��ｿ)                      */
/* @errorList:   ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ(json��ｿ)                         */
function validateDataType(validTypeJson, webItemJson, errorJson){
    var isError = false;
    for(var itemName in validTypeJson){
        var itemTypeJson = validTypeJson[itemName];
        for(var typeNum in itemTypeJson){
            var type = itemTypeJson[typeNum];
            var webItemType = webItemJson[itemName];
            if(type == "require"){
                if(util.isUndefine(webItemType)){
                  // Error��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ
                  isError = true;
                  logger.error('XXXXX', 'info =>'+ itemName + ', ' + webItemJson[itemName]);
                  break;
                }
                continue;
            }
            // NULL��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿNULL��ｿ��ｿOK��ｿ
            if(util.isUndefine(webItemType)){
                continue; // OK
            }
            // STRING��ｿ��ｿ��ｿ��ｿ
            if(type == "string"){
                if(!isNaN(webItemType)){
                  // Error��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ
                  isError = true;
                  logger.error('XXXXX', 'info =>'+ itemName + ', ' + webItemJson[itemName]);
                  break;
                }
                continue;
            }
            // INTEGER��ｿ��ｿ��ｿ��ｿ
            if(type == "integer"){
                if(isNaN(webItemType)){
                    // Error��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ
                    isError = true;
                    logger.error('XXXXX', 'info =>'+ itemName + ', ' + webItemJson[itemName]);
                    break;
                }
                continue;
            }
            // Error��ｿSTRING��ｿ/INTEGER��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ
            isError = true;
            logger.error('XXXXX', 'info =>'+ itemName + ', ' + type);
            break;
        }
    }
    // ��ｿ��ｿ��ｿ��ｿ��ｿ
    if (isError){
        errorJson[isError] = true;
        return;
    }
}

/* ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ                                             */
/*                                                                          */
/* @baseList:    config��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ(json��ｿ) */
/* @webItemList: web��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ(json��ｿ)                          */
/* @errorList:   ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ(json��ｿ)                             */
function validateDataSize(validSizeJson, webItemJson, errorJson){
    var isError = false;
    for(var itemName in validSizeJson){
        var itemSize = validSizeJson[itemName];
        var webItemValue = webItemJson[itemName];
        if(util.isUndefine(webItemValue)){
            continue;
        }
        if(webItemValue.length < itemSize){
            // Error��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ��ｿ
            isError = true;
            logger.error('XXXXX', 'info =>'+ itemName + ', ' + itemSize);
            continue;
        }
    }
    // ��ｿ��ｿ��ｿ��ｿ��ｿ
    if (isError){
        errorJson[isError] = true;
        return;
    }
}

function paddingBlank(value){
    var _value = value.replace(/^\s+/g, "").replace(/\s+$/g, "");
    return _value;
}

exports.getSplitBlancList = function (value) {
    var _value = value.replace("　", " ");
    var _valueList = _value.split(" ");
    var valueList = [];

    for (var i in _valueList) {
        if (!isUndefine(_valueList[i])) {
            valueList.push(paddingBlank(_valueList[i]));
        }
    }
    return valueList;
};

