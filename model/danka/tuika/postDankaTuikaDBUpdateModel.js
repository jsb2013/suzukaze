/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
 
var database = require("../../../dao/database");
var client = database.createClient();
var dbcommon = require("../../../dao/database_common");
var mMemberDao = require("../../../dao/mMemberDao");
var tDankaDao = require("../../../dao/tDankaDao");
var mCommentDao = require("../../../dao/mCommentDao");
var mAddressDao = require("../../../dao/mAddressDao");
var mMailDao = require("../../../dao/mMailDao");
var mTelnumberDao = require("../../../dao/mTelnumberDao");
var async = require('async');

/* 檀家追加画面メイン（post処理） */
exports.main = function (webItemJson, callback) {
    // いったんはpostで入ってきたデータは正しい想定で作る

    var memberIdInfo = [];
    var memberId = "";

    async.series([
    // 【START】トランザクション開始
    function (dbcallback) {
        dbcommon.dbBegin(client, database, dbcallback);
    },
    // メンバーマスタへ追加(insert m_member)
    function (dbcallback) {
        mergeMMemberInfoDefault(webItemJson);
        mMemberDao.insertMMemberNotMemberId(client, database, webItemJson, dbcallback);
    },
    // メンバーマスタのmember_idを取得する(select m_member)
    function (dbcallback) {
        mMemberDao.getMMemberForMemberIdByName(client, database, webItemJson, memberIdInfo, dbcallback);
    },
    // 住所マスタへ追加(insert m_address)
    function (dbcallback) {
        memberId = memberIdInfo[0].member_id;
        mAddressDao.insertMAddress(client, database, 1, memberId, webItemJson, dbcallback);
    },
    // メールマスタ(insert m_mail)
    function (dbcallback) {
        mMailDao.insertMMail(client, database, 1, memberId, webItemJson, dbcallback);
    },
    // メールマスタ(insert m_mail)
    function (dbcallback) {
        mMailDao.insertMMail(client, database, 2, memberId, webItemJson, dbcallback);
    },
    // メールマスタ(insert m_mail)
    function (dbcallback) {
        mMailDao.insertMMail(client, database, 3, memberId, webItemJson, dbcallback);
    },
    // 電話番号マスタ(insert m_telnumber)
    function (dbcallback) {
        mTelnumberDao.insertMTelnumber(client, database, 1, memberId, webItemJson, dbcallback);
    },
    // 電話番号マスタ(insert m_telnumber)
    function (dbcallback) {
        mTelnumberDao.insertMTelnumber(client, database, 2, memberId, webItemJson, dbcallback);
    },
    // 電話番号マスタ(insert m_telnumber)
    function (dbcallback) {
        mTelnumberDao.insertMTelnumber(client, database, 3, memberId, webItemJson, dbcallback);
    },
    // 檀家間関係管理追加(insert t_danka)
    function (dbcallback) {
        mergeTDankaInfoDefault(webItemJson, memberId);
        tDankaDao.insertTDanka(client, database, memberId, webItemJson, dbcallback);
    },
    // 檀家間関係管理追加(insert t_danka)
    function (dbcallback) {
        mCommentDao.insertTComment(client, database, memberId, webItemJson, dbcallback);
    } ],
    // 【END】トランザクション完了(commit or rollback)
    function (err, results) {
        if (err) {
            dbcommon.dbRollback(client, database, callback);
            return;
        }
        dbcommon.dbCommit(client, database, callback);
        return;
    }
    );
};

function mergeMMemberInfoDefault(baseInfo){

    baseInfo.sex = 0;
    baseInfo.is_arive = 1;
    baseInfo.meinichi_y = "";
    baseInfo.meinichi_m = "";
    baseInfo.meinichi_d = "";
}

function mergeTDankaInfoDefault(baseInfo, memberId){
    // 最新のレコード情報
    baseInfo.kaimyo = "";
    baseInfo.member_id_kosyu = memberId;
    baseInfo.kaimyo_furigana = "";
    baseInfo.sesyu_sei = "";
    baseInfo.sesyu_na = "";
    baseInfo.relation = "";
}