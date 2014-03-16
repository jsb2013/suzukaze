/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var log = require("../util/logger");
var logger = log.createLogger();

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
exports.getTDankaDetailKosyuInfo = function(client, database, member_id, rows, callback){
    var isDbError = false;
    var query = client.query('select * from t_danka_detail_kosyu_info where is_deleted = false and member_id = $1',
            [member_id] );

    query.on('row', function(row) {
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
            callback(null);
            return;
        }
        if (isDbError) {
            return;
        }
        // 存在しない場合
        if (rows.length === 0) {
            logger.error('xxxx', 'err =>' + err);
            callback(new Error());
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

exports.updateTDankaDetailKosyuForDeleteFlag = function(client, database, memberId, dbcallback){
    var isDbError = false;
    var query = client.query('update t_danka_detail_kosyu_info set is_deleted=true, update_date=now(), update_user=$1 where member_id = $2',
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

exports.insertTDankaDetailKosyuInfo = function(client, database, memberId, baseInfo, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
    var isDbError = false;
    var dankaType = baseInfo.danka_type;
    var nameSei = baseInfo.name_sei;
    var nameNa = baseInfo.name_na;
    var furiganaSei = baseInfo.furigana_sei;
    var furiganaNa = baseInfo.furigana_na;
    var sex = baseInfo.sex;
    var jobCode = baseInfo.job_code;
    var birthdayY = baseInfo.birthday_y;
    var birthdayM = baseInfo.birthday_m;
    var birthdayD = baseInfo.birthday_d;
    var tikuCode = baseInfo.tiku_code;
    var tikuName = baseInfo.tiku_name;
    var sewaCode = baseInfo.sewa_code;
    var sewaName = baseInfo.sewa_name;
    var memberIdSou = baseInfo.member_id_sou;

    var query = client.query('INSERT INTO t_danka_detail_kosyu_info(member_id, danka_type, name_sei, name_na, furigana_sei, furigana_na, sex, job_code, birthday_y, birthday_m, birthday_d, tiku_code, tiku_name, sewa_code, sewa_name, member_id_sou, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_deleted) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, null, null, $17, now(), $18, now(), false)',
                    [memberId, dankaType, nameSei, nameNa, furiganaSei, furiganaNa, sex, jobCode, birthdayY, birthdayM, birthdayD, tikuCode, tikuName, sewaCode, sewaName, memberIdSou, 'yamashita0284', 'yamashita0284']);
    
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