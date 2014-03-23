$(function() {

    // ソケット通信の開始  socket.on
    var socket = io.connect("http://localhost");

    // SelectReportTypeメッセージを受けたとき
    socket.on('SelectReportType', function(data) {
      // 選択肢から一度全て取り除く
      $('#select_template > option').remove();
      // テンプレートを選択肢に追加
      $('#select_template').append($('<option>').html("内容を選択").val(9999));
      for(var i=0 ; i < data.length ; i++){
        $('#select_template').append($('<option>').html(data[i].report_name).val(data[i].report_no));
      }
    });

    // SelectReportメッセージを受けたとき
    socket.on('SelectReport', function(data) {

      // 帳票名を設定
      $("#input_report_name").val(data[0].report_name);
      // 送付状を設定
      $("#input_souhujo").val(data[0].text_1);
      // 口座番号1を設定
      $("#input_kouzaNo1").val(data[0].text_2);
      // 口座番号2を設定
      $("#input_kouzaNo2").val(data[0].text_3);
      // 口座番号3を設定
      $("#input_kouzaNo3").val(data[0].text_4);
      // 金額を設定
      $("#input_kingaku").val(data[0].text_5);
      // 料金を設定
      $("#input_ryoukin").val(data[0].text_6);
      // 特殊取扱を設定
      $("#input_tokyusyu").val(data[0].text_7);
      // 加入者名を設定
      $("#input_kanyusyaMei").val(data[0].text_8);
      // 通信を設定
      $("#input_tushin").val(data[0].text_9);
      // 件名を設定
      $("#input_report_title").val(data[0].text_10);
    });

    // ReportSaveメッセージを受けたとき
    socket.on('ReportSave', function() {
      alert('保存されました。');
    });

    // ReportSaveAsメッセージを受けたとき
    socket.on('ReportSaveAs', function() {
      alert('別名で保存されました。\n検索ページへ戻ります。');
      location.reload();
    });

    // ReportDeleteメッセージを受けたとき
    socket.on('ReportDelete', function() {
      alert('削除しました。\n検索ページへ戻ります。');
      location.reload();
    });

    // GetTargetListメッセージを受けたとき
    socket.on('GetTargetList', function(data) {
      //alert("add:"+ data.length)
      // まずは一度全て取り除く
      $('#target_list > tr').remove();

      for(var i=0;i<data.length;i++){
      	var html = "";
          html += "<tr>";
          html +=   "<td>";
        if(data[i].report_if_id == null){
          html +=     "<input type='checkbox' id='selected_" + i + "' name='target' value="+ data[i].member_id + "></input>";
        }else{
          html +=     "<input type='checkbox' id='selected_" + i + "' name='target' value="+ data[i].member_id + " checked></input>";
        }
          html +=   "</td>";
          html +=   "<td>";
          html +=     "<p>" + data[i].name +"</p>";
          html +=   "</td>";        	          
          html +=   "<td>";
          html +=     "<p>" + data[i].address +"</p>";
          html +=   "</td>";
          html +=   "<td>";
          html +=     "<p>" + data[i].tags + "</p>";
          html +=   "</td>";
          html +=  "</tr>";

        $('#target_list').append(html);
        var val = data[i].name_na;
        $('#selected_' + i ).on('click', function(){
          if($(this).prop('checked') == true){
            var data = $(this).attr('value');
            // InsertReportIfメッセージを送る
            socket.emit('InsertReportIf', { value: data });
          }
          else{
            var data = $(this).attr('value');
            // DeleteReportIfメッセージを送る
            socket.emit('DeleteReportIf', { value: data });
          }
        });
      }
    });

    // disconnectionメッセージを送る
    function DisConnect() {
      var msg = socket.socket.transport.sessid + "は切断しました。";
      socket.emit('disconnection', { value: msg });
      socket.disconnect();
    }

    // SelectReportTypeメッセージを送る
    function SendSelectReportType() {
      // report_type_noを送る
      var data = $("select[id='select_type']").val();
      socket.emit('SelectReportType', { value: data });
    }

    // SelectReportメッセージを送る
    function SendSelectReport() {
      // report_type_noを送る
      var data = $("select[id='select_template']").val();
      socket.emit('SelectReport', { value: data });
    }

    // GetTargetListメッセージを送る
    function GetTargetList() {
      // 検索ボックスに入力されたtagsを送る
      var data = $('#serch_tag').val();
      socket.emit('GetTargetList', { value: data });
    }

    // ChangeAllメッセージを送る
    function all_change(){
      var elem = document.getElementsByName("target");

      if(document.getElementById("all_change").checked){
        for(var i = 0; i < elem.length; i++){
    　     elem[i].checked = "checked";
          // DeleteReportIfメッセージを送る(一度消して)
          socket.emit('DeleteReportIf', { value: elem[i].value });
          // InsertReportIfメッセージを送る(追加する)
          socket.emit('InsertReportIf', { value: elem[i].value });
        }
      }
      else{
        for(var i = 0; i < elem.length; i++){
          elem[i].checked = "";
          // DeleteReportIfメッセージを送る
          socket.emit('DeleteReportIf', { value: elem[i].value });
        }
      }
    }
    
    // ReportSaveメッセージを送る
    function ReportSave() {
      // 帳票テンプレートNoを送る
      var report_no = $('#select_template').val();
      // 帳票名を設定
      var report_name = $("#input_report_name").val();
      // 挨拶文を設定
      var text_1 = $("#input_souhujo").val();
      // 口座番号1を設定
      var text_2 = $("#input_kouzaNo1").val();
      // 口座番号2を設定
      var text_3 = $("#input_kouzaNo2").val();
      // 口座番号3を設定
      var text_4 = $("#input_kouzaNo3").val();
      // 金額を設定
      var text_5 = $("#input_kingaku").val();
      // 料金を設定
      var text_6 = $("#input_ryoukin").val();
      // 特殊取扱を設定
      var text_7 = $("#input_tokyusyu").val();
      // 加入者名を設定
      var text_8 = $("#input_kanyusyaMei").val();
      // 通信を設定
      var text_9 = $("#input_tushin").val();
      // 件名を設定
      var text_10 = $("#input_report_title").val();

      socket.emit('ReportSave', { 
              report_no: report_no ,report_name: report_name ,
              text_1: text_1 ,text_2: text_2 ,text_3: text_3 ,text_4: text_4 ,text_5: text_5 ,
              text_6: text_6 ,text_7: text_7 ,text_8: text_8 ,text_9: text_9 ,text_10: text_10});
    }

    // ReportSaveAsメッセージを送る
    function ReportSaveAs() {
      // 帳票種別Noを送る
      var report_type_no = $('#select_type').val();
      // 帳票名を設定
      var report_name = $("#input_report_name").val();
      // 挨拶文を設定
      var text_1 = $("#input_souhujo").val();
      // 口座番号1を設定
      var text_2 = $("#input_kouzaNo1").val();
      // 口座番号2を設定
      var text_3 = $("#input_kouzaNo2").val();
      // 口座番号3を設定
      var text_4 = $("#input_kouzaNo3").val();
      // 金額を設定
      var text_5 = $("#input_kingaku").val();
      // 料金を設定
      var text_6 = $("#input_ryoukin").val();
      // 特殊取扱を設定
      var text_7 = $("#input_tokyusyu").val();
      // 加入者名を設定
      var text_8 = $("#input_kanyusyaMei").val();
      // 通信を設定
      var text_9 = $("#input_tushin").val();
      // 件名を設定
      var text_10 = $("#input_report_title").val();

      socket.emit('ReportSaveAs', { 
              report_type_no: report_type_no,report_name: report_name ,
              text_1: text_1 ,text_2: text_2 ,text_3: text_3 ,text_4: text_4 ,text_5: text_5 ,
              text_6: text_6 ,text_7: text_7 ,text_8: text_8 ,text_9: text_9 ,text_10: text_10});
    }

    // ReportDeleteメッセージを送る
    function ReportDelete() {
      
     var myRet = confirm("表示している帳票データを削除します。よろしいですか？");
     if ( myRet == true ){
      // 帳票テンプレートNoを送る
      var report_no = $('#select_template').val();

      socket.emit('ReportDelete', {report_no: report_no});
     }
    }
});
