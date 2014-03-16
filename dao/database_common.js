/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
 
var log = require("../util/logger");
var logger = log.createLogger();

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
/* postgresのトランザクション開始 */
exports.dbBegin = function(client, database, callback){
    var query = client.query('begin');
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            callback(err);
        }
        callback(null);
        return;
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        callback(new Error());
        return;
    });
};

/* postgresのトランザクション完了（rollback） */
exports.dbRollback = function(client, database, callback){
    var query = client.query('rollback');
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            callback(true);
        }
        callback(true);
        return;
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        callback(true);
        return;
    });
};

/* postgresのトランザクション完了（commit） */
exports.dbCommit = function(client, database, callback){
    var query = client.query('commit');
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            callback(err);
        }
        callback(null);
        return;
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        callback(new Error());
        return;
    });
};

/* postgresのトランザクション完了（commit） */
exports.dbCommitSimple = function (client, database) {
    var query = client.query('commit');

    query.on('end', function (row, err) {
        if (err) {
            logger.error('xxxx', 'err =>' + err);
            throw new Error();
            return;
        }
        logger.info('xxxx');
        return;
    });

    query.on('error', function (error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => ' + errorMsg);
        callback(true);
        return;
    });
};