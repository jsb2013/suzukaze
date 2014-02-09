/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
 
var database = require("../dao/database");
var client = database.createClient();
var log = require("../util/logger");
var logger = log.createLogger();
var async = require('async');

/* 檀家追加画面メイン（post処理） */
exports.main = function(callback){
    // いったんはpostで入ってきたデータは正しい想定で作る
    
    var tikuCodeInfo = [];
    var jobCodeInfo = [];
    var sewaCodeInfo = [];
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
        // [TBA] 住所、メールを取得する。
        // メンバーマスタから僧のリストを取得
        function (dbcallback) {
            getSouMemberIdInfo(souMemberIdInfo, dbcallback);
        }],
        // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, jobCodeInfo, tikuCodeInfo, sewaCodeInfo, souMemberIdInfo);
            return;
        }
    );
};

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
