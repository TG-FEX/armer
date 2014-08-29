armer.support.flash = (function(){
    var support = !1,
        version = "",
        plugin, mime, actXObj;

    function getVersion(s) {
        s = s.match(/[\d]+/g);
        s.length = 3;
        return s.join(".")
    }
    if (navigator.plugins && navigator.plugins.length) {
        plugin = navigator.plugins["Shockwave Flash"];
        plugin && (support = !0, plugin.description && (version = getVersion(plugin.description)));
        navigator.plugins["Shockwave Flash 2.0"] && (support = !0, version = "2.0.0.11")
    } else {
        if (navigator.mimeTypes && navigator.mimeTypes.length) {
            mime = navigator.mimeTypes["application/x-shockwave-flash"];
            (support = mime && mime.enabledPlugin) && (version = getVersion(mime.enabledPlugin.description))
        } else {
            try {
                actXObj = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
                support = !0;
                version = getVersion(actXObj.GetVariable("$version"));
            } catch (h) {
                try {
                    actXObj = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
                    support = !0;
                    version = "6.0.21";
                } catch (i) {
                    try {
                        actXObj = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                        support = !0;
                        version = getVersion(actXObj.GetVariable("$version"))
                    } catch (j) {}
                }
            }
        }
    }

    return version
})();
(function($){
    $.Flash = function(src, options){
        var callee = arguments.callee;
        if (! this instanceof callee) return new callee(src, options);
        if (typeof src == 'object') {
            options = src;
            src = null
        }
        this.options = $.extend({}, callee.defaults, options);
        this.src = src || options.src;
        this.id = options.id;
        this.width = options.width;
        this.height = options.height;
        delete options.id;
        delete options.src;
        delete options.width;
        delete options.height;
    }
    $.Flash.prototype = {
        toString: function(){
            var options = this.options,
                height = this.height,
                width = this.width,
                id = this.id;
            var size = (width ? (' width="' + width + '" ') : '') + (height ? (' height="' + height + '"'): '')
            var obj = '<object' + (id ? ' id="' + id + '"' : '') + ' classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"' + size + '><param name="movie" value="' + src + '" />',
                embed = '<embed src="' + src + '"' + (id ? ' name="' + id + '"' : '') + size + ' pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"';
            for (var n in options) {
                obj += '<param name="' + n + '" value="' + options[n] + '" />';
                embed += ' ' + n + '="' + options[n] + '"';
            }
            embed += '></embed>';
            obj += embed + '</object>';
            return obj;
        },
        appendTo: function(elem){
            return $(this.toString()).appendTo(elem);
        }
    }
    $.Flash.defaults = {
        wmode: "transparent",
        quality: "high"
    }


})(armer)
