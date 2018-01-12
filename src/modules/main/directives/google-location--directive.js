function controllerFunc($q) {
    return function (scope, element, attrs, ctrls) {
        if (!google || !google.maps) {
            throw new Error('Google Maps JS library is not loaded!');
        } else if (!google.maps.places) {
            throw new Error('Google Maps JS library does not have the Places module');
        }
        var autocompleteService = new google.maps.places.AutocompleteService();
        var map = new google.maps.Map(document.createElement('div'));
        var placeService = new google.maps.places.PlacesService(map);
        scope.ngModel = {};

        /**
         * @ngdoc function
         * @name getResults
         * @description
         *
         * Helper function that accepts an input string
         * and fetches the relevant location suggestions
         *
         * This wraps the Google Places Autocomplete Api
         * in a promise.
         *
         * Refer: https://developers.google.com/maps/documentation/javascript/places-autocomplete#place_autocomplete_service
         */
        var getResults = function (address) {
            var deferred = $q.defer();
            var type = scope.searchType === '1' ? '(cities)' : 'address';
            try {
                autocompleteService.getPlacePredictions({
                    input: address,
                    types: [type],
                    componentRestrictions: {
                        country: ['IN', 'USA']
                    }
                }, function (data) {
                        deferred.resolve(data);
                });
            } catch (e) {
                console.log(e, 'error');
                deferred.reject();
            }
            return deferred.promise;
        };

        /**
         * @ngdoc function
         * @name getDetails
         * @description
         * Helper function that accepts a place and fetches
         * more information about the place. This is necessary
         * to determine the latitude and longitude of the place.
         *
         * This wraps the Google Places Details Api in a promise.
         *
         * Refer: https://developers.google.com/maps/documentation/javascript/places#place_details_requests
         */
        var getDetails = function (place) {
            var deferred = $q.defer();
            try {
                placeService.getDetails({
                    'placeId': place.place_id
                }, function (details) {
                        deferred.resolve(details);
                });
            } catch (e) {
                console.log(e, 'error');
                deferred.reject();
            }

            return deferred.promise;
        };

        scope.search = function (input) {
            if (!input) {
                return;
            }
            return getResults(input).then(function (places) {
                if (places !== null) {
                    return places;
                }
                return [];
            }, function () {
                scope.ngModel = {};
                return [];
            });
        };
        /**
         * @ngdoc function
         * @name getLatLng
         * @description
         * Updates the scope ngModel variable with details of the selected place.
         * The latitude, longitude and name of the place are made available.
         *
         * This function is called every time a location is selected from among
         * the suggestions.
         */
        scope.getLatLng = function (place) {
            if (!place) {
                scope.ngModel = {};
                return;
            }
            try {
                getDetails(place).then(function (details) {
                    scope.ngModel = {
                        'name': details.formatted_address,
                        'latitude': details.geometry.location.lat(),
                        'longitude': details.geometry.location.lng()
                    };
                });
            } catch (e) {
                console.log(e, 'error');
            }

        };

        scope.clearSearchText = () => {
            scope.searchText = "";
        };
        scope.onClear({clearFn: scope.clearSearchText});

        scope.setModelAddress = (value) => {
            scope.ngModel = {
                'name': value,
                'latitude': '',
                'longitude': ''
            };
            scope.searchText = value;
        };
        scope.onAddress({addressFn: scope.setModelAddress});
    };
};

class PlaceAutocomplete {
    constructor($q) {
        this.$q = $q;
        this._instantiateDDO();
    }

    _instantiateDDO() {
        this.restrict = 'E';
        this.require = 'ngModel';
        this.replace = true;
        this.templateUrl = 'main/partials/place-autocomplete.jade';
        this.scope = {
            ngModel: '=',
            onClear: '&',
            onAddress: '&',
            searchType: '@',
            checkRequired: '@'
        };
        this.link = controllerFunc(this.$q);
    }
}
placeAutocomplete.$inject = ['$q'];
export function placeAutocomplete($q) {
    return new PlaceAutocomplete($q);
}
