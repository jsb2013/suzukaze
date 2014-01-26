/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
 
var database = require("../dao/database");
var client = database.createClient();
var log = require("../util/logger");
var logger = log.createLogger();
var util = require("../util/util");
//var masterList = require("../conf/m_member")
var async = require("async");

/* 檀家追加画面メイン（post処理） */
exports.serchDankaFrom50onId = function (serchId, callback) {

    var convert50onJson = require("../conf/convert50on");
    // チェック用configの読み込み
    if(util.isUndefine(serchId)) {
        logger.error('XXXXXX', 'err =>' + err);
        callback(true);
        return;
    }

    var serchMoji = convertIdToMoji(serchId);
    
    function convertIdToMoji(serchId){
        


    } 
    validateBaseJson.size;

    // 入力データのNULLチェック（validateBaseJson）
    // "webItemJson"のチェックは特に行わず、以下データチェック関数で確認する。
    if (util.isUndefineForList(validTypeJson) || util.isUndefineForList(validSizeJson)) {
        // errorList追加
        return false;
    }

    // 入力データのエラー情報格納（Json）
    var errorJson = {};

    // 入力データの型チェック（同期）
    validateDataType(validTypeJson, webItemJson, errorJson);

    // 入力データのサイズのチェック（同期）
    validateDataSize(validTypeJson, webItemJson, errorJson);

    // 入力データチェックのエラー有無チェック（Error有りなら処理終了）
    if (util.isUndefineForList(errorJson)) {
        callback(true, false);
        return;
    }
    //var webItemJsonHosei = util.convertJsonNullToBlank(webItemJson);
    // 入力データを補正

    // 2.既に登録されているデータでないことを確認する。
    // （一応名前を検索して、名前を検索する。で、もし同じ名前があったら、確認画面に注意書きを追加しておく。）
    checkNameDuplicate(webItemJson, callback);
};

function checkNameDuplicate(webItemJson, callback) {
    var nameSei = webItemJson.name_sei;
    var nameNa = webItemJson.name_na;
    var query = client.query('select * from m_member where name_sei = $1 and name_na = $2', [nameSei, nameNa]);
    var rows = [];
        
    query.on('row', function(row) {
        rows.push(row);
    });
        
    query.on('end', function(row,err) {
        // エラーが発生した場合 -> Error
        if (err){
            logger.error('XXXXXX', 'err =>'+ err);
            callback(true, false);
            return;
        }
        // ユーザが存在する場合 -> Warning
        if (rows.length > 0) {
            logger.warn('XXXXX', 'warn =>'+ rows);
            callback(false, true, webItemJson);
            return;
        }
        // ユーザが存在しない場合 -> OK!
        callback(false, false, webItemJson);
        return;
    });
        
    query.on('error', function(error) {
        var errorMsg = util.getErrorMsg(error);
        logger.error('xxxxx', 'error => '+errorMsg);
        callback(true, false);
        return;
    });
}

/* 入力データの型チェック                                               */
/*                                                                      */
/* @baseList:    configに記載されたデータ型のバリデーション情報(json型) */
/* @webItemList: web画面で入力されたデータ(json型)                      */
/* @errorList:   エラー箇所を纏めたもの(json型)                         */
function validateDataType(validTypeJson, webItemJson, errorJson){
    var isError = false;
    for(var itemName in validTypeJson){
        var itemTypeJson = validTypeJson[itemName];
        for(var typeNum in itemTypeJson){
            var type = itemTypeJson[typeNum];
            var webItemType = webItemJson[itemName];
            if(type == "require"){
                if(util.isUndefine(webItemType)){
                  // Error（必要な値が設定されていない。）
                  isError = true;
                  logger.error('XXXXX', 'info =>'+ itemName + ', ' + webItemJson[itemName]);
                  break;
                }
                continue;
            }
            // NULLかをチェック（NULLでもOK）
            if(util.isUndefine(webItemType)){
                continue; // OK
            }
            // STRING型の確認
            if(type == "string"){
                if(!isNaN(webItemType)){
                  // Error（数値が設定されている。）
                  isError = true;
                  logger.error('XXXXX', 'info =>'+ itemName + ', ' + webItemJson[itemName]);
                  break;
                }
                continue;
            }
            // INTEGER型の確認
            if(type == "integer"){
                if(isNaN(webItemType)){
                    // Error（文字列が設定されている。）
                    isError = true;
                    logger.error('XXXXX', 'info =>'+ itemName + ', ' + webItemJson[itemName]);
                    break;
                }
                continue;
            }
            // Error（STRING型/INTEGER型以外が設定ファイルに含まれている。）
            isError = true;
            logger.error('XXXXX', 'info =>'+ itemName + ', ' + type);
            break;
        }
    }
    // エラー判別
    if (isError){
        errorJson[isError] = true;
        return;
    }
}

/* 入力データのサイズのチェック                                             */
/*                                                                          */
/* @baseList:    configに記載されたデータサイズのバリデーション情報(json型) */
/* @webItemList: web画面で入力されたデータ(json型)                          */
/* @errorList:   エラー箇所を纏めたもの(json型)                             */
function validateDataSize(validSizeJson, webItemJson, errorJson){
    var isError = false;
    for(var itemName in validSizeJson){
        var itemSize = validSizeJson[itemName];
        var webItemValue = webItemJson[itemName];
        if(util.isUndefine(webItemValue)){
            continue;
        }
        if(webItemValue.length < itemSize){
            // Error（実際のサイズが想定サイズ以上になっている。）
            isError = true;
            logger.error('XXXXX', 'info =>'+ itemName + ', ' + itemSize);
            continue;
        }
    }
    // エラー判別
    if (isError){
        errorJson[isError] = true;
        return;
    }
}

/* 檀家追加画面メイン（post処理） */
exports.updateDBFromWebItemJson = function(webItemJson, callback){
    // いったんはpostで入ってきたデータは正しい想定で作る
    // 
    var async = require('async');
    async.series([
        // 【START】トランザクション開始
        function (dbcallback) {
            dbBegin(dbcallback);
        },
        // メンバーマスタへ追加(insert m_member)
        function (dbcallback) {
            updateMMember(webItemJson, dbcallback);
        },
        // メンバーマスタのmember_idを取得する(select m_member)
        function (dbcallback) {
            getMemberId(webItemJson, dbcallback);
        },
        // 住所マスタへ追加(insert m_address)
        function (dbcallback) {
            updateMAddress(webItemJson, dbcallback);
        }],
        // メールマスタ(insert m_mail)
        //function (dbcallback) {
        ////    updateMMail(webItemJson, dbcallback);
        //},
        //// 電話番号マスタ(insert m_telnumber)
        //function (dbcallback) {
        //    updateMTelnumber(webItemJson, dbcallback);
        //},
        // メンバー役割関係管理マスタ追加(insert m_member_yakuwari)
        //function (dbcallback) {
        //    updateMMemberYakuwari(webItemJson, dbcallback);
        //},
        // メンバー地区関係管理マスタ追加(insert m_member_tiku)
        //function (dbcallback) {
        //    updateMMemberTiku(webItemJson, dbcallback);
        //},
        // 檀家間関係管理追加(insert t_danka)
        //function (dbcallback) {
        //    updateTDanka(webItemJson, dbcallback);
        // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                dbRollback(callback);
                return;
            }
            dbCommit(callback);
            return;
        }
    );
};

function updateMMember(webItemJson, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
    var name_sei = webItemJson.name_sei;
    var name_na = webItemJson.name_na;
    var furigana_sei = webItemJson.furigana_sei;
    var furigana_na = webItemJson.furigana_na;
    var sex = webItemJson.sex;
    var job_name = webItemJson.job_name;
    var birthday_y = webItemJson.birthday_y;
    var birthday_m = webItemJson.birthday_m;
    var birthday_d = webItemJson.birthday_d;
    
    var query = client.query('INSERT INTO m_member(name_sei, name_na, furigana_sei, furigana_na, sex, job_code, birthday_y, birthday_m, birthday_d, meinichi_y, meinichi_m, meinichi_d, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_disabled, is_deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,null,null,null,null,null,$10,now(),$11,now(),FALSE,FALSE)',
                    [name_sei, name_na, furigana_sei, furigana_na, sex, job_name, birthday_y, birthday_m, birthday_d, 'yamashita0284', 'yamashita0284']);
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
        }else{
            dbcallback(null);
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        dbcallback(new error());
        return;
    });
}

function getMemberId(webItemJson, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
    var name_sei = webItemJson.name_sei;
    var name_na = webItemJson.name_na;
    var furigana_sei = webItemJson.furigana_sei;
    var furigana_na = webItemJson.furigana_na;
    var sex = webItemJson.sex;
    var job_name = webItemJson.job_name;
    var birthday_y = webItemJson.birthday_y;
    var birthday_m = webItemJson.birthday_m;
    var birthday_d = webItemJson.birthday_d;
    var rows = [];
    
    var query = client.query('select member_id from m_member where name_sei=$1 and name_na=$2 and furigana_sei=$3 and furigana_na=$4 and sex=$5 and job_code=$6 and birthday_y=$7 and birthday_m=$8 and birthday_d=$9 and is_disabled=false and is_deleted=false',
                    [name_sei, name_na, furigana_sei, furigana_na, sex, job_name, birthday_y, birthday_m, birthday_d]);

    query.on('row', function(row) {
        rows.push(row);
    });
    
    query.on('end', function(row,err) {
        // エラーが発生した場合
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
            return;
        }
        // 存在する場合
        if (rows.length === 1) {
            var db_info = rows[0];
            var memberId = db_info.member_id;
            webItemJson.member_id = memberId;
            dbcallback(null);
            return;
        }
        // 存在する場合
        if (rows.length !== 1) {
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(new Error());
            return;
        }        
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        dbcallback(new Error());
        return;
    });
}

function updateMAddress(webItemJson, dbcallback){
    // 柔軟にしようと思ったけど、結局運用に乗せても大して変わらない&それほど共通化する要素でもない&配列とかで直感的にわかりづらいことから、自力でがんばる系にした。
    var member_id = webItemJson.member_id;
    var priority = 1;
    var zip_code_pre = webItemJson.zip_code_pre;
    var zip_code_last = webItemJson.zip_code_last;
    var region = webItemJson.region;
    var city = webItemJson.city;
    var address_line1 = webItemJson.address_line1;
    var address_line2 = webItemJson.address_line2;
    var yoto = null;
    
    var query = client.query('INSERT INTO m_address(member_id, priority, zip_code_pre, zip_code_last, region, city, address_line1, address_line2, yoto, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_disabled, is_deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, null, null,$10,now(),$11,now(),FALSE,FALSE)',
                    [member_id, priority, zip_code_pre, zip_code_last, region, city, address_line1, address_line2, yoto, 'yamashita0284', 'yamashita0284']);

    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
        }else{
            dbcallback(null);
        }
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        // これでよいのかな？
        dbcallback(new error());
        return;
    });
}

/* postgresのトランザクション開始 */
function dbBegin(dbcallback){
    var query = client.query('begin');
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            dbcallback(err);
        }
        dbcallback(null);
        return;
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        dbcallback(true);
        return;
    });
}

/* postgresのトランザクション完了（rollback） */
function dbRollback(callback){
    var query = client.query('rollback');
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            callback(true);
        }
        callback(false);
        return;
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        callback(true);
        return;
    });
}

/* postgresのトランザクション完了（commit） */
function dbCommit(callback){
    var query = client.query('commit');
    
    query.on('end', function(row,err) {
        if (err){
            logger.error('xxxx', 'err =>'+ err);
            callback(true);
        }
        callback(false);
        return;
    });
    
    query.on('error', function(error) {
        var errorMsg = database.getErrorMsg(error);
        logger.error('xxxx', 'error => '+errorMsg);
        callback(true);
        return;
    });
}