;(function ($) {

        
    var methods = {
        init: function(){
                
        },

        // ENTERキーで次のセルに移動するメソッド
        toNextCell: function(){
            var elements = this;

            $(elements).keypress(function(e) {
                var c = e.which ? e.which : e.keyCode;
                if (c == 13) { 
                    var index = $(elements).index(this);
                    var nextIndex = index + 1;
                    var pressShiftKey = e.shiftKey;

                    // Enter(!shift)で最後のIndexの場合、処理を終了する。（→submitが有効となる。）
                    if(!pressShiftKey){
                        var elementsMax = elements.length;    
                        if(nextIndex == elementsMax){
                            return this;
                        }
                    }

                    // shift+Enterの場合、一つ前のセルにIndexを設定
                    if(pressShiftKey){
                        nextIndex = index;
                        if(index > 0){
                            nextIndex = index -1;
                        }
                    }
                    elements[nextIndex].focus();
                    e.preventDefault();
                } 
            });
            return this;
        },

        // CELLに"undefine"が登録されていたら空白に変換
        undefileToBlank: function(){
            var elements = this;
            $(elements).each(function(){
                var value = $(this).val();
                $(this).val(convertNullToBlank(value));
            });
            return this;
        },

        // checkboxのvalueに"checkMojiRetu（カンマ区切り）"が含まれる場合、check=trueにする。
        inputCheckbox: function(checkMojiRetu, isString){
            if(!isUndefine(checkMojiRetu)){
                var testList = checkMojiRetu;
                if(isString){
                    testList = checkMojiRetu.split(",");
                }
                var elements = this;
                for(var i in testList){
                    var value = testList[i];
                    $(elements).each(function(){ 
                        var aaa = $(this).val();
                        if(value == aaa){
                            $(this).attr("checked", true );
                        }
                    });
                }
            }
            return this;
        },

        // checkboxのvalueに"checkMojiRetu（カンマ区切り）"が含まれる場合、check=trueにする。
        selectList: function(checkCode){
            if(!isUndefine(checkCode)){
                var _checkCode = checkCode;
                var elements = this;
                elements.val(_checkCode);
            }
            return this;
        },

        // checkboxのvalueに"checkMojiRetu（カンマ区切り）"が含まれる場合、check=trueにする。
        checkRadioButton: function(checkCode){
            if(!isUndefine(checkCode)){
                var _checkCode = checkCode;
                var elements = this;
                elements.val(_checkCode);
            }
            return this;
        },

        // フォーカスが外れると全角→半角に変換するメソッド（対象：数値）
        convertNumberZenToHan: function(){
            var elements = this;
            $(elements).change(function(e) {
                var data = $(this).val();
                var hankaku = data.replace(/[Ａ-Ｚａ-ｚ０-９]|\－|\＋/g,function(s){return String.fromCharCode(s.charCodeAt(0)-0xFEE0)});
                $(this).val(hankaku);
                e.preventDefault();
            });
            return this;
        },

        // EnterKeyをclick()イベントに変換する。
        convertEnterToClick: function(){
            var elements = this;
            $(elements).keypress(function(e) {
                var c = e.which ? e.which : e.keyCode;
                if (c == 13) { 
                    $(this).click();
                }
                e.preventDefault();
            });
            return this;
        },

        // 郵便番号から住所を検索する。
        // 前提として呼出元のHTMLで「<script src="http://api.zipaddress.net/sdk/zipaddr.min.js"></script>」を定義する。
        searchZipCode: function(){
            var elements = this;
            $(elements).click(function(e) {
                var zipCodePre = $("#zip_code_pre").val();
                var zipCodeLast = $("#zip_code_last").val();
                var zipCode = zipCodePre + zipCodeLast;
                ZA.request(zipCode, function(data, err) {
                    // エラーがあったか見つからない
                    if ( err ) {
                        return alert("入力した郵便番号に該当する住所がありません。");
                    }
                    var region = data.pref;
                    var city = data.address;
                    $("#region").val(region);
                    $("#city").val(city);
                });
                e.preventDefault();
            });
            return this;
        },

        // 比較を
        diffTextList: function(beforeTextList){

            // 比較対象のTEXTLIST
            var elements = this;

            // テキスト項目の差分チェックを実施
            var isChange = false;
            $(elements).each(function(){
                var key = $(this).attr("name");
                var value = $(this).val();
                //$(".chenge_check_bk").each(function(){
                $(beforeTextList).each(function(){
                    if($(this).hasClass(key)){
                        var valueBk = $(this).val();
                        if(value !== valueBk){
                            isChange = true;
                            return false;
                        }
                        return true;
                    }
                });
            
                if(isChange){
                    return true;
                }
            });
            return isChange;
        },

        // 比較を
        changeTagsToString: function(){

            // 比較対象のTEXTLIST
            var elements = this;
            var checkTags = "";

            $(elements).each(function () {
                var _tagName = $(this).val();
                //var _tagName = $(this)[0].nextSibling.nodeValue;
                var _tagNameTrim = jQuery.trim(_tagName);
                if (isUndefine(checkTags)) {
                    checkTags = _tagNameTrim;
                    return true;
                }
                checkTags = checkTags + "," + _tagNameTrim;
                return true;
            });
            return checkTags;
        },

        // formのバリデーションチェックを行う。
        validationCheck: function(formInfoJson, nestNo){
            var elements = this;

            // エラーの初期化
            $("p.error").remove();
            $("p.clear_both").remove();
            $("td").removeClass("error");
         
            var isError = false;
            var isDuplicateForRequire = false;
            var isDuplicateForNumber = false;
            var isDuplicateForValueLimit = false;
            var isDuplicateForSpecial = false;
            $(elements).each(function(){
                var value = $(this).val();

                // 必須項目チェック
                if($(this).hasClass("require")){
                    if(isUndefine(value)){
                        isError = true;
                        // 重複フラグ考慮要のCELLで、重複フラグFALSEの場合
                        if($(this).hasClass("duplicate") && !isDuplicateForRequire){
                            isDuplicateForRequire = true;
                            if(isUndefine(nestNo)){
                                //何もしない
                            } else{
                                $(this).parent().parent().append("<p class='clear_both'>★入力して下さい。（入力必須項目です）</p>");
                                $(this).parent().parent().addClass("error");
                            }
                            return;
                        // 重複フラグ考慮要のCELLで、重複フラグTRUEの場合
                        } else if($(this).hasClass("duplicate") && isDuplicateForRequire){
                            return;
                        // 重複フラグ考慮要の最終CELLで、重複フラグがTRUEの場合
                        } else if($(this).hasClass("duplicate_end") && isDuplicateForRequire){
                            isDuplicateForRequire = false;
                            return;
                        // 重複フラグなし、若しくは重複フラグ考慮要の最終CELLかつ重複フラグFALSEの場合
                        } else {
                            if(isUndefine(nestNo)){
                                //何もしない
                            } else{
                                $(this).parent().parent().append("<p class='clear_both'>★入力して下さい。（入力必須項目です）</p>");
                                $(this).parent().parent().addClass("error");
                            }
                            isDuplicateForRequire = false;
                            return;
                        }
                    }
                }

                // 特殊文字チェック(住所で使うし、-は外した。これだけで問題が起きることは無いし。)
                if($(this).hasClass("sp_check")){
                    if(!isUndefine(value) && value.match(/['"*+.\?\{\}\]\[()^$|=]/)){
                        isError = true;
                        // 重複フラグ考慮要のCELLで、重複フラグFALSEの場合
                        if($(this).hasClass("duplicate") && !isDuplicateForSpecial){
                            isDuplicateForSpecial = true;
                            if(isUndefine(nestNo)){
                                //何もしない
                            } else{
                                $(this).parent().parent().append("<p class='clear_both'>★特殊文字は入力できません。(対象文字： \'\"\\\*\+\.\?\{\}\[\]\&\(\)\^\$\-\|\=\`)</p>");
                                $(this).parent().parent().addClass("error");
                            }
                        // 重複フラグ考慮要のCELLで、重複フラグTRUEの場合
                        } else if($(this).hasClass("duplicate") && isDuplicateForSpecial){
                        // 重複フラグ考慮要の最終CELLで、重複フラグがTRUEの場合
                        } else if($(this).hasClass("duplicate_end") && isDuplicateForSpecial){
                            isDuplicateForSpecial = false;
                        // 重複フラグなし、若しくは重複フラグ考慮要の最終CELLかつ重複フラグFALSEの場合
                        } else {
                            if(isUndefine(nestNo)){
                                //何もしない
                            } else{
                                $(this).parent().parent().append("<p class='clear_both'>★特殊文字は入力できません。(対象文字： \'\"\\\*\+\.\?\{\}\[\]\&\(\)\^\$\-\|\=\`)</p>");
                                $(this).parent().parent().addClass("error");
                            }
                            isDuplicateForSpecial = false;
                        }
                    }
                }

                // 【一般的】名前チェック（漢字、ひらがな、カタカナ、数字、ハイフン、スペースのみ許可）※本チェックだと外字が入らない。
                if($(this).hasClass("name_check")){
                    if(!isUndefine(value) && !value.match(/^[ぁ-んァ-ヶー一-龠a-zA-Z0-9 　\r\n\t\-]+$/)){
                        isError = true;
                        $(this).parent().parent().append("<p class='clear_both'>★[漢字/ひらがな/カタカナ/数字/空白/スペース]の何れかを入力して下さい。</p>");
                        $(this).parent().parent().addClass("error");
                    }
                }

                // 【一般的】フリガナチェック（ひらがな、カタカナ、数字、ハイフン、スペースのみ許可）
                if($(this).hasClass("furigana_check")){
                    if(!isUndefine(value) && !value.match(/^[ぁ-んァ-ヶー一a-zA-Z0-9 　\r\n\t\-]+$/)){
                        isError = true;
                        $(this).parent().parent().append("<p class='clear_both'>★[ひらがな、かたかな、ー、スペース]を入力して下さい。</p>");
                        $(this).parent().parent().addClass("error");
                    }
                }

                // メールアドレスチェック（アルファベット、数字、@、.、_、-を許可。）
                if($(this).hasClass("mail")){
                    if(!isUndefine(value) && !value.match((/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/))){
                        isError = true;
                        $(this).parent().parent().append("<p class='clear_both'>★[アルファベット、数字、@、.、_、-]を入力して下さい。</p>");
                        $(this).parent().parent().addClass("error");
                    }
                }

                // 数字項目チェック
                if($(this).hasClass("number")){
                    if(!isUndefine(value) && isNaN(value)){
                        isError = true;
                        // 重複フラグ考慮要のCELLで、重複フラグFALSEの場合
                        if($(this).hasClass("duplicate") && !isDuplicateForNumber){
                            isDuplicateForNumber = true;
                            if(isUndefine(nestNo)){
                                //何もしない
                            } else{
                                $(this).parent().parent().append("<p class='clear_both'>★数値を入力して下さい。</p>");
                                $(this).parent().parent().addClass("error");
                            }
                        // 重複フラグ考慮要のCELLで、重複フラグTRUEの場合
                        } else if($(this).hasClass("duplicate") && isDuplicateForNumber){
                        // 重複フラグ考慮要の最終CELLで、重複フラグがTRUEの場合
                        } else if($(this).hasClass("duplicate_end") && isDuplicateForNumber){
                            isDuplicateForNumber = false;
                        // 重複フラグなし、若しくは重複フラグ考慮要の最終CELLかつ重複フラグFALSEの場合
                        } else {
                            if(isUndefine(nestNo)){
                                //何もしない
                            } else{
                                $(this).parent().parent().append("<p class='clear_both'>★数値を入力して下さい。</p>");
                                $(this).parent().parent().addClass("error");
                            }
                            isDuplicateForNumber = false;
                        }
                    }
                }
            
                if(isUndefine(formInfoJson)){
                    // 桁数チェックファイル指定なしの場合
                    return;
                }
                // 桁数チェック
                var idName = $(this).attr("id");
                var limitNum = formInfoJson[idName];

                if(!isUndefine(limitNum) && !isUndefine(value)){
                    if(value.length > limitNum){
                        isError = true;
                        // 重複フラグ考慮要のCELLで、重複フラグFALSEの場合
                        if($(this).hasClass("duplicate") && !isDuplicateForValueLimit){
                            isDuplicateForValueLimit = true;
                            var valueLength = value.length;
                            if(isUndefine(nestNo)){
                                //何もしない
                            } else{
                                $(this).parent().parent().append("<p class='clear_both'>★桁数が長すぎます（上限桁数：" + limitNum + "桁 / 設定桁数：" + valueLength + "桁）</p>");
                                $(this).parent().parent().addClass("error");
                            }
                        // 重複フラグ考慮要のCELLで、重複フラグTRUEの場合
                        } else if($(this).hasClass("duplicate") && isDuplicateForValueLimit){
                            // DO NOTHING
                        // 重複フラグ考慮要の最終CELLで、重複フラグがTRUEの場合
                        } else if($(this).hasClass("duplicate_end") && isDuplicateForValueLimit){
                            isDuplicateForValueLimit = false;
                        // 重複フラグなし、若しくは重複フラグ考慮要の最終CELLかつ重複フラグFALSEの場合
                        } else {
                            var valueLength = value.length;
                            if(isUndefine(nestNo)){
                                //何もしない
                            } else{
                                $(this).parent().parent().append("<p class='clear_both'>★桁数が長すぎます（上限桁数：" + limitNum + "桁 / 設定桁数：" + valueLength + "桁）</p>");
                                $(this).parent().parent().addClass("error");
                            }
                            isDuplicateForValueLimit = false;
                        }
                    }
                }
            });
         
            // エラーチェック
            if(isError){
                return true;
            }
            return false;
        },

        // フォーカスが外れると全角→半角に変換するメソッド（対象：数値/英文字/メール用特殊記号）
        convertMailZenToHan: function(){
            var elements = this;
            var zenkigou = "＠－ー＋＿．，、";
            var hankigou = "@--+_...";

            $(elements).change(function(e) {
                var str = "";
                var data = $(this).val();

                // 指定された全角記号のみを半角に変換
                for (i=0; i<data.length; i++){
                    var dataChar = data.charAt(i);
                    var dataNum = zenkigou.indexOf(dataChar,0);
                    if (dataNum >= 0) dataChar = hankigou.charAt(dataNum);
                    str += dataChar;
                }
                // 定番の、アルファベットと数字の変換処理
                var hankaku = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g,function(s){return String.fromCharCode(s.charCodeAt(0)-0xFEE0)});
                $(this).val(hankaku);
                e.preventDefault();
            });
            return this;
        }
    };

    
    $.fn.formUtil = function (method) {
        var elements = this;
            // メソッド呼び出し部分
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
        }
        return this;
    };
})(jQuery);
