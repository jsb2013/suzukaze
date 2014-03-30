/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
 
var database = require("../../../dao/database");
var client = database.createClient();
var dbcommon = require("../../../dao/database_common");
var log = require("../../../util/logger");
var logger = log.createLogger();
var util = require("../../../util/util");
var async = require("async");
var mSewaCodeDao = require("../../../dao/mSewaCodeDao");
var mTikuCodeDao = require("../../../dao/mTikuCodeDao");
var mMemberDao = require("../../../dao/mMemberDao");
var mTagsDao = require("../../../dao/mTagsDao");
var fs = require("fs");

/* 檀家追加画面メイン（post処理） */
exports.main = function (baseInfoInWeb, callback) {

    var baseInfoInDb = [];
    var tikuList = [];
    var sewaList = [];
    var tagList = [];
    var resultInfo = [];

    async.series([

    // 地区コードマスタを取得する
        function (dbcallback) {
            mTikuCodeDao.getMTikuCode(client, database, tikuList, dbcallback);
        },
    // 世話コードマスタを取得する
        function (dbcallback) {
            mSewaCodeDao.getMSewaCode(client, database, sewaList, dbcallback);
        },
    // タグコードマスタを取得する
        function (dbcallback) {
            mTagsDao.getMTags(client, database, tagList, dbcallback);
        },
    // 檀家検索結果取得（50音検索）
        function (dbcallback) {
            mMemberDao.getMmemberAndTDanka(client, database, baseInfoInDb, dbcallback);
        } ],
    // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            // 検索条件により絞込みを行う。
            getBaseInfoBysearchData(baseInfoInDb, baseInfoInWeb, resultInfo);

            // DB検索条件をcsv形式に変換する。（delimiterは"|"）
            var stringList = [];
            createString(resultInfo, stringList);

            // 檀家検索情報をファイル出力する。（→danka_search_info.txt）
            fileOutDankaInfoToString(stringList);

            var tikuInfoJson = convertTikuListToJson(tikuList);
            if (!tikuInfoJson) {
                callback(true);
            }
            var sewaInfoJson = convertSewaListToJson(sewaList);
            if (!sewaInfoJson) {
                callback(true);
            }
            var tagInfoJson = convertTagListToJson(tagList);
            if (!tagInfoJson) {
                callback(true);
            }
            var seachTitle = "詳細条件検索";
            callback(false, resultInfo, tikuInfoJson, tikuList, sewaInfoJson, sewaList, tagInfoJson, tagList, seachTitle);
            return;
        }
    );
};

// 檀家検索情報をファイル出力する。（→danka_search_info.txt）
function fileOutDankaInfoToString(stringList){
    if(fs.existsSync("./tmp/danka_search_info.txt")){
        fs.unlinkSync("./tmp/danka_search_info.txt");    
    }
    var fd = fs.openSync("./tmp/danka_search_info.txt", "a");
    for(var key in stringList){
       var line = stringList[key];
        fs.writeSync(fd, line, 0);
    }
    fs.closeSync(fd);
}

// DB検索条件をcsv形式に変換する。（delimiterは"|"）
function createString(resultInfo, stringList){
    for(var key in resultInfo){
        var baseInfo = resultInfo[key];
        var memberId = baseInfo.member_id;
        var dankaType = baseInfo.danka_type;
        var nameSei = baseInfo.name_sei;
        var nameNa = baseInfo.name_na;
        var tags = baseInfo.tags;
        var isArive = baseInfo.is_arive;
        var tikuCode = baseInfo.tiku_code;
        var sewaCode = baseInfo.sewa_code;
        var nameSeiKosyu = baseInfo.name_sei_kosyu;
        var nameNaKosyu = baseInfo.name_na_kosyu;
        var memberIdKosyu = baseInfo.member_id_kosyu;
        var stringLine = memberId + "|" + dankaType + "|" + nameSei + "|" + nameNa + "|" + tags + "|" + isArive + "|" + tikuCode + "|" + sewaCode + "|" + nameSeiKosyu + "|" + nameNaKosyu + "|" + memberIdKosyu + "\n";
        stringList.push(stringLine);
    }
}

// 指定した条件でレコードを絞り込む。
function getBaseInfoBysearchData(baseInfoInDb, baseInfoInWeb, resultInfo){
 
    var resultCount = 0;
    for (var key in baseInfoInDb) {
        var info = baseInfoInDb[key];

        // 戸主名(性）で検索
        var nameSeiInDb = info.name_sei;
        var nameSeiInWeb = baseInfoInWeb.name_sei;
        if (!checkValueByString(nameSeiInDb, nameSeiInWeb)) {
            continue;
        }

        // 戸主名(名）で検索
        var nameNaInDb = info.name_na;
        var nameNaInWeb = baseInfoInWeb.name_na;
        if (!checkValueByString(nameNaInDb, nameNaInWeb)) {
            continue;
        }

        // ふりがな(性）で検索
        var furiganaSeiInDb = info.furigana_sei;
        var furiganaSeiInWeb = baseInfoInWeb.furigana_sei;
        if (!checkValueByString(furiganaSeiInDb, furiganaSeiInWeb)) {
            continue;
        }

        // ふりがな(名）で検索
        var furiganaNaInDb = info.furigana_na;
        var furiganaNaInWeb = baseInfoInWeb.furigana_na;
        if (!checkValueByString(furiganaNaInDb, furiganaNaInWeb)) {
            continue;
        }

        // 性別(名）で検索
        var sexInDb = info.sex;
        var sexInWebInfo = baseInfoInWeb.sex;
        var isMatch = false;
        for(var key in sexInWebInfo){
            var _sexInWeb = sexInWebInfo[key];
            if (!checkValueByNumeric(sexInDb, _sexInWeb)) {
                continue;
            }
            isMatch = true;
            break;
        }
        if(!util.isUndefineForList(sexInWebInfo) && !isMatch){
            continue;
        }

        // 地区コードで検索
        var tikuCodeInDb = info.tiku_code;
        var tikuCodeInWeb = baseInfoInWeb.tiku_code;
        if (!checkValueByNumeric(tikuCodeInDb, tikuCodeInWeb)) {
            continue;
        }

        // 世話コードで検索
        var sewaCodeInDb = info.sewa_code;
        var sewaCodeInWeb = baseInfoInWeb.sewa_code;
        if (!checkValueByNumeric(sewaCodeInDb, sewaCodeInWeb)) {
            continue;
        }

        // タグで検索
        var tagsInDb = info.tags;
        var tagsInWebInfo = baseInfoInWeb.tags;
        var isMatch = false;
        for(var key in tagsInWebInfo){
            var tagName = tagsInWebInfo[key];
            if (!checkValueByString(tagsInDb, tagName)) {
                continue;
            }
            isMatch = true;
            break;
        }

        // 生死区分で検索
        var isAriveTypeInDb = info.is_arive;
        var includeKojinInWeb = baseInfoInWeb.include_kojin;
        if (util.isUndefine(includeKojinInWeb)){
            if(isAriveTypeInDb !== 1){
                continue;
            }
        }
        resultInfo.push(info);
        //resultInfo[resultCount] = info;
        //resultCount++;
    }
}

function checkValueByString(valueInDb, valueInWeb){

    // DBに定義されている値がない場合は、valueInWebの指定有無で条件が確定する。
    if(util.isUndefine(valueInDb)){
        if(util.isUndefine(valueInWeb)){
            return true;
        }
        return false; 
    }

    // valueInWebが空の場合は、検索キー外としてスキップする。
    if(util.isUndefine(valueInWeb)){
        return true; 
    }
    // 部分一致する場合は必ず0以上の値になる。(→次の検索条件へ! return true）
    var index = valueInDb.indexOf(valueInWeb);
    if(index > -1){
        return true;
    }
    return false;
}

function checkValueByNumeric(valueInDb, valueInWeb){

    // DBに定義されている値がない場合は、valueInWebの指定有無で条件が確定する。
    if(util.isUndefine(valueInDb) || valueInDb == 0){
        if(util.isUndefine(valueInWeb) || valueInWeb == 0){
            return true;
        }
        return false; 
    }

    // valueInWebが空の場合は、検索キー外としてスキップする。
    if(util.isUndefine(valueInWeb) || valueInWeb == 0){
        return true; 
    }
    // 一致する場合は次の検索条件へ! return true）
    if(valueInDb == valueInWeb){
        return true;
    }
    return false;
}

function convertTikuListToJson(tikuList) {
    var tikuInfoJson = {};
    for(var i in tikuList){
        var tikuCode = tikuList[i].tiku_code;
        var tikuName = tikuList[i].tiku_name;
        tikuInfoJson[tikuCode] = tikuName;
    }
    return tikuInfoJson;
}

function convertSewaListToJson(sewaList) {
    var sewaInfoJson = {};
    for(var i in sewaList){
        var sewaCode = sewaList[i].sewa_code;
        var sewaName = sewaList[i].sewa_name;
        sewaInfoJson[sewaCode] = sewaName;
    }
    return sewaInfoJson;
}

function convertTagListToJson(tagList) {
    var tagInfoJson = {};
    for(var i in tagList){
        var tagCode = tagList[i].tags_id;
        var tagName = tagList[i].tags;
        tagInfoJson[tagCode] = tagName;
    }
    return tagInfoJson;
}
