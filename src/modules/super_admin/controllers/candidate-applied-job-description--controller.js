
let _this;
export class CandidateAppliedJobDescriptionController {
    /** @ngInject  */
    constructor(CandidateAppliedJobService, GrowlerService, $stateParams, UtilsService, $sce, $filter, NgTableParams, dataTableService, LoaderService) {
        _this = this;
        _this.GrowlerService = GrowlerService;
        _this.CandidateAppliedJobService = CandidateAppliedJobService;
        _this.$stateParams = $stateParams;
        _this.jobId = _this.$stateParams.id;
        _this.isVideo = false;
        _this.showVideo = false;
        _this.UtilsService = UtilsService;
        _this.dataTableService = dataTableService;
        _this.LoaderService = LoaderService;
        _this.$sce = $sce;
        _this.$filter = $filter;
        _this.searchFilter = {};
        _this.videoPath = '';
        _this.comment = '';
        _this.isCommented = true;
        _this.CandidateProfileInfo = {};
        _this.CandidateProfileInfo.candidateInfo = {};
        _this.tableParams = new NgTableParams({
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
                        //_this.positionStatusCount = response.data.statusCounts;
                        if (response.data && response.data.data) {
                            _this.appliedCandidatesList = response.data.data;
                            _this.candidateList = response.data.data;
                            _this.appliedCandidatesCount = response.data.total;
                            params.total(_this.appliedCandidatesCount);
                            if (!_this.dataTableService.totalColumn.length) {
                                _this.dataTableService.initTable(_this.cols, _this.tableParams);
                            }
                            return (_this.candidateList);
                        }

                    },
                        onError = (error) => {
                            console.log(error);
                        };
                    _this.CandidateAppliedJobService.getAllCandidateList(queryURL, _this.jobId);
                    return _this.CandidateAppliedJobService.activePromise.then(onSuccess, onError);
                }
            });
        _this.toggle = function () {
            _this.dataTableService.setColumn(-1);
            _this.dataTableService.toggle(_this.cols, event.target.value);
        };

    }

    getCandidateAppliedJobDescription() {
        let onSuccess = (response) => {
            _this.candidateAppliedJobDescription = response.data.data;
        },
            onError = (error) => {
                console.log(error);
            };
        _this.CandidateAppliedJobService.getCandidateAppliedJobDescription(_this.id);
        _this.CandidateAppliedJobService.activePromise.then(onSuccess, onError);
    }

    getCandidateProfileInfo(id) {
        _this.candidateId = id;
        let onSuccess = (response) => {
            _this.CandidateProfileInfo = response.data;
            for (var i = 0; i < _this.CandidateProfileInfo.candidateExperiences.length; i++) {
                _this.CandidateProfileInfo.candidateExperiences[i].startDate = _this.$filter('date')(new Date(_this.CandidateProfileInfo.candidateExperiences[i].startDate), 'MMM yyyy');
                _this.CandidateProfileInfo.candidateExperiences[i].endDate = _this.$filter('date')(new Date(_this.CandidateProfileInfo.candidateExperiences[i].endDate), 'MMM yyyy');
            }
            if (_this.CandidateProfileInfo.twoMinIntroVideo === '' || _this.CandidateProfileInfo.twoMinIntroVideo === null) {
                _this.showVideo = false;
            } else {
                _this.videoPath = response.data.twoMinIntroVideo;
                _this.showVideo = true;
                //_this.videoPlay(_this.videoPath);
            }
        },
            onError = (error) => {
                console.log(error);
            };
        _this.CandidateAppliedJobService.getCandidateProfileInfo(id);
        _this.CandidateAppliedJobService.activePromise.then(onSuccess, onError);
    }

    videoPlay() {
        if (_this.videoPath !== null && _this.videoPath !== "") {
            let path = _this.videoPath;
            if (path.indexOf('youtube') >= 0) {
                path = path.replace("watch?v=", "embed/");
                _this.isVideo = true;
                _this.videoPath = path;
            } else {
                _this.isVideo = false;
                _this.UtilsService.initVideoPlayer('candidateVideo', path);
            }
        }
    }

    trustSrc(src) {
        return _this.$sce.trustAsResourceUrl(src);
    }

    changeIcon(element, index) {
        let id = angular.element("#" + element.currentTarget.id).attr("data-target");
        let rowId = angular.element("#" + element.currentTarget.id).attr("data-rowId");
        angular.element("tr.collapse.in:not(" + id + ")").removeClass("in").attr("aria-expanded", false);
        angular.element("tr.active-row:not(#" + rowId + ")").removeClass("active-row")
        $('#' + element.currentTarget.id).toggleClass('inactv');
        $('#' + element.currentTarget.id).parents('tr').toggleClass('active-row');
        $('#' + element.currentTarget.id).parents('tr').next('.full-row').slideToggle('slow');
    }

    handleCollapse(candidateId) {
        if (_this.CandidateProfileInfo.candidateInfo.id !== candidateId) {
            _this.getCandidateProfileInfo(candidateId);

        }

    }

    getCandidateListByJobId() {
        let onSuccess = (response) => {
            _this.candidateAppliedJobDescription = response.data.data;
        },
            onError = (error) => {
                console.log(error);
            };
        _this.CandidateAppliedJobService.getAllCandidateList(_this.jobId);
        _this.CandidateAppliedJobService.activePromise.then(onSuccess, onError);
    }

    getJobInfo() {
        let onSuccess = (response) => {
            _this.candidateJobDescription = response.data;
            _this.candidateJobDescription.jobCreatedDate= moment(_this.candidateJobDescription.jobCreatedDate+'Z').local().format('MM-DD-YYYY HH:mm');
            _this.candidateJobDescription.appliedDate= moment(_this.candidateJobDescription.appliedDate+'Z').local().format('MM-DD-YYYY HH:mm');
        },
            onError = (error) => {
                console.log(error);
            };
        _this.CandidateAppliedJobService.getJobDescription(_this.jobId);
        _this.CandidateAppliedJobService.activePromise.then(onSuccess, onError);

    }


    changeCandidateJobStatus(candidate, event) {
        let appliedJobStatusId = $('#ddl_' + candidate.id).val();
        if (appliedJobStatusId == candidate.appliedJobStatusId) {
            return false;
        } else if (candidate.appliedJobStatusId != appliedJobStatusId && appliedJobStatusId == 12) {
            $('#modal_' + candidate.id).show();   
            if (event.target.localName == "button") {
                if (_this.comment != '') {
                    _this.isCommented = true;
                } else {
                    _this.isCommented = false;
                    return false;
                }
            } else {
                return false;
            }        
        }        

        let param = {
            jobId: candidate.jobId,
            candidateId: candidate.candidateId,
            statusId: parseInt(appliedJobStatusId),
            comment: _this.comment
        },
        onSuccess = (response) => {
            _this.UtilsService.notify("Job Status Updated Successfully.");
            candidate.appliedJobStatusId = appliedJobStatusId;
            if(appliedJobStatusId == 12){
                $('#modal_' + candidate.id).hide(); 
                _this.comment = '';
            }             
        },
        onError = (error) => {
            let errorMessage = error.data.errorMessage || error.data;
            _this.UtilsService.notify(errorMessage, 'd');
            if(appliedJobStatusId == 12){
                $('#modal_' + candidate.id).hide(); 
                _this.comment = '';
            }
        };

        _this.CandidateAppliedJobService.changeJobStatus(param);
        _this.CandidateAppliedJobService.activePromise.then(onSuccess, onError);
    }

    closeDialogBox(candidate) {
        $('#modal_' + candidate.id).hide(); 
        $("#ddl_"+ candidate.id +" option").filter(function() {
            return $(this).val() ==  candidate.appliedJobStatusId.toString(); 
        }).prop('selected', true);        
        _this.comment = '';
    }
}