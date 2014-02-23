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
    var memberId = webItemJson.selected_member_id;
    var dankaInfo = [];
    var tikuCodeInfo = [];
    var sewaCodeInfo = [];
    var commentInfo = [];

    async.series([
    // 檀家マスタを取得
        function (dbcallback) {
            getMemberList(memberId, dankaInfo, dbcallback);
        },
    // 地区コードマスタを取得
        function (dbcallback) {
            getTikuCodeInfo(tikuCodeInfo, dbcallback);
        },
    // 世話コードマスタを取得
        function (dbcallback) {
            getSewaCodeInfo(sewaCodeInfo, dbcallback);
        },
    // コメントマスタを取得
        function (dbcallback) {
            getCommentByMemberId(memberId, commentInfo, dbcallback);
        } ],
    // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            var tikuCodeList = {};
            addTikuNameAndSewaName(dankaInfo, tikuCodeInfo, sewaCodeInfo);
            callback(false, dankaInfo, tikuCodeInfo, sewaCodeInfo, commentInfo);
            return;
        }
    );
};

function addTikuNameAndSewaName(dankaInfo, tikuCodeInfo, sewaCodeInfo){
    var danka = dankaInfo[0];
    var tikuCode = danka.tiku_code;
    var sewaCode = danka.sewa_code;
    
    // tikuCOdeを追加
    for(var i in tikuCodeInfo){
        var info = tikuCodeInfo[i];
        var _tiku_code = info.tiku_code;
        var _tiku_name = info.tiku_name;
        if(tikuCode === _tiku_code){
            danka.tiku_name = _tiku_name;
            break;
        }
    }

    // sewaCodeを追加
    for(var i in sewaCodeInfo){
        var info = sewaCodeInfo[i];
        var _sewa_code = info.sewa_code;
        var _sewa_name = info.sewa_name;
        if(sewaCode === _sewa_code){
            danka.sewa_name = _sewa_name;
            break;
        }
    }
}

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
function getMemberList(memberId, rows, callback){
    
    var query = client.query('select a.member_id, a.name_sei, a.name_na, a.furigana_sei, a.furigana_na, a.sex, a.kaimyo, a.birthday_y, a.birthday_m, a.birthday_d, a.meinichi_y, a.meinichi_m, a.meinichi_d, b.sewa_code, c.tiku_code from (m_member as a inner join t_danka as b on a.member_id = b.member_id) inner join m_member_tiku as c on b.member_id = c.member_id where a.member_id = $1 and a.is_deleted = false and a.is_disabled = false and b.is_deleted = false and c.is_deleted = false and c.is_disabled = false',
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
        callback(null);
        return;
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