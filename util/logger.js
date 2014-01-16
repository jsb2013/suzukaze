// config�Ƀ��O���[�h�idisplay or log)���w�肵�āA
// ���̃��O���[�h�ŁA�\���`����ς���B
// ���O�̃G���[�����́A�ʓrjson�t�@�C����ID�ƃ��b�Z�[�W�����̃}�b�s���O�����B
// �\�����[�h�́Aconsole.log(xx)���o��
// ���O�o�͂̏ꍇ�́A�o�̓t�H���_�A���[�e�[�g�`�����֐��Ŏw��ł���悤�ɂ���B

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

