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
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        dbcallback(new Error());
        isDbError = true;
        return;
    });
}

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
exports.getTCommentByMemberId = function (client, database, memberId, rows, callback) {
    var isDbError = false;
    var query = client.query('select comment from t_comment where member_id = $1 and comment_code = 1 and is_deleted = false;',
                    [memberId]);

    query.on('row', function (row) {
        rows.push(row);
    });

    query.on('end', function (row, err) {
        // エラーが発生した場合
        if (err) {
            logger.error('xxxx', 'err =>' + err);
            callback(err);
            return;
        }
        // 存在する場合
        if (rows.length > 0) {
            util.convertJsonNullToBlankForAllItem(rows);
            callback(null);
            return;
        }
        if (isDbError) {
            return;
        }
        // 存在しない場合
        // ※DB登録ミスや想定外の事象が考えられる。エラーを出して一旦空レコードを返す。
        if (rows.length === 0) {
            logger.error('xxxx', 'err =>' + err);
            createInitialInfo(rows);
            callback(null);
            return;
        }
    });

    query.on('error', function (error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => ' + errorMsg);
        // これでよいのかな？
        callback(new Error());
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
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
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