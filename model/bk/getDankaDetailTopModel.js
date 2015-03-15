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
var mMemberDao = require("../../../dao/mMemberDao");
var mTikuCodeDao = require("../../../dao/mTikuCodeDao");
var mSewaCodeDao = require("../../../dao/mSewaCodeDao");

/* 檀家追加画面メイン（post処理） */
exports.main = function (memberId, callback) {

    // 入力値が無い→画面推移なら必ず値が入る為、不正電文の可能性が高い。
    if (util.isUndefine(memberId)) {
        logger.error('XXXXXX', 'err =>' + memberId);
        callback(true);
        return;
    }

    var resultRows = [];
    var tikuNameInfo = [];
    var sewaNameInfo = [];

    async.series([
    // 檀家検索結果取得（50音検索）
        function (dbcallback) {
            mMemberDao.getMmemberAndTDankaByMemberId(client, database, memberId, resultRows, dbcallback);
        },
    // 地区名を取得する。
        function (dbcallback) {
            var tikuCode = resultRows[0].tiku_code;
            mTikuCodeDao.getMTikuCodeForTikuNameByTikuCode(client, database, tikuNameInfo, tikuCode, dbcallback);
        },
    // 世話名を取得する。
        function (dbcallback) {
            var sewaCode = resultRows[0].sewa_code;
            mSewaCodeDao.getMSewaCodeForSewaNameBySewaCode(client, database, sewaNameInfo, sewaCode, dbcallback);
        },
    // 【START】トランザクション開始 ------------------------------
        function (dbcallback) {
            dbcommon.dbBegin(client, database, dbcallback);
        },
    // T_xxを削除
        function (dbcallback) {
            tDankaDetailKosyuDao.deleteTDankaDetailKosyuBymemberId(client, database, memberId, dbcallback);
        },
    // T_xxにインサート
        function (dbcallback) {
            // 地区名と世話名をresultRowsにAdd
            addTikuNameAndSewaName(tikuNameInfo, sewaNameInfo, resultRows);
            // メイン処理
            tDankaDetailKosyuDao.insertTDankaDetailKosyuInfo(client, database, memberId, resultRows[0], dbcallback);
        },
    // 【COMMIT】トランザクション終了-----------------------------
        function (dbcallback) {
            dbcommon.dbCommit(client, database, dbcallback);
        } ],
    // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                dbcommon.dbRollback(client, database, callback);
                return;
            }
            // t_xxxへのInsertは保持する。
            callback(false, resultRows);
            return;
        }
    );
};

function addTikuNameAndSewaName(tikuNameInfo, sewaNameInfo, resultRows) {
    // 絶対中身が無いことはない。
    var _tikuName = tikuNameInfo[0].tiku_name;
    var _sewaName = sewaNameInfo[0].sewa_name;

    resultRows[0].tiku_name = _tikuName;
    resultRows[0].sewa_name = _sewaName;
    return;
}

    
    
    
    

    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    