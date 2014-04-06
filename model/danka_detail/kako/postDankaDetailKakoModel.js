/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
 
var database = require("../../../dao/database");
var client = database.createClient();
var log = require("../../../util/logger");
var logger = log.createLogger();
var util = require("../../../util/util");
var async = require('async');
var tDankaDetailKosyuDao = require("../../../dao/tDankaDetailKosyuDao");

/* 檀家追加画面メイン（post処理） */
exports.main = function (webItemJson, callback) {
    // いったんはpostで入ってきたデータは正しい想定で作る
    var memberId = webItemJson.member_id;
    var kakoMemberInfo = [];
    var kosyuInfo = [];
    async.series([

    // 仕事コードマスタを取得
        function (dbcallback) {
            getKakoMemberInfo(memberId, kakoMemberInfo, dbcallback);
        },
    // T_xxxマスタを取得
        function (dbcallback) {
            tDankaDetailKosyuDao.getTDankaDetailKosyuInfoByMemberId(client, database, memberId, kosyuInfo, dbcallback);
        }],
    // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, kakoMemberInfo, kosyuInfo);
            return;
        }
    );
};

/* 過去帳に該当するリストを取得 */
function getKakoMemberInfo(memberId, rows, dbcallback){
    var isDbError = false;
    var query = client.query('select mm.member_id, mm.name_sei, mm.name_na, td.kaimyo, mm.birthday_y, mm.birthday_m, mm.birthday_d, mm.meinichi_y, mm.meinichi_m, mm.meinichi_d, td.sesyu_sei, td.sesyu_na, td.kyonen, td.relation from m_member as mm inner join t_danka as td on mm.member_id = td.member_id where mm.is_deleted = false and mm.is_disabled = false and td.is_deleted = false and td.member_id_kosyu = $1 and mm.is_arive = 0',
                    [memberId]);

    query.on('row', function(row) {
        rows.push(row);
    });
    
    query.on('end', function(row,err) {
        // エラーが発生した場合
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
            return;
        }
        if (isDbError) {
            return;
        }
        util.convertJsonNullToBlankForAllItem(rows);
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
