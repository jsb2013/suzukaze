///////////////////////////////////////////////////////////
//  
//  UTIL
//  
///////////////////////////////////////////////////////////

// date()関数の月を実際の月名に変換する。
function convertNullToBlank(value){
    if (value === undefined || value === null || value ==='' || value === "null" || value === "undefined"){
        return "";
    }
    return value;
}

function isUndefine(value){
    if (value === undefined || value === null || value ==='' || value === "null" || value === "undefined"){
        return true;
    }
    return false;
}

function isUndefineOrNotNumeric(value){
    if (value === undefined || value === null || value ==='' || value === "null" || value === "undefined" || isNaN(value)){
        return true;
    }
    return false;
}

function isUndefineForList(value){
    if (value === undefined || value === null || value ==='' || value.length == 0){
        return true;
    }
    return false;
};

function convertNullToMoji(value, moji){
    if(isUndefine(value)){
        document.write(moji);
        return;
    }
    return document.write(value);
}


