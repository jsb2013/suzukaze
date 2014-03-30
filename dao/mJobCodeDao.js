/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var log = require("../util/logger");
var logger = log.createLogger();
var util = require("../util/util");

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
exports.getMJobCode = function (client, database, rows, dbcallback) {
    var isDbError = false;
    var query = client.query('select job_code, job_name from m_job_code where is_disabled=false and is_deleted=false');

    query.on('row', function (row) {
        rows.push(row);
    });

    query.on('end', function (row, err) {
        // session out
        client.end();

        // database error
        if (err) {
            logger.error('xxxx', 'err =>' + err);
            dbcallback(err);
            return;
        }
        // callback(normal end)
        if (rows.length > 0) {
            util.convertJsonNullToBlankForAllItem(rows);
            dbcallback(null);
            return;
        }
        // database error(structure)
        if (isDbError) {
            return;
        }
        // unexpected error
        logger.error('xxxx', 'err =>' + err);
        dbcallback(new Error());
        return;
    });

    query.on('error', function(error) {
        // session out
        client.end();

        // database error
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        dbcallback(new Error());
        isDbError = true;
        return;
    });
}
