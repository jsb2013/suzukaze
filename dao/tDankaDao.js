/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var log = require("../util/logger");
var logger = log.createLogger();

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

exports.updateTDankaForDeleteFlag = function(client, database, memberId, dbcallback){
    var isDbError = false;
    var query = client.query('update t_danka set is_deleted=true, update_date=now(), update_user=$1 where member_id=$2',
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

exports.insertTDanka = function(client, database, memberId, baseInfo, dbcallback){
    
    var isDbError = false;
    var dankaType = baseInfo.danka_type;
    var memberIdKosyu = baseInfo.member_id_kosyu;
    var kaimyo = baseInfo.kaimyo;
    var kaimyoFurigana = baseInfo.kaimyo_furigana;
    var relation = baseInfo.relation;
    var sewaCode = baseInfo.sewa_code;
    var memberIdSou = baseInfo.member_id_sou;
    
    var query = client.query('INSERT INTO t_danka(member_id, danka_type, member_id_kosyu, kaimyo, kaimyo_furigana, relation, sewa_code, member_id_sou, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8, null, null,$9,now(),$10,now(),FALSE)',
                    [memberId, dankaType, memberIdKosyu, kaimyo, kaimyoFurigana, relation, sewaCode, memberIdSou, 'yamashita0284', 'yamashita0284']);
    
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