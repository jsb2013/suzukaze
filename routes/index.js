
/*
 * GET home page.
 */

var waitScheduleDao = require("../dao/waitScheduleDao");
var userAccountDao = require("../dao/userAccountDao");
var config = require("../conf/common_config");
var log = require("../util/logger");
var logger = log.createLogger();

/*
 * スケジュール画面
 */
// 1-1.スケジュールTOP画面（get:/schedule_top）
exports.schedule_top = function(req, res){
    res.render('schedule_top', {
        loginFailed: false
    });
};

// 1-2.スケジュール画面（カレンダー指定）（get:/schedule_month）
exports.schedule_month = function(req, res){
    res.render('schedule_month', {
        loginFailed: false
    });
};

// 1-3.スケジュール画面（日指定）（get:/schedule_day）
exports.schedule_day = function(req, res){
    res.render('schedule_day', {
        loginFailed: false
    });
};

/*
 * 檀家検索画面
 */
// 2-1.檀家検索TOP画面（get:/danka_top）
exports.danka_top = function(req, res){
    res.render('danka_top', {
        loginFailed: false
    });
};

// 2-2.檀家検索-50音指定画面（get:/danka_50）
exports.danka_50 = function(req, res){
    res.render('danka_50', {
        loginFailed: false
    });
};

// 2-3.檀家検索-世話人指定画面（get:/danka_sewa）
exports.danka_sewa = function(req, res){
    res.render('danka_sewa', {
        loginFailed: false
    });
};

// 2-4.檀家検索-詳細指定画面（get:/danka_syosai）
exports.danka_syosai = function(req, res){
    res.render('danka_syosai', {
        loginFailed: false
    });
};

// 2-5.檀家検索-地区指定画面（get:/danka_tiku）
exports.danka_tiku = function(req, res){
    res.render('danka_tiku', {
        loginFailed: false
    });
};

// 2-6.檀家追加画面（get:/danka_tuika）
exports.danka_tuika = function(req, res){
    res.render('danka_tuika', {
        loginFailed: false
    });
};

// 2.ログイン画面（post:/login）
exports.loginpost = function(req, res){
    var userid = req.body.userid;
    var password = req.body.password;
    
    function authCallback(err, userInfo){
        // システムエラー[TBA:システムエラー時の画面を用意する]
        if (err) {
            res.render('login', {
                error: 100,
                loginFailed: true
            });
            return;
        }
        
        // ユーザID若しくはパスワードに誤りあり
        if (!userInfo) {
            res.render('login', {
                error: 200,
                loginFailed: true
            });
            return;
        }
        
        // 認証に成功
        req.session.user = {
            userid: userInfo.user_id,
            username: userInfo.user_name
        };
        // メイン画面へ推移
        logger.info('ILOGIN10', null, userInfo.user_id);
        res.redirect('/main');
        return;
    }
    userAccountDao.authenticate(userid, password, authCallback);
};

// 3-1.メイン画面のヘッダー（get:/header）
exports.header = function(req, res) {
    // ログイン成功画面へ推移
    res.render('header', {});
    return;
};

// 3.メイン画面遷移（get:/main）
exports.main = function(req, res){
    if (req.session.user === undefined){
        res.redirect("/login");
        return;
    }
    
    var userid = req.session.user.userid;
    var username = req.session.user.username;
    function authCallback(err, isRegist, schdInfo){
        // 認証に失敗
        // 本当は別の画面を用意したい！（最後に見直す）
        if (err) {
            res.render('login', {
                error: 200,
                loginFailed: true
            });
            return;
        }
        // メイン画面へ推移
        res.render('main', {
            isRegist: isRegist,
            schdInfo: schdInfo,
            username: username
        }); 
        return;
    }
    waitScheduleDao.getWaitScheduleInfo(userid, authCallback);
};

// 4.ユーザ情報登録画面（get:/create）
exports.create = function(req, res) {
    // ログイン成功画面へ推移
    res.render('create', {});
    return;
};

// 5.ユーザ情報登録成功画面への推移（post:/create）
exports.createpost = function(req, res) {
    var userid = req.body.userid;
    var username = req.body.username;
    var password = req.body.password;
    
    function authCallback(err){
        // 認証に失敗
        // 本当は別の画面を用意したい！（最後に見直す）
        if (err) {
            res.render('login', {
                error: 200,
                loginFailed: true
            });
            return;
        }
        // 認証に成功
        req.session.user = {
            userid: userid,
            username: username
        };
    
        // ログイン成功画面へ推移
        res.render('create_success', {});
        return;
    }
    userAccountDao.insertUserAccount(userid, username, password, authCallback);
};

// 5.ユーザ情報登録成功画面への推移（get:/register）
exports.register = function(req, res) {
    if (req.session.user === undefined){
        res.redirect("/login");
        return;
    }
    var userid = req.session.user.userid;
    
    function authCallback(err){
        // 認証に失敗
        // 本当は別の画面を用意したい！（最後に見直す）
        if (err) {
            res.render('login', {
                error: 200,
                loginFailed: true
            });
            return;
        }
    
        // ログイン成功画面へ推移
        res.redirect('/main');
        return;
    }
    waitScheduleDao.inserWaitSchedule(userid, authCallback);
};

// 5.ユーザ情報登録成功画面への推移（get:/delete）[TBA]こういうのは全部POSTにしないといけない。
exports.delete = function(req, res) {
    if (req.session.user === undefined){
        res.redirect("/login");
        return;
    }
    var userid = req.session.user.userid;
    
    function authCallback(err){
        // 認証に失敗
        // 本当は別の画面を用意したい！（最後に見直す）
        if (err) {
            res.render('login', {
                error: 200,
                loginFailed: true
            });
            return;
        }
    
        // ログイン成功画面へ推移
        res.redirect('/main');
        return;
    }
    waitScheduleDao.updateStatusForWaitSchedule(userid, '4', authCallback);
};

// 5.ユーザ情報登録成功画面への推移（get:/delete）
exports.logout = function(req, res) {
    if (req.session.user === undefined){
        res.redirect("/login");
        return;
    }
    // セッションの破棄
    req.session.destroy;
    res.redirect("/login");
    return;
};

