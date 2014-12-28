/* Copyright (c) 2012, Hiromichi Matsushima <hylom@users.sourceforge.jp>
 *All rights reserved.
 *This file is released under New BSD License.
 */
var crypto = require('crypto');
var database = require("../../dao/database");
var client = database.createClient();

var users = exports;

// 認証を行う
users.authenticate = function (name, password, callback) {

  var query = client.query('select * from m_account where is_disabled is FALSE and is_deleted is FALSE and login_id = $1 ',[name]);

  var rows = [];
  var userInfo;
 
  query.on('row', function(row) {
           rows.push(row);
           });
  
  query.on('end', function(row,err) {
            client.end();
            userInfo = rows[0];
            console.log(userInfo);

            console.log("rows.length:"+ rows.length);
            
            // 該当ユーザー有り
            if (rows && (rows.length > 0)) {
                if (userInfo.password == _hashPassword(password)) {
                    // パスワードOK
                    callback(null,userInfo);
                    return;
                }
			}

            // 該当ユーザー無し or パスワードNG
            callback(err,null);
            //console.log("PASS:" + password);
            //console.log("PASS(hash):" + _hashPassword(password));
            //console.log("PASS(DB):" + userInfo.password);
            return;
            });
};

// パスワードのハッシュを作成する
function _hashPassword(password) {
  if (password === '') {
    return '';
  }
  var shasum = crypto.createHash('sha256');
  shasum.update(password);
  return shasum.digest('hex');
}

// ユーザー名からアカウント情報を取得する
users.getByUsername = function (name, callback) {
  db.query('SELECT * FROM m_account WHERE login_id = ?',
	     [name,], queryCallback);
  function qurryCallback(err, results, fields) {
    db.end();
    if (err) {
      callback(err, undefined);
      return;
    }
    if (results && (results.length > 0)) {
      userInfo = results[0];
      delete userInfo.password;
      callback(false, userInfo);
    } else {
      callback(false, null);
    }
  }
}
  
// ユーザーを作成する
users.createUser = function (name, password, callback) {
  var hashedPassword = _hashPassword(password);
  db.query(
    'INSERT INTO m_account '
      + '(id,  login_id, password) '
      + 'VALUES '
      + '(NULL, ?,    ?)'
      + ';',
    [name, hashedPassword],
    function (err, results, fields) {
      db.end();
      var sid = results.insertId;
      if (err) {
        callback(new Error('Insert failed.'));
      }
      callback(null, sid);
    });
}
