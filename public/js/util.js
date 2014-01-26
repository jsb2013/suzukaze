///////////////////////////////////////////////////////////
//  
//  UTIL
//  
///////////////////////////////////////////////////////////

// date()関数の月を実際の月名に変換する。
function convertNullToBlank(value){
    if (value === undefined || value === null || value ===''){
        return "";
    }
    return value;
}
