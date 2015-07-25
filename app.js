
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var config = require("./conf/common_config");
var app = express();

// ログの設定
var log4js = require('log4js');
log4js.configure('./conf/log4js_setting.json', { reloadSecs: 300 });
var logger = log4js.getLogger();

// all environments
app.configure(function(){
   app.set('port', process.env.PORT || config.connectionPort);
   app.set('views', path.join(__dirname, 'views'));
   app.set('view engine', 'ejs');
   app.use(express.cookieParser("hogehoge"));
   app.use(express.session());
   app.use(express.favicon());
   app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO }));
//   app.use(express.logger('dev'));
   app.use(express.bodyParser());
      app.use(app.router);
   app.use(express.json());
   app.use(express.urlencoded());
   app.use(express.methodOverride());
   app.use(express.static(path.join(__dirname, 'public')));
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//***************************************
//********* ルート情報 ******************
//***************************************

// 0.ログイン画面
app.get('/login', routes.login);
app.post('/login', routes.login.post);

// 1.スケジュール画面
app.get('/schedule_top', routes.getScheduleTop);
app.get('/schedule_month', routes.getScheduleMonth);
app.get('/schedule_day', routes.getScheduleDay);

// 2.檀家検索画面
app.get('/db_update_success', routes.getDBUpdateSuccess);
app.get('/db_update_error', routes.getDBUpdateError);
app.get('/db_unupdatable', routes.getUnUpdatable);

//***************************************
// 檀家追加画面
//***************************************
// 檀家追加画面→確認画面
app.post('/danka_tuika_conform', routes.postDankaTuikaConform);
// 檀家追加画面→確認画面→檀家情報DB追加処理
app.post('/danka_tuika_update', routes.postDankaTuikaDBUpdate);

//***************************************
// 詳細検索画面
//***************************************
app.get('/danka_base', routes.getDankaBase);
app.post('/danka_base', routes.postDankaBase);

//***************************************
// 檀家検索結果画面
//***************************************
// 檀家詳細TOP画面
app.get('/danka_detail_kihon', routes.getDankaDetailKihon);
// 檀家詳細TOP画面→基本情報画面
app.post('/danka_detail_kihon', routes.postDankaDetailKihon);
// 檀家詳細TOP画面→基本情報画面→確認画面
app.post('/danka_detail_kihon_confirm', routes.postDankaDetailKihonConfirm);
// 檀家詳細TOP画面→基本情報画面→確認画面→DB更新
app.post('/danka_detail_kihon_db_update', routes.postDankaDetailKihonDbUpdate);
// 檀家検索結果画面への戻り
app.post('/return_danka_search', routes.postReturnDankaSearchResult);
// 檀家詳細TOP画面への戻り
app.post('/return_danka_detail_top', routes.postReturnDankaDetailTop);

app.post('/danka_kosyu_change', routes.postDankaKosyuChange);
app.post('/danka_mv_kako', routes.postDankaMvKako);
app.post('/danka_mv_gen', routes.postDankaMvGen);



// 檀家詳細TOP画面→過去帳画面
app.post('/danka_detail_kako', routes.postDankaDetailKako);
// 檀家詳細TOP画面→過去帳画面→詳細画面
app.post('/danka_detail_kako_kihon', routes.postDankaDetailKakoKihon);
// 檀家詳細TOP画面→過去帳画面→詳細画面→確認画面
app.post('/danka_detail_kako_confirm', routes.postDankaDetailKakoConfirm);
// 檀家詳細TOP画面→過去帳画面→詳細画面→確認画面→DB更新
app.post('/danka_detail_kako_db_update', routes.postDankaDetailKakoDbUpdate);

// 3.帳票印刷画面
app.get('/report_top', routes.getReportTop);
// 檀家詳細TOP画面→基本情報画面→確認画面→DB更新
app.post('/report_view', routes.postReportView);

//***************************************
//********* ルート情報 ******************
//***************************************

// Expressのappsオブジェクトを引数にhttp.Serverクラスのインスタンスを作成
var server = http.createServer(app);

// node.jsサーバーの起動
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var socketApp = require("./socket/socketApp");
// socket.IOサーバーの起動
socketApp.receiveMassages(server,function(){
  console.log('Socket.IO server listening on port ' + app.get('port'));
});

