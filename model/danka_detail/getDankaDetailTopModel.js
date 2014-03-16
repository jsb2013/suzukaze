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

/* 檀家追加画面メイン（post処理） */
exports.main = function (memberId, callback) {

    // チェック用configの読み込み
    if (util.isUndefine(memberId)) {
        logger.error('XXXXXX', 'err =>' + memberId);
        callback(true);
        return;
    }

    var resultRows = [];
    var tikuName = [];
    var sewaName = [];

    async.series([
        // 檀家検索結果取得（50音検索）
        function (dbcallback) {
            getDankaResultFromDB(memberId, resultRows, dbcallback);
        },
        // 地区名をresultRowsにAddする。
        function (dbcallback) {
            var tikuCode = resultRows[0].tiku_code;
            getTikuCode(tikuName, tikuCode, dbcallback);
        },
        // 世話名をresultRowsにAddする。
        function (dbcallback) {
            var sewaCode = resultRows[0].sewa_code;
            getSewaCode(sewaName, sewaCode, dbcallback);
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
            // 地区名と世話名をresultRowsにAdd
            addTikuNameAndSewaName(tikuName, sewaName, resultRows);
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

function addTikuNameAndSewaName(tikuName, sewaName, resultRows) {
    var _tikuName = tikuName[0].tiku_name;
    var _sewaName = sewaName[0].sewa_name;

    resultRows[0].tiku_name = _tikuName;
    resultRows[0].sewa_name = _sewaName;
    return;
}

function convertSewaListToJson(sewaList) {
    var sewaInfoJson = {};
    for (var i in sewaList) {
        var sewaCode = sewaList[i].sewa_code;
        var sewaName = sewaList[i].sewa_name;
        sewaInfoJson[sewaCode] = sewaName;
    }
    return sewaInfoJson;
}


    function getDankaResultFromDB(memberId, resultRows, dbcallback) {
        // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。 
        var isDbError = false;

        var query = client.query('select mm.member_id, mm.name_sei, mm.name_na, mm.furigana_sei, mm.furigana_na, mm.sex, mm.job_code, mm.birthday_y, mm.birthday_m, mm.birthday_d, td.danka_type, mmt.tiku_code, td.sewa_code, td.member_id_sou from (m_member as mm inner join m_member_tiku as mmt on mm.member_id = mmt.member_id) inner join t_danka td on mmt.member_id = td.member_id where mm.is_disabled=false and mm.is_deleted=false and mmt.is_disabled=false and mmt.is_deleted=false and td.is_deleted=false and mm.member_id = $1 and td.member_id = $1 and mmt.member_id = $1',
                    [memberId]);

        query.on('row', function (row) {
            resultRows.push(row);
        });

        query.on('end', function (row, err) {
            // エラーが発生した場合
            if (err) {
                logger.error('xxxx', 'err =>' + err);
                dbcallback(err);
                return;
            }
            if (isDbError) {
               return;
            }
            dbcallback(null);
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

    function getTikuCode(rows, tikuCode, dbcallback) {
        var isDbError = false;
        // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
        var query = client.query('select tiku_code, tiku_name from m_tiku_code where tiku_code = $1 and is_disabled=false and is_deleted=false',
                [tikuCode]);

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
            if (isDbError) {
                return;
            }
            dbcallback(null);
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

    function getSewaCode(rows, sewaCode, dbcallback) {
        var isDbError = false;
        // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
        var query = client.query('select sewa_code, sewa_name from m_sewa_code where sewa_code = $1 and is_disabled=false and is_deleted=false',
                [sewaCode]);

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
            if (isDbError) {
                return;
            }
            dbcallback(null);
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