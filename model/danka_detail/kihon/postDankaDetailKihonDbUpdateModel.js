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
var mMemberTikuDao = require("../../../dao/mMemberTikuDao");
var tDankaDetailKosyuDao = require("../../../dao/tDankaDetailKosyuDao");

/* 檀家追加画面メイン（post処理） */
exports.main = function (webItemJson, callback) {
    // いったんはpostで入ってきたデータは正しい想定で作る

    var memberId = webItemJson.member_id;
    var isUpdateMMember = webItemJson.is_update_m_member;
    var isUpdateMMTiku = webItemJson.is_update_m_member_tiku;
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
                // 必要な項目をratestMMemberInfo→webItemJsonにmergeする。
                mergeMMemberInfo(ratestMMemberInfo, webItemJson);
                mMemberDao.insertMMember(client, database, memberId, webItemJson, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // 住所マスタ削除（deleteFlag = true)
        function (dbcallback) {
            if (isUpdateMMember === "true") {
                mAddressDao.updateMAddressForDeleteFlag(client, database, 1, memberId, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // 住所マスタ追加
        function (dbcallback) {
            if (isUpdateMMember === "true") {
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
    // Eメールマスタ2追加
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
    // メンバー地区関係管理マスタ削除（deleteFlag = true)
        function (dbcallback) {
            if (isUpdateMMTiku === "true") {
                mMemberTikuDao.updateMMemberTikuForDeleteFlag(client, database, memberId, webItemJson, dbcallback);
            } else {
                dbcallback(null);
            }
        },
    // メンバー地区関係管理マスタ追加
        function (dbcallback) {
            if (isUpdateMMTiku === "true") {
                mMemberTikuDao.insertMMemberTiku(client, database, memberId, webItemJson, dbcallback);
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
    // メンバーマスタ追加
        function (dbcallback) {
            tDankaDetailKosyuDao.getTDankaDetailKosyuInfo(client, database, memberId, ratestTDankaDetailKosyuInfo, dbcallback);
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
    var ratestMMember = ratestMMemberInfo[0];
    var meinichiY = ratestMMember.meinichi_y;
    var meinichiM = ratestMMember.meinichi_m;
    var meinichiD = ratestMMember.meinichi_d;
    var tag = ratestMMember.tag;
    var isArive = ratestMMember.is_arive;

    webItemJson.meinichi_y = meinichiY;
    webItemJson.meinichi_m = meinichiM;
    webItemJson.meinichi_d = meinichiD;
    webItemJson.tag = tag;
    webItemJson.is_arive = isArive;
}

function mergeTDankaInfo(ratestTDankaInfo, webItemJson){
    var ratestTdanka = ratestTDankaInfo[0];
    var kaimyo = ratestTdanka.kaimyo;
    var kaimyoFurigana = ratestTdanka.kaimyo_furigana;
    var memberIdKosyu = ratestTdanka.member_id_kosyu;
    var relation = ratestTdanka.relation;

    webItemJson.kaimyo = kaimyo;
    webItemJson.kaimyo_furigana = kaimyoFurigana;
    webItemJson.relation = relation;
    webItemJson.member_id_kosyu = memberIdKosyu;
}
