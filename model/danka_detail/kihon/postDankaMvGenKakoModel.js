/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
 
var database = require("../../../dao/database");
var client = database.createClient();
var dbcommon = require("../../../dao/database_common");
var async = require('async');
var mMemberDao = require("../../../dao/mMemberDao");

/* 檀家追加画面メイン（post処理） */
exports.main = function (webItemJson, isArive, callback) {
    // いったんはpostで入ってきたデータは正しい想定で作る

    var memberId = webItemJson.member_id;

    async.series([
    // 名前でM_Memberを検索
        function (dbcallback) {
            mMemberDao.updateMMemberForIsArive(client, database, memberId, isArive, dbcallback);
            return;
        } ],
    // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false);
            return;
        }
    );
};