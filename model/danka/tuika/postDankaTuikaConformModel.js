/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
 
var database = require("../dao/database");
var client = database.createClient();
var log = require("../util/logger");
var logger = log.createLogger();
var util = require("../util/util");

/* 檀家追加画面メイン（post処理） */
exports.main = function(webItemJson, callback) {
    
    // チェック用configの読み込み
    var validateBaseJson = require("../conf/web_item_info");
    var validTypeJson = validateBaseJson.type;
    var validSizeJson = validateBaseJson.size;
    
    // 入力データのNULLチェック（validateBaseJson）
    // "webItemJson"のチェックは特に行わず、以下データチェック関数で確認する。
    if(util.isUndefineForList(validTypeJson) || util.isUndefineForList(validSizeJson)){
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
    if(util.isUndefineForList(errorJson)){
        callback(true,false);
        return;
    }
    
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