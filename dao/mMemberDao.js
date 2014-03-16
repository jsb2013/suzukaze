/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var log = require("../util/logger");
var logger = log.createLogger();

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
exports.getMMember = function(client, database, memberId, rows, dbcallback){
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

exports.updateMMemberForDeleteFlag = function(client, database, memberId, dbcallback){
    var isDbError = false;
    var query = client.query('update m_member set is_deleted=true, update_date=now(), update_user=$1 where member_id=$2',
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

exports.insertMMember = function (client, database, memberId, baseInfo, dbcallback) {

    var isDbError = false;
    var name_sei = baseInfo.name_sei;
    var name_na = baseInfo.name_na;
    var furigana_sei = baseInfo.furigana_sei;
    var furigana_na = baseInfo.furigana_na;
    var sex = baseInfo.sex;
    var birthdayY = baseInfo.birthday_y;
    var birthdayM = baseInfo.birthday_m;
    var birthdayD = baseInfo.birthday_d;
    var meinichiY = baseInfo.meinichi_y;
    var meinichiM = baseInfo.meinichi_m;
    var meinichiD = baseInfo.meinichi_d;
    var jobCode = baseInfo.job_code;
    var tag = baseInfo.tag;
    var isArive = baseInfo.is_arive;

    var query = client.query('INSERT INTO m_member(member_id, name_sei, name_na, furigana_sei, furigana_na, sex, job_code, birthday_y, birthday_m, birthday_d, is_arive, meinichi_y, meinichi_m, meinichi_d, tag, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_disabled, is_deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,null,null,$16,now(),$17,now(),FALSE,FALSE)',
                    [memberId, name_sei, name_na, furigana_sei, furigana_na, sex, jobCode, birthdayY, birthdayM, birthdayD, isArive, meinichiY, meinichiM, meinichiD, tag, 'yamashita0284', 'yamashita0284']);

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
