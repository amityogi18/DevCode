let _this;
const EMAIL_REGEX = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;

export class CandidateCredentialsListController {
    /** @ngInject  */
    constructor(CandidateCredentialsService, NgTableParams, dataTableService, GrowlerService) {
        _this = this;
        console.log('CandidateCredentialsListController');
        _this.CandidateCredentialsService = CandidateCredentialsService;
        _this.dataTableService = dataTableService;
        _this.dataTableService.initTable([], {});
        _this.GrowlerService = GrowlerService;
        _this.IsEdit = false;
        _this.candidateCredentailsData = '';
        _this.candidateOfficialEmail = '';
        _this.candidateOfficialPassword = '';
        _this.searchFilter = {};
        _this.hostName = '';
        if (_this.infoData && _this.infoData === 'edit') {
            _this.IsEdit = true;
            _this.showUpdateCandidate(_this.data);
        } else {
            _this.IsAdd = true;
            _this.candidateInfodata = _this.data;
        }
        _this.credentialsTableParams = new NgTableParams(
            {
                page: 1,
                count: 5,
                filter: _this.searchFilter
            },
            {
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
                        sortFields.push(`${key}&order=${value}`);
                    });
                    angular.forEach(filter, (value, key) => {
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

                        _this.candidateCredentailsData = response.data.data;
                        if (response.data && response.data.data &&
                            response.data.data.length > 0) {
                            _this.candidateCredentailsData = response.data.data;
                            _this.candidateCredentialsCount = response.data.total;
                            params.total(_this.candidateCredentialsCount);
                            if (!_this.dataTableService.totalColumn.length) {
                                _this.dataTableService.initTable(_this.cols, _this.credentialsTableParams);
                            }
                            return (_this.candidateCredentailsData);
                        }
                    },
                        onError = (error) => {
                            console.log(error);
                        };

                    _this.CandidateCredentialsService.getCandidateCredentials(queryURL);
                    return _this.CandidateCredentialsService.activePromise.then(onSuccess, onError);
                }
            });
    }

    onClose() {
        _this.credentialsTableParams.reload();
    }

}