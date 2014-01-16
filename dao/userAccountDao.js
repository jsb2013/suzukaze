/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var database = require("./database");
var client = database.createClient();
var log = require("../util/logger");
var logger = log.createLogger();
var auth = require("../util/authority");

/* ログイン処理 */
exports.authenticate = function(userid, password, callback) {
    var query = client.query('select * from user_account where user_id = $1', [userid]);
    var rows = [];
        
    query.on('row', function(row) {
        rows.push(row);
    });
        
    query.on('end', function(row,err) {
        // エラーが発生した場合
        if (err){
            logger.error('ELOGIN10', 'err =>'+ err);
            callback(err, null);
            return;
        }
        // ユーザが存在する場合
        if (rows.length > 0) {
            var userinfo = rows[0];
            if (userinfo.password == auth.convertHashPassword(password)) {
                // ログイン成功
                delete userinfo.password;
                callback(err, userinfo);
                return;
            }
            // パスワード誤り
            logger.warn('WLOGIN10',null);
            callback(err, null);
            return;
        }
        // ユーザが存在しない場合
        logger.warn('WLOGIN20', 'ID='+userid);
        callback(err, null);
        return;
    });
        
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('ELOGIN20', 'error => '+errorMsg);
        callback(error, null);
        return;
    });
};

/* ユーザ登録 */
exports.insertUserAccount = function(userid, username, password, callback) {
    // パスワードは必ず値が設定されている前提（Clientサイドでチェック済）
    var hashedPassword = auth.convertHashPassword(password);
    var query = client.query('INSERT INTO user_account(user_id, user_name, password, postcode, address, email, job, birthday) values ( $1, $2, $3, \'\', \'\', \'\', \'\', now())', [userid, username, hashedPassword]);
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('ECREATE10', 'err =>'+ err);
            callback(err);
        }else{
            callback(false);
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('ECREATE20', 'error => '+errorMsg);
        callback(errorMsg);
        return;
    });
};
