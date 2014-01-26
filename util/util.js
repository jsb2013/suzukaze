var sys = require("sys");

exports.isUndefine = function(value){
    if (value === undefined || value === null || value ===''){
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

// �f�[�^�x�[�X�G���[���b�Z�[�W�̕ϊ�
exports.getErrorMsg = function(error){
    return sys.inspect(error);
};
