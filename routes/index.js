
/*
 * GET home page.
 */

 //***************************************
// ログイン画面
//***************************************

// ログイン処理を行う
exports.login = function (req, res) {
  var name = req.body.name || '';
  var password = '';

  // GETリクエストに対する処理
  res.render('login/login', {
//    user: req.session.user || null,
    name: name,
    error: 200,
    loginFailed: false
  });
  return;
};

// ログインフォームを処理する
exports.login.post = function (req, res) {

  var users = require('../model/login/users');

  var name = req.body.name || '';
  var password = req.body.password || '';
    
  function authCallback(err, userInfo) {
    if (err || userInfo === null) {
      // 認証に失敗
      res.render('login/login', {
        page: { title: 'login_err' },
//        user: req.session.user || null,
 name: name,
 error: 200,
 loginFailed: true
      });
      return;
    }
    // 認証に成功
    if (req.session.user === undefined) {
        req.session.user = {
            //uid: userInfo.uid,
            login_id: userInfo.login_id
        };
        console.log("---session created---");
        console.log("userInfo.login_id:" + userInfo.login_id);
        console.log("req.session.user.login_id:" + req.session.user.login_id);
  //console.log("req.session.user.login_id:" + req.session.user);
    }
    res.redirect('/danka_base?id=0');
    return;
  }
  users.authenticate(name, password, authCallback);
};

//***************************************
// 檀家管理画面
//***************************************
// 檀家管理ベース
exports.getDankaBase = function (req, res) {
    // sessionが無い場合はloginへ
    if(req.session.user === undefined){
        res.redirect('/login');
    return;
    }
    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var config = require("../conf/common_config");
    var getDankaBaseModel = require("../model/danka/syosai/getDankaSyosaiNewModel");
    var webItemJson = req.body;
    var tabId = req.query.id;
    var memberId = req.query.memberId;

    function authCallback(isError, tikuInfoJson, tikuCodeInfo, tagInfoJson, tagCodeInfo, sewaCodeInfo, reportTypeInfo, serchMoji, optionId) {
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka/danka_base', {
            page:{ url:config.connectionUrl, data:reportTypeInfo, urlPrintServ:config.connectionPrintServUrl },
            webItemJson : webItemJson,
            tikuInfoJson: tikuInfoJson,
            tikuCodeInfo: tikuCodeInfo,
            sewaCodeInfo : sewaCodeInfo,
            tagInfoJson: tagInfoJson,
            tagCodeInfo: tagCodeInfo,
            tabId: tabId,
            optionId: optionId,
            serchMoji: serchMoji
        });
        return;
    }

    getDankaBaseModel.main(memberId, authCallback);
};

// 檀家管理ベース
exports.postDankaBase = function (req, res) {
    // sessionが無い場合はloginへ
    if(req.session.user === undefined){
        res.redirect('/login');
    return;
    }
    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var config = require("../conf/common_config");
    var getDankaBaseModel = require("../model/danka/syosai/getDankaSyosaiNewModel");
    var webItemJson = req.body;
    var tabId = req.query.id;
    var memberId = req.query.memberId;

    function authCallback(isError, tikuInfoJson, tikuCodeInfo, tagInfoJson, tagCodeInfo, sewaCodeInfo, reportTypeInfo, serchMoji, optionId) {
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka/danka_base', {
            page:{ url:config.connectionUrl, data:reportTypeInfo, urlPrintServ:config.connectionPrintServUrl },
            webItemJson : webItemJson,
            tikuInfoJson: tikuInfoJson,
            tikuCodeInfo: tikuCodeInfo,
            sewaCodeInfo : sewaCodeInfo,
            tagInfoJson: tagInfoJson,
            tagCodeInfo: tagCodeInfo,
            tabId: tabId,
            optionId: optionId,
            serchMoji: serchMoji
        });
        return;
    }

    getDankaBaseModel.main(memberId, authCallback);
};
//***************************************
// 檀家追加画面
//***************************************
// 檀家追加画面→確認画面（post:/danka_tuika）
exports.postDankaTuikaConform = function(req, res) {
    
    // sessionが無い場合はloginへ
    if(req.session.user === undefined){
        res.redirect('/login');
    return;
    }
    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var postDankaTuikaConformModel = require("../model/danka/tuika/postDankaTuikaConformModel");
    var webItemJson = req.body;
    
    function authCallback(isError, isDuplicate, tags){
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka/danka_tuika_conform', {
            webItemJson : webItemJson,
            isDuplicate: isDuplicate,
            tags: tags
        });
        return;
    }

    postDankaTuikaConformModel.main(webItemJson, authCallback);
};

// 檀家追加画面→確認画面→檀家情報DB追加処理（post:/danka_tuika_update）
exports.postDankaTuikaDBUpdate = function(req, res) {
    
    // sessionが無い場合はloginへ
    if(req.session.user === undefined){
        res.redirect('/login');
    return;
    }
    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var postDankaTuikaDBUpdateModel = require("../model/danka/tuika/postDankaTuikaDBUpdateModel");
    var webItemJson = req.body;
    
    // first:想定外エラー、second:WEBのバック機能で多重登録された場合
    function authCallback(isError, isUnUpdatable){
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.redirect('/db_update_error');
            return;
        }
        // WEBのバック機能で多重登録された場合の警告画面
        if (isUnUpdatable){
            res.redirect('/db_unupdatable');
            return;
        }
        // ログイン成功画面へ推移
        res.redirect('/db_update_success');
        return;
    }

    postDankaTuikaDBUpdateModel.main(webItemJson, authCallback);
};

// データベース更新後→成功（get:/db_update_success）
exports.getDBUpdateSuccess = function(req, res){

    // sessionが無い場合はloginへ
    if(req.session.user === undefined){
        res.redirect('/login');
    return;
    }
    var getDBUpdateResultModel = require("../model/danka/common/getDBUpdateResultModel");

    function authCallback(isError){
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('danka/db_update_error', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka/db_update_success', {});
        return;
    }

    getDBUpdateResultModel.main(authCallback);
};

// データベース更新後→成功（get:/db_update_error）
exports.getDBUpdateError = function(req, res){

    // sessionが無い場合はloginへ
    if(req.session.user === undefined){
        res.redirect('/login');
    return;
    }
    var getDBUpdateResultModel = require("../model/danka/common/getDBUpdateResultModel");

    function authCallback(isError){
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('danka/db_update_error', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka/db_update_error', {});
        return;
    }

    getDBUpdateResultModel.main(authCallback);
};

// データベース更新後→DB更新不可（get:/db_unupdatable）
exports.getUnUpdatable = function(req, res){

    // sessionが無い場合はloginへ
    if(req.session.user === undefined){
        res.redirect('/login');
    return;
    }
    var getDBUpdateResultModel = require("../model/danka/common/getDBUpdateResultModel");

    function authCallback(isError){
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('danka/db_update_error', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka/db_unupdatable', {});
        return;
    }

    getDBUpdateResultModel.main(authCallback);
};

//***************************************
// 檀家検索結果画面
//***************************************
// 檀家詳細TOP画面→基本情報画面
exports.getDankaDetailKihon = function (req, res) {

    // sessionが無い場合はloginへ
    if(req.session.user === undefined){
        res.redirect('/login');
    return;
    }

    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var getDankaDetailKihonModel = require("../model/danka_detail/kihon/getDankaDetailKihonModel");
    var memberId = req.query.id;
    var memberIdkosyu = req.query.kosyuid;
    var serchMoji = req.query.sm;
    var optionId = req.query.optionId;

    function authCallback(isError, kosyuInfo, kosyuIdlistIsArive, kosyuIdlistIsAriveNot, tikuCodeInfo, sewaCodeInfo, addressInfo, mailInfo, telnumberInfo, tagsInfo, tagNameListInMM) {
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka_detail/kihon/danka_detail_kihon', {
            kosyuInfo: kosyuInfo[0],
            tikuCodeInfo: tikuCodeInfo,
            sewaCodeInfo: sewaCodeInfo,
            addressInfo: addressInfo,   
            mailInfo: mailInfo,
            telnumberInfo: telnumberInfo,
            tagsInfo: tagsInfo,
            tagNameListInMM: tagNameListInMM,
            kosyuIdlistIsArive: kosyuIdlistIsArive,
            kosyuIdlistIsAriveNot: kosyuIdlistIsAriveNot
        });
        return;
    }

    getDankaDetailKihonModel.main(memberId, memberIdkosyu, optionId, serchMoji, authCallback);
};

exports.postDankaDetailKihon = function (req, res) {

    // sessionが無い場合はloginへ
    if(req.session.user === undefined){
        res.redirect('/login');
    return;
    }

    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var getDankaDetailKihonModel = require("../model/danka_detail/kihon/getDankaDetailKihonModel");
    var memberId = req.query.id;
    var memberIdkosyu = req.query.kosyuid;
    var serchMoji = req.query.sm;
    var optionId = req.query.optionId;
    var webItemJson = req.body;

    function authCallback(isError, kosyuInfo, kosyuIdlistIsArive, kosyuIdlistIsAriveNot, tikuCodeInfo, sewaCodeInfo, addressInfo, mailInfo, telnumberInfo, tagsInfo, tagNameListInMM) {
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka_detail/kihon/danka_detail_kihon', {
            kosyuInfo: kosyuInfo[0],
            tikuCodeInfo: tikuCodeInfo,
            sewaCodeInfo: sewaCodeInfo,
            addressInfo: addressInfo,   
            mailInfo: mailInfo,
            telnumberInfo: telnumberInfo,
            tagsInfo: tagsInfo,
            tagNameListInMM: tagNameListInMM
        });
        return;
    }

    getDankaDetailKihonModel.main(memberId, memberIdkosyu, optionId, serchMoji, authCallback);
};

// 檀家詳細TOP画面→基本情報画面→確認画面
exports.postDankaDetailKihonConfirm = function (req, res) {

    // sessionが無い場合はloginへ
    if(req.session.user === undefined){
        res.redirect('/login');
    return;
    }

    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var postDankaDetailKihonConfirmModel = require("../model/danka_detail/kihon/postDankaDetailKihonConfirmModel");
    var webItemJson = req.body;

    function authCallback(isError) {
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka_detail/kihon/danka_detail_kihon_confirm', {
            webItemJson: webItemJson
        });
        return;
    }

    postDankaDetailKihonConfirmModel.main(authCallback);
};

// 檀家詳細TOP画面→基本情報画面→確認画面→DB更新
exports.postDankaDetailKihonDbUpdate = function (req, res) {

    // sessionが無い場合はloginへ
    if(req.session.user === undefined){
        res.redirect('/login');
    return;
    }
    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var webItemJson = req.body;
    var isArive = webItemJson.is_arive;

    var postDankaDetailDbUpdateModel;
    if(isArive == "1"){
        postDankaDetailDbUpdateModel = require("../model/danka_detail/kihon/postDankaDetailKihonDbUpdateModel");
    }else{
        postDankaDetailDbUpdateModel = require("../model/danka_detail/kako/postDankaDetailKakoDbUpdateModel");
    }

    function authCallback(isError) {
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka_detail/kihon/danka_detail_kihon_confirm_success', {
            webItemJson: webItemJson
        });
        return;
    }
    postDankaDetailDbUpdateModel.main(webItemJson, authCallback);
};

// 檀家詳細検索画面（get:/danka_syosai）
exports.postReturnDankaSearchResult = function(req, res){

    var postReturnDankaSearchResultModel = require("../model/danka_detail/common/postReturnDankaSearchResultModel");
    var webItemJson = req.body;

    function authCallback(isError, resultRows, tikuInfoJson, tikuCodeInfo, tagInfoJson, tagCodeInfo, seachTitle){
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka/common/danka_result', {
            resultRows: resultRows,
            tikuInfoJson: tikuInfoJson,
            tikuCodeInfo: tikuCodeInfo,
            tagInfoJson: tagInfoJson,
            tagCodeInfo: tagCodeInfo,
            seachTitle: seachTitle
        });
        return;
    }

    postReturnDankaSearchResultModel.main(webItemJson, authCallback);
};

// 檀家詳細検索画面（get:/danka_syosai）
exports.postReturnDankaDetailTop = function(req, res){

    // sessionが無い場合はloginへ
    if(req.session.user === undefined){
        res.redirect('/login');
    return;
    }

    var postReturnDankaDetailTopModel = require("../model/danka_detail/common/postReturnDankaDetailTopModel");
    var webItemJson = req.body;
    
    function authCallback(isError, resultRows) {
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka_detail/common/danka_detail_top', {
            resultRows: resultRows
        });
        return;
    }

    postReturnDankaDetailTopModel.main(webItemJson, authCallback);
};


// 檀家詳細TOP画面→過去帳画面
exports.postDankaDetailKako = function (req, res) {

    // sessionが無い場合はloginへ
    if(req.session.user === undefined){
        res.redirect('/login');
    return;
    }

    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var postDankaDetailKakoModel = require("../model/danka_detail/kako/postDankaDetailKakoModel");
    var webItemJson = req.body;
    
    function authCallback(isError, memberInfo, kosyuInfo) {
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka_detail/kako/danka_detail_kako', {
            memberInfo: memberInfo,
            kosyuInfo: kosyuInfo[0]
        });
        return;
    }

    postDankaDetailKakoModel.main(webItemJson, authCallback);
};

// 檀家詳細TOP画面→過去帳画面→詳細画面
exports.postDankaDetailKakoKihon = function (req, res) {

    // sessionが無い場合はloginへ
    if(req.session.user === undefined){
        res.redirect('/login');
    return;
    }

    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var postDankaDetailKakoKihonModel = require("../model/danka_detail/kako/postDankaDetailKakoKihonModel");
    var webItemJson = req.body;
    
    function authCallback(isError, kosyuInfo, dankaInfo, tagsInfo, tagNameListInMM) {
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka_detail/kako/danka_detail_kako_kihon', {
            kosyuInfo: kosyuInfo[0],
            dankaInfo: dankaInfo[0],
            tagsInfo: tagsInfo,
            tagNameListInMM: tagNameListInMM
        });
        return;
    }

    postDankaDetailKakoKihonModel.main(webItemJson, authCallback);
};

// 檀家詳細TOP画面→過去帳画面→詳細画面→確認画面
exports.postDankaDetailKakoConfirm = function (req, res) {

    // sessionが無い場合はloginへ
    if(req.session.user === undefined){
        res.redirect('/login');
    return;
    }

    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var postDankaDetailKakoConfirmModel = require("../model/danka_detail/kako/postDankaDetailKakoConfirmModel");
    var webItemJson = req.body;

    function authCallback(isError, kosyuInfo) {
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka_detail/kako/danka_detail_kako_confirm', {
            webItemJson: webItemJson,
            kosyuInfo: kosyuInfo[0]
        });
        return;
    }

    postDankaDetailKakoConfirmModel.main(webItemJson, authCallback);
};

// 檀家詳細TOP画面→基本情報画面→確認画面→DB更新
exports.postDankaDetailKakoDbUpdate = function (req, res) {

    // sessionが無い場合はloginへ
    if(req.session.user === undefined){
        res.redirect('/login');
    return;
    }

    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var postDankaDetailKakoDbUpdateModel = require("../model/danka_detail/kako/postDankaDetailKakoDbUpdateModel");
    var webItemJson = req.body;

    function authCallback(isError, kosyuInfo) {
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka_detail/kako/danka_detail_kako_confirm_success', {
            kosyuInfo: kosyuInfo[0]
        });
        return;
    }

    postDankaDetailKakoDbUpdateModel.main(webItemJson, authCallback);
};


// 帳票印刷画面
exports.getReportTop = function (req, res) {
  // sessionが無い場合はloginへ
  if(req.session.user === undefined){
      res.redirect('/login');
   return;
  }

  var config = require("../conf/common_config");
  var report = require("../model/report/reportTop");
  
  function authCallback(isError, data){

    // 検索結果の表示
    res.render('report/report_top', {
               //page:{ url:config.connectionUrl, data:data1, typeahead:data2}
               page:{ url:config.connectionUrl, data:data}
    });
    return;
  }
  report.postRerportTop(authCallback);
  return;
};

// 帳票画面
exports.postReportView = function (req, res) {

    // sessionが無い場合はloginへ
    if(req.session.user === undefined){
        res.redirect('/login');
    return;
    }

  var report = require("../model/report/reportTop");
  var select_type_no = req.body.select_type;
  var select_no = req.body.select_template;
  var preview_flag = req.body.preview_flag;
  

    // ** 払込票 **/
    function haraikomiCallback(isError, report_data, print_target){
      
      // 印刷数はgoiraiMeiの配列数に依存(キー)。
      var goiraiYubin = [];
      var goiraiJusyo1 = [];
      var goiraiJusyo2 = [];
      var goiraiMei = [];
      var goiraiTel = [];
      
      for(var i=0 ; i < print_target.length ; i++){
        goiraiYubin[i] = print_target[i].zip_code;
        goiraiJusyo1[i] = print_target[i].address_main;
        goiraiJusyo2[i] = print_target[i].address_sub;
        goiraiMei[i] = print_target[i].name;
        goiraiTel[i] = print_target[i].tel;
      }
      
      // GETリクエストに対する処理
      res.render('report/report_view_haraikomi', {
        page: { daimei: report_data[0].report_name,
                souhujo: report_data[0].text_1,            
                kouzaNo1: report_data[0].text_2,
                kouzaNo2: report_data[0].text_3,
                kouzaNo3: report_data[0].text_4,
                kingaku: report_data[0].text_5,
                ryoukin: report_data[0].text_6,
                tokyusyu: report_data[0].text_7,
                kanyusyaMei: report_data[0].text_8,
                tusinRan: report_data[0].text_9,
                title: report_data[0].text_10,
                date: report_data[0].text_11,
                goiraiYubin:goiraiYubin,
                goiraiJusyo1:goiraiJusyo1,
                goiraiJusyo2:goiraiJusyo2,
                goiraiMei: goiraiMei,
                goiraiTel: goiraiTel,
                previewFlag: preview_flag,
                tyohyoTypeNo: select_type_no
              }
      });
      return;
    }

    // ** 払込票(オリジナル貼り付け) **/
    function haraikomiOriginalCallback(isError, report_data, print_target){
      
      // 印刷数はgoiraiMeiの配列数に依存(キー)。
      var goiraiYubin = [];
      var goiraiJusyo1 = [];
      var goiraiJusyo2 = [];
      var goiraiMei = [];
      var goiraiTel = [];
      
      for(var i=0 ; i < print_target.length ; i++){
        goiraiYubin[i] = print_target[i].zip_code;
        goiraiJusyo1[i] = print_target[i].address_main;
        goiraiJusyo2[i] = print_target[i].address_sub;
        goiraiMei[i] = print_target[i].name;
        goiraiTel[i] = print_target[i].tel;
      }
      
      // GETリクエストに対する処理
      res.render('report/report_view_haraikomi_original', {
        page: { daimei: report_data[0].report_name,
                souhujo: report_data[0].text_1,            
                kouzaNo1: report_data[0].text_2,
                kouzaNo2: report_data[0].text_3,
                kouzaNo3: report_data[0].text_4,
                kingaku: report_data[0].text_5,
                ryoukin: report_data[0].text_6,
                tokyusyu: report_data[0].text_7,
                kanyusyaMei: report_data[0].text_8,
                tusinRan: report_data[0].text_9,
                title: report_data[0].text_10,
                date: report_data[0].text_11,
                goiraiYubin:goiraiYubin,
                goiraiJusyo1:goiraiJusyo1,
                goiraiJusyo2:goiraiJusyo2,
                goiraiMei: goiraiMei,
                goiraiTel: goiraiTel,
                previewFlag: preview_flag,
                tyohyoTypeNo: select_type_no
              }
      });
      return;
    }

    // ** 払込票_施餓鬼(オリジナル貼り付け) **/
    function haraikomiSegakiOriginalCallback(isError, report_data, print_target){
      
      // 印刷数はgoiraiMeiの配列数に依存(キー)。
      var goiraiYubin = [];
      var goiraiJusyo1 = [];
      var goiraiJusyo2 = [];
      var goiraiMei = [];
      var goiraiTel = [];
      
      for(var i=0 ; i < print_target.length ; i++){
        goiraiYubin[i] = print_target[i].zip_code;
        goiraiJusyo1[i] = print_target[i].address_main;
        goiraiJusyo2[i] = print_target[i].address_sub;
        goiraiMei[i] = print_target[i].name;
        goiraiTel[i] = print_target[i].tel;
      }
      
      // GETリクエストに対する処理
      res.render('report/report_view_haraikomi_segaki_original', {
        page: { daimei: report_data[0].report_name,
                souhujo: report_data[0].text_1,            
                kouzaNo1: report_data[0].text_2,
                kouzaNo2: report_data[0].text_3,
                kouzaNo3: report_data[0].text_4,
                kingaku: report_data[0].text_5,
                ryoukin: report_data[0].text_6,
                tokyusyu: report_data[0].text_7,
                kanyusyaMei: report_data[0].text_8,
                tusinRan: report_data[0].text_9,
                title: report_data[0].text_10,
                date: report_data[0].text_11,
                goiraiYubin:goiraiYubin,
                goiraiJusyo1:goiraiJusyo1,
                goiraiJusyo2:goiraiJusyo2,
                goiraiMei: goiraiMei,
                goiraiTel: goiraiTel,
                previewFlag: preview_flag,
                tyohyoTypeNo: select_type_no
              }
      });
      return;
    }

   // ** コクヨ(KPC-E110)ラベルプリンタ用 **/
    function KokuyoKpcE110Callback(isError, report_data, print_target){
      
      // 印刷数はgoiraiMeiの配列数に依存(キー)。
      var goiraiYubin = [];
      var goiraiJusyo1 = [];
      var goiraiJusyo2 = [];
      var goiraiMei = [];
      var goiraiTel = [];
      
      for(var i=0 ; i < print_target.length ; i++){
        goiraiYubin[i] = print_target[i].zip_code;
        goiraiJusyo1[i] = print_target[i].address_main;
        goiraiJusyo2[i] = print_target[i].address_sub;
        goiraiMei[i] = print_target[i].name;
        goiraiTel[i] = print_target[i].tel;
      }
      
      // GETリクエストに対する処理
      res.render('report/report_view_Kokuyo_KPC_E110', {
        page: {
                goiraiYubin:goiraiYubin,
                goiraiJusyo1:goiraiJusyo1,
                goiraiJusyo2:goiraiJusyo2,
                goiraiMei: goiraiMei,
                goiraiTel: goiraiTel,
                previewFlag: preview_flag,
              }
      });
      return;
    }


  // ** 払込票(オリジナル貼り付け) **/
  if(select_type_no == 1){
    report.postRerpotPrintView(select_type_no, select_no, preview_flag, haraikomiOriginalCallback);
    return;    
  }
 
  // ** 払込票 **/
  if(select_type_no == 2 || select_type_no == 3){
    report.postRerpotPrintView(select_type_no, select_no, preview_flag, haraikomiCallback);
    return;    
  }

  // ** 払込票_施餓鬼(オリジナル貼り付け) **/
  if(select_type_no == 4){
    report.postRerpotPrintView(select_type_no, select_no, preview_flag, haraikomiSegakiOriginalCallback);
    return;    
  }  

  // ** コクヨ(KPC-E110)ラベルプリンタ用 **/
  if(select_type_no == 5){
    report.postRerpotPrintView(select_type_no, select_no, preview_flag, KokuyoKpcE110Callback);
    return;        
  }  

};

//***************************************
// スケジュール管理画面
//***************************************
// スケジュールTOP画面（get:/schedule_top）
exports.getScheduleTop = function(req, res){
    // sessionが無い場合はloginへ
    if(req.session.user === undefined){
        res.redirect('/login');
    return;
    }
    res.render('schedule_top', {
        loginFailed: false
    });
};

// スケジュール画面（カレンダー指定）（get:/schedule_month）
exports.getScheduleMonth = function(req, res){
    // sessionが無い場合はloginへ
    if(req.session.user === undefined){
        res.redirect('/login');
    return;
    }
    res.render('schedule_month', {
        loginFailed: false
    });
};

// スケジュール画面（日指定）（get:/schedule_day）
exports.getScheduleDay = function(req, res){
    // sessionが無い場合はloginへ
    if(req.session.user === undefined){
        res.redirect('/login');
    return;
    }
    res.render('schedule_day', {
        loginFailed: false
    });
};

// 2-6.檀家追加画面（get:/danka_tuika）
//exports.getTyohyoMain = function(req, res){
//    // sessionが無い場合はloginへ
//    if(req.session.user === undefined){
//        res.redirect('/login');
//    return;
//    }
//    res.render('danka_tyohyo', {
//        loginFailed: false
//    });
//};