/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var log = require("../util/logger");
var logger = log.createLogger();
var util = require("../util/util");

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
exports.getTDankaByMemberId = function(client, database, memberId, rows, dbcallback){
    var isDbError = false;
    var query = client.query('select * from t_danka where member_id = $1 and is_deleted = false',
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

exports.updateTDankaForDeleteFlag = function(client, database, memberId, dbcallback){
    var isDbError = false;
    var query = client.query('update t_danka set is_deleted=true, update_date=now(), update_user=$1 where member_id=$2',
                    ['yamashita0284', memberId]);
    
    query.on('end', function(row,err) {
        // session out
        client.end();

        if (err){
            logger.error('xxxx', 'err =>'+ err);
            client.end();
            dbcallback(err);
            return;
        }
        if (isDbError) {
            return;
        }
        client.end();
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

exports.insertTDanka = function(client, database, memberId, baseInfo, dbcallback){
    
    var isDbError = false;
    var dankaType = baseInfo.danka_type;
    var memberIdKosyu = baseInfo.member_id_kosyu;
    var kaimyo = baseInfo.kaimyo;
    var kaimyoFurigana = baseInfo.kaimyo_furigana;
    var relation = baseInfo.relation;
    var sewaCode = baseInfo.sewa_code;
    var tikuCode = baseInfo.tiku_code;
    var memberIdSou = util.convertBlankToNull(baseInfo.member_id_sou);
    var sesyuSei = baseInfo.sesyu_sei;
    var sesyuNa = baseInfo.sesyu_na;
    var jiin = baseInfo.jiin;
    var kyonen = baseInfo.kyonen;
    
    var query = client.query('INSERT INTO t_danka(member_id, danka_type, sewa_code, tiku_code, member_id_kosyu, member_id_sou, kaimyo, kaimyo_furigana, relation, sesyu_sei, sesyu_na, kyonen, jiin, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13, null, null,$14,now(),$15,now(),FALSE)',
                    [memberId, dankaType, sewaCode, tikuCode, memberIdKosyu, memberIdSou, kaimyo, kaimyoFurigana, relation, sesyuSei, sesyuNa, kyonen, jiin, 'yamashita0284', 'yamashita0284']);
    
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

exports.updateTDankaForTikuNumber = function(client, database, memberId, dbcallback){
    var isDbError = false;
    var query = client.query('update t_danka as td set yobi_1 = mtc.yobi_1 from m_tiku_code as mtc where td.tiku_code = mtc.tiku_code and td.member_id = $1 and td.is_deleted = false and mtc.is_disabled = false and mtc.is_deleted = false;',
                    [memberId]);
    
    query.on('end', function(row,err) {
        // session out
        client.end();

        if (err){
            logger.error('xxxx', 'err =>'+ err);
            client.end();
            dbcallback(err);
            return;
        }
        if (isDbError) {
            return;
        }
        client.end();
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

exports.updateTDankaForMemberIdKosyu = function(client, database, memberId, dbcallback){
    var isDbError = false;
    var query = client.query('update t_danka as td set yobi_1 = mtc.yobi_1 from m_tiku_code as mtc where td.tiku_code = mtc.tiku_code and td.member_id = $1 and td.is_deleted = false and mtc.is_disabled = false and mtc.is_deleted = false;',
                    [memberId]);
    
    query.on('end', function(row,err) {
        // session out
        client.end();

        if (err){
            logger.error('xxxx', 'err =>'+ err);
            client.end();
            dbcallback(err);
            return;
        }
        if (isDbError) {
            return;
        }
        client.end();
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

// 本当はForMemberIdKosyuにしないといけないのだけど、上で間違って登録されてるからとりあえずこの名前にする。
exports.updateTDankaForMemberIdKosyuByMemberId = function(client, database, memberId, memberIdKosyu, dbcallback){
    var isDbError = false;
    var query = client.query('update t_danka set member_id_kosyu = $1 where member_id_kosyu = $2 and is_deleted = false;',
                    [memberId, memberIdKosyu]);
    
    query.on('end', function(row,err) {
        // session out
        client.end();

        if (err){
            logger.error('xxxx', 'err =>'+ err);
            client.end();
            dbcallback(err);
            return;
        }
        if (isDbError) {
            return;
        }
        client.end();
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