/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var log = require("../util/logger");
var logger = log.createLogger();
var util = require("../util/util");

exports.updateTCommentForDeleteFlag = function(client, database, memberId, dbcallback){
    var isDbError = false;
    var query = client.query('update t_comment set is_deleted=true, update_date=now(), update_user=$1 where member_id=$2 and comment_code=1',
                    ['yamashita0284', memberId]);
    
    query.on('end', function(row,err) {
        // session out
        client.end();

        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
            return;
        }
        if (isDbError) {
            return;
        }
        dbcallback(null);
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

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
exports.getTCommentByMemberId = function (client, database, memberId, rows, dbcallback) {
    var isDbError = false;
    var query = client.query('select comment from t_comment where member_id = $1 and comment_code = 1 and is_deleted = false;',
                    [memberId]);

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
        if (rows.length === 1) {
            util.convertJsonNullToBlankForAllItem(rows);
            dbcallback(null);
            return;
        }
        // database error(structure)
        if (isDbError) {
            return;
        }
        // not register address info
        if (rows.length === 0) {
            createInitialInfo(rows);
            dbcallback(null);
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

        // database error(structure)
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        dbcallback(new Error());
        isDbError = true;
        return;
    });
}

exports.insertTComment = function(client, database, memberId, baseInfo, dbcallback){
    
    var isDbError = false;
    var comment = baseInfo.comment;
    
    var query = client.query('INSERT INTO t_comment(comment_code, member_id, comment, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_deleted) VALUES ($1,$2,$3, null, null,$4,now(),$5,now(),FALSE)',
                    [1, memberId, comment, 'yamashita0284', 'yamashita0284']);
    
    query.on('end', function(row,err) {
        // session out
        client.end();

        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
            return;
        }
        if (isDbError) {
            return;
        }
        dbcallback(null);
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

// 空レコードを登録する。
function createInitialInfo(baseInfo){
    var base = {};
    base.comment = "";
    baseInfo[0] = base;
}