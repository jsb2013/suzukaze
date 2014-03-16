/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var log = require("../util/logger");
var logger = log.createLogger();

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
exports.getMMail = function(client, database, memberId, rows, dbcallback){
    var isDbError = false;
    var query = client.query('select * from m_mail where member_id = $1 and is_disabled = false and is_deleted = false',
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

exports.updateMMailForDeleteFlag = function(client, database, priority, memberId, dbcallback){
    var isDbError = false;
    var query = client.query('update m_mail set is_deleted=true, update_date=now(), update_user=$1 where member_id=$2 and priority=$3',
                    ['yamashita0284', memberId, priority]);
    
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

exports.insertMMail = function (client, database, priority, memberId, baseInfo, dbcallback) {

    var isDbError = false;
    var mailPriority = {};
    var mailAddress = {};
    var mailYoto = {};
    
    if(priority === 1){
        mailPriority = priority;
        mailAddress = baseInfo.mail_address_1;
        mailYoto = baseInfo.mail_yoto_1;
    }
    if(priority === 2){
        mailPriority = priority;
        mailAddress = baseInfo.mail_address_2;
        mailYoto = baseInfo.mail_yoto_2;
    }
    if(priority === 3){
        mailPriority = priority;
        mailAddress = baseInfo.mail_address_3;
        mailYoto = baseInfo.mail_yoto_3;
    }

    var query = client.query('INSERT INTO m_mail(member_id, priority, mail_address, yoto, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_disabled, is_deleted) VALUES ($1,$2,$3,$4,null,null,$5,now(),$6,now(),FALSE,FALSE)',
                    [memberId, mailPriority, mailAddress, mailYoto, 'yamashita0284', 'yamashita0284']);
    
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

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
exports.getMailInfoByMemberId = function(client, database, memberId, rows, callback){

    var isDbError = false;
    var query = client.query('select priority, mail_address, yoto from m_mail where member_id = $1 and is_disabled = false and is_deleted = false',
                    [memberId]);

    query.on('row', function(row) {
        rows.push(row);
    });
    
    query.on('end', function(row,err) {
        // エラーが発生した場合
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            callback(err);
            return;
        }
        // 存在する場合
        if (rows.length > 0) {
            callback(null);
            return;
        }
        if (isDbError) {
            return;
        }
        // 存在しない場合
        if (rows.length === 0) {
            logger.error('xxxx', 'err =>'+ err);
            callback(new Error());
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        callback(new Error());
        isDbError = true;
        return;
    });
}