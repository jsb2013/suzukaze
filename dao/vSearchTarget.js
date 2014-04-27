/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var log = require("../util/logger");
var logger = log.createLogger();
var util = require("../util/util");

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
exports.getVSearchTargetBySql = function (client, database, sql, rows, dbcallback) {
    var isDbError = false;
    var query = client.query(sql);

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

exports.updateMMemberForDeleteFlag = function(client, database, memberId, dbcallback){
    var isDbError = false;
    var query = client.query('update m_member set is_deleted=true, update_date=now(), update_user=$1 where member_id=$2',
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

exports.insertMMember = function (client, database, memberId, baseInfo, dbcallback) {

    // varchar型 or boolean型の値を取得。
    var isDbError = false;
    var name_sei = baseInfo.name_sei;
    var name_na = baseInfo.name_na;
    var furigana_sei = baseInfo.furigana_sei;
    var furigana_na = baseInfo.furigana_na;
    var sex = baseInfo.sex;
    var job = baseInfo.job;
    var tags = baseInfo.tags;
    var isArive = baseInfo.is_arive;
    var birthdayY = baseInfo.birthday_y
    var birthdayM = baseInfo.birthday_m;
    var birthdayD = baseInfo.birthday_d;
    var meinichiY = baseInfo.meinichi_y;
    var meinichiM = baseInfo.meinichi_m;
    var meinichiD = baseInfo.meinichi_d;

    var query = client.query('INSERT INTO m_member(member_id, name_sei, name_na, furigana_sei, furigana_na, sex, job, birthday_y, birthday_m, birthday_d, meinichi_y, meinichi_m, meinichi_d, tags, is_arive, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_disabled, is_deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,null,null,$16,now(),$17,now(),FALSE,FALSE)',
                    [memberId, name_sei, name_na, furigana_sei, furigana_na, sex, job, birthdayY, birthdayM, birthdayD, meinichiY, meinichiM, meinichiD, tags, isArive, 'yamashita0284', 'yamashita0284']);

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

exports.insertMMemberNotMemberId = function (client, database, baseInfo, dbcallback) {

    // varchar型 or boolean型の値を取得。
    var isDbError = false;
    var name_sei = baseInfo.name_sei;
    var name_na = baseInfo.name_na;
    var furigana_sei = baseInfo.furigana_sei;
    var furigana_na = baseInfo.furigana_na;
    var sex = baseInfo.sex;
    var job = baseInfo.job;
    var tags = baseInfo.tags;
    var isArive = baseInfo.is_arive;
    var birthdayY = baseInfo.birthday_y
    var birthdayM = baseInfo.birthday_m;
    var birthdayD = baseInfo.birthday_d;
    var meinichiY = baseInfo.meinichi_y;
    var meinichiM = baseInfo.meinichi_m;
    var meinichiD = baseInfo.meinichi_d;

    var query = client.query('INSERT INTO m_member(name_sei, name_na, furigana_sei, furigana_na, sex, job, birthday_y, birthday_m, birthday_d, meinichi_y, meinichi_m, meinichi_d, tags, is_arive, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_disabled, is_deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,null,null,$15,now(),$16,now(),FALSE,FALSE)',
                    [name_sei, name_na, furigana_sei, furigana_na, sex, job, birthdayY, birthdayM, birthdayD, meinichiY, meinichiM, meinichiD, tags, isArive, 'yamashita0284', 'yamashita0284']);

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

exports.getMmemberAndTDankaByFurigana = function(client, database, searchMoji, rows, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。 
    var isDbError = false;
    var query = client.query('select mm1.member_id, td.danka_type, mm1.name_sei, mm1.name_na, mm1.tags, mm1.is_arive, td.tiku_code, td.sewa_code, mm2.name_sei as name_sei_kosyu, mm2.name_na as name_na_kosyu, mm2.member_id as member_id_kosyu from (m_member as mm1 inner join t_danka as td on mm1.member_id = td.member_id) inner join m_member as mm2 on td.member_id_kosyu = mm2.member_id where mm1.is_disabled=false and mm1.is_deleted=false and mm2.is_disabled=false and mm2.is_deleted=false and td.is_deleted=false and ((mm1.furigana_sei like $1)or(mm1.furigana_na like $1)) order by mm1.member_id',
                    [searchMoji + '%']);

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
        // database error(structure)
        if (isDbError) {
            return;
        }
        // callback(normal end)
        util.convertJsonNullToBlankForAllItem(rows);
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

exports.getMmemberAndTDankaByMemberId = function(client, database, memberId, rows, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。 
    var isDbError = false;
    var query = client.query('select mm.member_id, mm.name_sei, mm.name_na, mm.furigana_sei, mm.furigana_na, mm.sex, mm.job, mm.birthday_y, mm.birthday_m, mm.birthday_d, td.danka_type, td.tiku_code, td.sewa_code, td.member_id_sou, mm.tags, td.jiin from m_member as mm inner join t_danka td on mm.member_id = td.member_id where mm.is_disabled=false and mm.is_deleted=false and td.is_deleted=false and mm.member_id = $1',
                [memberId]);

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
        // database error(structure)
        if (isDbError) {
            return;
        }
        // callback(normal end)
        util.convertJsonNullToBlankForAllItem(rows);
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

exports.getMmemberAndTDanka = function (client, database, rows, dbcallback) {
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。 
    var isDbError = false;
    var query = client.query('select mm1.member_id, td.danka_type, mm1.name_sei, mm1.name_na, mm1.furigana_sei, mm1.furigana_na, mm1.sex, mm1.tags, mm1.is_arive, td.tiku_code, td.sewa_code, mm2.name_sei as name_sei_kosyu, mm2.name_na as name_na_kosyu, mm2.member_id as member_id_kosyu, td.jiin from (m_member as mm1 inner join t_danka as td on mm1.member_id = td.member_id) inner join m_member as mm2 on td.member_id_kosyu = mm2.member_id where mm1.is_disabled=false and mm1.is_deleted=false and mm2.is_disabled=false and mm2.is_deleted=false and td.is_deleted=false');

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
        // callback(normal end)
        util.convertJsonNullToBlankForAllItem(rows);
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

exports.getMMemberByName = function(client, database, baseInfo, rows, dbcallback){

    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。 
    var isDbError = false;
    var nameSei = baseInfo.name_sei;
    var nameNa = baseInfo.name_na;
    var furiganaSei = baseInfo.furigana_sei;
    var furiganaNa = baseInfo.furigana_na;

    var query = client.query('select * from m_member where name_sei = $1 and name_na = $2 and furigana_sei = $3 and furigana_na = $4',
             [nameSei, nameNa, furiganaSei, furiganaNa]);

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
        // database error(structure)
        if (isDbError) {
            return;
        }
        // callback(normal end)
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

exports.getMMemberForMemberIdByName = function(client, database, baseInfo, rows, dbcallback){

    var isDbError = false;
    var nameSei = baseInfo.name_sei;
    var nameNa = baseInfo.name_na;
    var furiganaSei = baseInfo.furigana_sei;
    var furiganaNa = baseInfo.furigana_na;

    var query = client.query('select member_id from m_member where name_sei = $1 and name_na = $2 and furigana_sei = $3 and furigana_na = $4 order by update_date desc LIMIT 1;',
             [nameSei, nameNa, furiganaSei, furiganaNa]);

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
        // database error(structure)
        if (isDbError) {
            return;
        }
        // callback(normal end)
        if (rows.length === 1) {
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

        // database error
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        dbcallback(new Error());
        isDbError = true;
        return;
    });
}