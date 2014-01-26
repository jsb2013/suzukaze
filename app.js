
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
app.get('/schedule_top', routes.schedule_top);
app.get('/schedule_month', routes.schedule_month);
app.get('/schedule_day', routes.schedule_day);

// 2.檀家検索画面
app.get('/danka_top', routes.danka_top);
app.get('/danka_50', routes.danka_50);
app.get('/danka_sewa', routes.danka_sewa);
app.get('/danka_syosai', routes.danka_syosai);
app.get('/danka_tiku', routes.danka_tiku);

// 3.50音別検索
app.get('/danka_result', routes.danka_result);


// 檀家追加画面
app.get('/danka_tuika', routes.danka_tuika);
// 檀家追加画面→確認画面
app.post('/danka_tuika_conform', routes.dankaTuikaConform);
// 檀家追加画面→確認画面→檀家追加処理
app.post('/danka_tuika_update', routes.dankaTuikaUpdate);

//***************************************
//***************************************

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
