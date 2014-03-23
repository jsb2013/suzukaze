/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var log = require("../util/logger");
var logger = log.createLogger();
var util = require("../util/util");

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
exports.getMTikuCode = function(client, database, rows, dbcallback){
    var isDbError = false;
    var query = client.query('select tiku_code, tiku_name from m_tiku_code where is_disabled=false and is_deleted=false');

    query.on('row', function(row) {
        rows.push(row);
    });

    query.on('end', function (row, err) {
        // エラーが発生した場合
        if (err) {
            logger.error('xxxx', 'err =>' + err);
            dbcallback(err);
            return;
        }
        // 存在する場合
        if (rows.length > 0) {
            dbcallback(null);
            return;
        }
        if (isDbError) {
            return;
        }
        // 存在しない場合
        if (rows.length === 0) {
            logger.error('xxxx', 'err =>' + err);
            dbcallback(new Error());
            return;
        }
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

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
exports.getMTikuCodeForTikuNameByTikuCode = function(client, database, rows, tikuCode, dbcallback){
    var isDbError = false;
    var query = client.query('select tiku_name from m_tiku_code where tiku_code = $1 and is_disabled=false and is_deleted=false',
                [tikuCode]);

    query.on('row', function(row) {
        rows.push(row);
    });

    query.on('end', function (row, err) {
        // エラーが発生した場合
        if (err) {
            logger.error('xxxx', 'err =>' + err);
            dbcallback(err);
            return;
        }
        // 存在する場合
        if (rows.length > 0) {
            dbcallback(null);
            return;
        }
        if (isDbError) {
            return;
        }
        // 存在しない場合　→ DB登録不正（登録している地区コードが地区コードマスタに無い）
        if (rows.length === 0) {
            logger.error('xxxx', 'err =>' + err);
            dbcallback(new Error());
            return;
        }
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