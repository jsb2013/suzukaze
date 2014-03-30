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
var convert50on = require("../../../conf/convert50on");
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
        } ],
    // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            // ファイルから檀家検索情報を取得する。
            var dankaInfoFromFile = fs.readFileSync('./tmp/danka_search_info.txt', 'utf8');

            // 檀家検索情報を\nで切って、一行ずつListに格納する。(この時点では、まだ"|"区切りの文字列）
            var dankaListBystring = [];
            convertStringToList(dankaInfoFromFile, dankaListBystring);

            // 檀家情報をresultInfoに格納する。
            var resultInfo = [];
            convertListToDankaInfo(dankaListBystring, resultInfo);

            // 検索条件により絞込みを行う。
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
            var seachTitle = "－";
            callback(false, resultInfo, tikuInfoJson, tikuList, sewaInfoJson, sewaList, tagInfoJson, tagList, seachTitle);
            return;
        }
    );
};

function convertListToDankaInfo(dankaListBystring, resultInfo){
    for(var key in dankaListBystring){
        var stringLine = dankaListBystring[key];
        var stringList = stringLine.split("|");

        var base = {};
        base.member_id = stringList[0];
        base.danka_type = stringList[1];
        base.name_sei = stringList[2];
        base.name_na = stringList[3];
        base.tags = stringList[4];
        base.is_arive = stringList[5];
        base.tiku_code = stringList[6];
        base.sewa_code = stringList[7];
        base.name_sei_kosyu = stringList[8];
        base.name_na_kosyu = stringList[9];
        base.member_id_kosyu = stringList[10];
        resultInfo.push(base);
    }
}

function convertStringToList(dankaInfoFromFile, dankaListBystring){
    while(true){
        var index = dankaInfoFromFile.indexOf('\n');
        if(index > -1){
            var partString = dankaInfoFromFile.substring(0, index);
            dankaListBystring.push(partString);
            var afterPushString = dankaInfoFromFile.substring(index + 1);
            dankaInfoFromFile = afterPushString
            continue;
        }
        break;
    }
}

function convertIdToMoji(searchId) {
    var searchMoji = convert50on[searchId];
    if (util.isUndefine(searchMoji)) {
        logger.error('XXXXXX', 'err =>' + searchId);
        return false;
    }
    return searchMoji;
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
