/**
 * Created by Christophe on 02/09/2016.
 */
(function(factory) {

    var root = (typeof self == 'object' && self.self === self && self) ||
        (typeof global == 'object' && global.global === global && global);

    if (typeof define === 'function' && define.amd) {
        define(["filter"], function(Filter) {
            return factory(Filter);
        });
    } else {
        root.TentacleFiltersSet = factory(root.TentacleFilter);
    }

})(function(Filter) {

    return function (operand) {

        this.operand = operand;
        this.filters = [];

        this.addFilter = function (propertyName, propertyValue) {
            this.filters.push(new Filter(propertyName, propertyValue));
        };
    }
});
