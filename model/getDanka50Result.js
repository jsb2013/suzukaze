/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
 
var database = require("../dao/database");
var client = database.createClient();
var log = require("../util/logger");
var logger = log.createLogger();
var util = require("../util/util");
var async = require("async");

/* 檀家追加画面メイン（post処理） */
exports.main = function (searchId, callback) {

    // チェック用configの読み込み
    if (util.isUndefine(serchId)) {
        logger.error('XXXXXX', 'err =>' + err);
        callback(true);
        return;
    }

    var serchMoji = convertIdToMoji(searchId);

    validateBaseJson.size;

    // 入力データのNULLチェック（validateBaseJson）
    // "webItemJson"のチェックは特に行わず、以下データチェック関数で確認する。
    if (util.isUndefineForList(validTypeJson) || util.isUndefineForList(validSizeJson)) {
        // errorList追加
        return false;
    }

    // 入力データのエラー情報格納（Json）
    var errorJson = {};

    // 入力データの型チェック（同期）
    validateDataType(validTypeJson, webItemJson, errorJson);

    // 入力データのサイズのチェック（同期）
    validateDataSize(validTypeJson, webItemJson, errorJson);

    // 入力データチェックのエラー有無チェック（Error有りなら処理終了）
    if (util.isUndefineForList(errorJson)) {
        callback(true, false);
        return;
    }
};

function convertIdToMoji(searchId) {
            var convert50on = require("../conf/convert50on");

    var serchMoji = convert50on[searchId];
    if (util.isUndefine(serchMoji)) {
        logger.error('XXXXXX', 'err =>' + err);
        callback(true);
        return;
    }
    return searchId;
}
