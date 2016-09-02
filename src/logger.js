/**
 * Created by Christophe on 01/09/2016.
 */
(function(factory) {

    var root = (typeof self == 'object' && self.self === self && self) ||
        (typeof global == 'object' && global.global === global && global);

    if (typeof define === 'function' && define.amd) {
        define(["underscore", "constants"], function(_, Constants) {
            return factory(_, Constants);
        });
    } else {
        root.TentacleLogger = factory(root._, root.TentacleManagerConstants);
    }

})(function(_, Constants) {

    return function () {

        this.sendLog = function (msg, args, level) {

            if (!level) {
                level = Constants.LoggerLevels.WARNING;
            }

            var argsToken = "$$";

            if ((typeof args) === "object") {

                _.each(args, function (arg) {
                    var index = msg.indexOf(argsToken, 1);
                    msg = msg.slice(0, index) + arg + msg.slice(index + argsToken.length, msg.length);
                });

            } else if (typeof args === "string") {

                msg = msg.replace("$$", args);

            } else {

                console.log(Constants.Exceptions.badloggerargs);
                return;

            }

            switch (level) {
                case Constants.LoggerLevels.LOG:
                    console.log(msg);
                    break;

                case Constants.LoggerLevels.WARNING:
                    console.warn(msg);
                    break;

                case Constants.LoggerLevels.ERROR:
                    console.error(msg);
                    break;
            }
        };

        this.log = function (msg, args) {
            this.sendLog(msg, args, Constants.LoggerLevels.LOG);
        };

        this.warn = function (msg, args) {
            this.sendLog(msg, args, Constants.LoggerLevels.WARNING);
        };

        this.error = function (msg, args) {
            this.sendLog(msg, args, Constants.LoggerLevels.ERROR);
        };

        // aliases
        /*Tentacle.log = this.log;
        Tentacle.warn = this.warn;
        Tentacle.error = this.error;*/
    }

});