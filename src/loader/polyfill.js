function then(p, n) {
    if (p.state == 'done')
        n(p.prams);
    else
        p.thens.push(n)
}
function resolve(p) {
    var t;
    while(t = p.thens.shift()) {
        p.prams = t.call(null, p.prams);
    }
}
var Promise = function (success) {
    this.thens = [];
    var that = this;
    success(function(re){ that.state = 'done'; that.prams = re; resolve(that) })

};
Promise.prototype = {
    then: function (n) {
        var that = this;
        then(this, n);
        return new Promise(function(done){
            then(that, done)
        });
    }
}