/*
 * report_top関連のDB処理
 */
 

var database = require("../../dao/database");
var client = database.createClient();
var async = require('async');
//var log = require("../util/logger");
//var logger = log.createLogger();

/* 帳票印刷画面を開くときに送信する情報*/
exports.postRerpotPrintView = function(select_type_no, select_no, preview_flag, callback){
  
    var report_data = [];
    var print_target = [];

    async.series([
    // 仕事コードマスタを取得
        function (dbcallback) {
            selectPrintReport(select_type_no, select_no, report_data, dbcallback);
        }
    ,
    // 顧客情報及びtagsの取得
        function (dbcallback) {
            selectPrintTarget(preview_flag, print_target, dbcallback);
        }
    ],
    // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                callback(true);
                return;
            }

            callback(false, report_data, print_target);
            return;
        }
    );
}

/* 帳票情報の取得- */
function selectPrintReport(select_type_no, select_no, rows, callback){
  
  var query = client.query('select * from m_report where is_disabled is FALSE and is_deleted is FALSE and report_no = $1 and report_type_no = $2',[select_no,select_type_no]);
  
  query.on('row', function(row) {
           rows.push(row);
           });
  
  query.on('end', function(row,err) {
           client.end();
           callback(null);
           return;
           });
};

/* 印刷対象情報の取得- */
function selectPrintTarget(preview_flag, rows, callback){
  
  var query;
  // プレビュー
  if(preview_flag == 1){
    query = client.query('select * from v_report_target_preview');
  }
  // その他
  else{
    query = client.query('select * from v_report_target where report_if_id is not null');
  }
  
  query.on('row', function(row) {
           rows.push(row);
           });
  
  query.on('end', function(row,err) {
           client.end();
           callback(null);
           return;
           });
};

/* 帳票画面を開くときに送信する情報 */
exports.postRerportTop = function(callback){
  
    var data = [];
    //var data2 = [];

    async.series([
    // 帳票タイプを取得
        function (dbcallback) {
            selectReportType(data, dbcallback);
        }
    ],
    // 【END】トランザクション完了(commit or rollback)
        function (err, results) {
            if (err) {
                callback(true);
                return;
            }

            callback(false, data);
            return;
        }
    );
}

/* 帳票タイプの取得- */
function selectReportType(rows, callback){
  
  var query = client.query('select * from v_report_type;');
  
  query.on('row', function(row) {
           rows.push(row);
           });
  
  query.on('end', function(row,err) {
           client.end();
           callback(null);
           return;
           });
};

/* 顧客情報及びtagsの取得 */
/* **今は使えていないが、いずれはasyncをつかった方式を実装したい** */
exports.selectTypeahead = function(callback){
  
  var query = client.query('select id,text from v_typeahead;');

  var rows = [];
  query.on('row', function(row) {
           rows.push(row);
           });
  
  query.on('end', function(row,err) {
           client.end();
           callback(rows);
           return;
           });
};


/* 帳票テンプレートの取得 */
/* **今は使えていないが、いずれはasyncをつかった方式を実装したい** */
exports.selectReport = function(report_type_no,callback){
  
  var query = client.query('select * from v_report where report_type_no = $1;',[report_type_no]);
  
  var rows = [];
  query.on('row', function(row) {
           rows.push(row);
           });
  
  query.on('end', function(row,err) {
          client.end();
          callback(rows);
          return;
          });
};

/* 帳票テンプレートデータの取得 */
/* 今は使えていないが、いずれはasyncをつかった方式を実装したい */
exports.selectReportData = function(report_no,callback){
  
  var query = client.query('select * from v_report where report_no = $1;',[report_no]);
  
  var rows = [];
  query.on('row', function(row) {
           rows.push(row);
           });
  
  query.on('end', function(row,err) {
           client.end();
           callback(rows);
           return;
           });
};
/* 印刷対象の情報を取得 */
exports.getReportTarget = function(tag,callback){
  
  var tagArray = tag.split(",");
  var sql;

  // 検索条件が無い場合は、印刷対象に指定されているターゲットだけ表示
  // ちなみにtagArray.length===0にしない理由。なぜがインプットゼロでも、lengthが1になるため。
  if(tagArray[0] === ""){
    sql = 'select * from v_report_target where report_if_id is not null';
  }

  // 検索条件が有るなら、普通に検索(印刷対象に指定されているターゲットは無条件で表示)
  else{
    sql = 'select * from v_report_target where ';
    for(var i = 0 ; i < tagArray.length ; i++){
      if(i===0){
        sql += ' ('
        sql += ' tags like \'%' + tagArray[i] + '%\'';
        sql += ' or name like \'%' + tagArray[i] + '%\'';
        sql += ' or address like \'%' + tagArray[i] + '%\'';    
        sql += ' or report_if_id is not null';    
        sql += ')'
      }else{
        sql += ' and ('
        sql += ' tags like \'%' + tagArray[i] + '%\'';
        sql += ' or name like \'%' + tagArray[i] + '%\'';
        sql += ' or address like \'%' + tagArray[i] + '%\'';    
        sql += ' or report_if_id is not null';    
        sql += ')'
      }
    } 
    
  }

  var query = client.query(sql);

  var rows = [];
  query.on('row', function(row) {
           rows.push(row);
           });
  
  query.on('end', function(row,err) {
           client.end();
           callback(rows);
           return;
           });
};

/* report_ifに選択対象を追加 */
exports.insertReportIf = function(member_id,callback){
  
  var query = client.query('insert into t_report_if (member_id, yobi_1, yobi_2, create_user, create_date, update_user, update_date) values ($1, null, null, $2, now(), $3, now() );',[member_id,"system","system"]);

  query.on('end', function(row,err) {
           client.end();
           callback(null);
           return;
           });
};

/* report_ifから選択対象を削除 */
exports.deleteReportIf = function(member_id,callback){
  
  var query = client.query('delete from t_report_if where member_id = $1;',[member_id]);

  query.on('end', function(row,err) {
           client.end();
           callback(null);
           return;
           });
};

/* report_ifへ全ての選択対象を追加*/
exports.updateAllReportIf = function(target_member_id, flag, callback){

    if(flag === true){
      async.series([
      // 全て削除
          function (dbcallback) {
              deleteAllReportIf(target_member_id, dbcallback);
          }
      ,
      // 全て追加
          function (dbcallback) {
              insertAllReportIf(target_member_id, dbcallback);
          }
      ],
      // 【END】トランザクション完了(commit or rollback)
          function (err, results) {
              if (err) {
                  callback(true);
                  return;
              }
              callback(null);
              return;
          }
      );
    }
    else{
      async.series([
      // 全て削除
          function (dbcallback) {
              deleteAllReportIf(target_member_id, dbcallback);
          }
      ],
      // 【END】トランザクション完了(commit or rollback)
          function (err, results) {
              if (err) {
                  callback(true);
                  return;
              }
              callback(null);
              return;
          }
      );
    }
}

/* report_ifへ全ての選択対象を追加 */
function insertAllReportIf(target_member_id, callback){

  var sql;

  sql = 'insert into t_report_if  (member_id, yobi_1, yobi_2, create_user, create_date, update_user, update_date) select member_id, null, null, \'system\', now(), \'system\', now() from m_member where ';
  for(var i = 0 ; i < target_member_id.length ; i++){
    if(i===0){
      sql += ' member_id = ' + target_member_id[i];
    }else{
      sql += ' or member_id = ' + target_member_id[i];
    }
  } 
  var query = client.query(sql);

  query.on('end', function(row,err) {
           client.end();
           callback(null);
           return;
           });
};

/* report_ifから全ての選択対象を削除 */
function deleteAllReportIf(target_member_id,callback){
  
  var sql;

  sql = 'delete from t_report_if where ';
  for(var i = 0 ; i < target_member_id.length ; i++){
    if(i===0){
      sql += ' member_id = ' + target_member_id[i];
    }else{
      sql += ' or member_id = ' + target_member_id[i];
    }
  } 
  var query = client.query(sql);

  query.on('end', function(row,err) {
          client.end();
          callback(null);
          return;
          });
};

/* m_reportで選択対象を更新 */
exports.updateReport = function(report_no,report_name,text_1,text_2,text_3,text_4,text_5,text_6,text_7,text_8,text_9,text_10,callback){
  
  var query = client.query('update m_report set report_name = $2, text_1 = $3, text_2 = $4, text_3 = $5, text_4 = $6, text_5 = $7, text_6 = $8, text_7 = $9, text_8 = $10, text_9 = $11, text_10 = $12 where report_no = $1',[report_no,report_name,text_1,text_2,text_3,text_4,text_5,text_6,text_7,text_8,text_9,text_10]);

  query.on('end', function(row,err) {
           client.end();
           callback(null);
           return;
           });
};

/* m_reportに選択対象を追加 */
exports.insertReport = function(report_type_no, report_name,text_1,text_2,text_3,text_4,text_5,text_6,text_7,text_8,text_9,text_10,callback){
  
  var query = client.query('INSERT INTO m_report (report_type_no, report_name, text_1, text_2, text_3, text_4, text_5, text_6, text_7, text_8, text_9, text_10, text_memo, yobi_1, yobi_2, create_user, create_date, update_user, update_date, is_disabled, is_deleted) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, null, null, null, $13, now(), $14, now(), False, False);',[report_type_no, report_name, text_1, text_2, text_3, text_4, text_5, text_6, text_7, text_8, text_9, text_10,'m.kanamori','m.kanamori']);

  query.on('end', function(row,err) {
           client.end();
           callback(null);
           return;
           });
};

/* m_reportの選択対象を削除 */
exports.deleteReport = function(report_no,callback){
  
  var query = client.query('update m_report set is_deleted = True where report_no = $1',[report_no]);

  query.on('end', function(row,err) {
           client.end();
           callback(null);
           return;
           });
};