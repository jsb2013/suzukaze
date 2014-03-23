/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
 
var database = require("../../../dao/database");
var client = database.createClient();
var log = require("../../../util/logger");
var logger = log.createLogger();
var async = require('async');
var util = require("../../../util/util");
var mJobCodeDao = require("../../../dao/mJobCodeDao");

/* 檀家追加画面メイン（post処理） */
exports.main = function(callback){
    // いったんはpostで入ってきたデータは正しい想定で作る
    
    var tikuCodeInfo = [];
    var jobCodeInfo = [];
    var sewaCodeInfo = [];
    var souMemberIdInfo = [];

    async.series([

        // 仕事コードマスタを取得
        function (dbcallback) {
            mJobCodeDao.getMJobCode(client, database, jobCodeInfo, dbcallback);
        },
        // 地区コードマスタを取得
        function (dbcallback) {
            mTikuCodeDao.getMTikuCode(client, database, tikuCodeInfo, dbcallback);
        },
        // 世話コードマスタを取得
        function (dbcallback) {
            mSewaCodeDao.getMSewaCode(client, database, sewaCodeInfo, dbcallback);
        },
        // メンバーマスタから僧のリストを取得
        function (dbcallback) {
            mMemberDao.getSouMemberIdInfo(client, database, souMemberIdInfo, dbcallback);
        }],
        // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(null, jobCodeInfo, tikuCodeInfo, sewaCodeInfo, souMemberIdInfo);
            return;
        }
    );
};
