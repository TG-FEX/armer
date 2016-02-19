/**
 * Created by Administrator on 2015/12/16.
 */
(function (k) {
    var h = document.dispatchEvent, e, n = /([a-zA-Z]\w*)?(?:#([a-zA-Z]\w+))?(?:((?:\.[a-zA-Z]\w*)+))?/, o = {"float": h ? "cssFloat" : "styleFloat"}, l = {
        opacity: {
            get: function (a) {
                h ? a = document.defaultView.getComputedStyle(a, null).getPropertyValue("opacity") : (a = a.filters.alpha.opacity || a.filters["DXImageTransform.Microsoft.Alpha"].opacity, a = (a ? a / 100 : a) + "");
                return a
            }, set: function (a, b) {
                h ? a.style.opacity = +b : a.style.alpha.opacity =
                    100 * +b
            }
        }
    }, p = function (a, b, c) {
        var b = b || document, c = c || "*", d = [];
        if (document.getElementsByClassName)for (var a = b.getElementsByClassName(a), f = 0; b = a[f++];)("*" == c || b.tagName === c.toUpperCase()) && d.push(b); else {
            a = a.split(" ");
            b = "*" === c && b.all ? b.all : b.getElementsByTagName(c);
            c = [];
            for (f = a.length; 0 <= --f;)c.push(RegExp("(^|\\s)" + a[f] + "(\\s|$)"));
            for (var j = b.length; 0 <= --j;) {
                for (var a = b[j], f = !1, e = 0, g = c.length; e < g && !(f = c[e].test(a.className), !f); e++);
                f && d.push(a)
            }
        }
        return d
    }, q = {"class": h ? "class" : "className"}, r = function (a) {
        var b =
            window.event || a, a = b.charCode || b.keyCode, c = b.srcElement || b.target;
        this.originalEvent = b;
        this.keyCode = a;
        this.target = c;
        this.preventDefault = function () {
            b.preventDefault ? b.preventDefault() : b.returnValue = !1
        };
        this.stopPropagation = function () {
            b.stopPropagation ? b.stopPropagation() : b.cancelBubble = !0
        }
    }, i = {
        bind: function (a, b) {
            var c = this.event = this.event || {}, d = c[a] = c[a] || {};
            d.queue = d.queue || [];
            d.queue.push(b);
            d.active || (this.each(function (b) {
                var c =
                    this;
                e.bind(c, a, function (a) {
                    for (var e = 0, g = d.queue.length; e < g; e++)d.queue[e].call(c, new r(a), b)
                })
            }), d.active = !0);
            return this
        }, unbind: function (a) {
            this.event[a].queue = [];
            return this
        }, hover: function (a, b) {
            b = b || a;
            this.bind("mouseover", function (b, d) {
                b.stopPropagation();
                a.call(this, b, d)
            });
            this.bind("mouseout", function (a, d) {
                b.call(this, a, d)
            })
        }, submit: function () {
            var a = this.el[0];
            "form" == this.tagName.toLowerCase() && a.submit()
        }, focus: function () {
            this.el[0].focus()
        }, children: function (a) {
            var b = [];
            this.each(function () {
                for (var c =
                    this.childNodes, d = 0, f = c.length; d < f; d++)1 == c[d].nodeType && !e.inArray(b, c[d]) && (!a || c[d].tagName.toLowerCase() == a) && b.push(c[d])
            });
            return new g(b)
        }, parent: function () {
            var a = [];
            this.each(function () {
                var b = this.parentNode;
                e.inArray(a, b) || a.push(b)
            });
            return new g(a)
        }, siblings: function () {
            var a = [];
            this.each(function () {
                for (var b = this.previousSibling, c = this.nextSibling; b;)1 === b.nodeType && !e.inArray(a, b) && a.push(b), b = b.previousSibling;
                for (; c;)1 === c.nodeType && !e.inArray(a, c) && a.push(c), c = c.nextSibling
            });
            return new g(a)
        },
        attr: function (a, b) {
            a = q[a] || a;
            return b ? (this.each(function () {
                this.setAttribute ? this.setAttribute(a, b) : this[a] = b
            }), this) : this.el[0].getAttribute ? this.el[0].getAttribute(a) : this.el[0][a]
        }, hasClass: function (a) {
            return RegExp("( +)?" + a).test(this.el[0].className)
        }, addClass: function (a) {
            return this.toggleClass(a, !0)
        }, removeClass: function (a) {
            return this.toggleClass(a, !1)
        }, toggleClass: function (a, b) {
            var c = RegExp("( +)?" + a);
            return this.each(function () {
                var d = this.className;
                if (c.test(d))b || (this.className = d.replace(c,
                    "")); else if (b || b == k)this.className = d + " " + a
            })
        }, hide: function () {
        }, show: function () {
        }, eq: function (a) {
            return new g(this.el[a])
        }, html: function (a) {
            return a != k ? this.each(function () {
                this.innerHTML = a
            }) : this.el[0].innerHtml
        }, val: function (a) {
            return a != k ? (this.each(function () {
                this.value = a
            }), this) : this.el[0].value
        }, each: function (a) {
            for (var b = 0, c = this.el.length; b < c; b++)a.call(this.el[b], b);
            return this
        }, delegate: function () {
        }, css: function (a, b) {
            a = o[a] || e.camelCase(a);
            return this.each(function () {
                l[a] ? b = l[a].set(b) :
                    this.style[a] = b
            })
        }
    }, g = function (a, b) {
        this.el = [];
        "string" == typeof b && (b = (new g(b)).el);
        b instanceof g && (b = b.el);
        if ("object" == typeof a)"[object NodeList]" == {}.toString.call(a) || a.constructor == Array ? this.el = a : this.el[0] = a; else {
            var b = b ? b[0] : document, c = a.match(n);
            if (c)if (c[2])this.el[0] = b.getElementById(c[2]); else if (c[3]) {
                var d = 0, e = c[3].replace(/\./g, function () {
                    if (d)return " ";
                    d++;
                    return ""
                });
                this.el = p(e, b, c[1])
            } else this.el = b.getElementsByTagName(c[1]);
            this.length = this.el.length
        }
    };
    i.on = i.bind;
    i.off = i.unbind;
    g.prototype = g.fn = i;
    window.$ = e = function (a, b) {
        return new g(a, b)
    };
    e.inArray = function (a, b) {
        for (var c = 0, d = a.length; c < d; c++)if (a[c] == b)return !0;
        return !1
    };
    e.bind = h ? function (a, b, c, d) {
        a.addEventListener(b, c, !!d);
        return c
    } : function (a, b, c) {
        a.attachEvent("on" + b, c);
        return c
    };
    e.unbind = h ? function (a, b, c, d) {
        a.removeEventListener(b, c || e.noop, !!d)
    } : function (a, b, c) {
        b = "on" + b;
        "undefined" === typeof a[b] && (a[b] = null);
        a.detachEvent(b, c || e.noop)
    };
    e.trim = function (a) {
        return a.replace(/^\s*(.*?)\s*$/, "$1")
    };
    e.nop = e.empty = function () {
    };
    e.camelCase = function (a) {
        return a.replace(/\-(\w)/g, function (a, c) {
            return c.toUpperCase()
        })
    };
    e.contains = function (a, b) {
        a = a.tagName ? a : a.el[0];
        b = b.tagName ? b : b.el[0];
        if (a.compareDocumentPosition)return a === b || !!(a.compareDocumentPosition(b) & 16);
        if (a.contains && 1 === b.nodeType)return a.contains(b) && a !== b;
        for (; b = b.parentNode;)if (b === a)return !0;
        return !1
    };
})();

