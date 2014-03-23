/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */

var database = require("../../dao/database");
var client = database.createClient();
var dbcommon = require("../../dao/database_common");
var log = require("../../util/logger");
var logger = log.createLogger();
var util = require("../../util/util");
var async = require("async");
var tDankaDetailKosyuDao = require("../../dao/tDankaDetailKosyuDao");
var mTikuCodeDao = require("../../dao/mTikuCodeDao");
var mSewaCodeDao = require("../../dao/mSewaCodeDao");

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
            getDankaResultFromDB(memberId, resultRows, dbcallback);
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
            tDankaDetailKosyuDao.updateTDankaDetailKosyuForDeleteFlag(client, database, memberId, dbcallback);
        },
    // T_xxにインサート
        function (dbcallback) {
            // 担当者（僧）のデフォルト値を設定
            setDefaultValueForMemberIdSou(resultRows);
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

function setDefaultValueForMemberIdSou(resultRows){
    var memberIdSou = resultRows[0].member_id_sou;
    if(util.isUndefine(memberIdSou)){
        resultRows[0].member_id_sou = "0";
        return;
    }
    
    return;
}

function addTikuNameAndSewaName(tikuNameInfo, sewaNameInfo, resultRows) {
    // 絶対中身が無いことはない。
    var _tikuName = tikuNameInfo[0].tiku_name;
    var _sewaName = sewaNameInfo[0].sewa_name;

    resultRows[0].tiku_name = _tikuName;
    resultRows[0].sewa_name = _sewaName;
    return;
}

function getDankaResultFromDB(memberId, rows, dbcallback) {
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。 
    var isDbError = false;
    var query = client.query('select mm.member_id, mm.name_sei, mm.name_na, mm.furigana_sei, mm.furigana_na, mm.sex, mm.job_code, mm.birthday_y, mm.birthday_m, mm.birthday_d, td.danka_type, td.tiku_code, td.sewa_code, td.member_id_sou, mm.tags from m_member as mm inner join t_danka td on mm.member_id = td.member_id where mm.is_disabled=false and mm.is_deleted=false and td.is_deleted=false and mm.member_id = $1',
                [memberId]);

    query.on('row', function (row) {
        rows.push(row);
    });

    query.on('end', function (row, err) {
        // エラーが発生した場合
        if (err) {
            logger.error('xxxx', 'err =>' + err);
            dbcallback(err);
            return;
        }
        // 1件存在する場合=正しい
        if (rows.length === 1) {
            util.convertJsonNullToBlankForAllItem(rows);
            dbcallback(null);
            return;
        }
        // DBエラーの場合
        if (isDbError) {
            return;
        }
        // 件数が存在しない場合=requestがmemberIDなので有り得ない→不正電文の可能性
        // 複数検出の場合=DBに複数memberID登録不可なので有り得ない→要調査。
        logger.error('xxxx', 'err =>' + err);
        dbcallback(new Error());
        return;
    });

    query.on('error', function (error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => ' + errorMsg);
        // これでよいのかな？
        dbcallback(new Error());
        isDbError = true;
        return;
    });
}
    
    
    
    
    

    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    