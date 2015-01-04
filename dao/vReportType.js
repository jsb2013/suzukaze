/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var log = require("../util/logger");
var logger = log.createLogger();
var util = require("../util/util");

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
exports.getvReportType = function (client, database, rows, dbcallback) {
    var isDbError = false;
    var query = client.query('select * from v_report_type;');

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
        // database error(structure)
        if (isDbError) {
            return;
        }
        dbcallback(null);
        return;
    });

    query.on('error', function(error) {
        // session out
        client.end();

        // database error(structure)
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        dbcallback(new Error());
        isDbError = true;
        return;
    });
}

