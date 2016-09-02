/**
 * Created by Christophe on 02/09/2016.
 */
(function (factory) {

    var root = (typeof self == 'object' && self.self === self && self) ||
        (typeof global == 'object' && global.global === global && global);

    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return factory();
        });
    } else {
        root.TentacleManagerConstants = factory();
    }

})(function () {

    return {
        BaseObjectTypes: {
            STRING: "string",
            BOOLEAN: "boolean",
            NUMBER: "number"
        },
        Exceptions: {
            cantfinddescriptor: "Can't find ClassDescriptor '$$' in descriptors",
            badloggerargs: "Bad logger arguments",
            verywell: "Everything is fine !",
            cantFindModelProperty: "Can't find property '$$' in model of type '$$'"
        },
        FilterOperand: {
            AND: "and",
            OR: "or"
        },
        LoggerLevels: {
            LOG: "log",
            WARNING: "warning",
            ERROR: "error"
        },
        ModelDecriptorTypes: {
            CONDITIONAL_ATTRIBUTES_SET: "ConditionalAttributesSet",
            COLLECTION: "collection",
            LINKED_CONDITIONAL_ATTRIBUTES_SET: "LinkedConditionalAttributesSet",
            INCLUDE: "include",
            REFERENCE_ATTRIBUTE_VALUE: "referenceattributevalue"
        }
    }

});