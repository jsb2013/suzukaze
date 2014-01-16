/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var database = require("./database");
var client = database.createClient();
var config = require("../conf/common_config");
var util = require("../util/util");
var log = require("../util/logger");
var logger = log.createLogger();

//　ユーザ&パスワードのチェックを行う。
exports.getWaitScheduleInfo = function(userid, callback){
    
    var schdInfo = {"waitNum":0, "waitTime":0};
    function callbackFirst(err, isUserid){
        if (err) {
            callback(err);
            return;
        }
        // ユーザが存在しない場合
        if (!isUserid){
            callback(err, false, schdInfo);
            return;
        }
        // ユーザが存在するので、順番情報を取得する。
        getWaitScheduleByuserIdAndWait(userid, callbackSecond);
    }
    
    function callbackSecond(err, schdInfoList){
        if (err) {
            callback(err);
            return;
        }
        // 待ち情報を作成する。

        schdInfo.waitNum = schdInfoList.length;
        schdInfo.waitTime = schdInfo.waitNum * config.perTime;
        callback(null, true, schdInfo);
    }
    
    getWaitScheduleByuserIdAndStatus(userid, '1', callbackFirst);
};

function getWaitScheduleByuserIdAndStatus(userid, status, callback){
    var query = client.query('select * from wait_schedule where user_id = $1 and status = $2', [userid, status]);
    var rows = [];
        
    query.on('row', function(row) {
        rows.push(row);
    });
        
    query.on('end', function(row,err) {
        // エラーが発生した場合
        if (err){
            callback(err, null);
            return;
        }
        // ユーザがない場合
        if (rows.length === 0){
            callback(err, false);
            return;
        }
        // エラーが発生しない場合
        callback(err, true);
        return;
    });
        
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        console.log(errorMsg);
        return;
    });
}    

function getWaitScheduleByuserIdAndWait(userid, callback){
    var query = client.query('select * from wait_schedule where status = \'1\' and register_time < (select register_time from wait_schedule where user_id = $1 and status = \'1\')', [userid]);
    var rows = [];
    
    query.on('row', function(row) {
        rows.push(row);
    });
    
    query.on('end', function(row,err) {
        // エラーが発生した場合
        if (err){
            callback(err, null);
            return;
        }
        // エラーが発生しない場合
        callback(false, rows);
        return;
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        console.log(errorMsg);
        return;
    });
}

/* ユーザ登録 */
exports.inserWaitSchedule = function(userid, callback) {
    if(util.isUndefine(userid)){
        logger.error('EIWAITSCHED10');
        callback();
        return;
    }
    // パスワードは必ず値が設定されている前提（Clientサイドでチェック済）
    var query = client.query('INSERT INTO wait_schedule(user_id, status, register_time) VALUES ($1, \'1\', now())', [userid]);
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('EIWAITSCHED20', 'err =>'+ err);
            callback(err);
        }else{
            callback(false);
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('EIWAITSCHED30', 'error => '+errorMsg);
        callback(errorMsg);
        return;
    });
};

/* ユーザ登録 */
exports.updateStatusForWaitSchedule = function(userid, status, callback) {
    if(util.isUndefine(userid)){
        logger.error('EIWAITSCHED10');
        callback();
        return;
    }
    // パスワードは必ず値が設定されている前提（Clientサイドでチェック済）
    var query = client.query('update wait_schedule set status = $1 WHERE user_id = $2', [status, userid]);
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('EIWAITSCHED20', 'err =>'+ err);
            callback(err);
        }else{
            callback(false);
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('EIWAITSCHED30', 'error => '+errorMsg);
        callback(errorMsg);
        return;
    });
};