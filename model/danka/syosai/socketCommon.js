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
var tDankaDao = require("../../../dao/tDankaDao");
var mConfDao = require("../../../dao/mConfDao");
var vSearchTargetDao = require("../../../dao/vSearchTarget");

/* 印刷対象の情報を取得 */
exports.getSearchTargetList = function (data, callback) {

    // 入力データ
    var searchTag = data.searchTag;
    var isKako = data.isKako;
    var filterJiin = data.filterJiin;
    var filterTikuCode = data.filterTikuCode;
    var filterTag = data.filterTag;
    var printStatusOn = data.printStatusOn;
    var addReportIf = data.addReportIf;

    // work変数定義
    //var _searchTag = searchTag.replace("　", " ");
    //var tagArray = _searchTag.split(" ");
    var tagArray = util.getSplitBlancList(searchTag);
    var sql = "";
    var isUpdateForSql = false;
    var rows = [];

    // 検索SQL作成（tag）
    if (!util.isUndefine(searchTag)) {
        for (var i = 0; i < tagArray.length; i++) {
            if (i === 0) {
                // ～XXの検索
                if (tagArray[i].substr(0, 1) == "～") {
                    var searchMoji = tagArray[i].slice(1);
                    // 英文字検索
                    if (searchMoji == "英文字") {
                        sql += ' (';
                        sql += ' name similar to \'%[A-Za-z]\'';
                        sql += ' or furigana similar to \'%[A-Za-z]\'';
                        sql += ')';
                        // ひらがな、英文字以外の検索
                    } else if (searchMoji == "その他文字") {
                        sql += ' (';
                        sql += ' furigana not similar to \'%[A-Za-zあ-んア-ン]\'';
                        sql += ')';
                        // ひらがな検索
                    } else {
                        sql += ' (';
                        sql += ' name like \'%' + searchMoji + '\'';
                        sql += ' or furigana like \'%' + searchMoji + '\'';
                        sql += ')';
                    }
                    isUpdateForSql = true;
                    // XX～の検索
                } else if (tagArray[i].substr(-1, 1) == "～") {
                    var searchMoji = tagArray[i].slice(0, -1);
                    // 英文字検索
                    if (searchMoji == "英文字") {
                        sql += ' (';
                        sql += ' name similar to \'[A-Za-z]%\'';
                        sql += ' or furigana similar to \'[A-Za-z]%\'';
                        sql += ')';
                        // ひらがな、英文字以外の検索
                    } else if (searchMoji == "その他文字") {
                        sql += ' (';
                        sql += ' furigana not similar to \'[A-Za-zあ-んア-ン]%\'';
                        sql += ')';
                        // ひらがな検索
                    } else {
                        sql += ' (';
                        sql += ' name like \'' + searchMoji + '%\'';
                        sql += ' or furigana like \'' + searchMoji + '%\'';
                        sql += ')';
                    }
                    isUpdateForSql = true;
                } else {
                    var searchMoji = tagArray[i];
                    // 英文字検索
                    if (searchMoji == "英文字") {
                        sql += ' (';
                        sql += ' name similar to \'%[A-Za-z]%\'';
                        sql += ' or furigana similar to \'%[A-Za-z]%\'';
                        sql += ')';
                        // ひらがな、英文字以外の検索
                    } else if (searchMoji == "その他文字") {
                        sql += ' (';
                        sql += ' furigana not similar to \'%[A-Za-zあ-んア-ン]%\'';
                        sql += ')';
                        // ひらがな検索
                    } else {
                        sql += ' (';
                        sql += ' name like \'%' + searchMoji + '%\'';
                        sql += ' or furigana like \'%' + searchMoji + '%\'';
                        sql += ')';
                    }
                    isUpdateForSql = true;
                }
            } else {
                // ～XXの検索
                if (tagArray[i].substr(0, 1) == "～") {
                    var searchMoji = tagArray[i].slice(1);
                    // 英文字検索
                    if (searchMoji == "英文字") {
                        sql += 'and (';
                        sql += ' name similar to \'%[A-Za-z]\'';
                        sql += ' or furigana similar to \'%[A-Za-z]\'';
                        sql += ')';
                        // ひらがな、英文字以外の検索
                    } else if (searchMoji == "その他文字") {
                        sql += 'and (';
                        sql += ' furigana not similar to \'%[A-Za-zあ-んア-ン]\'';
                        sql += ')';
                        // ひらがな検索
                    } else {
                        sql += 'and (';
                        sql += ' name like \'%' + searchMoji + '\'';
                        sql += ' or furigana like \'%' + searchMoji + '\'';
                        sql += ')';
                    }
                    // XX～の検索
                } else if (tagArray[i].substr(-1, 1) == "～") {
                    var searchMoji = tagArray[i].slice(0, -1);
                    // 英文字検索
                    if (searchMoji == "英文字") {
                        sql += 'and (';
                        sql += ' name similar to \'[A-Za-z]%\'';
                        sql += ' or furigana similar to \'[A-Za-z]%\'';
                        sql += ')';
                        // ひらがな、英文字以外の検索
                    } else if (searchMoji == "その他文字") {
                        sql += 'and (';
                        sql += ' furigana not similar to \'[A-Za-zあ-んア-ン]%\'';
                        sql += ')';
                        // ひらがな検索
                    } else {
                        sql += 'and (';
                        sql += ' name like \'' + searchMoji + '%\'';
                        sql += ' or furigana like \'' + searchMoji + '%\'';
                        sql += ')';
                    }
                } else {
                    var searchMoji = tagArray[i];
                    // 英文字検索
                    if (searchMoji == "英文字") {
                        sql += 'and (';
                        sql += ' name similar to \'%[A-Za-z]%\'';
                        sql += ' or furigana similar to \'%[A-Za-z]%\'';
                        sql += ')';
                        // ひらがな、英文字以外の検索
                    } else if (searchMoji == "その他文字") {
                        sql += 'and (';
                        sql += ' furigana not similar to \'%[A-Za-zあ-んア-ン]%\'';
                        sql += ')';
                        // ひらがな検索
                    } else {
                        sql += 'and (';
                        sql += ' name like \'%' + searchMoji + '%\'';
                        sql += ' or furigana like \'%' + searchMoji + '%\'';
                        sql += ')';
                    }
                }
            }
        }
    }

    // 検索SQL作成（is_kako）
    if (!isKako) {
        if (isUpdateForSql) {
            sql += ' and is_arive = \'-\'';
        } else {
            sql += 'is_arive = \'-\'';
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
    if(addReportIf){
        if (isUpdateForSql) {
            sql = 'select * from v_search_target where report_if_id is not null or ( ' + sql + ' )';
        } else {
            sql = 'select * from v_search_target';
        }        
    }else{
        if (isUpdateForSql) {
            sql = 'select * from v_search_target where member_id = member_id_kosyu and ' + sql;
        } else {
            sql = 'select * from v_search_target where member_id = member_id_kosyu';
        }
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

exports.getMaxTikuNumber = function (tikuCode, callback) {
    // いったんはpostで入ってきたデータは正しい想定で作る

    var maxTikuNumber = [];

    async.series([
    // 名前でM_Memberを検索
        function (dbcallback) {
            mTikuCodeDao.getMTikuCodeForTikuNumberByTikuCode(client, database, tikuCode, maxTikuNumber, dbcallback);
            return;
        } ],
    // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, maxTikuNumber);
            return;
        }
    );

};

exports.getMMemberByTikuCodeAndTikuNumber = function (tikuCode, tikuNumber, callback) {
    // いったんはpostで入ってきたデータは正しい想定で作る

    var row = [];

    async.series([
    // 名前でM_Memberを検索
        function (dbcallback) {
            tDankaDao.getTDankaByTikuCodeAndTikuNumber(client, database, tikuCode, tikuNumber, row, dbcallback);
            return;
        } ],
    // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            var isExist = true;
            if (util.isUndefineForList(row)) {
                isExist = false;
            }
            callback(false, isExist);
            return;
        }
    );

};

exports.getReportFileNameKey = function (callback) {
    // いったんはpostで入ってきたデータは正しい想定で作る

    var rows = [];

    async.series([
    // 名前でM_Memberを検索
        function (dbcallback) {
            mConfDao.getMConfForValue(client, database, rows, dbcallback);
            return;
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

exports.updateReportFileNameKey = function (data, callback) {
    // いったんはpostで入ってきたデータは正しい想定で作る

    var value = data.value;

    async.series([
    // 名前でM_Memberを検索
        function (dbcallback) {
            mConfDao.updateMConfForValue(client, database, value, dbcallback);
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