import _ from 'lodash';

let _this;
export class PositionReviewSaController {
  /** @ngInject  */
  constructor($stateParams, locationService, SocialMediaService, GrowlerService, dataTableService, NgTableParams, SuperAdminService) {
    _this = this;
    _this.locationService = locationService;
    _this.SocialMediaService = SocialMediaService;
    _this.GrowlerService = GrowlerService;
    _this.dataTableService = dataTableService;
    _this.SuperAdminService = SuperAdminService;
    _this.dataTableService.initTable([], {});
    _this.colNum = 6;
    _this.$stateParams = $stateParams;
    _this.portalId = _this.$stateParams.portalId;
    _this.allJobPortalsTableFilter = {};
    _this.portalDetails = {};
    _this.companyList = [];
    _this.getCompanyList();
    _this.allJobPortalsTableParams = new NgTableParams({
      page: 1,
      count: 5,
      filter: _this.allJobPortalsTableFilter
    }, {
        counts: [5, 10, 20],
        getData: function (params) {
          let filter = params.filter(),
            sorting = params.sorting(),
            count = params.count(),
            page = params.page(),
            filterFields = [],
            sortFields = [],
            queryString = '',
            queryURL = '?';
          angular.forEach(sorting, (value, key) => {
            console.log(key + '---' + value);
            sortFields.push(`${key}&order=${value}`);
          });
          angular.forEach(filter, (value, key) => {
            console.log(key + '---' + value);
            filterFields.push(`${key}=${value}`);
          });
          if (sortFields.length) {
            queryString += `orderBy=${sortFields.join('&')}&`;
          }
          if (filterFields.length) {
            queryString += filterFields.join('&');
          }
          queryURL += `${queryString}&limit=${count}&page=${page}`;
          let onSuccess = (response) => {
            _this.allJobPortalsList = response.data.data;
            _this.allJobPortalsListCount = response.data.total;
            _this.getPortalName(_this.portalId, _this.allJobPortalsList);
            params.total(_this.allJobPortalsListCount);
            if (!_this.dataTableService.totalColumn.length) {
              _this.dataTableService.initTable(_this.cols, _this.allJobPortalsTableParams);
            }
            return (_this.allJobPortalsList);

          },
            onError = (error) => {
              console.log(error);
            };
          _this.SocialMediaService.getJobPortalsList(queryURL, _this.portalId);
          return _this.SocialMediaService.activePromise.then(onSuccess, onError);
        }

      });
    _this.toggle = function (selectedValue) {
      _this.dataTableService.setColumn(-1);
      _this.dataTableService.toggle(_this.cols, event.target.value);
    };
  }

  getCompanyList() {
    let onSuccess = (response) => {
      var allCompany = {
        id: '',
        name: 'All'
      };
      _this.companyList = response.data;
      _this.companyList.unshift(allCompany);
    },
      onError = (error) => {
        console.log(error);
      };
    _this.SuperAdminService.getCompanyList();
    _this.SuperAdminService.activePromise.then(onSuccess, onError);
  }

  getCompanyData() {
    _this.allJobPortalsTableFilter.companyId = (_this.id === " ") ? "" : _this.id;
  }

  getPortalName(portalId, allJobPortalsList) {
    for (let i = 0; i < allJobPortalsList.length; i++) {
      _this.portalDetails = _.find(allJobPortalsList[i].postedJobPortals, 
        function (portal) {
         return portal.portalId == _this.portalId; 
        });
      if(angular.isDefined(_this.portalDetails.portalName)){
        break;
      }
    }
  }
}

