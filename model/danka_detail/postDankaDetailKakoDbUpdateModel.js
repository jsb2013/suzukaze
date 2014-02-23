/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
 
var database = require("../../dao/database");
var client = database.createClient();
var dbcommon = require("../../dao/database_common");
var log = require("../../util/logger");
var logger = log.createLogger();

/* 檀家追加画面メイン（post処理） */
exports.main = function(webItemJson, callback){
    // いったんはpostで入ってきたデータは正しい想定で作る
    
    var memberId = webItemJson.member_id_kako;
    var isUpdateMMember = webItemJson.is_update_m_member;
    var isUpdateMMTiku = webItemJson.is_update_m_member_tiku;
    var isUpdateTDanka = webItemJson.is_update_t_danka;
    var isUpdateTComment = webItemJson.is_update_t_comment;
    
    // 
    var async = require('async');
    
    async.series([
        // 【START】トランザクション開始
        function (dbcallback) {
            dbcommon.dbBegin(client, database, dbcallback);
        },
        // メンバーマスタ削除（deleteFlag = true)
        function (dbcallback) {
            if(isUpdateMMember ===  "true"){
                updateMMemberForDeleteFlag(memberId, dbcallback);
            }else{
                dbcallback(null);
            }
        },
        // メンバーマスタ追加
        function (dbcallback) {
            if(isUpdateMMember ===  "true"){
                insertMMember(memberId, webItemJson, dbcallback);
            }else{
                dbcallback(null);
            }
        },
        // メンバー地区関係管理マスタ削除（deleteFlag = true)
        function (dbcallback) {
            if(isUpdateMMTiku ===  "true"){
                updateMMemberTikuForDeleteFlag(memberId, webItemJson, dbcallback);
            }else{
                dbcallback(null);
            }
        },
        // メンバー地区関係管理マスタ追加
        function (dbcallback) {
            if(isUpdateMMTiku ===  "true"){
                insertMMemberTiku(memberId, webItemJson, dbcallback);
            }else{
                dbcallback(null);
            }
        },
        // 檀家マスタ削除（deleteFlag = true)
        function (dbcallback) {
            if(isUpdateTDanka ===  "true"){
                updateTDankaForDeleteFlag(memberId, dbcallback);
            }else{
                dbcallback(null);
            }
        },
        // 檀家マスタ追加
        function (dbcallback) {
            if(isUpdateTDanka ===  "true"){
                insertTDanka(memberId, webItemJson, dbcallback);
            }else{
                dbcallback(null);
            }
        },   
        // コメントマスタ削除（deleteFlag = true)
        function (dbcallback) {
            if(isUpdateTComment ===  "true"){
                updateTCommentForDeleteFlag(memberId, dbcallback);
            }else{
                dbcallback(null);
            }
        },
        // コメントマスタ追加
        function (dbcallback) {
            if(isUpdateTComment ===  "true"){
                insertTComment(memberId, webItemJson, dbcallback);
            }else{
                dbcallback(null);
            }
        }],    
        // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                dbcommon.dbRollback(client, database, callback);
                return;
            }
            dbcommon.dbCommit(client, database, callback);
            return;
        }
    );
};

function insertMMember(memberId, webItemJson, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
    var name_sei = webItemJson.name_sei;
    var name_na = webItemJson.name_na;
    var furigana_sei = webItemJson.furigana_sei;
    var furigana_na = webItemJson.furigana_na;
    var sex = webItemJson.sex;
    var job_code = webItemJson.job_code;
    var birthday_y = webItemJson.birthday_y;
    var birthday_m = webItemJson.birthday_m;
    var birthday_d = webItemJson.birthday_d;
    
    var query = client.query('INSERT INTO m_member(member_id, name_sei, name_na, furigana_sei, furigana_na, kaimyo, sex, job_code, birthday_y, birthday_m, birthday_d, meinichi_y, meinichi_m, meinichi_d, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_disabled, is_deleted) VALUES ($1,$2,$3,$4,$5,null,$6,$7,$8,$9,$10,null,null,null,null,null,$11,now(),$12,now(),FALSE,FALSE)',
                    [memberId, name_sei, name_na, furigana_sei, furigana_na, sex, job_code, birthday_y, birthday_m, birthday_d, 'yamashita0284', 'yamashita0284']);
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
            return;
        }else{
            dbcallback(null);
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        dbcallback(new error());
        return;
    });
}

function insertMAddress(memberId, webItemJson, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
    var zipCodePre = webItemJson.zip_code_pre;
    var zipCodeLast = webItemJson.zip_code_last;
    var region = webItemJson.region;
    var city = webItemJson.city;
    var addressLine1 = webItemJson.address_line1;
    var addressLine2 = webItemJson.address_line2;
    
    var query = client.query('INSERT INTO m_address(member_id, priority, zip_code_pre, zip_code_last, region, city, address_line1, address_line2, yoto, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_disabled, is_deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,null,null,null,$9,now(),$10,now(),FALSE,FALSE)',
                    [memberId, 1, zipCodePre, zipCodeLast, region, city, addressLine1, addressLine2, 'yamashita0284', 'yamashita0284']);
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
            return;
        }else{
            dbcallback(null);
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        dbcallback(new error());
        return;
    });
}

function insertMMail(memberId, priority, webItemJson, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
    
    var mailPriority = {};
    var mailAddress = {};
    var mailYoto = {};
    
    if(priority === 1){
        mailPriority = priority;
        mailAddress = webItemJson.mail_address_1;
        mailYoto = webItemJson.mail_yoto_1;
    }
    if(priority === 2){
        mailPriority = priority;
        mailAddress = webItemJson.mail_address_2;
        mailYoto = webItemJson.mail_yoto_2;
    }
    if(priority === 3){
        mailPriority = priority;
        mailAddress = webItemJson.mail_address_3;
        mailYoto = webItemJson.mail_yoto_3;
    }

    var query = client.query('INSERT INTO m_mail(member_id, priority, mail_address, yoto, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_disabled, is_deleted) VALUES ($1,$2,$3,$4,null,null,$5,now(),$6,now(),FALSE,FALSE)',
                    [memberId, mailPriority, mailAddress, mailYoto, 'yamashita0284', 'yamashita0284']);
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
            return;
        }else{
            dbcallback(null);
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        dbcallback(new error());
        return;
    });
}

function insertMTelnumber(memberId, priority, webItemJson, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
    
    var telPriority = {};
    var telNumberPre = {};
    var telNumberMid = {};
    var telNumberLast = {};
    var telYoto = {};
    
    if(priority === 1){
        telPriority = priority;
        telNumberPre = webItemJson.telno_pre_1;
        telNumberMid = webItemJson.telno_mid_1;
        telNumberLast = webItemJson.telno_last_1;
        telYoto = webItemJson.telno_yoto_1;
    }
    if(priority === 2){
        telPriority = priority;
        telNumberPre = webItemJson.telno_pre_2;
        telNumberMid = webItemJson.telno_mid_2;
        telNumberLast = webItemJson.telno_last_2;
        telYoto = webItemJson.telno_yoto_2;
    }
    if(priority === 3){
        telPriority = priority;
        telNumberPre = webItemJson.telno_pre_3;
        telNumberMid = webItemJson.telno_mid_3;
        telNumberLast = webItemJson.telno_last_3;
        telYoto = webItemJson.telno_yoto_3;
    }

    var query = client.query('INSERT INTO m_telnumber(member_id, priority, tel_number_pre, tel_number_mid, tel_number_last, yoto, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_disabled, is_deleted) VALUES ($1,$2,$3,$4,$5,$6,null,null,$7,now(),$8,now(),FALSE,FALSE)',
                    [memberId, telPriority, telNumberPre, telNumberMid, telNumberLast, telYoto, 'yamashita0284', 'yamashita0284']);
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
            return;
        }else{
            dbcallback(null);
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        dbcallback(new error());
        return;
    });
}

function insertMMemberTiku(memberId, webItemJson, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
    var tikuCode = webItemJson.tiku_code;
    
    var query = client.query('INSERT INTO m_member_tiku(member_id, tiku_code, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_disabled, is_deleted) VALUES ($1,$2,null,null,$3,now(),$4,now(),FALSE,FALSE)',
                    [memberId, tikuCode, 'yamashita0284', 'yamashita0284']);
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
            return;
        }else{
            dbcallback(null);
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        dbcallback(new error());
        return;
    });
}

function insertTDanka(memberId, webItemJson, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
    var dankaType = webItemJson.danka_type;
    var memberIdKosyu = memberId;
    var sewaCode = webItemJson.sewa_code;
    var memberIdSou = webItemJson.member_id_sou;
    
    var query = client.query('INSERT INTO t_danka(member_id, danka_type, member_id_kosyu, sewa_code, member_id_sou, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_deleted) VALUES ($1,$2,$3,$4,$5,null,null,$6,now(),$7,now(),FALSE)',
                    [memberId, dankaType, memberIdKosyu, sewaCode, memberIdSou, 'yamashita0284', 'yamashita0284']);
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
            return;
        }else{
            dbcallback(null);
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        dbcallback(new error());
        return;
    });
}

function insertTComment(memberId, webItemJson, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
    var comment = webItemJson.comment;
    
    var query = client.query('INSERT INTO t_comment(comment_code, member_id, comment, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_deleted) VALUES ($1,$2,$3,null,null,$4,now(),$5,now(),FALSE)',
                    [1, memberId, comment, 'yamashita0284', 'yamashita0284']);
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
            return;
        }else{
            dbcallback(null);
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        dbcallback(new error());
        return;
    });
}

function updateMMemberForDeleteFlag(memberId, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
    
    var query = client.query('update m_member set is_deleted=true, update_date=now(), update_user=$1 where member_id=$2',
                    ['yamashita0284', memberId]);
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
            return;
        }else{
            dbcallback(null);
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        dbcallback(new error());
        return;
    });
}

function updateMAddressForDeleteFlag(memberId, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
    
    var query = client.query('update m_address set is_deleted=true, update_date=now(), update_user=$1 where member_id=$2 and priority=1',
                    ['yamashita0284', memberId]);
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
            return;
        }else{
            dbcallback(null);
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        dbcallback(new error());
        return;
    });
}

function updateMMailForDeleteFlag(memberId, priority, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
    
    var query = client.query('update m_mail set is_deleted=true, update_date=now(), update_user=$1 where member_id=$2 and priority=$3',
                    ['yamashita0284', memberId, priority]);
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
            return;
        }else{
            dbcallback(null);
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        dbcallback(new error());
        return;
    });
}

function updateMTelnumberForDeleteFlag(memberId, priority, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
    
    var query = client.query('update m_telnumber set is_deleted=true, update_date=now(), update_user=$1 where member_id=$2 and priority=$3',
                    ['yamashita0284', memberId, priority]);
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
            return;
        }else{
            dbcallback(null);
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        dbcallback(new error());
        return;
    });
}

function updateMMemberTikuForDeleteFlag(memberId, webItemJson, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
    
    var tikuCode = webItemJson.tiku_code_bk;
    
    var query = client.query('update m_member_tiku set is_deleted=true, update_date=now(), update_user=$1 where member_id=$2 and tiku_code=$3',
                    ['yamashita0284', memberId, tikuCode]);
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
            return;
        }else{
            dbcallback(null);
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        dbcallback(new error());
        return;
    });
}

function updateTDankaForDeleteFlag(memberId, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
    
    var query = client.query('update t_danka set is_deleted=true, update_date=now(), update_user=$1 where member_id=$2',
                    ['yamashita0284', memberId]);
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
            return;
        }else{
            dbcallback(null);
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        dbcallback(new error());
        return;
    });
}

function updateTCommentForDeleteFlag(memberId, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
    
    var query = client.query('update t_comment set is_deleted=true, update_date=now(), update_user=$1 where member_id=$2 and comment_code=1',
                    ['yamashita0284', memberId]);
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
            return;
        }else{
            dbcallback(null);
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        dbcallback(new error());
        return;
    });
}
