/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
 
var database = require("../../../dao/database");
var client = database.createClient();
var dbcommon = require("../../../dao/database_common");
var log = require("../../../util/logger");
var logger = log.createLogger();
var async = require('async');
var mMemberDao = require("../../../dao/mMemberDao");
var tDankaDao = require("../../../dao/tDankaDao");
var mCommentDao = require("../../../dao/mCommentDao");
var tDankaDetailKosyuDao = require("../../../dao/tDankaDetailKosyuDao");

/* 檀家追加画面メイン（post処理） */
exports.main = function (webItemJson, callback) {
    // いったんはpostで入ってきたデータは正しい想定で作る

    var memberId = webItemJson.member_id;
    var memberIdKosyu = webItemJson.member_id_kosyu;
    var isUpdateMMember = webItemJson.is_update_m_member;
    var isUpdateMMTiku = webItemJson.is_update_m_member_tiku;
    var isUpdateTDanka = webItemJson.is_update_t_danka;
    var isUpdateTComment = webItemJson.is_update_t_comment;
    var ratestMMemberInfo = [];
    var ratestTDankaInfo = [];
    var kosyuInfo = [];

    async.series([
    // 【START】トランザクション開始
        function (dbcallback) {
            dbcommon.dbBegin(client, database, dbcallback);
        },
    // T_xxxマスタを取得（戸主情報）
        function (dbcallback) {
            tDankaDetailKosyuDao.getTDankaDetailKosyuInfo(client, database, memberIdKosyu, kosyuInfo, dbcallback);
        },
    // メンバーマスタ削除（deleteFlag = true)
        function (dbcallback) {
            if (isUpdateMMember === "true") {
                mMemberDao.getMMember(client, database, memberId, ratestMMemberInfo, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // メンバーマスタ削除（deleteFlag = true)
        function (dbcallback) {
            if (isUpdateMMember === "true") {
                mMemberDao.updateMMemberForDeleteFlag(client, database, memberId, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // メンバーマスタ追加
        function (dbcallback) {
            if (isUpdateMMember === "true") {
                mergeMMemberInfo(ratestMMemberInfo, webItemJson);
                mMemberDao.insertMMember(client, database, memberId, webItemJson, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // 檀家マスタ最新レコード取得（deleteFlag = true)
        function (dbcallback) {
            if (isUpdateTDanka === "true") {
                tDankaDao.getTDanka(client, database, memberId, ratestTDankaInfo, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // 檀家マスタ削除（deleteFlag = true)
        function (dbcallback) {
            if (isUpdateTDanka === "true") {
                tDankaDao.updateTDankaForDeleteFlag(client, database, memberId, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // 檀家マスタ追加
        function (dbcallback) {
            if (isUpdateTDanka === "true") {
                // 必要な項目をretestTDankaInfo→webItemJsonにmergeする。
                mergeTDankaInfo(ratestTDankaInfo, webItemJson);
                tDankaDao.insertTDanka(client, database, memberId, webItemJson, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // コメントマスタ削除（deleteFlag = true)
        function (dbcallback) {
            if (isUpdateTComment === "true") {
                mCommentDao.updateTCommentForDeleteFlag(client, database, memberId, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // コメントマスタ追加
        function (dbcallback) {
            if (isUpdateTComment === "true") {
                mCommentDao.insertTComment(client, database, memberId, webItemJson, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // コメントマスタ追加
        function (dbcallback) {
            dbcommon.dbCommit(client, database, dbcallback);
        } ],
    // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                dbcommon.dbRollback(client, database, callback);
                return;
            }
            callback(false, kosyuInfo);
            return;
        }
    );
};

function mergeMMemberInfo(ratestMMemberInfo, webItemJson){
    var ratestMMember = ratestMMemberInfo[0];
    var jobCode = ratestMMember.job_code;
    var tag = ratestMMember.tag;

    webItemJson.job_code = jobCode;
    webItemJson.tag = tag;
    webItemJson.is_arive = 0;
}

function mergeTDankaInfo(ratestTDankaInfo, webItemJson){
    var ratestTdanka = ratestTDankaInfo[0];
    var sewaCode = ratestTdanka.sewa_code;
    var dankaType = ratestTdanka.danka_type;
    var memberIdKosyu = ratestTdanka.member_id_kosyu;
    var memberIdSou = ratestTdanka.member_id_sou;

    webItemJson.sewa_code = sewaCode;
    webItemJson.danka_type = dankaType;
    webItemJson.member_id_kosyu = memberIdKosyu;
    webItemJson.member_id_sou = memberIdSou;
}

