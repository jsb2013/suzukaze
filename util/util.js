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

/* 入力データの型チェック                                               */
/*                                                                      */
/* @baseList:    configに記載されたデータ型のバリデーション情報(json型) */
/* @webItemList: web画面で入力されたデータ(json型)                      */
/* @errorList:   エラー箇所を纏めたもの(json型)                         */
function validateDataType(validTypeJson, webItemJson, errorJson){
    var isError = false;
    for(var itemName in validTypeJson){
        var itemTypeJson = validTypeJson[itemName];
        for(var typeNum in itemTypeJson){
            var type = itemTypeJson[typeNum];
            var webItemType = webItemJson[itemName];
            if(type == "require"){
                if(util.isUndefine(webItemType)){
                  // Error（必要な値が設定されていない。）
                  isError = true;
                  logger.error('XXXXX', 'info =>'+ itemName + ', ' + webItemJson[itemName]);
                  break;
                }
                continue;
            }
            // NULLかをチェック（NULLでもOK）
            if(util.isUndefine(webItemType)){
                continue; // OK
            }
            // STRING型の確認
            if(type == "string"){
                if(!isNaN(webItemType)){
                  // Error（数値が設定されている。）
                  isError = true;
                  logger.error('XXXXX', 'info =>'+ itemName + ', ' + webItemJson[itemName]);
                  break;
                }
                continue;
            }
            // INTEGER型の確認
            if(type == "integer"){
                if(isNaN(webItemType)){
                    // Error（文字列が設定されている。）
                    isError = true;
                    logger.error('XXXXX', 'info =>'+ itemName + ', ' + webItemJson[itemName]);
                    break;
                }
                continue;
            }
            // Error（STRING型/INTEGER型以外が設定ファイルに含まれている。）
            isError = true;
            logger.error('XXXXX', 'info =>'+ itemName + ', ' + type);
            break;
        }
    }
    // エラー判別
    if (isError){
        errorJson[isError] = true;
        return;
    }
}

/* 入力データのサイズのチェック                                             */
/*                                                                          */
/* @baseList:    configに記載されたデータサイズのバリデーション情報(json型) */
/* @webItemList: web画面で入力されたデータ(json型)                          */
/* @errorList:   エラー箇所を纏めたもの(json型)                             */
function validateDataSize(validSizeJson, webItemJson, errorJson){
    var isError = false;
    for(var itemName in validSizeJson){
        var itemSize = validSizeJson[itemName];
        var webItemValue = webItemJson[itemName];
        if(util.isUndefine(webItemValue)){
            continue;
        }
        if(webItemValue.length < itemSize){
            // Error（実際のサイズが想定サイズ以上になっている。）
            isError = true;
            logger.error('XXXXX', 'info =>'+ itemName + ', ' + itemSize);
            continue;
        }
    }
    // エラー判別
    if (isError){
        errorJson[isError] = true;
        return;
    }
}
