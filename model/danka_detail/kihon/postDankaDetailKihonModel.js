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
var mJobCodeDao = require("../../../dao/mJobCodeDao");
var mAddressDao = require("../../../dao/mAddressDao");
var mMailDao = require("../../../dao/mMailDao");
var mTelnumberDao = require("../../../dao/mTelnumberDao");
var mTagsDao = require("../../../dao/mTagsDao");

/* 檀家追加画面メイン（post処理） */
exports.main = function (webItemJson, callback) {
    // いったんはpostで入ってきたデータは正しい想定で作る
    var memberId = webItemJson.member_id;
    var tikuCodeInfo = [];
    var jobCodeInfo = [];
    var sewaCodeInfo = [];
    var addressInfo = [];
    var mailInfo = [];
    var commentInfo = [];
    var telnumberInfo = [];
    var souMemberIdInfo = [];
    var kosyuInfo = [];
    var tagsInfo = [];

    async.series([

    // 仕事コードマスタを取得
        function (dbcallback) {
            mJobCodeDao.getMJobCode(client, database, jobCodeInfo, dbcallback);
        },
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
    // [TBA] 住所、メールを取得する。
    // メンバーマスタから僧のリストを取得
        function (dbcallback) {
            mMemberDao.getSouMemberIdInfo(client, database, souMemberIdInfo, dbcallback);
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

            // 仕事名称と担当[僧]とコメントをwebitemJsonに登録
            // ※本内容は「danka_detail_kihon」内では使用しないが、その後「danka_detail_kihon_confirm」で使用する為、
            // ※事前に取得しておく。（jobcode,memberIdSouを変更した場合の、変更前名称。必要な時に取得するとDBアクセスが発生する為）
            registerNama(kosyuInfo, jobCodeInfo, souMemberIdInfo, commentInfo);

            var tagNameListInMM = util.splitStringByDelimiter(kosyuInfo[0].tags, ",");

            callback(false, kosyuInfo, jobCodeInfo, tikuCodeInfo, sewaCodeInfo, addressInfo, mailInfo, telnumberInfo, souMemberIdInfo, tagsInfo, tagNameListInMM);
            return;
        }
    );
};

function registerNama(kosyuInfo, jobCodeInfo, souMemberIdInfo, commentInfo){
    var jobCode = kosyuInfo[0].job_code;
    var memberIdSou = kosyuInfo[0].member_id_sou;
    
    // 仕事名を登録
    for(var key in jobCodeInfo){
        var _line = jobCodeInfo[key];
        var _jobCode = _line.job_code;
        if(jobCode == _jobCode){
            var jobName = _line.job_name;
            kosyuInfo[0].job_name = jobName;
            break;
        }
    }    
    // 担当[僧]を登録
    for(var key in souMemberIdInfo){
        var _line = souMemberIdInfo[key];
        var _memberIdSou = _line.member_id;
        if(memberIdSou == _memberIdSou){
            var souNameSei = _line.name_sei;
            var souNameNa = _line.name_na;
            kosyuInfo[0].sou_name_sei = souNameSei;
            kosyuInfo[0].sou_name_na = souNameNa;
            break;
        }
    } 
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
