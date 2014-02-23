/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
 
var database = require("../../dao/database");
var client = database.createClient();
var log = require("../../util/logger");
var logger = log.createLogger();
var util = require("../../util/util");
var async = require('async');

/* 檀家追加画面メイン（post処理） */
exports.main = function (webItemJson, callback) {
    // いったんはpostで入ってきたデータは正しい想定で作る
    var memberId = webItemJson.member_id;
    var tikuCodeInfo = [];
    var jobCodeInfo = [];
    var sewaCodeInfo = [];
    var addressInfo = [];
    var mailInfo = [];
    var commentInfo = [];
    var telnumberInfo = [];
    var souMemberIdInfo = [];

    async.series([

    // 仕事コードマスタを取得
        function (dbcallback) {
            getJobCodeInfo(jobCodeInfo, dbcallback);
        },
    // 地区コードマスタを取得
        function (dbcallback) {
            getTikuCodeInfo(tikuCodeInfo, dbcallback);
        },
    // 世話コードマスタを取得
        function (dbcallback) {
            getSewaCodeInfo(sewaCodeInfo, dbcallback);
        },
    // 住所マスタを取得
        function (dbcallback) {
            getAddressInfoByMemberId(memberId, addressInfo, dbcallback);
        },
    // メールマスタを取得
        function (dbcallback) {
            getMailInfoByMemberId(memberId, mailInfo, dbcallback);
        },
    // 電話番号マスタを取得
        function (dbcallback) {
            getTelnumberInfoByMemberId(memberId, telnumberInfo, dbcallback);
        },
    // コメントマスタを取得
        function (dbcallback) {
            getCommentByMemberId(memberId, commentInfo, dbcallback);
        },
    // [TBA] 住所、メールを取得する。
    // メンバーマスタから僧のリストを取得
        function (dbcallback) {
            getSouMemberIdInfo(souMemberIdInfo, dbcallback);
        } ],
    // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            // 住所情報をpriority順に並び替える。
            convertInfoByPriority(addressInfo);

            // メール情報をpriority順に並び替える。
            convertInfoByPriority(mailInfo);

            // 電話番号情報をpriority順に並び替える。
            convertInfoByPriority(telnumberInfo);

            // 仕事名称と担当[僧]とコメントをwebitemJsonに登録
            registerNama(webItemJson, jobCodeInfo, souMemberIdInfo, commentInfo);

            callback(false, jobCodeInfo, tikuCodeInfo, sewaCodeInfo, addressInfo, mailInfo, telnumberInfo, souMemberIdInfo);
            return;
        }
    );
};

function registerNama(webItemJson, jobCodeInfo, souMemberIdInfo, commentInfo){
    var jobCode = webItemJson.job_code;
    var memberIdSou = webItemJson.member_id_sou;
    
    // 仕事名を登録
    for(var key in jobCodeInfo){
        var _line = jobCodeInfo[key];
        var _jobCode = _line.job_code;
        if(jobCode == _jobCode){
            var jobName = _line.job_name;
            webItemJson.job_name = jobName;
            break;
        }
    }    
    // 担当[僧]を登録
    for(var key in souMemberIdInfo){
        var _line = souMemberIdInfo[key];
        var _memberIdSou = _line.member_id;
        if(memberIdSou == _memberIdSou){
            var souNameSei = _line.name_sei;
            var souNameNa = _line.name_na;
            webItemJson.sou_name_sei = souNameSei;
            webItemJson.sou_name_na = souNameNa;
            break;
        }
    } 
    // コメントを登録
    var comment = "";
    if(!util.isUndefineForList(commentInfo)){
        comment = commentInfo[0].comment;
    }
    webItemJson.comment = comment;
}

function convertInfoByPriority(infoJson){
    var priorityInfo1 = {};
    var priorityInfo2 = {};
    var priorityInfo3 = {};
    
    for(var key in infoJson){
        var line = infoJson[key];
        var priority = line.priority;
        if(priority === 1){
            priorityInfo1 = line;
            continue;
        }
        if(priority === 2){
            priorityInfo2 = line;
            continue;
        }
        if(priority === 3){
            priorityInfo3 = line;
            continue;
        }
    }
    infoJson[0] = priorityInfo1;
    infoJson[1] = priorityInfo2;
    infoJson[2] = priorityInfo3;
}

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
function getSouMemberIdInfo(rows, callback){
    
    var query = client.query('select mm.member_id, mm.name_sei, mm.name_na from m_member as mm inner join m_sou as ms on mm.member_id = ms.member_id where mm.is_disabled = false and mm.is_deleted = false and ms.is_disabled = false and ms.is_deleted = false');

    query.on('row', function(row) {
        rows.push(row);
    });
    
    query.on('end', function(row,err) {
        // エラーが発生した場合
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            callback(err);
            return;
        }
        // 存在する場合
        if (rows.length > 0) {
            callback(null);
            return;
        }
        // 存在しない場合
        if (rows.length === 0) {
            logger.error('xxxx', 'err =>'+ err);
            callback(new Error());
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        callback(new Error());
        return;
    });
}

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
function getJobCodeInfo(rows, callback){
    
    var query = client.query('select job_code, job_name from m_job_code where is_disabled=false and is_deleted=false');

    query.on('row', function(row) {
        rows.push(row);
    });
    
    query.on('end', function(row,err) {
        // エラーが発生した場合
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            callback(err);
            return;
        }
        // 存在する場合
        if (rows.length > 0) {
            callback(null);
            return;
        }
        // 存在しない場合
        if (rows.length === 0) {
            logger.error('xxxx', 'err =>'+ err);
            callback(new Error());
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        callback(new Error());
        return;
    });
}

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
function getTikuCodeInfo(rows, callback){
    
    var query = client.query('select tiku_code, tiku_name from m_tiku_code where is_disabled=false and is_deleted=false');

    query.on('row', function(row) {
        rows.push(row);
    });
    
    query.on('end', function(row,err) {
        // エラーが発生した場合
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            callback(err);
            return;
        }
        // 存在する場合
        if (rows.length > 0) {
            callback(null);
            return;
        }
        // 存在しない場合
        if (rows.length === 0) {
            logger.error('xxxx', 'err =>'+ err);
            callback(new Error());
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        callback(new Error());
        return;
    });
}

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
function getSewaCodeInfo(rows, callback){
    
    var query = client.query('select sewa_code, sewa_name from m_sewa_code where is_disabled=false and is_deleted=false');

    query.on('row', function(row) {
        rows.push(row);
    });
    
    query.on('end', function(row,err) {
        // エラーが発生した場合
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            callback(err);
            return;
        }
        // 存在する場合
        if (rows.length > 0) {
            callback(null);
            return;
        }
        // 存在しない場合
        if (rows.length === 0) {
            logger.error('xxxx', 'err =>'+ err);
            callback(new Error());
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        callback(new Error());
        return;
    });
}

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
function getAddressInfoByMemberId(memberId, rows, callback){
    
    var query = client.query('select priority, zip_code_pre, zip_code_last, region, city, address_line1, address_line2, yoto from m_address where member_id = $1 and is_disabled = false and is_deleted = false', 
                    [memberId]);

    query.on('row', function(row) {
        rows.push(row);
    });
    
    query.on('end', function(row,err) {
        // エラーが発生した場合
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            callback(err);
            return;
        }
        // 存在する場合
        if (rows.length > 0) {
            callback(null);
            return;
        }
        // 存在しない場合
        if (rows.length === 0) {
            logger.error('xxxx', 'err =>'+ err);
            callback(new Error());
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        callback(new Error());
        return;
    });
}

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
function getMailInfoByMemberId(memberId, rows, callback){
    
    var query = client.query('select priority, mail_address, yoto from m_mail where member_id = $1 and is_disabled = false and is_deleted = false',
                    [memberId]);

    query.on('row', function(row) {
        rows.push(row);
    });
    
    query.on('end', function(row,err) {
        // エラーが発生した場合
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            callback(err);
            return;
        }
        // 存在する場合
        if (rows.length > 0) {
            callback(null);
            return;
        }
        // 存在しない場合
        if (rows.length === 0) {
            logger.error('xxxx', 'err =>'+ err);
            callback(new Error());
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        callback(new Error());
        return;
    });
}

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
function getTelnumberInfoByMemberId(memberId, rows, callback){
    
    var query = client.query('select priority, tel_number_pre, tel_number_mid, tel_number_last, yoto from m_telnumber where member_id = $1 and is_disabled = false and is_deleted = false',
                    [memberId]);

    query.on('row', function(row) {
        rows.push(row);
    });
    
    query.on('end', function(row,err) {
        // エラーが発生した場合
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            callback(err);
            return;
        }
        // 存在する場合
        if (rows.length > 0) {
            callback(null);
            return;
        }
        // 存在しない場合
        if (rows.length === 0) {
            logger.error('xxxx', 'err =>'+ err);
            callback(new Error());
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        callback(new Error());
        return;
    });
}

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
function getCommentByMemberId(memberId, rows, callback){
    
    var query = client.query('select comment from t_comment where member_id = $1 and comment_code = 1 and is_deleted = false;',
                    [memberId]);

    query.on('row', function(row) {
        rows.push(row);
    });
    
    query.on('end', function(row,err) {
        // エラーが発生した場合
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            callback(err);
            return;
        }
        // 存在する場合
        if (rows.length > 0) {
            callback(null);
            return;
        }
        // 存在しない場合
        if (rows.length === 0) {
            logger.error('xxxx', 'err =>'+ err);
            callback(new Error());
            return;
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        callback(new Error());
        return;
    });
}