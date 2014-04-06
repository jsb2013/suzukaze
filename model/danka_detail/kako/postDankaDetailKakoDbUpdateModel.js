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
var util = require("../../../util/util");

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
            tDankaDetailKosyuDao.getTDankaDetailKosyuInfoByMemberId(client, database, memberIdKosyu, kosyuInfo, dbcallback);
        },
    // メンバーマスタ削除（deleteFlag = true)
        function (dbcallback) {
            if (isUpdateMMember === "true") {
                mMemberDao.getMMemberByMemberId(client, database, memberId, ratestMMemberInfo, dbcallback);
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
                mMemberDao.insertMMember(client, database, memberId, ratestMMemberInfo[0], dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // 檀家マスタ最新レコード取得（deleteFlag = true)
        function (dbcallback) {
            if (isUpdateTDanka === "true") {
                tDankaDao.getTDankaByMemberId(client, database, memberId, ratestTDankaInfo, dbcallback);
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
                tDankaDao.insertTDanka(client, database, memberId, ratestTDankaInfo[0], dbcallback);
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
    // 最新のレコード情報
    var ratestMMember = ratestMMemberInfo[0];

    // 画面から更新した可能性のある項目
    var nameSei = webItemJson.name_sei;
    var nameNa = webItemJson.name_na;
    var furiganaSei = webItemJson.furigana_sei;
    var furiganaNa = webItemJson.furigana_na;
    var birthdayY = webItemJson.birthday_y;
    var birthdayM = webItemJson.birthday_m;
    var birthdayD = webItemJson.birthday_d;
    var meinichiY = webItemJson.meinichi_y;
    var meinichiM = webItemJson.meinichi_m;
    var meinichiD = webItemJson.meinichi_d;
    var tags = webItemJson.tags;

    // 最新のレコードに更新した可能性のある項目をマージ
    ratestMMember.name_sei = nameSei;
    ratestMMember.name_na = nameNa;
    ratestMMember.furigana_sei = furiganaSei;
    ratestMMember.furigana_na = furiganaNa;
    ratestMMember.birthday_y = birthdayY;
    ratestMMember.birthday_m = birthdayM;
    ratestMMember.birthday_d = birthdayD;
    ratestMMember.meinichi_y = meinichiY;
    ratestMMember.meinichi_m = meinichiM;
    ratestMMember.meinichi_d = meinichiD;
    ratestMMember.tags = tags;
}

function mergeTDankaInfo(ratestTDankaInfo, webItemJson){
    // 最新のレコード情報
    var ratestTdanka = ratestTDankaInfo[0];

    // 画面から更新した可能性のある項目
    var kaimyo = webItemJson.kaimyo;
    var kaimyoFurigana = webItemJson.kaimyo_furigana;
    var sesyuSei = webItemJson.sesyu_sei;
    var sesyuNa = webItemJson.sesyu_na;
    var relation = webItemJson.relation;

    // 最新のレコードに更新した可能性のある項目をマージ
    ratestTdanka.kaimyo = kaimyo;
    ratestTdanka.kaimyo_furigana = kaimyoFurigana;
    ratestTdanka.sesyu_sei = sesyuSei;
    ratestTdanka.sesyu_na = sesyuNa;
    ratestTdanka.relation = relation;
}

