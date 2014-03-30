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

// �f�[�^�x�[�X�G���[���b�Z�[�W�̕ϊ�
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

/* ���̓f�[�^�̌^�`�F�b�N                                               */
/*                                                                      */
/* @baseList:    config�ɋL�ڂ��ꂽ�f�[�^�^�̃o���f�[�V�������(json�^) */
/* @webItemList: web��ʂœ��͂��ꂽ�f�[�^(json�^)                      */
/* @errorList:   �G���[�ӏ���Z�߂�����(json�^)                         */
function validateDataType(validTypeJson, webItemJson, errorJson){
    var isError = false;
    for(var itemName in validTypeJson){
        var itemTypeJson = validTypeJson[itemName];
        for(var typeNum in itemTypeJson){
            var type = itemTypeJson[typeNum];
            var webItemType = webItemJson[itemName];
            if(type == "require"){
                if(util.isUndefine(webItemType)){
                  // Error�i�K�v�Ȓl���ݒ肳��Ă��Ȃ��B�j
                  isError = true;
                  logger.error('XXXXX', 'info =>'+ itemName + ', ' + webItemJson[itemName]);
                  break;
                }
                continue;
            }
            // NULL�����`�F�b�N�iNULL�ł�OK�j
            if(util.isUndefine(webItemType)){
                continue; // OK
            }
            // STRING�^�̊m�F
            if(type == "string"){
                if(!isNaN(webItemType)){
                  // Error�i���l���ݒ肳��Ă���B�j
                  isError = true;
                  logger.error('XXXXX', 'info =>'+ itemName + ', ' + webItemJson[itemName]);
                  break;
                }
                continue;
            }
            // INTEGER�^�̊m�F
            if(type == "integer"){
                if(isNaN(webItemType)){
                    // Error�i�����񂪐ݒ肳��Ă���B�j
                    isError = true;
                    logger.error('XXXXX', 'info =>'+ itemName + ', ' + webItemJson[itemName]);
                    break;
                }
                continue;
            }
            // Error�iSTRING�^/INTEGER�^�ȊO���ݒ�t�@�C���Ɋ܂܂�Ă���B�j
            isError = true;
            logger.error('XXXXX', 'info =>'+ itemName + ', ' + type);
            break;
        }
    }
    // �G���[����
    if (isError){
        errorJson[isError] = true;
        return;
    }
}

/* ���̓f�[�^�̃T�C�Y�̃`�F�b�N                                             */
/*                                                                          */
/* @baseList:    config�ɋL�ڂ��ꂽ�f�[�^�T�C�Y�̃o���f�[�V�������(json�^) */
/* @webItemList: web��ʂœ��͂��ꂽ�f�[�^(json�^)                          */
/* @errorList:   �G���[�ӏ���Z�߂�����(json�^)                             */
function validateDataSize(validSizeJson, webItemJson, errorJson){
    var isError = false;
    for(var itemName in validSizeJson){
        var itemSize = validSizeJson[itemName];
        var webItemValue = webItemJson[itemName];
        if(util.isUndefine(webItemValue)){
            continue;
        }
        if(webItemValue.length < itemSize){
            // Error�i���ۂ̃T�C�Y���z��T�C�Y�ȏ�ɂȂ��Ă���B�j
            isError = true;
            logger.error('XXXXX', 'info =>'+ itemName + ', ' + itemSize);
            continue;
        }
    }
    // �G���[����
    if (isError){
        errorJson[isError] = true;
        return;
    }
}
