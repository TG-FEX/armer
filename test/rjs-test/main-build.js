define("test1",[],function(){return 111}),define("test2",[],function(){return"222"}),define("main",["test1","test2"],function(e,t){alert(e+t)});