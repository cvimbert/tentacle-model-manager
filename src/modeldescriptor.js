/**
 * Created by Christophe on 01/09/2016.
 */
(function(factory) {

    var root = (typeof self == 'object' && self.self === self && self) ||
        (typeof global == 'object' && global.global === global && global);

    if (typeof define === 'function' && define.amd) {
        define(["underscore", "logger", "constants"], function(_, Logger, Constants) {
            return factory(_, Logger, Constants);
        });
    } else {
        root.TentacleModelDescriptor = factory(root._, root.TentacleLogger, root.TentacleManagerConstants);
    }

})(function(_, Logger, Constants) {

    return function (modelManager) {
        var self = this;
        var descriptorsByClasses = {};


        this.load = function (jsonDescriptor) {

            _.each(jsonDescriptor, function (jsonClassDescriptor, classId) {
                var descriptor = new ClassModelDescriptor(classId, jsonClassDescriptor, self, modelManager);
                descriptorsByClasses[classId] = descriptor;
            });

        };


        this.getClassDescriptor = function (classId) {

            if (!descriptorsByClasses[classId]) {
                Logger.log(Constants.Exceptions.cantfinddescriptor, classId);
                return null;
            }

            return descriptorsByClasses[classId];
        };

        var ClassModelDescriptor = function (classId, jsonClassDescriptor, modelDescriptor, modelManager) {

            var self = this;


            this.getRaw = function () {
                return jsonClassDescriptor;
            };

            this.getAttributes = function () {
                return jsonClassDescriptor.attributes;
            };

            this.getAttribute = function (id) {
                return getAttributes()[id];
            };

            this.getClone = function () {
                var serializedDescriptor = JSON.stringify(jsonClassDescriptor);
                return JSON.parse(serializedDescriptor);
            };


            // descriptor flatten functions

            this.flattenByItem = function (item) {
                var destDesc = {};
                self.flattenByDescItem(item, jsonClassDescriptor, destDesc, 0);
                return destDesc;
            };

            this.flattenByDescItem = function (item, desc, destDesc, indentation) {
                flattenByItemAction(item, desc.attributes, destDesc, indentation);
            };

            this.flattenAttribute = function (item, attribute, attributeId, destDesc, indentation) {

                if (attribute.type !== Constants.ModelDecriptorTypes.LINKED_CONDITIONAL_ATTRIBUTES_SET && attribute.type !== Constants.ModelDecriptorTypes.INCLUDE) {
                    destDesc[attributeId] = attribute;
                    destDesc[attributeId].indentation = indentation;
                }


                if (attribute.type === Constants.ModelDecriptorTypes.CONDITIONAL_ATTRIBUTES_SET) {

                    if (item && item.attributes[attributeId]) {
                        var selectedBranch = attribute.attributesSets[item.attributes[attributeId]];
                        flattenByItemAction(item, selectedBranch, destDesc, indentation + 1);
                    }

                } else if (attribute.type === Constants.ModelDecriptorTypes.INCLUDE) {

                    var targetDescriptor = modelDescriptor.getClassDescriptor(attribute.includetype).getRaw();
                    self.flattenAttribute(item, targetDescriptor, attributeId, destDesc, indentation);

                } else if (attribute.type === Constants.ModelDecriptorTypes.LINKED_CONDITIONAL_ATTRIBUTES_SET) {

                    if (attribute.linktype === Constants.ModelDecriptorTypes.REFERENCE_ATTRIBUTE_VALUE) {
                        var refItemId = item.attributes[attribute.linkedreference];

                        if (refItemId) {

                            // recupération de l'objet qui possède cet id
                            var targetItem = modelManager.getItem(refItemId);

                            // récupération de la propriété qui nous intéresse dans cet objet
                            var targetItemSelectedValue = targetItem.attributes[attribute.linkedattribute];

                            // choix de la branche fonction de cette propriété
                            var selectedBranch = attribute.attributesSets[targetItemSelectedValue];

                            // et flatten de la branche
                            flattenByItemAction(item, selectedBranch, destDesc, indentation);
                        }
                    }

                    // non utilisé, voir si on peut supprimer
                    if (attribute.linktype === "attributevaluenonull") {

                        if (item[attribute.link]) {

                            var selectedBranch = attribute.attribute;
                            flattenByItemAction(item, selectedBranch, destDesc, indentation);
                        }
                    }

                }
            };

            function flattenByItemAction(item, attributes, destDesc, indentation) {

                _.each(attributes, function (attribute, attributeId) {
                    self.flattenAttribute(item, attribute, attributeId, destDesc, indentation);
                });
            }
        }
    };



});