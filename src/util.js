


    $.Utility = function(){
    return $.extend(function(){},{
        // �رմ���
        'closeWindow' : function(confirmStr){
            if (confirmStr && !confirm(confirmStr)) return;
            if (document.referrer == "") {
                if ($.browser.mozilla) return alert("�ô�����Ҫ�رա�������������֧�ֹرյ������ڣ����ֶ��رա�");
                window.opener = '';
                window.open('','_self');
            }
            window.close();
        },
        // �ı�����
        'copyText' : function(text, notdebug){
            var copy = true;
            if (window.clipboardData) {
                window.clipboardData.clearData();
                window.clipboardData.setData("Text", text);
            }else if (!notdebug) {
                prompt("��IE���������Ctrl+c�ֶ���������", text);
                copy = false;
            }
            return copy;
        },
        // ����ղ�
        'addFavorite' : function(url,title){
            var url = url || top.location.href;
            var title = title || top.document.title;
            if (document.all) {
                window.external.addFavorite(url,title); }
            else if (window.sidebar)  {
                window.sidebar.addPanel(title, url, "");
            } else {
                alert("�ղ�ʧ�ܣ���ʹ��Ctrl+D�����ղ�");
            }
        }
    })
}();

