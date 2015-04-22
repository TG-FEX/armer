(function($){
    $.Utility = $.extend(function(){},{
        // 关闭窗口
        'closeWindow' : function(confirmStr){
            if (confirmStr && !confirm(confirmStr)) return;
            if (document.referrer == "") {
                if ($.browser.mozilla) return alert("该窗口需要关闭。但火狐浏览器不支持关闭单独窗口，请手动关闭。");
                window.opener = '';
                window.open('','_self');
            }
            window.close();
        },
        // 文本复制
        'copyText' : function(text, notdebug){
            var copy = true;
            if (window.clipboardData) {
                window.clipboardData.clearData();
                window.clipboardData.setData("Text", text);
            }else if (!notdebug) {
                prompt("非IE浏览器请用Ctrl+c手动复制链接", text);
                copy = false;
            }
            return copy;
        },
        // 添加收藏
        'addFavorite' : function(url,title){
            var url = url || top.location.href;
            var title = title || top.document.title;
            if (document.all) {
                window.external.addFavorite(url,title); }
            else if (window.sidebar)  {
                window.sidebar.addPanel(title, url, "");
            } else {
                alert("收藏失败！请使用Ctrl+D进行收藏");
            }
        }
    });


    var list = [], t;
    function start(){
        t = setInterval(function(){
            list.forEach(function(item){
                var now = $.now();
                var pass = getpass(item, now);
                item.tickNum ++;
                if (!item._lastTick) item._lastTick = now;
                if (now - item._lastTick >= item.interval) {
                    item.trigger($.Timer.event.TICK, [pass,  pass / item.timeout, item.tickNum]);
                    item._lastTick = now;
                }
                if (item.tickNum >= item.limit || pass >= item.timeout) {
                    item.trigger($.Timer.event.FINISH);
                }
            })
        }, $.Timer.interval);
    }
    function getpass(item, now) {
        var pass = now - item._startTime + item._pass;
        pass = pass > item.timeout ? item.timeout : pass;
        return pass;
    }

})(armer);

