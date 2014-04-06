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
var mAddressDao = require("../../../dao/mAddressDao");
var mMailDao = require("../../../dao/mMailDao");
var mTelnumberDao = require("../../../dao/mTelnumberDao");
var tDankaDetailKosyuDao = require("../../../dao/tDankaDetailKosyuDao");
var util = require("../../../util/util");

/* 檀家追加画面メイン（post処理） */
exports.main = function (webItemJson, callback) {
    // いったんはpostで入ってきたデータは正しい想定で作る

    var memberId = webItemJson.member_id;
    var isUpdateMMember = webItemJson.is_update_m_member;
    var isUpdateMAddress = webItemJson.is_update_m_address;
    var isUpdateMtelnumber1 = webItemJson.is_update_m_telnumber_1;
    var isUpdateMtelnumber2 = webItemJson.is_update_m_telnumber_2;
    var isUpdateMtelnumber3 = webItemJson.is_update_m_telnumber_3;
    var isUpdateMMail1 = webItemJson.is_update_m_mail_1;
    var isUpdateMMail2 = webItemJson.is_update_m_mail_2;
    var isUpdateMMail3 = webItemJson.is_update_m_mail_3;
    var isUpdateTDanka = webItemJson.is_update_t_danka;
    var isUpdateTComment = webItemJson.is_update_t_comment;
    var ratestMMemberInfo = [];
    var ratestTDankaInfo = [];
    var ratestTDankaDetailKosyuInfo = [];

    async.series([
    // 【START】トランザクション開始
        function (dbcallback) {
            dbcommon.dbBegin(client, database, dbcallback);
        },
    // マスタ最新レコード取得（deleteFlag = true)
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
                // 必要な項目をratestMMemberInfo→webItemJsonにmergeする。
                mergeMMemberInfo(ratestMMemberInfo, webItemJson);
                mMemberDao.insertMMember(client, database, memberId, ratestMMemberInfo[0], dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // 住所マスタ削除（deleteFlag = true)
        function (dbcallback) {
            if (isUpdateMAddress === "true") {
                mAddressDao.updateMAddressForDeleteFlag(client, database, 1, memberId, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // 住所マスタ追加
        function (dbcallback) {
            if (isUpdateMAddress === "true") {
                mAddressDao.insertMAddress(client, database, 1, memberId, webItemJson, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // Eメールマスタ削除1（deleteFlag = true)
        function (dbcallback) {
            if (isUpdateMMail1 === "true") {
                mMailDao.updateMMailForDeleteFlag(client, database, 1, memberId, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // Eメールマスタ1追加
        function (dbcallback) {
            if (isUpdateMMail1 === "true") {
                mMailDao.insertMMail(client, database, 1, memberId, webItemJson, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // Eメールマスタ2削除（deleteFlag = true)
        function (dbcallback) {
            if (isUpdateMMail2 === "true") {
                mMailDao.updateMMailForDeleteFlag(client, database, 2, memberId, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // Eメールマスタ2追加
        function (dbcallback) {
            if (isUpdateMMail2 === "true") {
                mMailDao.insertMMail(client, database, 2, memberId, webItemJson, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // Eメールマスタ3削除（deleteFlag = true)
        function (dbcallback) {
            if (isUpdateMMail3 === "true") {
                mMailDao.updateMMailForDeleteFlag(client, database, 3, memberId, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // Eメールマスタ3追加
        function (dbcallback) {
            if (isUpdateMMail3 === "true") {
                mMailDao.insertMMail(client, database, 3, memberId, webItemJson, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // 電話番号マスタ1削除（deleteFlag = true)
        function (dbcallback) {
            if (isUpdateMtelnumber1 === "true") {
                mTelnumberDao.updateMTelnumberForDeleteFlag(client, database, 1, memberId, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // 電話番号マスタ1追加
        function (dbcallback) {
            if (isUpdateMtelnumber1 === "true") {
                mTelnumberDao.insertMTelnumber(client, database, 1, memberId, webItemJson, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // 電話番号マスタ2削除（deleteFlag = true)
        function (dbcallback) {
            if (isUpdateMtelnumber2 === "true") {
                mTelnumberDao.updateMTelnumberForDeleteFlag(client, database, 2, memberId, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // 電話番号マスタ2追加
        function (dbcallback) {
            if (isUpdateMtelnumber2 === "true") {
                mTelnumberDao.insertMTelnumber(client, database, 2, memberId, webItemJson, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // 電話番号マスタ3削除（deleteFlag = true)
        function (dbcallback) {
            if (isUpdateMtelnumber3 === "true") {
                mTelnumberDao.updateMTelnumberForDeleteFlag(client, database, 3, memberId, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // 電話番号マスタ3追加
        function (dbcallback) {
            if (isUpdateMtelnumber3 === "true") {
                mTelnumberDao.insertMTelnumber(client, database, 3, memberId, webItemJson, dbcallback);
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
    // メンバーマスタ追加
        function (dbcallback) {
            tDankaDetailKosyuDao.updateTDankaDetailKosyuForDeleteFlag(client, database, memberId, dbcallback);
        },
    // メンバーマスタ追加
        function (dbcallback) {
            tDankaDetailKosyuDao.insertTDankaDetailKosyuInfo(client, database, memberId, webItemJson, dbcallback);
        }],
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
    var job = webItemJson.job;
    var tags = webItemJson.tags;

    // 最新のレコードに更新した可能性のある項目をマージ
    ratestMMember.name_sei = nameSei;
    ratestMMember.name_na = nameNa;
    ratestMMember.furigana_sei = furiganaSei;
    ratestMMember.furigana_na = furiganaNa;
    ratestMMember.birthday_y = birthdayY;
    ratestMMember.birthday_m = birthdayM;
    ratestMMember.birthday_d = birthdayD;
    ratestMMember.job = job;
    ratestMMember.tags = tags;
}

function mergeTDankaInfo(ratestTDankaInfo, webItemJson){
    // 最新のレコード情報
    var ratestTdanka = ratestTDankaInfo[0];

    // 画面から更新した可能性のある項目
    var dankaType = webItemJson.danka_type;
    var sewaCode = webItemJson.sewa_code;
    var tikuCode = webItemJson.tiku_code;
    var jiin = webItemJson.jiin;

    // 最新のレコードに更新した可能性のある項目をマージ
    ratestTdanka.danka_type = dankaType;
    ratestTdanka.sewa_code = sewaCode;
    ratestTdanka.jiin = jiin;
}
