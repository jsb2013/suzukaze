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
    var memberInfo = [];
    async.series([

    // 仕事コードマスタを取得
        function (dbcallback) {
            getMemberList(memberId, memberInfo, dbcallback);
        }],
    // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, memberInfo);
            return;
        }
    );
};

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
function getMemberList(memberId, rows, callback){
    
    var query = client.query('select a.member_id, a.name_sei, a.name_na, a.furigana_sei, a.furigana_na, a.sex, a.kaimyo, a.birthday_y, a.birthday_m, a.birthday_d, a.meinichi_y, a.meinichi_m, a.meinichi_d from m_member as a inner join t_danka as b on a.member_id = b.member_id where a.is_deleted = false and a.is_disabled = false and b.is_deleted = false and b.member_id_kosyu = $1 and a.meinichi_y is not null',
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
