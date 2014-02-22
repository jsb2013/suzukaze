///////////////////////////////////////////////////////////
//
// カレンダーを生成する関数
//
// USAGE: createCalendarList(yyyy, mm, dd)
// ＜in＞
//    yyyy(int): 年
//    mm(int): 月
//    dd(int): 日
// ＜out＞
//    <div id="calendar">で囲ったテーブル型のHTMLカレンダー
//    また、カレンダー生成処理日の<td>タグの属性に"id=today"を設定
// ＜注意点＞
//    バリデーションチェックが完璧ではない！！（今後改修する。）
//  
///////////////////////////////////////////////////////////

function createHtml(value1, value2){
        
        if(isUndefine(value1)){
            var value1 = "-";
        }
        if(isUndefine(value2)){
            var value2 = "-";
        }

        if(value1 !== value2){
            document.writeln('<td class="is_change">');
            document.writeln('<label>修正前：' + value1 + '</label><br>');
            document.write('<label>修正後：' + value2 + '</label>');
            document.writeln('</td>');
            return;
        }
        document.writeln('<td>');
        document.writeln('<label>' + value1 + '</label>');
        document.writeln('</td>');
        return;
};

function createHtmlByDankaType(value1, value2){
    var dankaValue1 = "檀家";
    var dankaValue2 = "檀家";

    if(value1 === "1"){
        dankaValue1 = "信徒";
    }
    if(value2 === "1"){
        dankaValue2 = "信徒";
    }
    createHtml(dankaValue1, dankaValue2);
    return;
}

function createHtmlBySex(value1, value2){
    var sexValue1 = "男";
    var sexValue2 = "男";

    if(value1 === "2"){
        sexValue1 = "女";
    }
    if(value2 === "2"){
        sexValue2 = "女";
    }
    createHtml(sexValue1, sexValue2);
    return;
}