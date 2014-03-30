/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
 
var database = require("../../../dao/database");
var client = database.createClient();
var log = require("../../../util/logger");
var logger = log.createLogger();
var util = require("../../../util/util");
//var validateBaseJson = require("../../../conf/web_item_info");
var mMemberDao = require("../../../dao/mMemberDao");
var mTagsDao = require("../../../dao/mTagsDao");
var async = require('async');

/* 檀家追加画面メイン（post処理） */
exports.main = function (webItemJson, callback) {

    // チェック用configの読み込み
    //var validTypeJson = validateBaseJson.type;
    //var validSizeJson = validateBaseJson.size;

    // 入力データのエラー情報格納（Json）
    //var errorJson = {};

    // 入力データの型チェック（同期）
    //validateDataType(validTypeJson, webItemJson, errorJson);

    // 入力データのサイズのチェック（同期）
    //validateDataSize(validTypeJson, webItemJson, errorJson);

    // 入力データチェックのエラー有無チェック（Error有りなら処理終了）
    //if(util.isUndefineForList(errorJson)){
    //    callback(true,false);
    //    return;
    //}

    // 2.既に登録されているデータでないことを確認する。
    // （一応名前を検索して、名前を検索する。で、もし同じ名前があったら、確認画面に注意書きを追加しておく。）
    var memberInfo = [];
    var tagsInfo = [];

    async.series([

    // 名前でM_Memberを検索
        function (dbcallback) {
            mMemberDao.getMMemberByName(client, database, webItemJson, memberInfo, dbcallback);
        },
    // タグ情報を取得（戸主情報）
        function (dbcallback) {
            mTagsDao.getMTags(client, database, tagsInfo, dbcallback);
        } ],
    // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            // 既に登録されているメンバーがいないかを確認
            var isDupricateMember = false;
            if (memberInfo.length > 0) {
                isDupricateMember = true;
            }
            var tags = convertTagsWithDelimiter(webItemJson, tagsInfo, ",")
            callback(null, isDupricateMember, tags);
            return;
        }
    );
};

function convertTagsWithDelimiter(memberInfo, tagsInfo, delimiter){

    var tagsInfoInBase = memberInfo.tags;
    var checkTags = "";

    for(var key in tagsInfoInBase){
        var _tagIdInBase = tagsInfoInBase[key];
        for(var key2 in tagsInfo){
            var _tagsId = tagsInfo[key2].tags_id;
            var _tagsName = tagsInfo[key2].tags;
            if(_tagIdInBase == _tagsId){
                if (util.isUndefine(checkTags)) {
                    checkTags = _tagsName;
                    break;
                }
                checkTags = checkTags + delimiter + _tagsName;
                break;
            }
        }
    }
    return checkTags;
}