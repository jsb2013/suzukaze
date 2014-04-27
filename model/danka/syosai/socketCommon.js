/*
 * report_top関連のDB処理
 */
 

var database = require("../../../dao/database");
var client = database.createClient();
var dbcommon = require("../../../dao/database_common");
var log = require("../../../util/logger");
var logger = log.createLogger();
var util = require("../../../util/util");
var async = require("async");
var mTikuCodeDao = require("../../../dao/mTikuCodeDao");
var mTagsDao = require("../../../dao/mTagsDao");
var vSearchTargetDao = require("../../../dao/vSearchTarget");

/* 印刷対象の情報を取得 */
exports.getSearchTargetList = function (data, callback) {

    // 入力データ
    var searchTag = data.searchTag;
    var isKako = data.isKako;
    var filterJiin = data.filterJiin;
    var filterTikuCode = data.filterTikuCode;
    var filterTag = data.filterTag;

    // work変数定義
    var tagArray = searchTag.split(",");
    var sql = "";
    var isUpdateForSql = false;
    var rows = [];

    // 検索SQL作成（tag）
    if (!util.isUndefine(searchTag)) {
        for (var i = 0; i < tagArray.length; i++) {
            if (i === 0) {
                sql += ' (';
                sql += ' name like \'%' + tagArray[i] + '%\'';
                sql += ' or furigana like \'%' + tagArray[i] + '%\'';
                sql += ')';
                isUpdateForSql = true;
            } else {
                sql += ' and (';
                sql += ' name like \'%' + tagArray[i] + '%\'';
                sql += ' or furigana like \'%' + tagArray[i] + '%\'';
                sql += ')';
            }
        }
    }

    // 検索SQL作成（is_kako）
    if (!isKako) {
        if (isUpdateForSql) {
            sql += ' and is_arive = \'○\'';
        } else {
            sql += 'is_arive = \'○\'';
            isUpdateForSql = true;
        }
    }

    // 検索SQL作成（jiin）
    if (filterJiin !== "0") {
        if (isUpdateForSql) {
            sql += ' and jiin = \'' + filterJiin + '\'';
        } else {
            sql += 'jiin = \'' + filterJiin + '\'';
            isUpdateForSql = true;
        }
    }

    // 検索SQL作成（tiku_code）
    if (filterTikuCode !== "0") {
        if (isUpdateForSql) {
            sql += ' and tiku_code =' + filterTikuCode;
        } else {
            sql += 'tiku_code =' + filterTikuCode;
            isUpdateForSql = true;
        }
    }
    // 検索SQL作成（tag）
    if (filterTag !== "0") {
        if (isUpdateForSql) {
            sql += ' and tags like \'%' + filterTag + '%\'';
        } else {
            sql += 'tags like \'%' + filterTag + '%\'';
            isUpdateForSql = true;
        }
    }
    // 検索SQL作成（base)
    if (isUpdateForSql) {
        sql = 'select * from v_search_target where ' + sql;
    } else {
        sql = 'select * from v_search_target';
    }

    async.series([

    // 地区コードマスタを取得する
        function (dbcallback) {
            vSearchTargetDao.getVSearchTargetBySql(client, database, sql, rows, dbcallback);
        } ],
    // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, rows);
            return;
        }
    );
};
