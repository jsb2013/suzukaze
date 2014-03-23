/*
 * socket.IOサーバーを起動し、メッセージを処理する
 */

exports.receiveMassages = function(server,callback){

    var socketIO = require('socket.io');
    
    // soclet.IOサーバーの起動(node.jsサーバーのIPアドレスとポート番号を結びつけ)
    var io = socketIO.listen(server);
    
    // クライアントが接続してきたときの処理
    io.sockets.on('connection', function(socket) {
        console.log("--------connection-----------");

       // disconnectionメッセージを受けたときの処理
        socket.on('disconnection', function(){
            console.log("--------disconnection--------");
        });
 
        // ************************************************** //
        // *****  ページ毎のソケット通信内容を記述SART  ***** //
        // ************************************************** //


        // *** 帳票印刷画面 *** //
        // サジェスト候補の取得
        socket.on('GetTypeahead', function(msg) {
          console.log(msg);
          var report = require("../model/report/reportTop");
          
          function callback(data){
            io.sockets.emit("GetTypeahead", data);
            return;
          }
          report.selectTypeahead(callback);
        });

        // 帳票種類の取得
        socket.on('SelectReportType', function(data) {
          var report = require("../model/report/reportTop");
          var report_type_no = data.value;
          
          function callback(data){
            io.sockets.emit("SelectReportType", data);
            return;
          }
          report.selectReport(report_type_no,callback);
        });

        // 帳票テンプレートデータの取得
        socket.on('SelectReport', function(data) {
          var report = require("../model/report/reportTop");
          var report_no = data.value;
          
          function callback(data){
            io.sockets.emit("SelectReport", data);
            return;
          }
          report.selectReportData(report_no,callback);
        });
        
        // 印刷対象の情報を取得
        socket.on('GetTargetList', function(data) {
          var report = require("../model/report/reportTop");
          var tag = data.value;
          
          function callback(data){
            io.sockets.emit("GetTargetList", data);
            return;
          }
          report.getReportTarget(tag,callback);
        });

        // report_ifに選択対象を追加
        socket.on('InsertReportIf', function(data) {
          var report = require("../model/report/reportTop");
          var member_id = data.value;
          
          function callback(data){
            // io.sockets.emit("InsertReportIf", data);
            return;
          }
          report.insertReportIf(member_id,callback);
        });

        // report_ifから選択対象を削除
        socket.on('DeleteReportIf', function(data) {
          var report = require("../model/report/reportTop");
          var member_id = data.value;
          
          function callback(data){
            // io.sockets.emit("DeleteReportIf", data);
            return;
          }
          report.deleteReportIf(member_id,callback);
        });

        // report_ifへ全ての選択対象を追加
        socket.on('AllInsertReportIf', function(data) {
          var report = require("../model/report/reportTop");
          var target_member_id = data.value;
          var flag = data.flag;
          
          function callback(data){
            return;
          }
          // flag=trueの時はInsert
          report.updateAllReportIf(target_member_id,flag,callback);
        });

        // report_ifから全ての選択対象を削除
        socket.on('AllDeleteReportIf', function(data) {
          var report = require("../model/report/reportTop");
          var target_member_id = data.value;
          var flag = data.flag

          function callback(data){
            return;
          }
          // flag=falseの時はDelete
          report.updateAllReportIf(target_member_id,flag,callback);
        });

        // m_reportで選択対象を更新
        socket.on('ReportSave', function(data) {
          var report = require("../model/report/reportTop");
          var report_no = data.report_no;
          var report_name = data.report_name;
          var text_1 = data.text_1;
          var text_2 = data.text_2;
          var text_3 = data.text_3;
          var text_4 = data.text_4;
          var text_5 = data.text_5;
          var text_6 = data.text_6;
          var text_7 = data.text_7;
          var text_8 = data.text_8;
          var text_9 = data.text_9;
          var text_10 = data.text_10;

          function callback(data){
            io.sockets.emit("ReportSave");
            return;
          }
          report.updateReport(report_no,report_name,text_1,text_2,text_3,text_4,text_5,text_6,text_7,text_8,text_9,text_10,callback);
        });

        // m_reportに選択対象を追加
        socket.on('ReportSaveAs', function(data) {
          var report = require("../model/report/reportTop");
          var report_type_no = data.report_type_no;
          var report_name = data.report_name;
          var text_1 = data.text_1;
          var text_2 = data.text_2;
          var text_3 = data.text_3;
          var text_4 = data.text_4;
          var text_5 = data.text_5;
          var text_6 = data.text_6;
          var text_7 = data.text_7;
          var text_8 = data.text_8;
          var text_9 = data.text_9;
          var text_10 = data.text_10;

          function callback(data){
            io.sockets.emit("ReportSaveAs");
            return;
          }
          report.insertReport(report_type_no, report_name,text_1,text_2,text_3,text_4,text_5,text_6,text_7,text_8,text_9,text_10,callback);
        });

        // m_reportの選択対象を削除(デリフラ)
        socket.on('ReportDelete', function(data) {
          var report = require("../model/report/reportTop");
          var report_no = data.report_no;

          function callback(data){
            io.sockets.emit("ReportDelete");
            return;
          }
          report.deleteReport(report_no, callback);
        });
        // ************************************************* //
        // *****  ページ毎のソケット通信内容を記述END  ***** //
        // ************************************************* //
              
    });
    
callback(null);

}