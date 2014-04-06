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
var mTagsDao = require("../../../dao/mTagsDao");

/* 檀家追加画面メイン（post処理） */
exports.main = function (webItemJson, callback) {
    // いったんはpostで入ってきたデータは正しい想定で作る
    var memberId = webItemJson.selected_member_id;
    var memberIdKosyu = webItemJson.member_id_kosyu;
    var dankaInfo = [];
    var commentInfo = [];
    var kosyuInfo = [];
    var tagsInfo = [];

    async.series([
    // 檀家マスタを取得（過去帳で指定したメンバー分）レコードは必ず1件含まれる。
        function (dbcallback) {
            getKakoMemberInfo(memberId, dankaInfo, dbcallback);
        },
    // コメントマスタを取得（過去帳で指定したメンバー分）
        function (dbcallback) {
            mCommentDao.getTCommentByMemberId(client, database, memberId, commentInfo, dbcallback);
        },
    // T_xxxマスタを取得（戸主情報）
        function (dbcallback) {
            tDankaDetailKosyuDao.getTDankaDetailKosyuInfoByMemberId(client, database, memberIdKosyu, kosyuInfo, dbcallback);
        },
    // タグ情報を取得（戸主情報）
        function (dbcallback) {
            mTagsDao.getMTags(client, database, tagsInfo, dbcallback);
        } ],
    // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            //var tagsIdListInMM = convertTagsToTagsId(tagsInfo, dankaInfo);
            var tagNameListInMM = util.splitStringByDelimiter(dankaInfo[0].tags, ",");
            addCommentToDankaInfo(dankaInfo, commentInfo);
            callback(false, kosyuInfo, dankaInfo, tagsInfo, tagNameListInMM);
            return;
        }
    );
};

function convertTagsToTagsId(tagsInfo, dankaInfo){
    var tags = dankaInfo[0].tags;
    var tagsInfoInMM = tags.split(",");
    var tagsIdListMM = [];

    for(var tagsNameInMM in tagsInfoInMM){
        var _tagsNameInMM = tagsInfoInMM[tagsNameInMM];
        for(var key in tagsInfo){
            var _tagsInfo = tagsInfo[key];
            var _tagsId = _tagsInfo.tags_id;
            var _tagsName = _tagsInfo.tags;
            if(_tagsNameInMM == _tagsName){
                tagsIdListMM.push(_tagsId);
                break;
            }
        }
    }
    return tagsIdListMM;
}

function addCommentToDankaInfo(dankaInfo, commentInfo){
    var danka = dankaInfo[0];

    // コメントを登録
    var comment = "";
    if(!util.isUndefineForList(commentInfo)){
        comment = commentInfo[0].comment;
    }
    danka.comment = comment;
}

/* 過去帳に該当するリストを取得 */
function getKakoMemberInfo(memberId, rows, dbcallback){
    var isDbError = false;
    var query = client.query('select mm.member_id, mm.name_sei, mm.name_na, mm.furigana_sei, mm.furigana_na, td.kaimyo, td.kaimyo_furigana, td.relation, mm.tags, mm.birthday_y, mm.birthday_m, mm.birthday_d, mm.meinichi_y, mm.meinichi_m, mm.meinichi_d, td.kyonen, td.sesyu_sei, td.sesyu_na from m_member as mm inner join t_danka as td on mm.member_id = td.member_id where mm.member_id = $1 and mm.is_deleted = false and mm.is_disabled = false and td.is_deleted = false',
                    [memberId]);

    query.on('row', function(row) {
        rows.push(row);
    });
    
    query.on('end', function(row,err) {
        // エラーが発生した場合
        if (err) {
            logger.error('xxxx', 'err =>' + err);
            dbcallback(err);
            return;
        }
        // 1件存在する場合=正しい
        if (rows.length === 1) {
            util.convertJsonNullToBlankForAllItem(rows);
            dbcallback(null);
            return;
        }
        // DBエラーの場合
        if (isDbError) {
            return;
        }
        // 件数が存在しない場合=requestがmemberIDなので有り得ない→不正電文の可能性
        // 複数検出の場合=DBに複数memberID登録不可なので有り得ない→要調査。
        logger.error('xxxx', 'err =>' + err);
        dbcallback(new Error());
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
