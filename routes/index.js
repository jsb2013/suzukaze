
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
    res.render('danka/common/danka_top', {
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
    res.render('danka/syosai/danka_syosai', {
        loginFailed: false
    });
};

// ★テスト中
exports.getDankaSyosaiNew = function(req, res){

    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var getDankaSyosaiNewModel = require("../model/danka/syosai/getDankaSyosaiNewModel");

    function authCallback(isError, tikuInfoJson, tikuCodeInfo, sewaInfoJson, sewaCodeInfo, tagInfoJson, tagCodeInfo) {
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka/syosai/danka_syosai_new', {
            tikuInfoJson: tikuInfoJson,
            tikuCodeInfo: tikuCodeInfo,
            sewaInfoJson: sewaInfoJson,
            sewaCodeInfo: sewaCodeInfo,
            tagInfoJson: tagInfoJson,
            tagCodeInfo: tagCodeInfo
        });
        return;
    }

    getDankaSyosaiNewModel.main(authCallback);
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
    res.render('danka/50on/danka_50', {
        loginFailed: false
    });
};

// 50音別検索画面→検索結果画面
exports.getDanka50Result = function (req, res) {

    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var getDanka50ResultModel = require("../model/danka/common/getDanka50ResultModel");
    var serchId = req.query.id;

    function authCallback(isError, resultRows, tikuInfoJson, tikuCodeInfo, sewaInfoJson, sewaCodeInfo, tagInfoJson, tagCodeInfo, seachTitle) {
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
            sewaInfoJson: sewaInfoJson,
            sewaCodeInfo: sewaCodeInfo,
            tagInfoJson: tagInfoJson,
            tagCodeInfo: tagCodeInfo,
            seachTitle: seachTitle
        });
        return;
    }

    getDanka50ResultModel.main(serchId, authCallback);
};

//***************************************
// 檀家追加画面
//***************************************
// 檀家追加画面（get:/danka_tuika）
exports.getDankaTuika = function(req, res){

    var getDankaTuikaModel = require("../model/danka/tuika/getDankaTuikaModel");
  
    function authCallback(isError, tikuCodeInfo, sewaCodeInfo, tagsInfo){
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka/tuika/danka_tuika', {
            tikuCodeInfo : tikuCodeInfo,
            sewaCodeInfo : sewaCodeInfo,
            tagsInfo: tagsInfo
        });
        return;
    }

    getDankaTuikaModel.main(authCallback);
};

// 檀家追加画面→確認画面（post:/danka_tuika）
exports.postDankaTuikaConform = function(req, res) {
    
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
        res.render('danka/tuika/danka_tuika_conform', {
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
    
    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var postDankaTuikaDBUpdateModel = require("../model/danka/tuika/postDankaTuikaDBUpdateModel");
    var webItemJson = req.body;
    
    function authCallback(isError){
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka/tuika/danka_tuika_success', {});
        return;
    }

    postDankaTuikaDBUpdateModel.main(webItemJson, authCallback);
};

//***************************************
// 檀家詳細検索画面
//***************************************
// 檀家詳細検索画面（get:/danka_syosai）
exports.getDankaSyosai = function(req, res){

    var postDankaSyosaiModel = require("../model/danka/syosai/postDankaSyosaiModel");
  
    function authCallback(isError, tikuCodeInfo, sewaCodeInfo, tagsInfo){
        // 想定外のエラー（詳細はログを見るとして、ひとまずシステムエラー画面を表示）
        if (isError) {
            res.render('dummy', {});
            return;
        }
        // ログイン成功画面へ推移
        res.render('danka/syosai/danka_syosai', {
            tikuCodeInfo : tikuCodeInfo,
            sewaCodeInfo : sewaCodeInfo,
            tagsInfo: tagsInfo
        });
        return;
    }

    postDankaSyosaiModel.main(authCallback);
};

// 檀家詳細検索画面（get:/danka_syosai）
exports.getDankaSyosaiSearch = function(req, res){

    var postDankaSyosaiSearchModel = require("../model/danka/syosai/postDankaSyosaiSearchModel");
    var webItemJson = req.body;
  
    function authCallback(isError, resultRows, tikuInfoJson, tikuCodeInfo, sewaInfoJson, sewaCodeInfo, tagInfoJson, tagCodeInfo, seachTitle){
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
            sewaInfoJson: sewaInfoJson,
            sewaCodeInfo: sewaCodeInfo,
            tagInfoJson: tagInfoJson,
            tagCodeInfo: tagCodeInfo,
            seachTitle: seachTitle
        });
        return;
    }

    postDankaSyosaiSearchModel.main(webItemJson, authCallback);
};

//***************************************
// 檀家検索結果画面
//***************************************
// 檀家詳細TOP画面
exports.getDankaDetailTop = function(req, res) {
    
    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var getDankaDetailTopModel = require("../model/danka_detail/common/getDankaDetailTopModel");
    var memberId = req.query.id;
    
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

    getDankaDetailTopModel.main(memberId, authCallback);
};

// 檀家詳細TOP画面→基本情報画面
exports.postDankaDetailKihon = function (req, res) {

    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var postDankaDetailKihonModel = require("../model/danka_detail/kihon/postDankaDetailKihonModel");
    var webItemJson = req.body;

    function authCallback(isError, kosyuInfo, tikuCodeInfo, sewaCodeInfo, addressInfo, mailInfo, telnumberInfo, tagsInfo, tagNameListInMM) {
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

    postDankaDetailKihonModel.main(webItemJson, authCallback);
};

// 檀家詳細TOP画面→基本情報画面→確認画面
exports.postDankaDetailKihonConfirm = function (req, res) {

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

    // 画面項目情報一覧（檀家追加）をconfigから取得する。
    var postDankaDetailKihonDbUpdateModel = require("../model/danka_detail/kihon/postDankaDetailKihonDbUpdateModel");
    var webItemJson = req.body;

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

    postDankaDetailKihonDbUpdateModel.main(webItemJson, authCallback);
};

// 檀家詳細検索画面（get:/danka_syosai）
exports.postReturnDankaSearchResult = function(req, res){

    var postReturnDankaSearchResultModel = require("../model/danka_detail/common/postReturnDankaSearchResultModel");
    var webItemJson = req.body;
  
    function authCallback(isError, resultRows, tikuInfoJson, tikuCodeInfo, sewaInfoJson, sewaCodeInfo, tagInfoJson, tagCodeInfo, seachTitle){
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
            sewaInfoJson: sewaInfoJson,
            sewaCodeInfo: sewaCodeInfo,
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

  // ** 払込票 **/
  if(select_type_no == 1 || select_type_no == 2 || select_type_no == 3){
    report.postRerpotPrintView(select_type_no, select_no, preview_flag, haraikomiCallback);
    return;    
  }
  
};
