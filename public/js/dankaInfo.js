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

        if(value1 !== value2){
            document.writeln('<td id="change">');
            document.writeln('<label>修正前：' + value1 + '<label>');
            document.write('<label>修正後：' + value2 + '<label>');
            document.writeln('</td>');
            return;
        }
};

function test(aaa){
    document.writeln('<label>' + aaa.danka_type + '<label>');
};