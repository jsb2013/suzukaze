/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var log = require("../util/logger");
var logger = log.createLogger();
var util = require("../util/util");


exports.updateMAddressForDeleteFlag = function(client, database, priority, memberId, dbcallback){
    var isDbError = false;
    var query = client.query('update m_address set is_deleted=true, update_date=now(), update_user=$1 where member_id=$2 and priority=$3',
                    ['yamashita0284', memberId, priority]);
    
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
        // session out
        client.end();

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

exports.getAddressInfoByMemberIdAndPriority = function (client, database, memberId, priority, rows, dbcallback) {
    var isDbError = false;
    var query = client.query('select * from m_address where member_id = $1 and priority = $2 and is_disabled = false and is_deleted = false',
                    [memberId, priority]);

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

    query.on('error', function (error) {
        // session out
        client.end();

        // database error(structure)
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => ' + errorMsg);
        dbcallback(new Error());
        isDbError = true;
        return;
    });
}

// 空レコードを登録する。
function createInitialInfo(baseInfo){
    var base = {};
    base.priority = 1;
    base.zip_code_pre = "";
    base.zip_code_last = "";
    base.region = "";
    base.city = "";
    base.address_line1 = "";
    base.address_line2 = "";
    base.yoto = "";
    baseInfo[0] = base;
}