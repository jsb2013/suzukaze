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
            callback(false, jobCodeInfo, tikuCodeInfo, souMemberIdInfo);
            return;
        }
    );
};

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
function getSouMemberIdInfo(rows, callback){
    
    var query = client.query('select MM.member_id, MM.name_sei, MM.name_na from m_member as MM inner join m_member_yakuwari as MMY on MMY.member_id = MM.member_id and MMY.yakuwari_code=\'3\'');

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
