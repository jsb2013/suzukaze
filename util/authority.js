/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var crypto = require('crypto');

// パスワードのハッシュを作成する
exports.convertHashPassword = function(password) {
  if (password === '') {
    return '';
  }
  var shasum = crypto.createHash('sha256');
  shasum.update(password);
  return shasum.digest('hex');
};

// ユーザーを作成する
createUser = function (password) {
  var hashedPassword = _hashPassword(password);
  // TBA
};
