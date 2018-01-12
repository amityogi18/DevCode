/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


'use strict';
(function() {
    angular.module('ngStorage', []).factory('$storage', function() {
        function checkStorage() {
            var testKey = 'hello';
            var storage = localStorage;
            try {
                storage.setItem(testKey, '1');
                storage.removeItem(testKey);
                return storage;
            } catch (error) {
                return false;
            }
        }
        var structureLocalStorage = {};
        function getItem(key) {
            if (typeof structureLocalStorage[key] !== 'undefined') {
                return structureLocalStorage[key];
            }
            else {
                return null;
            }
        }

        function setItem(key, value) {
            structureLocalStorage[key] = value;
        }
        function removeItem(key) {
            structureLocalStorage[key] = undefined;
        }
        function clear()
        {
            structureLocalStorage = {};
        }
        return {
            storage: checkStorage,
            getItem: function(item) {
                if (this.storage()) {
                    return this.storage().getItem(item);
                } else {
                    return getItem(item);
                }
            },
            setItem: function(item, value) {
                if (this.storage()) {
                    return this.storage().setItem(item, value);
                } else {
                    return setItem(item, value);
                }
            },
            removeItem: function(item) {
                if (this.storage()) {
                    return this.storage().removeItem(item);
                } else {
                    return removeItem(item);
                }
            },
            clear: function() {
                if (this.storage()) {
                    return this.storage().clear();
                } else {
                    return clear();
                }
            }

        };
    });
})();