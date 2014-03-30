/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var log = require("../util/logger");
var logger = log.createLogger();
var util = require("../util/util");


exports.updateMTelnumberForDeleteFlag = function(client, database, priority, memberId, dbcallback){
    var isDbError = false;
    var query = client.query('update m_telnumber set is_deleted=true, update_date=now(), update_user=$1 where member_id=$2 and priority=$3',
                    ['yamashita0284', memberId, priority]);
    
    query.on('end', function(row,err) {
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
        // callback
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

exports.insertMTelnumber = function (client, database, priority, memberId, baseInfo, dbcallback) {

    var isDbError = false;
    var telPriority = {};
    var telNumberPre = {};
    var telNumberMid = {};
    var telNumberLast = {};
    var telYoto = {};
    
    if(priority === 1){
        telPriority = priority;
        telNumberPre = baseInfo.telno_pre_1;
        telNumberMid = baseInfo.telno_mid_1;
        telNumberLast = baseInfo.telno_last_1;
        telYoto = baseInfo.telno_yoto_1;
    }
    if(priority === 2){
        telPriority = priority;
        telNumberPre = baseInfo.telno_pre_2;
        telNumberMid = baseInfo.telno_mid_2;
        telNumberLast = baseInfo.telno_last_2;
        telYoto = baseInfo.telno_yoto_2;
    }
    if(priority === 3){
        telPriority = priority;
        telNumberPre = baseInfo.telno_pre_3;
        telNumberMid = baseInfo.telno_mid_3;
        telNumberLast = baseInfo.telno_last_3;
        telYoto = baseInfo.telno_yoto_3;
    }

    var query = client.query('INSERT INTO m_telnumber(member_id, priority, tel_number_pre, tel_number_mid, tel_number_last, yoto, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_disabled, is_deleted) VALUES ($1,$2,$3,$4,$5,$6,null,null,$7,now(),$8,now(),FALSE,FALSE)',
                    [memberId, telPriority, telNumberPre, telNumberMid, telNumberLast, telYoto, 'yamashita0284', 'yamashita0284']);
    
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
        // callback
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

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
exports.getTelnumberInfoByMemberId = function (client, database, memberId, rows, dbcallback) {

    var isDbError = false;
    var query = client.query('select priority, tel_number_pre, tel_number_mid, tel_number_last, yoto from m_telnumber where member_id = $1 and is_disabled = false and is_deleted = false',
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
        // database error(structure)
        if (isDbError) {
            return;
        }
        // check record
        checkAndAddRecord(rows);
        util.convertJsonNullToBlankForAllItem(rows);

        // callback
        dbcallback(null);
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

// add blank record
function checkAndAddRecord(rows){
    var maxRecordCount = 3;
    var recordCountByRows = rows.length;
    var addRecordCount = maxRecordCount - recordCountByRows;

    for(var i=0; i<addRecordCount; i++){
        var priority = maxRecordCount - i;
        var base = {};
        base.priority = priority;
        base.tel_number_pre = "";
        base.tel_number_mid = "";
        base.tel_number_last = "";
        base.yoto = "";
        rows[priority - 1] = base;
    }
}

