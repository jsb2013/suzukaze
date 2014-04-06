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
var mCommentDao = require("../../../dao/mCommentDao");
var mMemberDao = require("../../../dao/mMemberDao");
var mSewaCodeDao = require("../../../dao/mSewaCodeDao");
var mTikuCodeDao = require("../../../dao/mTikuCodeDao");
var mAddressDao = require("../../../dao/mAddressDao");
var mMailDao = require("../../../dao/mMailDao");
var mTelnumberDao = require("../../../dao/mTelnumberDao");
var mTagsDao = require("../../../dao/mTagsDao");

/* 檀家追加画面メイン（post処理） */
exports.main = function (webItemJson, callback) {
    // いったんはpostで入ってきたデータは正しい想定で作る
    var memberId = webItemJson.member_id;
    var tikuCodeInfo = [];
    var sewaCodeInfo = [];
    var addressInfo = [];
    var mailInfo = [];
    var commentInfo = [];
    var telnumberInfo = [];
    var kosyuInfo = [];
    var tagsInfo = [];

    async.series([

    // 地区コードマスタを取得
        function (dbcallback) {
            mTikuCodeDao.getMTikuCode(client, database, tikuCodeInfo, dbcallback);
        },
    // 世話コードマスタを取得
        function (dbcallback) {
            mSewaCodeDao.getMSewaCode(client, database, sewaCodeInfo, dbcallback);
        },
    // 住所マスタを取得
        function (dbcallback) {
            mAddressDao.getAddressInfoByMemberIdAndPriority(client, database, memberId, 1, addressInfo, dbcallback);
        },
    // メールマスタを取得
        function (dbcallback) {
            mMailDao.getMailInfoByMemberId(client, database, memberId, mailInfo, dbcallback);
        },
    // 電話番号マスタを取得
        function (dbcallback) {
            mTelnumberDao.getTelnumberInfoByMemberId(client, database, memberId, telnumberInfo, dbcallback);
        },
    // T_xxxマスタを取得
        function (dbcallback) {
            tDankaDetailKosyuDao.getTDankaDetailKosyuInfoByMemberId(client, database, memberId, kosyuInfo, dbcallback);
        },
    // コメントマスタを取得
        function (dbcallback) {
            mCommentDao.getTCommentByMemberId(client, database, memberId, commentInfo, dbcallback);
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

            // 住所情報をpriority順に並び替える。
            convertInfoByPriority(addressInfo);

            // メール情報をpriority順に並び替える。
            convertInfoByPriority(mailInfo);

            // 電話番号情報をpriority順に並び替える。
            convertInfoByPriority(telnumberInfo);

            // 仕事名称とコメントをwebitemJsonに登録
            // ※本内容は「danka_detail_kihon」内では使用しないが、その後「danka_detail_kihon_confirm」で使用する為、
            registerNama(kosyuInfo, commentInfo);

            var tagNameListInMM = util.splitStringByDelimiter(kosyuInfo[0].tags, ",");

            callback(false, kosyuInfo, tikuCodeInfo, sewaCodeInfo, addressInfo, mailInfo, telnumberInfo, tagsInfo, tagNameListInMM);
            return;
        }
    );
};

function registerNama(kosyuInfo, commentInfo){
    // コメントを登録
    var comment = "";
    if(!util.isUndefineForList(commentInfo)){
        comment = commentInfo[0].comment;
    }
    kosyuInfo[0].comment = comment;
}

function convertInfoByPriority(infoJson){
    var priorityInfo1 = {};
    var priorityInfo2 = {};
    var priorityInfo3 = {};
    
    for(var key in infoJson){
        var line = infoJson[key];
        var priority = line.priority;
        if(priority === 1){
            priorityInfo1 = line;
            continue;
        }
        if(priority === 2){
            priorityInfo2 = line;
            continue;
        }
        if(priority === 3){
            priorityInfo3 = line;
            continue;
        }
    }
    infoJson[0] = priorityInfo1;
    infoJson[1] = priorityInfo2;
    infoJson[2] = priorityInfo3;
}
