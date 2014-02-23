/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
 
var database = require("../dao/database");
var client = database.createClient();
var dbcommon = require("../dao/database_common");
var log = require("../util/logger");
var logger = log.createLogger();
var util = require("../util/util");
var async = require("async");

/* 檀家追加画面メイン（post処理） */
exports.main = function (searchId, callback) {

    // チェック用configの読み込み
    if (util.isUndefine(searchId)) {
        logger.error('XXXXXX', 'err =>' + searchId);
        callback(true);
        return;
    }

    // チェック文字の変換（参照型じゃない気がするけど挑戦！）
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
            getTikuCode(tikuList, dbcallback);
        },
    // 世話コードマスタを取得する
        function (dbcallback) {
            getSewaCode(sewaList, dbcallback);
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
    var query = client.query('select mm1.member_id, mm1.name_sei, mm1.name_na, mm1.meinichi_y, mmt.tiku_code, td.danka_type, td.sewa_code as sewa_code, mm2.name_sei as name_sei_kosyu, mm2.name_na as name_na_kosyu, mm2.member_id as member_id_kosyu, td.sewa_code from ((m_member as mm1 inner join m_member_tiku as mmt on mm1.member_id = mmt.member_id) inner join t_danka as td on mm1.member_id = td.member_id) inner join m_member as mm2 on td.member_id_kosyu = mm2.member_id where mm1.is_disabled=false and mm1.is_deleted=false and mmt.is_disabled=false and mmt.is_deleted=false and mm2.is_disabled=false and mm2.is_deleted=false and td.is_deleted=false and mm1.furigana_sei like $1 order by mm1.member_id',
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
        dbcallback(null);
        return;
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        dbcallback(new Error());
        return;
    });
}

function getTikuCode(tikuList, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
    var query = client.query('select tiku_code, tiku_name from m_tiku_code where is_disabled=false and is_deleted=false');

    query.on('row', function(row) {
        tikuList.push(row);
    });
    
    query.on('end', function(row,err) {
        // エラーが発生した場合
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
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
        return;
    });
}

function getSewaCode(sewaList, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
    var query = client.query('select sewa_code, sewa_name from m_sewa_code where is_disabled=false and is_deleted=false');

    query.on('row', function(row) {
        sewaList.push(row);
    });
    
    query.on('end', function(row,err) {
        // エラーが発生した場合
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
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
        return;
    });
}