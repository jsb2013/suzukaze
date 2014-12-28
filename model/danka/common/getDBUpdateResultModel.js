/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
 
var database = require("../../../dao/database");
var client = database.createClient();
var tDbupdateSetDao = require("../../../dao/tDbupdateSet");

/* 檀家追加画面メイン（post処理） */
exports.main = function (callback) {
    // いったんはpostで入ってきたデータは正しい想定で作る
    tDbupdateSetDao.updateStatusToUnUpdatable(client, database, 1, callback);
    return;
};