/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var database = require("../dao/database");
var client = database.createClient();
var log = require("../util/logger");
var logger = log.createLogger();
var async = require('async');
var util = require("../util/util");

/* 檀家追加画面メイン（post処理） */
exports.main = function (callback) {

    callback(false);
}

