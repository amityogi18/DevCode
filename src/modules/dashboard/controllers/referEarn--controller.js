import _ from 'lodash';

/*
 @name ReferEarnController-Controller
 @param {Object}NgTableParams  This return the actual data and promise object.
 @param {Object} $scope This bind the value between controller and view.
 @param {Object}$element This act as alias for jquery function.
 @param {Object}$timeout This is the predefined service.
 @param {Object}$filter This is used for displaying filter data.
 */
export class ReferEarnController {
	/** @ngInject  */
  constructor(NgTableParams, ReferEarnService, $scope, $element, $timeout, $filter) {
    var _this = this;
    _this.ReferEarnService = ReferEarnService;
    _this.$scope = $scope;
    _this.$timeout = $timeout;
    _this.$element = $element;
    _this.searchText = "";
    _this.tableParams = new NgTableParams({
      page: 1,
      count: 8
    }, {
      counts: [8, 16, 24],
      getData: function ($defer, params) {
        _this.ReferEarnService.getreferEarnList();
        var filter = params.filter();
        var sorting = params.sorting();
        _this.$timeout(function () {
          var sortedData = params.sorting() ? $filter('orderBy')(_this.ReferEarnService.referEarnList, params.orderBy()) : _this.ReferEarnService.referEarnList;
          var pageData = sortedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
          params.total(_this.ReferEarnService.referEarnList.length);
          $defer.resolve(pageData);
        }, 1000)

      }
    });


    _this.checkboxes = {'checked': false, items: {}};


    // watch for check all checkbox
    _this.$scope.$watch('checkboxes.checked', function (value) {
      angular.forEach(_this.referEarnList, function (item) {
        if (angular.isDefined(item.transactionId)) {
          _this.checkboxes.items[item.transactionId] = value;
        }
      });
    });

  }
}

