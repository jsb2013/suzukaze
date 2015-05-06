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
var mTikuCodeDao = require("../../../dao/mTikuCodeDao");
var mSewaCodeDao = require("../../../dao/mSewaCodeDao");
var mMemberDao = require("../../../dao/mMemberDao");
var mTagsDao = require("../../../dao/mTagsDao");
var vReportTypeDao = require("../../../dao/vReportType");
var tDbupdateSetDao = require("../../../dao/tDbupdateSet");
var tDankaDetailKosyuDao = require("../../../dao/tDankaDetailKosyuDao");
var fs = require("fs");

/* 檀家追加画面メイン（post処理） */
exports.main = function (memberId, callback) {

    var tikuList = [];
    var sewaList = [];
    var tagList = [];
    var reportTypeList = [];
    var tDankaDetailKosyuList = [];
    async.series([

    // 地区コードマスタを取得する
        function (dbcallback) {
            mTikuCodeDao.getMTikuCode(client, database, tikuList, dbcallback);
        },
    // 世話コードマスタを取得
        function (dbcallback) {
            mSewaCodeDao.getMSewaCode(client, database, sewaList, dbcallback);
        },
    // タグコードマスタを取得する
        function (dbcallback) {
            if (!util.isUndefine(memberId)) {
                tDankaDetailKosyuDao.getTDankaDetailKosyuInfoByMemberId(client, database, memberId, tDankaDetailKosyuList, dbcallback);
                return;
            }
            dbcallback(null);
        },
    // タグコードマスタを取得する
        function (dbcallback) {
            mTagsDao.getMTags(client, database, tagList, dbcallback);
        },
    // 帳票種別を取得する
        function (dbcallback) {
            vReportTypeDao.getvReportType(client, database, reportTypeList, dbcallback);
        } ],
    // DBUpdateステータス初期化
    //        function (dbcallback) {
    //            tDbupdateSetDao.updateStatusToUpdatable(client, database, 1, dbcallback);
    //        } ],
    // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            var tikuInfoJson = convertTikuListToJson(tikuList);
            if (!tikuInfoJson) {
                callback(true);
            }
            var tagInfoJson = convertTagListToJson(tagList);
            if (!tagInfoJson) {
                callback(true);
            }
            var serchMoji = null;
            var optionId = null;
            if (!util.isUndefineForList(tDankaDetailKosyuList)) {
                serchMoji = tDankaDetailKosyuList[0].yobi_1;
                optionId = tDankaDetailKosyuList[0].yobi_2;
            }
            callback(false, tikuInfoJson, tikuList, tagInfoJson, tagList, sewaList, reportTypeList, serchMoji, optionId);
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

