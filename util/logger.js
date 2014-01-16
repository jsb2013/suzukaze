// configにログモード（display or log)を指定して、
// そのログモードで、表示形式を変える。
// ログのエラー文言は、別途jsonファイルにIDとメッセージ文言のマッピングを作る。
// 表示モードは、console.log(xx)を出す
// ログ出力の場合は、出力フォルダ、ローテート形式を関数で指定できるようにする。

var log4js = require('log4js');
var logger = log4js.getLogger('console');
var messageBox = require('../conf/message');

var Logger = function(){};

Logger.prototype.info = function(messageCode, param, userid){
    var outMessage = this.convertMessage(messageCode, param, userid);
    logger.info(outMessage);
};

Logger.prototype.warn = function(messageCode, param, userid){
    var outMessage = this.convertMessage(messageCode, param, userid);
    logger.warn(outMessage);
};

Logger.prototype.error = function(messageCode, param, userid){
    var outMessage = this.convertMessage(messageCode, param, userid);
    logger.error(outMessage);
};

Logger.prototype.convertMessage = function(messageCode, param, userid){
    var dispMessage = this.convertCodeToMessage(messageCode);
    var dispUserid = this.getUserid(userid);
    if(!param){
        return '[' +dispUserid +'] ' + dispMessage;
    }
    return '[' + dispUserid + '] ' + dispMessage + '. param:(' + param +')'; 
};

Logger.prototype.convertCodeToMessage = function(messageCode){
    if(messageCode && messageBox[messageCode]){
        var message = messageBox[messageCode];
        return message;
    }
    return 'MESSAGE NOT REGISTERD.';
};

Logger.prototype.getUserid = function(userid){
    if(userid){
        return userid;
    }
    return '-----';
};

function createLogger(){
   return new Logger(); 
}

exports.createLogger = createLogger;

