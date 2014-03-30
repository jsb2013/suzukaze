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
var tDankaDetailKosyuDao = require("../../../dao/tDankaDetailKosyuDao");

/* 檀家追加画面メイン（post処理） */
exports.main = function (webItemJson, callback) {

    var memberId = webItemJson.member_id;
    var resultInfo = [];

    // memberIdのチェック
    if (util.isUndefine(memberId)) {
        logger.error('XXXXXX');
        callback(true);
        return;
    }

    async.series([

    // 地区コードマスタを取得する
        function (dbcallback) {
            tDankaDetailKosyuDao.getTDankaDetailKosyuInfoByMemberId(client, database, memberId, resultInfo, dbcallback);
        } ],
    // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, resultInfo);
            return;
        }
    );
};