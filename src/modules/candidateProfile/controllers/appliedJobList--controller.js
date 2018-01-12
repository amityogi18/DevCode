let _this;

export class appliedJobListController {
	/** @ngInject  */
   constructor(appliedJobListService,GrowlerService, NgTableParams, dataTableService, jobOpeningsService) {
    _this = this;
    _this.appliedJobListService = appliedJobListService;
    _this.GrowlerService = GrowlerService;
    _this.jobOpeningsService = jobOpeningsService;  
    _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});
    _this.colNum = 6;
    _this.appliedJobListTableFilter = {};
    _this.favoriteJobTableFilter = {};
    _this.appliedJobListTableParams = new NgTableParams({
          page: 1,
          count: 5,
          filter: _this.appliedJobListTableFilter
      }, {
          counts: [5, 10, 20],
          getData: function(params) {
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

                      _this.appliedJobList = response.data.data;
                      _this.appliedJobListCount = response.data.total;

                      params.total(_this.appliedJobListCount);
                      if(!_this.dataTableService.totalColumn.length) {
                          _this.dataTableService.initTable(_this.cols, _this.appliedJobListTableParams);
                      }
                      return (_this.appliedJobList);

                  },
                  onError = (error) => {
                      console.log(error);
                  };

              return _this.appliedJobListService.getAppliedJobList(queryURL).then(onSuccess, onError);
          }

      });
      _this.toggle = function(selectedValue) {
          _this.dataTableService.setColumn(-1);
          _this.dataTableService.toggle(_this.cols, event.target.value);
      };

      _this.favoriteJobTableParams = new NgTableParams({
          page: 1,
          count: 5,
          filter: _this.favoriteJobTableFilter
      }, {
          counts: [5, 10, 20],
          getData: function(params) {
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

                      _this.favoriteJobList = response.data.data;
                      _this.favoriteJobListCount = response.data.total;

                      params.total(_this.favoriteJobListCount);
                      if(!_this.dataTableService.totalColumn.length) {
                          _this.dataTableService.initTable(_this.cols11, _this.favoriteJobTableParams);
                      }
                      return (_this.favoriteJobList);

                  },
                  onError = (error) => {
                      console.log(error);
                  };

              return _this.appliedJobListService.getfavoriteJobList(queryURL).then(onSuccess, onError);
          }
      });
      _this.toggle11 = function(selectedValue) {
          _this.dataTableService.setColumn(-1);
          _this.dataTableService.toggle(_this.cols11, event.target.value);
      };

  }

    appliedJobPortals(jobId) {
        let onSuccess = (response) => {
                _this.GrowlerService.growl({type: 'success', message: "Job Applied Sucessfully", delay: 1000});
            },
            onError = (error) => {
                console.log(error);
            };
        let data = {
            jobIds: [jobId],
            isGlobal :0,
            portalId : 1
        };
        return _this.jobOpeningsService.appliedJobPortals(data).then(onSuccess, onError);
    }


    deleteAppliedJob(id) {
        let onSuccess = (response) => {
                _this.appliedJobListTableParams.reload();
                _this.GrowlerService.growl({
                    type: 'success',
                    message: "Job Deleted Successfully",
                    delay: 2000
                });
                console.log(response.data);

            },
            onError = (error) => {
                console.log(error);
            };
        let removeJobObj = {
            jobIds: [id]
        };
        _this.appliedJobListService.deleteAppliedJob(removeJobObj).then(onSuccess, onError);

    }
 };
