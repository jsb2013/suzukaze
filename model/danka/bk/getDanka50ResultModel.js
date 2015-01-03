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
var mMemberDao = require("../../../dao/mMemberDao");
var mTagsDao = require("../../../dao/mTagsDao");
var convert50on = require("../../../conf/convert50on");
var fs = require("fs");

/* 檀家追加画面メイン（post処理） */
exports.main = function (searchId, callback) {

    // チェック用configの読み込み
    if (util.isUndefine(searchId)) {
        logger.error('XXXXXX', 'err =>' + searchId);
        callback(true);
        return;
    }

    // チェック文字の変換（参照型じゃない気がするけど挑戦！）
    var searchMoji = convertIdToMoji(searchId);
    if (!searchMoji) {
        callback(true);
        return;
    }

    var resultRows = [];
    var tikuList = [];
    var tagList = [];
    async.series([

    // 地区コードマスタを取得する
        function (dbcallback) {
            mTikuCodeDao.getMTikuCode(client, database, tikuList, dbcallback);
        },
    // タグコードマスタを取得する
        function (dbcallback) {
            mTagsDao.getMTags(client, database, tagList, dbcallback);
        },
    // 檀家検索結果取得（50音検索）
        function (dbcallback) {
            mMemberDao.getMmemberAndTDankaByFurigana(client, database, searchMoji, resultRows, dbcallback);
        } ],
    // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                callback(true);
                return;
            }

            // DB検索条件をcsv形式に変換する。（delimiterは"|"）
            var stringList = [];
            createString(resultRows, stringList);

            // 檀家検索情報をファイル出力する。（→danka_search_info.txt）
            fileOutDankaInfoToString(stringList);

            var tikuInfoJson = convertTikuListToJson(tikuList);
            if (!tikuInfoJson) {
                callback(true);
            }
            var tagInfoJson = convertTagListToJson(tagList);
            if (!tagInfoJson) {
                callback(true);
            }
            var seachTitle = "50音別検索：" + searchMoji + "～";
            callback(false, resultRows, tikuInfoJson, tikuList, tagInfoJson, tagList, seachTitle);
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
        var memberIdKosyu = baseInfo.member_id_kosyu;
        var jiin = baseInfo.jiin;
        var stringLine = memberId + "|" + dankaType + "|" + nameSei + "|" + nameNa + "|" + tags + "|" + isArive + "|" + tikuCode + "|" + memberIdKosyu + "|" + jiin + "\n";
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

function convertTagListToJson(tagList) {
    var tagInfoJson = {};
    for(var i in tagList){
        var tagCode = tagList[i].tags_id;
        var tagName = tagList[i].tags;
        tagInfoJson[tagCode] = tagName;
    }
    return tagInfoJson;
}

