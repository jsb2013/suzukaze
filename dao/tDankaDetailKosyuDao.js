/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var log = require("../util/logger");
var logger = log.createLogger();
var util = require("../util/util");

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
exports.getTDankaDetailKosyuInfoByMemberId = function(client, database, member_id, rows, dbcallback){
    var isDbError = false;
    var query = client.query('select * from t_danka_detail_kosyu_info where is_deleted = false and member_id = $1',
            [member_id] );

    query.on('row', function(row) {
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

exports.updateTDankaDetailKosyuForDeleteFlag = function(client, database, memberId, dbcallback){
    var isDbError = false;
    var query = client.query('update t_danka_detail_kosyu_info set is_deleted=true, update_date=now(), update_user=$1 where member_id = $2',
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

exports.deleteTDankaDetailKosyuBymemberId = function(client, database, memberId, dbcallback){
    var isDbError = false;
    var query = client.query('delete from t_danka_detail_kosyu_info where member_id = $1',
                    [memberId]);
    
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

exports.insertTDankaDetailKosyuInfo = function (client, database, memberId, baseInfo, serchMoji, optionId, dbcallback) {

    // varchar型 or boolean型の値を取得。
    var isDbError = false;
    var dankaType = baseInfo.danka_type;
    var nameSei = baseInfo.name_sei;
    var nameNa = baseInfo.name_na;
    var furiganaSei = baseInfo.furigana_sei;
    var furiganaNa = baseInfo.furigana_na;
    var job = baseInfo.job;
    var tikuCode = baseInfo.tiku_code;
    var tikuName = baseInfo.tiku_name;
    var sewaCode = baseInfo.sewa_code;
    var sewaName = baseInfo.sewa_name;
    var memberIdSou = 0;
    var tags = baseInfo.tags;
    var birthdayY = baseInfo.birthday_y;
    var birthdayM = baseInfo.birthday_m;
    var birthdayD = baseInfo.birthday_d;
    var jiin = baseInfo.jiin;

    var query = client.query('INSERT INTO t_danka_detail_kosyu_info(member_id, danka_type, name_sei, name_na, furigana_sei, furigana_na, job, birthday_y, birthday_m, birthday_d, tiku_code, tiku_name, sewa_code, sewa_name, member_id_sou, tags, jiin, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_deleted) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, now(), $21, now(), false)',
                    [memberId, dankaType, nameSei, nameNa, furiganaSei, furiganaNa, job, birthdayY, birthdayM, birthdayD, tikuCode, tikuName, sewaCode, sewaName, memberIdSou, tags, jiin, serchMoji, optionId, 'yamashita0284', 'yamashita0284']);

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

    query.on('error', function (error) {
        // session out
        client.end();

        // database error
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => ' + errorMsg);
        dbcallback(new Error());
        isDbError = true;
        return;
    });
}

