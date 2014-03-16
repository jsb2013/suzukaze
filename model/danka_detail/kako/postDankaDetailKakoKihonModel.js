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
var mCommentDao = require("../../../dao/mCommentDao");
var tDankaDetailKosyuDao = require("../../../dao/tDankaDetailKosyuDao");

/* 檀家追加画面メイン（post処理） */
exports.main = function (webItemJson, callback) {
    // いったんはpostで入ってきたデータは正しい想定で作る
    var memberId = webItemJson.selected_member_id;
    var memberIdKosyu = webItemJson.member_id_kosyu;
    var dankaInfo = [];
    var commentInfo = [];
    var kosyuInfo = [];

    async.series([
    // 檀家マスタを取得（過去帳で指定したメンバー分）
        function (dbcallback) {
            getMemberList(memberId, dankaInfo, dbcallback);
        },
    // コメントマスタを取得（過去帳で指定したメンバー分）
        function (dbcallback) {
            mCommentDao.getTCommentByMemberId(client, database, memberId, commentInfo, dbcallback);
        },
    // T_xxxマスタを取得（戸主情報）
        function (dbcallback) {
            tDankaDetailKosyuDao.getTDankaDetailKosyuInfo(client, database, memberIdKosyu, kosyuInfo, dbcallback);
        }],
    // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            var tikuCodeList = {};
            addCommentToDankaInfo(dankaInfo, commentInfo);
            callback(false, kosyuInfo, dankaInfo);
            return;
        }
    );
};

function addCommentToDankaInfo(dankaInfo, commentInfo){
    var danka = dankaInfo[0];

    // コメントを登録
    var comment = "";
    if(!util.isUndefineForList(commentInfo)){
        comment = commentInfo[0].comment;
    }
    danka.comment = comment;
}

/* 檀家追加画面でtiku&sewaninボックスの表示の利用（get処理） */
function getMemberList(memberId, rows, callback){
    
    var query = client.query('select a.member_id, a.name_sei, a.name_na, a.furigana_sei, a.furigana_na, a.sex, b.danka_type, b.kaimyo, b.kaimyo_furigana, b.relation, a.tag, a.birthday_y, a.birthday_m, a.birthday_d, a.meinichi_y, a.meinichi_m, a.meinichi_d, b.sewa_code from m_member as a inner join t_danka as b on a.member_id = b.member_id where a.member_id = $1 and a.is_deleted = false and a.is_disabled = false and b.is_deleted = false',
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
