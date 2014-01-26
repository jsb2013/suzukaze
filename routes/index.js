
/*
 * GET home page.
 */

/*
 * スケジュール画面
 */
// 1-1.スケジュールTOP画面（get:/schedule_top）
exports.schedule_top = function(req, res){
    res.render('schedule_top', {
        loginFailed: false
    });
};

// 1-2.スケジュール画面（カレンダー指定）（get:/schedule_month）
exports.schedule_month = function(req, res){
    res.render('schedule_month', {
        loginFailed: false
    });
};

// 1-3.スケジュール画面（日指定）（get:/schedule_day）
exports.schedule_day = function(req, res){
    res.render('schedule_day', {
        loginFailed: false
    });
};

/*
 * 檀家検索画面
 */
// 2-1.檀家検索TOP画面（get:/danka_top）
exports.danka_top = function(req, res){
    res.render('danka_top', {
        loginFailed: false
    });
};

// 2-2.檀家検索-50音指定画面（get:/danka_50）
exports.danka_50 = function(req, res){
    res.render('danka_50', {
        loginFailed: false
    });
};

// 2-3.檀家検索-世話人指定画面（get:/danka_sewa）
exports.danka_sewa = function(req, res){
    res.render('danka_sewa', {
        loginFailed: false
    });
};

// 2-4.檀家検索-詳細指定画面（get:/danka_syosai）
exports.danka_syosai = function(req, res){
    res.render('danka_syosai', {
        loginFailed: false
    });
};

// 2-5.檀家検索-地区指定画面（get:/danka_tiku）
exports.danka_tiku = function(req, res){
    res.render('danka_tiku', {
        loginFailed: false
    });
};

// 2-6.檀家追加画面（get:/danka_tuika）
exports.danka_tuika = function(req, res){
    res.render('danka_tuika', {
        loginFailed: false
    });
};

// 5.ユーザ情報登録成功画面への推移（post:/danka_tuika）
exports.dankaTuikaConform = function(req, res) {
    
    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var dankaTuikaConfirm = require("../model/dankaTuikaConfirm");
    var webItemJson = req.body;
    
    function authCallback(isError, isDuplicate){
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka_tuika_conform', {
            webItemJson : webItemJson,
            isDuplicate: isDuplicate
        });
        return;
    }

    dankaTuikaConfirm.validateWebItemJson(webItemJson, authCallback);
};

// 5.ユーザ情報登録成功画面への推移（post:/danka_tuika_update）
exports.dankaTuikaUpdate = function(req, res) {
    
    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var dankaTuikaConfirm = require("../model/dankaTuikaConfirm");
    var webItemJson = req.body;
    
    function authCallback(isError){
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka_tuika_success', {});
        return;
    }

    dankaTuikaConfirm.updateDBFromWebItemJson(webItemJson, authCallback);
};

// 3.50音別検索移（get:/danka_result）
exports.danka_result = function (req, res) {

    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var danka_result = require("../model/danka_result");
    var serchId = req.query.id;

    function authCallback(isError) {
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka_result', {});
        return;
    }

    danka_result.serchDankaFrom50onId(serchId, authCallback);
};
