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

function createCalendarList(year, month, day) {
    // 入力変数のバリデーションチェック
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        alert("date変数に値が設定されていない。");
        return false;
    }
    // ★入力値の詳細チェックは別途追加する。
    if (month > 13) {
        alert("date変数の桁数が正しくない。");
        return false;
    }
    // 各種変数の定義
    var monthTbl = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31); //各月の最終日リスト
    var yobiLabelTbl = new Array('日', '月', '火', '水', '木', '金', '土');
    var yobiIdTbl = new Array('sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat');
    var today = new Date();
    var checkDate = new Date(year + "/" + month + "/" + day);
    var flag = checkMonth(year, today.getFullYear(), month, getMonth(today.getMonth()));
    checkDate.setDate(1);
    var yobi = checkDate.getDay(); // 対象月初日の曜日
    var lastDate = monthTbl[month - 1]; // 対象月最終日
    var rowCount = Math.ceil((lastDate - (7 - yobi)) / 7) + 1; // カレンダーの行
    var calBox = new Array();
    var callist = new Array();
    var count = 0;
    // 指定日のカレンダーをcalboxに作成する。
    for (var i = 0; i < rowCount; i++) {
        for (var j = 0; j < 7; j++) {
            if (i == 0 && j < yobi) {
                callist[j] = 0;
                continue;
            } else if (count >= lastDate) {
                callist[j] = 0;
                continue;
            } else {
                callist[j] = count + 1;
                count++;
                continue;
            }
        }
        calBox[i] = callist;
        callist = [];
    }

    // calboxを元にカレンダーを表示する。
    document.writeln('<table>');
    document.writeln('<tr>');
    // カレンダーのヘッダー部分を表示する。
    for (var h = 0; h < 7; h++) {
        document.write('<th id="' + yobiIdTbl[h] + '">');
        document.write(yobiLabelTbl[h]);
        document.writeln('</th>');
    }
    document.writeln('</tr>');
    // カレンダーのメイン部分を表示する。
    for (var i = 0; i < rowCount; i++) {
        document.writeln('<tr>');
        for (var j = 0; j < 7; j++) {
            if (calBox[i][j] == 0) {
                document.write('<td>');
                document.writeln('</td>');
                continue;
            }
            if (flag && calBox[i][j] == today.getDate()) {
                document.write('<td id="today" class="on"><label>');
                document.write(calBox[i][j]);
                document.writeln('</label></td>');
                continue;
            }
            document.write('<td class="on"><label>');
            document.write(calBox[i][j]);
            document.writeln('</label></td>');
            continue;
        }   
        document.writeln('</tr>');
    }
    document.writeln('</table>');
};

// (内部利用関数) 引数に指定した年月を比較する。
function checkMonth(yearA, yearB, monthA, monthB) {
    if (yearA == yearB && monthA == monthB) {
        return true;
    }
    return false;
};

// date()関数の月を実際の月名に変換する。
function getMonth(dateMon){
    var mon = dateMon + 1;
    if (mon == 0){
        mon = 12;
        return mon;
    }
    if (mon == 13){
        return 1;
    }
    return mon;
}

// get-requestのパラメータを取得する。
function getParamValue(param){
    if (param == null || param == undefined || param == ''){
        return -1;
    }
    var paramString = new String(param);
    var value = paramString.split("=");
    return new Number(value[1]);
}