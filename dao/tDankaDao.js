/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var log = require("../util/logger");
var logger = log.createLogger();
var util = require("../util/util");

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
exports.getTDanka = function(client, database, memberId, rows, dbcallback){
    var isDbError = false;
    var query = client.query('select * from t_danka where member_id = $1 and is_deleted = false',
            [memberId]);

    query.on('row', function(row) {
        rows.push(row);
    });

    query.on('end', function (row, err) {
        // エラーが発生した場合
        if (err) {
            logger.error('xxxx', 'err =>' + err);
            client.end();
            dbcallback(err);
            return;
        }
        // 存在する場合
        if (rows.length > 0) {
            util.convertJsonNullToBlankForAllItem(rows);
            client.end();
            dbcallback(null);
            return;
        }
        if (isDbError) {
            return;
        }
        // 存在しない場合
        if (rows.length === 0) {
            logger.error('xxxx', 'err =>' + err);
            client.end();
            dbcallback(new Error());
            return;
        }
    });

    query.on('error', function (error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => ' + errorMsg);
        client.end();
        // これでよいのかな？
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
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        client.end();
        // これでよいのかな？
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
    
    var query = client.query('INSERT INTO t_danka(member_id, danka_type, sewa_code, tiku_code, member_id_kosyu, member_id_sou, kaimyo, kaimyo_furigana, relation, sesyu_sei, sesyu_na, jiin, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12, null, null,$13,now(),$14,now(),FALSE)',
                    [memberId, dankaType, sewaCode, tikuCode, memberIdKosyu, memberIdSou, kaimyo, kaimyoFurigana, relation, sesyuSei, sesyuNa, jiin, 'yamashita0284', 'yamashita0284']);
    
    query.on('end', function(row,err) {
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
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        client.end();
        // これでよいのかな？
        dbcallback(new Error());
        isDbError = true;
        return;
    });
}