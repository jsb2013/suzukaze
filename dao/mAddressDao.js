/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var log = require("../util/logger");
var logger = log.createLogger();

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
exports.getMAddress = function(client, database, memberId, rows, dbcallback){
    var isDbError = false;
    var query = client.query('select * from m_address where member_id = $1 and is_disabled = false and is_deleted = false',
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

exports.updateMAddressForDeleteFlag = function(client, database, priority, memberId, dbcallback){
    var isDbError = false;
    var query = client.query('update m_address set is_deleted=true, update_date=now(), update_user=$1 where member_id=$2 and priority=$3',
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

exports.insertMAddress = function (client, database, priority, memberId, baseInfo, dbcallback) {

    var isDbError = false;
    var zipCodePre = baseInfo.zip_code_pre;
    var zipCodeLast = baseInfo.zip_code_last;
    var region = baseInfo.region;
    var city = baseInfo.city;
    var addressLine1 = baseInfo.address_line1;
    var addressLine2 = baseInfo.address_line2;
    
    var query = client.query('INSERT INTO m_address(member_id, priority, zip_code_pre, zip_code_last, region, city, address_line1, address_line2, yoto, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_disabled, is_deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,null,null,null,$9,now(),$10,now(),FALSE,FALSE)',
                    [memberId, priority, zipCodePre, zipCodeLast, region, city, addressLine1, addressLine2, 'yamashita0284', 'yamashita0284']);

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

exports.getAddressInfoByMemberId = function(client, database, memberId, rows, callback){
    var isDbError = false;
    var query = client.query('select priority, zip_code_pre, zip_code_last, region, city, address_line1, address_line2, yoto from m_address where member_id = $1 and is_disabled = false and is_deleted = false', 
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