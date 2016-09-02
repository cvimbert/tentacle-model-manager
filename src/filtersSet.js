/**
 * Created by Christophe on 02/09/2016.
 */
(function(factory) {

    var root = (typeof self == 'object' && self.self === self && self) ||
        (typeof global == 'object' && global.global === global && global);

    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return factory();
        });
    } else {
        root.TentacleFiltersSet = factory();
    }

})(function() {

    return function (operand) {

        this.operand = operand;
        this.filters = [];

        this.addFilter = function (propertyName, propertyValue) {
            this.filters.push(new Tentacle.Filter(propertyName, propertyValue));
        };
    }
});
