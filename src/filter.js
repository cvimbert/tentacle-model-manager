/**
 * Created by Christophe on 01/09/2016.
 */
(function(factory) {

    var root = (typeof self == 'object' && self.self === self && self) ||
        (typeof global == 'object' && global.global === global && global);

    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return factory();
        });
    } else {
        root.TentacleFilter = factory();
    }

})(function() {

    return function (propertyName, propertyValue) {
        this.propertyName = propertyName;
        this.propertyValue = propertyValue;
    }
});