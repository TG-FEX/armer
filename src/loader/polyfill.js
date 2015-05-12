if (!Function.prototype.bind) {
    Function.prototype.bind = function (scope) {
        if (arguments.length < 2 && scope === void 0)
            return this;
        var fn = this,
            argv = arguments;
        return function () {
            var args = [],
                i;
            for (i = 1; i < argv.length; i++)
                args.push(argv[i]);
            for (i = 0; i < arguments.length; i++)
                args.push(arguments[i]);
            return fn.apply(scope, args);
        };
    }
}