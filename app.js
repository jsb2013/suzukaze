
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var app = express();

// ログの設定
var log4js = require('log4js');
log4js.configure('./conf/log4js_setting.json', { reloadSecs: 300 });
var logger = log4js.getLogger();

// all environments
app.configure(function(){
   app.set('port', process.env.PORT || 3000);
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

// 1.スケジュール画面
app.get('/schedule_top', routes.getScheduleTop);
app.get('/schedule_month', routes.getScheduleMonth);
app.get('/schedule_day', routes.getScheduleDay);

// 2.檀家検索画面
app.get('/danka_top', routes.getDankaTop);

app.get('/danka_sewa', routes.getDankaSewa);
app.get('/danka_syosai', routes.getDankaSyosai);
app.get('/danka_tiku', routes.getDankaTiku);

//***************************************
// 檀家追加画面
//***************************************
// 50音別検索画面
app.get('/danka_50', routes.getDanka50);
// 50音別検索画面→検索結果画面
app.get('/danka_result', routes.getDanka50Result);

//***************************************
// 檀家追加画面
//***************************************
// 檀家追加画面
app.get('/danka_tuika', routes.getDankaTuika);
// 檀家追加画面→確認画面
app.post('/danka_tuika_conform', routes.postDankaTuikaConform);
// 檀家追加画面→確認画面→檀家情報DB追加処理
app.post('/danka_tuika_update', routes.postDankaTuikaDBUpdate);

//***************************************
// 檀家検索結果画面
//***************************************
// 結果TOP画面
app.get('/danka_detail_top', routes.getDankaDetailTop);
// 結果基本情報画面
app.post('/danka_detail_kihon', routes.postDankaDetailKihon);
app.post('/danka/danka_detail_kihon', routes.postDankaDetailKihon);
// 結果基本情報画面→確認画面
app.post('/danka_detail_kihon_confirm', routes.postDankaDetailKihonConfirm);
// 結果基本情報画面→確認画面→DB更新
app.post('/danka_detail_kihon_db_update', routes.postDankaDetailKihonDbUpdate);
// 結果過去帳画面
//app.post('/danka_detail_kako', routes.postDankaDetailKako);
// 結果現在帳画面
//app.post('/danka_detail_genzai', routes.postDankaDetailGenzai);
// 結果寄附帳画面
//app.post('/danka_detail_kihu', routes.postDankaDetailKihu);
// 結果お参り帳画面
//app.post('/danka_detail_omairi', routes.postDankaDetailOmairi);

app.get('/haraikomi', routes.haraikomi);
app.get('/danka_tyohyo', routes.getTyohyoMain);

//***************************************
//***************************************

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
