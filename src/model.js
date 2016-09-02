/**
 * Created by Christophe on 01/09/2016.
 */
(function(factory) {

    var root = (typeof self == 'object' && self.self === self && self) ||
        (typeof global == 'object' && global.global === global && global);

    if (typeof define === 'function' && define.amd) {
        define(["underscore", "uuid", "constants"], function(_, uuid, Constants) {
            return factory(_, uuid, Constants);
        });
    } else {
        root.TentacleModel = factory(root._, root.uuid, root.TentacleManagerConstants);
    }

})(function(_, uuid, Constants) {

    return function (jsonModel, mmanager) {
        var self = this;
        var modelManager;

        this.attributes = {};
        this.trashCan = {};


        if (jsonModel) {
            for (var id in jsonModel) {
                this[id] = jsonModel[id];
            }
        }

        if (mmanager) {
            modelManager = mmanager;
        }

        this.init = function () {
            this.mutate();
        };

        this.create = function (type, modManager, presets) {
            this.type = type;
            this.uid = uuid.v4();

            modelManager = modManager;

            if (presets) {
                for (var id in presets) {
                    this.set(id, presets[id]);
                }
            }

            this.init();
        };

        this.set = function (property, value) {
            this.attributes[property] = value;

            // on ne devrait le faire que dans le cas des attributs conditionnels
            this.mutate();
        };

        this.get = function (property) {

            if (!this.attributes[property]) {
                //Tentacle.log(Tentacle.Exceptions.cantFindModelProperty, [property, this.type]);
                return null;
            }

            return this.attributes[property];
        };


        this.mutate = function () {
            var modelDescriptor = modelManager.getClassDescriptor(this.type);

            // le destObject est créé pour éviter de garder dans le modèle des propriétés qui ne seraient plus utilisées
            // stockage des anciennes valeurs dans une corbeille

            _.each(this.attributes, function (attribute, attributeId) {
                self.trashCan[attributeId] = attribute;
            });

            var newAttributes = {};

            var flattenDescriptor = modelDescriptor.flattenByItem(this);
            getObject(flattenDescriptor, newAttributes);

            this.attributes = newAttributes;
        };


        function getObject(descriptorAttributes, newAttributes) {

            _.each(descriptorAttributes, function (attribute, attributeId) {

                // source object ne sera jamais null
                if (!self.attributes[attributeId]) {

                    switch (attribute.type) {

                        case Constants.BaseObjectTypes.STRING:
                            newAttributes[attributeId] = "";
                            break;

                        case Constants.BaseObjectTypes.NUMBER:
                            if (attribute.defaultvalue) {
                                newAttributes[attributeId] = attribute.defaultvalue;
                            } else {
                                newAttributes[attributeId] = 0;
                            }
                            break;

                        case Constants.BaseObjectTypes.BOOLEAN:
                            if (attribute.defaultvalue) {
                                newAttributes[attributeId] = attribute.defaultvalue;
                            } else {
                                newAttributes[attributeId] = "false";
                            }
                            break;

                        case Constants.ModelDecriptorTypes.CONDITIONAL_ATTRIBUTES_SET:
                            newAttributes[attributeId] = "";
                            break;

                        case Constants.ModelDecriptorTypes.COLLECTION:
                            newAttributes[attributeId] = [];
                            break;

                        default:
                            newAttributes[attributeId] = "";
                    }
                } else {

                    if (attribute.type === Constants.ModelDecriptorTypes.CONDITIONAL_ATTRIBUTES_SET) {

                        newAttributes[attributeId] = self.attributes[attributeId];
                        getObject(attribute.attributesSets[self.attributes[attributeId]], newAttributes);

                    } else {

                        newAttributes[attributeId] = self.attributes[attributeId];

                    }
                }
            });
        }

        this.clearTrashCan = function () {
            this.trashCan = {};
        };

        this.clone = function () {
            var str = JSON.stringify(this);
            return JSON.parse(str);
        };
    }

});