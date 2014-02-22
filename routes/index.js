
/*
 * GET home page.
 */

//***************************************
// スケジュール管理画面
//***************************************
// スケジュールTOP画面（get:/schedule_top）
exports.getScheduleTop = function(req, res){
    res.render('schedule_top', {
        loginFailed: false
    });
};

// スケジュール画面（カレンダー指定）（get:/schedule_month）
exports.getScheduleMonth = function(req, res){
    res.render('schedule_month', {
        loginFailed: false
    });
};

// スケジュール画面（日指定）（get:/schedule_day）
exports.getScheduleDay = function(req, res){
    res.render('schedule_day', {
        loginFailed: false
    });
};

/*
 * 檀家検索画面
 */
// 2-1.檀家検索TOP画面（get:/danka_top）
exports.getDankaTop = function(req, res){
    res.render('danka_top', {
        loginFailed: false
    });
};

// 2-3.檀家検索-世話人指定画面（get:/danka_sewa）
exports.getDankaSewa = function(req, res){
    res.render('danka_sewa', {
        loginFailed: false
    });
};

// 2-4.檀家検索-詳細指定画面（get:/danka_syosai）
exports.getDankaSyosai = function(req, res){
    res.render('danka_syosai', {
        loginFailed: false
    });
};

// 2-5.檀家検索-地区指定画面（get:/danka_tiku）
exports.getDankaTiku = function(req, res){
    res.render('danka_tiku', {
        loginFailed: false
    });
};

// 2-6.檀家追加画面（get:/danka_tuika）
exports.getTyohyoMain = function(req, res){
    res.render('danka_tyohyo', {
        loginFailed: false
    });
};


//***************************************
// 檀家検索画面（50音別）
//***************************************
// 50音別検索画面
exports.getDanka50 = function(req, res){
    res.render('danka_50', {
        loginFailed: false
    });
};

// 50音別検索画面→検索結果画面
exports.getDanka50Result = function (req, res) {

    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var getDanka50Result = require("../model/getDanka50ResultModel");
    var serchId = req.query.id;

    function authCallback(isError, resultRows, tikuInfoJson, tikuCodeInfo, sewaInfoJson, sewaCodeInfo, searchMoji) {
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka_result', {
            resultRows: resultRows,
            tikuInfoJson: tikuInfoJson,
            tikuCodeInfo: tikuCodeInfo,
            sewaInfoJson: sewaInfoJson,
            sewaCodeInfo: sewaCodeInfo,
            searchMoji: searchMoji
        });
        return;
    }

    getDanka50Result.main(serchId, authCallback);
};

//***************************************
// 檀家追加画面
//***************************************
// 檀家追加画面（get:/danka_tuika）
exports.getDankaTuika = function(req, res){

    var getDankaTuikaModel = require("../model/getDankaTuikaModel");
  
    function authCallback(isError, jobCodeInfo, tikuCodeInfo, sewaCodeInfo, souMemberIdInfo){
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka_tuika', {
            jobCodeInfo : jobCodeInfo,
            tikuCodeInfo : tikuCodeInfo,
            sewaCodeInfo : sewaCodeInfo,
            souMemberIdInfo : souMemberIdInfo
        });
        return;
    }

    getDankaTuikaModel.main(authCallback);
};

// 檀家追加画面→確認画面（post:/danka_tuika）
exports.postDankaTuikaConform = function(req, res) {
    
    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var postDankaTuikaConformModel = require("../model/postDankaTuikaConformModel");
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

    postDankaTuikaConformModel.main(webItemJson, authCallback);
};

// 檀家追加画面→確認画面→檀家情報DB追加処理（post:/danka_tuika_update）
exports.postDankaTuikaDBUpdate = function(req, res) {
    
    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var postDankaTuikaDBUpdateModel = require("../model/postDankaTuikaDBUpdateModel");
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

    postDankaTuikaDBUpdateModel.main(webItemJson, authCallback);
};

//***************************************
// 檀家検索結果画面
//***************************************
// 結果TOP画面
exports.getDankaDetailTop = function(req, res) {
    
    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var getDankaDetailTopModel = require("../model/getDankaDetailTopModel");
    var memberId = req.query.id;
    
    function authCallback(isError, resultRows, tikuInfoJson, tikuCodeInfo, sewaInfoJson, sewaCodeInfo) {
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka_detail_top', {
            resultRows: resultRows,
            tikuInfoJson: tikuInfoJson,
            tikuCodeInfo: tikuCodeInfo,
            sewaInfoJson: sewaInfoJson,
            sewaCodeInfo: sewaCodeInfo
        });
        return;
    }

    getDankaDetailTopModel.main(memberId, authCallback);
};

// 結果基本情報画面
exports.postDankaDetailKihon = function (req, res) {

    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var postDankaDetailKihonModel = require("../model/postDankaDetailKihonModel");
    var webItemJson = req.body;

    function authCallback(isError, jobCodeInfo, tikuCodeInfo, sewaCodeInfo, addressInfo, mailInfo, telnumberInfo, souMemberIdInfo) {
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka_detail_kihon', {
            webItemJson: webItemJson,
            jobCodeInfo: jobCodeInfo,
            tikuCodeInfo: tikuCodeInfo,
            sewaCodeInfo: sewaCodeInfo,
            addressInfo: addressInfo,
            mailInfo: mailInfo,
            telnumberInfo: telnumberInfo,
            souMemberIdInfo: souMemberIdInfo
        });
        return;
    }

    postDankaDetailKihonModel.main(webItemJson, authCallback);
};

// 結果基本情報画面
exports.postDankaDetailKihonConfirm = function (req, res) {

    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var postDankaDetailKihonConfirmModel = require("../model/postDankaDetailKihonConfirmModel");
    var webItemJson = req.body;

    function authCallback(isError) {
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka_detail_kihon_confirm', {
            webItemJson: webItemJson
        });
        return;
    }

    postDankaDetailKihonConfirmModel.main(authCallback);
};

















exports.haraikomi = function (req, res) {
  //テストデータ。本番は配列を渡せばOK。印刷数はgoiraiMeiの配列数に依存(キー)。
  var daimei = '平成25年度護持会費納入のお知らせ';
  var souhujo = '謹啓　新緑の候長伝寺檀家の皆様方には、長伝寺護持の為、日頃より御協力頂きまして誠にありがとうございます。さて、平成２５年度「護持会費・祠堂経料（御住職への手当）」の納入のお願いをお知らせいたします。';
  var kouzaNo1 = ['55555','55555','55555'];
  var kouzaNo2 = ['1','1','1'];
  var kouzaNo3 = ['7777777','7777777','7777777'];
  var kingaku = '1000';
  var ryoukin = '333';
  var tokyusyu = '特殊';
  var kanyusyaMei = '長伝寺';
  var tusinRan = '平成２５年度分護持会費として';
  var goiraiYubin = ['140-0014','xxx-xxxx','228-0026']
  var goiraiJusyo1 = ['東京都品川区大井4-5-1','東京都xxx-xxxx-xx','神奈川県座間市xxx-xxx-x']
  var goiraiJusyo2 = ['品川サウスヒルズ３０１号','','']
  var goiraiMei = ['金森 雅人','山下 修史','宮本 武蔵'];
  var goiraiTel = ['090-4xxx-xxxx','03-37xx-xxxx','046-xxx-xxxx'];

  // GETリクエストに対する処理
  res.render('haraikomi', {
    page: { daimei: daimei,
            souhujo: souhujo,            
            kouzaNo1: kouzaNo1,
            kouzaNo2: kouzaNo2,
            kouzaNo3: kouzaNo3,
            kingaku: kingaku,
            ryoukin: ryoukin,
            tokyusyu: tokyusyu,
            kanyusyaMei: kanyusyaMei,
            tusinRan: tusinRan,
            goiraiYubin:goiraiYubin,
            goiraiJusyo1:goiraiJusyo1,
            goiraiJusyo2:goiraiJusyo2,
            goiraiMei: goiraiMei,
            goiraiTel: goiraiTel
          }
  });
};
