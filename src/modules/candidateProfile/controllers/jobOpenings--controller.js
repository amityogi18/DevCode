let _this;
import _ from 'lodash';
export class jobOpeningsController {
    /** @ngInject  */
    constructor(jobOpeningsService, NgTableParams, dataTableService, AuthService, $state, $window, UtilsService, $mdDialog, AdminPaymentPlanService, $timeout, $location) {
        _this = this;
        _this.jobOpeningsService = jobOpeningsService;
        _this.dataTableService = dataTableService;
        _this.AuthService = AuthService;
        _this.$state = $state;
        _this.$window = $window;
        _this.$timeout = $timeout;
        _this.$location = $location;
        _this.isRegisterShow = false;
        _this.isLoginShow = true;
        _this.isUp = false;
        _this.isPaymentError = false;
        _this.paymentError = "";
        _this.jobList = {};
        _this.$mdDialog = $mdDialog;
        _this.UtilsService = UtilsService;
        _this.AdminPaymentPlanService = AdminPaymentPlanService;
        _this.getAllCompanyList();
        _this.getJobList();
        _this.getSkillList();
        _this.jobFilter = {};
        _this.filteredList = {};
        _this.getCandidateDetailsById();
        _this.candidateData = {};
        _this.initialLoad = true;
        _this.cardDetails = { status: false };
        _this.getCardDetail();
        _this.transactionId = "";
        _this.queryURL = _this.$window.localStorage.getItem('queryURL');
        _this.$window.localStorage.removeItem('queryURL');
        _this.getAllActiveJobList = function () {
            _this.tableParams = new NgTableParams({
                start: 1,
                count: 5,
                filter: _this.jobFilter
            }, {
                    counts: [5, 10, 20],
                    getData: function (params) {
                        let filter = params.filter(),
                            sorting = params.sorting(),
                            count = params.count(),
                            start = params.page(),
                            filterFields = [],
                            sortFields = [],
                            queryString = '';

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
                        if (_this.initialLoad) {
                            queryString = '*&wt=json&indent=true';
                        }
                        else if (_this.isFilterApplied()) {
                            queryString = _this.filterqueryURL;
                        } else {
                            queryString = '*&wt=json&indent=true';
                            _this.initialLoad = true;
                        }
                        if (_this.queryURL == "" || _this.queryURL == "undefined" || _this.queryURL == "null" || _this.queryURL === null) {
                            _this.queryURL = `${queryString}&start=${start * count}&rows=${count}`;
                        }

                        let onSuccess = (response) => {
                            _this.jobList = _this.filterOnDemandJobs(response.data.response.docs);
                            _this.jobListCount = response.data.response.numFound;
                            params.total(_this.jobListCount);
                            if (!_this.dataTableService.totalColumn.length) {
                                _this.dataTableService.initTable(_this.cols, _this.tableParams);
                            }
                            return (_this.jobList);
                        },
                            onError = (error) => {
                                console.log(error);
                            };
                            
                        _this.jobOpeningsService.getAllActiveJobList(_this.queryURL, _this.initialLoad);
                        _this.queryURL = "";
                        return _this.jobOpeningsService.activePromise.then(onSuccess, onError);

                    }
                });
        };
        _this.getAllActiveJobList(true);
        _this.getPaymentError();
        _this.getPaymentDetails();
    }

    getPaymentError() {
        let errorParam = _this.$location.$$search;
        if (angular.isDefined(errorParam) && angular.isDefined(errorParam.e)) {
            if (errorParam.e !== "") {
                _this.isPaymentError = true;
                _this.paymentError = errorParam.e;
                _this.$timeout(function () {
                    _this.isPaymentError = false;
                    _this.paymentError = "";
                    _this.$location.search('e', null);
                }, 10000);
            }
        }
    }

    getPaymentDetails() {
        let paymentInfo = window.localStorage.getItem('paymentResponse');
        if (angular.isDefined(paymentInfo) && paymentInfo != null && paymentInfo != "") {
            paymentInfo = JSON.parse(paymentInfo);
            _this.transactionId = paymentInfo.transactionId;
            window.localStorage.removeItem('paymentResponse');
            _this.getCandidateDetailsById(true);
            return false;
        }
    }

    isFilterApplied() {
        let isApplied = false;
        for (let key in _this.jobFilter) {
            if (_this.jobFilter[key]) {
                isApplied = true;
            }
        }
        return isApplied;
    }

    getCandidateDetailsById(isPaymentResponse) {
        let onSuccess = (response) => {
            _this.candidateData = response.data;
            _this.additionalInfo = {};
            _this.additionalInfo.coverLetter = _this.candidateData.coverLetter;
            _this.additionalInfo.resume = _this.candidateData.resume;
            _this.additionalInfo.candidateLogo = _this.$window.localStorage.profilePicPath;

            if (angular.isDefined(isPaymentResponse) && isPaymentResponse) {
                let jd = JSON.parse(_this.$window.localStorage.getItem('jd'));
                _this.$window.localStorage.removeItem('jd');
                _this.appliedJobPortals(jd);
            }
        },
            onError = (error) => {
                console.log(error);
            };
        _this.jobOpeningsService.getCandidateDetailsById();
        _this.jobOpeningsService.activePromise.then(onSuccess, onError);
    }

    appliyManually(jobUrl) {
        _this.$mdDialog.hide();
        _this.$window.open(jobUrl, '_blank');
    }

    getCandidateJobAppliedInfo(job) {
        let onSuccess = (response) => {
            let candidateJobAppliedInfo = response.data;

            if (angular.isDefined(candidateJobAppliedInfo) && candidateJobAppliedInfo.isApplied) {
                _this.UtilsService.notify("You have already applied for this job.");
            } else if (angular.isDefined(candidateJobAppliedInfo) && angular.isDefined(candidateJobAppliedInfo.isApplyLimitExceeded) && candidateJobAppliedInfo.isApplyLimitExceeded) {
                _this.showDialog(job);
            } else {
                _this.appliedJobPortals(job);
            }
        },
            onError = (error) => {
                console.log(error);
            };

        if (job.isOnDemandJob) {
            _this.jobOpeningsService.candidateAppliedDetailsById(job.jobcode);
        } else {
            _this.jobOpeningsService.candidateAppliedDetailsById(job.id);
        }
        _this.jobOpeningsService.activePromise.then(onSuccess, onError);
    }

    appliedJobPortals(job) {
        if (_this.additionalInfo.resume === "" || null) {
            _this.UtilsService.notify("In order to apply for any job you need to update your profile along with your updated resume ");
        }
        else if (_this.additionalInfo.candidateLogo === '' || null) {
            _this.UtilsService.notify("In order to apply for any job you need to update your profile along with your profile picture ");
        }
        else if (_this.additionalInfo.coverLetter === '' || null) {
            _this.UtilsService.notify("In order to apply for any job you need to update your profile and add a cover letter");
            //_this.$state.go('candidateProfile.create-profile');
        } else {
            let jobDetails = {
                transactionId: _this.transactionId,
                jobId: job.id,
                jobTitle: job.jobtitle,
                jobDescription: job.jobdescription,
                jobLocation: job.location,
                companyName: job.company,
                jobUrl: job.jobdetailurl,
                jobCode: job.jobcode,
                jobCreatedDate: job.jobcreationdate,
                additionalInfo: {
                    "applyCandidate": true,
                    "contactNumber": _this.additionalInfo.contactNumber || "",
                    "coverLetter": _this.additionalInfo.coverLetter || "",
                    "candidateLogo": _this.additionalInfo.candidateLogo || "",
                    "resume": _this.additionalInfo.resume || ""
                }
            },
                onSuccess = (response) => {
                    _this.UtilsService.notify("Job Applied Sucessfully");
                },
                onError = (error) => {
                    console.log(error);
                };
            _this.jobOpeningsService.appliedJobPortals(jobDetails);
            _this.jobOpeningsService.activePromise.then(onSuccess, onError);
        }
    }

    saveJobAsFavorite(job) {
        let onSuccess = (response) => {
            _this.UtilsService.notify("Job Save As Favorite");
        },
            onError = (error) => {
                console.log(error);
            };
        let data = {
            jobId: job.id,
            jobTitle: job.jobtitle,
            jobUrl: job.jobdetailurl,
            companyName: job.company,
            jobDescription: job.jobDescription,
            jobLocation: job.location,
            jobCreatedDate: job.jobcreationdate,
            isFavourite: true
        };
        _this.jobOpeningsService.saveJobAsFavorite(data);
        _this.jobOpeningsService.activePromise.then(onSuccess, onError);
    }

    showRegisterPage() {
        _this.isRegisterShow = true;
        _this.isLoginShow = false;
    }

    showLoginPage() {
        _this.isRegisterShow = false;
        _this.isLoginShow = true;
    }

    toggleIcon() {
        _this.isUp = !_this.isUp;
    }

    //Api to get all companylist(Haddop)
    getAllCompanyList() {
        let onSuccess = (response) => {
            _this.companyList = response.data.response.docs;
            _this.companyList = _.uniqBy(_this.companyList, 'company');
        },
            onError = (error) => {
                console.log(error);
            };
        _this.jobOpeningsService.getAllCompanyList();
        _this.jobOpeningsService.activePromise.then(onSuccess, onError);
    }

    //Api to get all jobcompanylist(Haddop) 
    getJobList() {
        let onSuccess = (response) => {
            _this.allJobList = response.data.response.docs;
            _this.allJobList = _.uniqBy(_this.allJobList, 'jobtitle');
        },
            onError = (error) => {
                console.log(error);
            };
        _this.jobOpeningsService.getJobList();
        _this.jobOpeningsService.activePromise.then(onSuccess, onError);
    }

    //APi to get skills
    getSkillList() {
        let onSuccess = (response) => {
            _this.skillSetList = response.data;
            _this.skillSetList = _.uniqBy(_this.skillSetList, 'skillName');
        },
            onError = (error) => {
                console.log(error);
            };
        _this.jobOpeningsService.getSkillList().then(onSuccess, onError);;
        //_this.jobOpeningsService.activePromise.then(onSuccess, onError);
    }

    searchFilter(value) {
        let jobtitle;
        _this.initialLoad = false;
        _this.jobFilter = {
            globalSearch: _this.globalSearch,
            jobtitle: _this.jobTitle,
            location: Object.keys(_this.location).length && _this.location.name.split(',')[0] + ',',
            company: _this.jobFilter.company,
            primarySkill: _this.jobFilter.primarySkill
        };

        _this.createQueryUrl();
    }

    updateFilter() {
        _this.jobFilter.globalSearch = _this.globalSearch;
    }

    onFilterApplied(value, category) {
        _this.initialLoad = false;
        if (_this.filteredList[value]) {
            if (_this.jobFilter[category] && !_this.jobFilter[category].includes(value)) {
                _this.jobFilter[category] += value;
            } else {
                _this.jobFilter[category] = value + ',';
            }
        } else {
            if (_this.jobFilter[category].includes(value)) {
                _this.jobFilter[category] = _this.jobFilter[category].replace(value, '');
            }
        }
        _this.createQueryUrl();
    }

    resetFilter() {
        _this.globalSearch = '';
        _this.location = '';
        _this.company = '';
        _this.jobTitle = '';
        _this.primarySkill = '';
        _this.jobFilter = {
            globalSearch: undefined,
            jobtitle: undefined,
            location: undefined,
            company: undefined,
            primarySkill: undefined
        };
        _this.filteredList = {
            jobtitle: undefined,
            location: undefined,
            company: undefined,
            primarySkill: undefined
        }
        _this.clearData();
        _this.createQueryUrl();
    }

    createQueryUrl() {
        let andSearch = '';
        for (let key in _this.jobFilter) {
            if (key !== 'globalSearch' && _this.jobFilter[key]) {
                let values = _this.jobFilter[key].split(',').filter(item => item != '');
                if (values.length) {
                    andSearch += `&fq=${key}:(`
                    for (let value = 0; value < values.length; value++) {
                        if (values[value]) {
                            andSearch += `${values[value]}`;
                        }
                        if (value < (values.length - 1)) {
                            andSearch += ' OR ';
                        }
                    }
                    andSearch += ')';
                }
            }
        }

        const openSearch = _this.globalSearch ? `${_this.globalSearch}${andSearch}&defType=dismax` : `*${andSearch}`;

        _this.filterqueryURL = openSearch;
        _this.tableParams.reload();
    }

    // Check if job is OnDemand job or not
    isOnDemandJob(job) {
        let returnValue = true;
        if (angular.isDefined(job.jobcode) && job.jobcode != null && job.jobcode !== "" && job.jobcode.trim() !== "") {
            returnValue = true;
        } else {
            returnValue = false;
        }
        return returnValue;
    }

    // Navigate to Payment Page
    goToPayment(jobId) {
        _this.$window.localStorage.setItem('queryURL', _this.queryURL);
        _this.$mdDialog.hide();
        if (angular.isDefined(_this.cardDetails) && !_this.cardDetails.status) {
            _this.$state.go('candidateProfile.admin-payment', { planId: jobId, type: "paymentBycandidate" });
        } else {
            _this.paymentCallback(_this.cardDetails.threeDsecure, jobId);
        }
    }

    // Update Card Details
    updateCardDetails(jobId) {
        _this.$mdDialog.hide();
        _this.$state.go('candidateProfile.admin-payment', { planId: jobId, type: "paymentBycandidate" });
    }

    // Callback function for payment
    paymentCallback(isThreeD, jobId) {
        let product = "",
            portal = [],
            candidateId = _this.AuthService.user.userId,
            type = "paymentBycandidate";

        let data = {
            "paymentType": type,
            "sourceId": "",
            "portalPlans": portal,
            "productPlan": product,
            "candidateId": candidateId,
            "positionId": "",
            "jobCode": jobId,
            "cardStatus": "x1ssdf1112dfdf1111df",
            "cardExpMonth": "",
            "cardExpYear": "",
            "cardLast4digit": "",
            "threed_secure": "",
            "owner": {
                "address": {
                    "city": "",
                    "country": "",
                    "line1": "",
                    "line2": "",
                    "postal_code": "",
                    "state": ""
                },
                "email": "",
                "name": "",
                "phone": "",
                "verified_address": null,
                "verified_email": null,
                "verified_name": null,
                "verified_phone": null
            }
        };
        let onSuccess = (response) => {
            console.log(response.data);
            if (isThreeD === "supported") {
                _this.paymentIframeCallback(response.data);
            } else {
                _this.makePayment(response.data);
            }
        },
            onError = (error) => {
                console.log(error);
                _this.UtilsService.notify('Something went wrong, Please try again in sometime. If problem persist please contact customer support.', true, 6000);
            };
        if (isThreeD === "supported") {
            _this.AdminPaymentPlanService.getThreeDSecureSource(data);
            _this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);
        } else {
            _this.AdminPaymentPlanService.getPaymentObject(data);
            _this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);
        }

    }

    paymentIframeCallback(response) {
        let windowWidth = _this.$window.innerWidth,
            windowHeight = _this.$window.innerHeight,
            windowStyle = 'width:' + windowWidth + 'px;height:' + windowHeight + 'px;overflow: hidden;border:0px;position:absolute;top:-65px;left:-133px;z-index:9999;';

        //window.location.replace(response.redirect.url);
        let paymentContainer = document.querySelector('#job-openings-container');
        paymentContainer.style.display = 'none';

        var iframe = document.createElement("iframe");
        iframe.src = response.redirect.url;
        iframe.setAttribute('style', windowStyle);
        iframe.className = "secure-iframe";
        $("#payment-candidate-profile-iframe").append(iframe);
    };

    makePayment(token) {
        let data = {
            "autoRenew": "1",
            "customerCode": token.customerCode
        };
        let onSuccess = (response) => {
            console.log(response.data);
            _this.UtilsService.notify('Transaction Successfull !!', true, 6000);
            _this.transactionId = response.data.transactionId;
            let jd = JSON.parse(_this.$window.localStorage.getItem('jd'));
            _this.$window.localStorage.removeItem('jd');
            _this.appliedJobPortals(jd);
        },
            onError = (error) => {
                console.log(error);
                _this.UtilsService.notify('Something went wrong, Please try again in sometime. If problem persist please contact customer support.', true, 6000);
            };
        _this.AdminPaymentPlanService.makePayment(data);
        _this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);
    }

    // fetch cradit/dabit card details of candidate
    getCardDetail() {
        let onSuccess = (response) => {
            //_this.cardDetails = { status: true };
            _this.cardDetails = response.data;
        },
            onError = (error) => {
                _this.cardDetails = [];
            };
        _this.jobOpeningsService.getCandidateCardDetails();
        _this.jobOpeningsService.activePromise.then(onSuccess, onError);
    }

    // Show Payment model popup
    showDialog(job) {
        let jd = JSON.stringify(job);
        _this.$window.localStorage.setItem('jd', jd);
        let jobId = job.jobid != "" ? job.jobid : job.id;
        let parentEl = angular.element(document.body);
        _this.$mdDialog.show({
            parent: parentEl,
            template:
                '<md-dialog aria-label="List dialog" style="width:50%">' +
                '   <md-toolbar>' +
                '       <div class="md-toolbar-tools">' +
                '           <h2>Payment Required</h2>' +
                '           <span flex></span>' +
                '           <md-button class="md-icon-button" ng-click="jobOpeningsCtrl.closeDialog()">' +
                '               <i class="fa fa-times" aria-hidden="true"></i>' +
                '               <md-icon  aria-label="Close dialog"></md-icon>' +
                '           </md-button>' +
                '       </div>' +
                '   </md-toolbar>' +
                '   <md-dialog-content>' +
                '       <div class="md-dialog-content">' +
                '           <h4>Only 5 jobs are allowed in a day.</h4>' +
                '           <p>If you wish to apply for more number of jobs, You have to pay <span style="color:blue;font-weight: bold;">&nbsp;$1&nbsp;</span> for each job you apply.</p>' +
                '           <hr data-ng-if="jobOpeningsCtrl.cardDetails.status"/>' +
                '           <p data-ng-if="jobOpeningsCtrl.cardDetails.status"> <span>You will be charged from the card ending with : </span><span style="font-size:11px;color:gray;">XXXX XXXX XXXX {{jobOpeningsCtrl.cardDetails.cardLast4digit}}</span><br/>To update the card details click here :' +
                '               <md-button ng-click="jobOpeningsCtrl.updateCardDetails(\'' + jobId + '\')" class="md-primary md-raised">Update Card Details</md-button>' +
                '           </p>' +
                '       </div>' +
                '   </md-dialog-content>' +
                '   <md-dialog-actions>' +
                '       <md-button ng-click="jobOpeningsCtrl.appliyManually(\'' + job.jobdetailurl + '\')" class="md-raised">Apply Manually</md-button>' +
                '       <md-button ng-click="jobOpeningsCtrl.goToPayment(\'' + jobId + '\')"" class="md-primary md-raised">Proceed To Payment</md-button>' +
                '       <md-button ng-click="jobOpeningsCtrl.closeDialog()" class="md-warn md-raised">Cancel</md-button>' +
                '   </md-dialog-actions>' +
                '</md-dialog>',
            controller: 'jobOpeningsController',
            controllerAs: 'jobOpeningsCtrl',
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true
        });
    };

    // Show Payment model popup
    closeDialog() {
        _this.$mdDialog.hide();
    }

    filterOnDemandJobs(jobList) {
        if (angular.isDefined(jobList) && jobList.length > 0) {
            _.forEach(jobList, function (job) {
                job.isOnDemandJob = _this.isOnDemandJob(job);
            });
        }
        return jobList;
    }

    clearSuggestions(clearData) {
        _this.clearData = clearData;
    };
};

