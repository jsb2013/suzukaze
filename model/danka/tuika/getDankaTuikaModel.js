/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
 
var database = require("../../../dao/database");
var client = database.createClient();
var async = require('async');
var mTikuCodeDao = require("../../../dao/mTikuCodeDao");
var mSewaCodeDao = require("../../../dao/mSewaCodeDao");
var mTagsDao = require("../../../dao/mTagsDao");

/* 檀家追加画面メイン（post処理） */
exports.main = function (callback) {
    // いったんはpostで入ってきたデータは正しい想定で作る

    var tikuCodeInfo = [];
    var sewaCodeInfo = [];
    var tagsInfo = [];

    async.series([

    // 地区コードマスタを取得
        function (dbcallback) {
            mTikuCodeDao.getMTikuCode(client, database, tikuCodeInfo, dbcallback);
        },
    // 世話コードマスタを取得
        function (dbcallback) {
            mSewaCodeDao.getMSewaCode(client, database, sewaCodeInfo, dbcallback);
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
            callback(null, tikuCodeInfo, sewaCodeInfo, tagsInfo);
            return;
        }
    );
};
