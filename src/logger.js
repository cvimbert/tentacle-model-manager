/**
 * Created by Christophe on 01/09/2016.
 */
(function(factory) {

    var root = (typeof self == 'object' && self.self === self && self) ||
        (typeof global == 'object' && global.global === global && global);

    if (typeof define === 'function' && define.amd) {
        define(["underscore"], function(_) {
            return factory(_);
        });
    } else {
        root.TentacleLogger = factory(_);
    }

})(function(_) {

    return function () {

        this.sendLog = function (msg, args, level) {

            if (!level) {
                level = Tentacle.LoggerLevels.WARNING;
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

                console.log(Tentacle.Exceptions.badloggerargs);
                return;

            }

            switch (level) {
                case Tentacle.LoggerLevels.LOG:
                    console.log(msg);
                    break;

                case Tentacle.LoggerLevels.WARNING:
                    console.warn(msg);
                    break;

                case Tentacle.LoggerLevels.ERROR:
                    console.error(msg);
                    break;
            }
        };

        this.log = function (msg, args) {
            Tentacle.Logger.sendLog(msg, args, Tentacle.LoggerLevels.LOG);
        };

        this.warn = function (msg, args) {
            Tentacle.Logger.sendLog(msg, args, Tentacle.LoggerLevels.WARNING);
        };

        this.error = function (msg, args) {
            Tentacle.Logger.sendLog(msg, args, Tentacle.LoggerLevels.ERROR);
        };

        // aliases
        Tentacle.log = this.log;
        Tentacle.warn = this.warn;
        Tentacle.error = this.error;
    }

});