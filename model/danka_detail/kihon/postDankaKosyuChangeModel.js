/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
 
var database = require("../../../dao/database");
var client = database.createClient();
var dbcommon = require("../../../dao/database_common");
var async = require('async');
var tDankaDao = require("../../../dao/tDankaDao");

/* 檀家追加画面メイン（post処理） */
exports.main = function (webItemJson, callback) {
    // いったんはpostで入ってきたデータは正しい想定で作る

    var memberId = webItemJson.member_id;
    var memberIdKosyu = webItemJson.member_id_kosyu;

    async.series([
    // 名前でM_Memberを検索
        function (dbcallback) {
            tDankaDao.updateTDankaForMemberIdKosyuByMemberId(client, database, memberId, memberIdKosyu, dbcallback);
        }],
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