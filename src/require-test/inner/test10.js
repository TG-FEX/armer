define(['../test.gif', '../test11', './inner/test12', './inner/test13'],function(tgif, t11, t12, t13){
    $(tgif).appendTo('div');
    return 'AAAA' + t11 + t12 + t13;
});
