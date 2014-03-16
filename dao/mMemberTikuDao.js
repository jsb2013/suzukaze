/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var log = require("../util/logger");
var logger = log.createLogger();

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
exports.getMMemberTiku = function(client, database, memberId, rows, dbcallback){
    var isDbError = false;
    var query = client.query('select * from m_member where member_id = $1 and is_disabled = false and is_deleted = false',
            [memberId]);

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
        callback(new Error());
        isDbError = true;
        return;
    });
}

exports.updateMMemberTikuForDeleteFlag = function(client, database, memberId, baseInfo, dbcallback){
    var isDbError = false;
    var tikuCode = baseInfo.tiku_code_bk;
    
    var query = client.query('update m_member_tiku set is_deleted=true, update_date=now(), update_user=$1 where member_id=$2 and tiku_code=$3 and is_deleted = false and is_disabled = false',
                    ['yamashita0284', memberId, tikuCode]);
    
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

exports.insertMMemberTiku = function (client, database, memberId, baseInfo, dbcallback) {

    var isDbError = false;
    var tikuCode = baseInfo.tiku_code;
    
    var query = client.query('INSERT INTO m_member_tiku(member_id, tiku_code, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_disabled, is_deleted) VALUES ($1,$2,null,null,$3,now(),$4,now(),FALSE,FALSE)',
                    [memberId, tikuCode, 'yamashita0284', 'yamashita0284']);
    
    query.on('end', function (row, err) {
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
