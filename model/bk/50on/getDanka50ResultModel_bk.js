/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
 
var database = require("../../../dao/database");
var client = database.createClient();
var dbcommon = require("../../../dao/database_common");
var log = require("../../../util/logger");
var logger = log.createLogger();
var util = require("../../../util/util");
var async = require("async");
var mSewaCodeDao = require("../../../dao/mSewaCodeDao");
var mTikuCodeDao = require("../../../dao/mTikuCodeDao");

/* 檀家追加画面メイン（post処理） */
exports.main = function (searchId, callback) {

    // チェック用configの読み込み
    if (util.isUndefine(searchId)) {
        logger.error('XXXXXX', 'err =>' + searchId);
        callback(true);
        return;
    }

    // チェック文字の変換
    var searchMoji = convertIdToMoji(searchId);
    if (!searchMoji) {
        callback(true);
        return;
    }

    var resultRows = [];
    var tikuList = [];
    var sewaList = [];
    async.series([

    // 地区コードマスタを取得する
        function (dbcallback) {
            mTikuCodeDao.getMTikuCode(client, database, tikuList, dbcallback);
        },
    // 世話コードマスタを取得する
        function (dbcallback) {
            mSewaCodeDao.getMSewaCode(client, database, sewaList, dbcallback);
        },
    // 檀家検索結果取得（50音検索）
        function (dbcallback) {
            getDankaResultFromDB(searchMoji, resultRows, dbcallback);
        } ],
    // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            var tikuInfoJson = convertTikuListToJson(tikuList);
            if (!tikuInfoJson) {
                callback(true);
            }
            var sewaInfoJson = convertSewaListToJson(sewaList);
            if (!sewaInfoJson) {
                callback(true);
            }
            callback(false, resultRows, tikuInfoJson, tikuList, sewaInfoJson, sewaList, searchMoji);
            return;
        }
    );
};

function convertIdToMoji(searchId) {
    var convert50on = require("../conf/convert50on");

    var searchMoji = convert50on[searchId];
    if (util.isUndefine(searchMoji)) {
        logger.error('XXXXXX', 'err =>' + searchId);
        return false;
    }
    return searchMoji;
}

function convertTikuListToJson(tikuList) {
    var tikuInfoJson = {};
    for(var i in tikuList){
        var tikuCode = tikuList[i].tiku_code;
        var tikuName = tikuList[i].tiku_name;
        tikuInfoJson[tikuCode] = tikuName;
    }
    return tikuInfoJson;
}

function convertSewaListToJson(sewaList) {
    var sewaInfoJson = {};
    for(var i in sewaList){
        var sewaCode = sewaList[i].sewa_code;
        var sewaName = sewaList[i].sewa_name;
        sewaInfoJson[sewaCode] = sewaName;
    }
    return sewaInfoJson;
}

function getDankaResultFromDB(searchMoji, resultRows, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。 
    var isDbError = false;
    var query = client.query('select mm1.member_id, mm1.name_sei, mm1.name_na, mm1.is_arive, td.danka_type, td.sewa_code, td.tiku_code, mm2.name_sei as name_sei_kosyu, mm2.name_na as name_na_kosyu, mm2.member_id as member_id_kosyu from (m_member as mm1 inner join t_danka as td on mm1.member_id = td.member_id) inner join m_member as mm2 on td.member_id_kosyu = mm2.member_id where mm1.is_disabled=false and mm1.is_deleted=false and mm2.is_disabled=false and mm2.is_deleted=false and td.is_deleted=false and (mm1.furigana_sei like $1 or mm1.furigana_na like $1) order by mm1.member_id',
                    [searchMoji + '%']);

    query.on('row', function(row) {
        resultRows.push(row);
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
