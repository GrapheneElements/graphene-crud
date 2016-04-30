(function(window) {
    'use strict';
    //Init document.Graphene object
    window.Graphene = window.Graphene || {};
    window.Graphene.behaviors = window.Graphene.behaviors || {};

    window.Graphene.behaviors.crudBehavior = {
        create: function(model) {
            return this.$.client.fetch(this._cDoc.url, model);
        },

        read: function(id) {
            return this.$.client.fetch(this._rDoc.url.replace(':id', id));
        },

        update: function(model) {
            return this.$.client.fetch(this._uDoc.url, model, this._uDoc.method);
        },

        delete: function(model) {
            return this.$.client.fetch(this._dDoc.url, model, this._dDoc.method);
        },

        _getAction: function(settings, mode) {
            return this.settings[mode];
        },

        _loadSettings: function(modelName) {
            try {
                var modelSettings = window.Graphene.settings.models[modelName];
                if (!!modelSettings) {
                    return {
                        c: modelSettings + '_CREATE',
                        r: modelSettings + '_READ',
                        u: modelSettings + '_UPDATE',
                        d: modelSettings + '_DELETE'
                    };
                } else {
                    return null;
                }
            } catch (e) {
                console.warn('[Graphene CRUD] %s\'s model settings not found in Graphene.settings.models', modelName);
                console.error(e);
            }
        },

        _clearDoc: function(docInstance) {
            if (!!docInstance.base) {
                var doc = docInstance.base.DocAction[0];
                return doc;
            }
        },

        _checkReady: function(_cDoc, _rDoc, _uDoc, _dDoc) {
            if (!!_cDoc.base.url && !!_rDoc.base.url && !!_uDoc.base.url && !!_dDoc.base.url) {
                this.fire('crud-ready');
                return true;
            }
            return false;
        },

        observers: [],

        properties: {
            modelName: String, //namespace-modelname

            createProto: {type: Object, notify: true},
            readProto:   {type: Object, notify: true},
            updateProto: {type: Object, notify: true},
            deleteProto: {type: Object, notify: true},

            settings: {type: Object, computed: '_loadSettings(modelName)'},
            cAction:  {type: String, computed: '_getAction(settings.*, \'c\' )'},
            rAction:  {type: String, computed: '_getAction(settings.*, \'r\' )'},
            uAction:  {type: String, computed: '_getAction(settings.*, \'u\' )'},
            dAction:  {type: String, computed: '_getAction(settings.*, \'d\' )'},

            isReady: {type: Boolean, computed: '_checkReady(_cDoc.*, _rDoc.*, _uDoc.*, _dDoc.*)'},

            _cDoc: {type: Object, computed: '_clearDoc(_c0Doc.*)'},
            _rDoc: {type: Object, computed: '_clearDoc(_r0Doc.*)'},
            _uDoc: {type: Object, computed: '_clearDoc(_u0Doc.*)'},
            _dDoc: {type: Object, computed: '_clearDoc(_d0Doc.*)'},

            _c0Doc: Object,
            _r0Doc: Object,
            _u0Doc: Object,
            _d0Doc: Object
        }
    };
})(window);
