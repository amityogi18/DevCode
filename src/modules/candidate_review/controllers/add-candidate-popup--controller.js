let _this;

export class AddCandidatePopupController {
    /** @ngInject  */
    constructor(AuthService, AdminDepartmentService, InterviewService, candidateReviewService, locationService, CandidateProfileService, GrowlerService) {
        _this = this;
        _this.AuthService = AuthService;
        _this.adminDepartmentService = AdminDepartmentService;
        _this.CandidateProfileService = CandidateProfileService;
        _this.InterviewService = InterviewService;
        _this.CandidateReviewService = candidateReviewService;
        _this.locationService = locationService;
        _this.GrowlerService = GrowlerService;
        _this.departmentList = [];
        _this.skillsetList = [];
        _this.locationName = {};
        _this.searchDepartment;
        _this.searchSkill;
        _this.searchPosition;
        _this.searchInterview;
        _this.autocomplete = "";        
        _this.inputSearch = "";
        _this.locationReadyInd = false;
        _this.selectedCompanyCandidateId = [];
        if (angular.isDefined(_this.data) && _this.data !== null) {
            _this.interviewId = _this.data.interviewId;
        }
        _this.positionId = _this.id;
        _this.getPositionList();
        _this.getDepartment();
        $(document).mouseup(function (e) {
            var container = $(".md-select-menu-container");
            // if the target of the click isn't the container nor a descendant of the container
            if (!container.is(e.target) && container.has(e.target).length === 0)
            {
                container.hide();
            }
        });

    }

    clearSearchDeptTerm() {
        _this.searchDepartment = '';
    }

    clearSearchSkillTerm() {
        _this.searchSkill = '';
    }

    clearSearchPositionTerm() {
        _this.searchPosition = '';
    }

    clearSearchInterviewTerm() {
        _this.searchInterview = '';
    }

    openCandidateUpload() {
        $('#candidatefilectrl').click();
    }  

    checkRequiredFields() {
        _this.locationName = _this.geoAddress.name;
        if (_this.firstName && _this.firstName !== ''
                && _this.lastName && _this.lastName !== ''
                && _this.email && _this.email !== ''
                && _this.departmentId && _this.departmentId !== ''
                && _this.totalYears && _this.totalYears !== ''
                && _this.totalMonths && _this.totalMonths !== ''
                && _this.locationName && _this.locationName !== ''
                && _this.skillsetId && _this.skillsetId !== ''
                && _this.contactNumber && _this.contactNumber !== ''
                ) {
            return true;
        } else {
            _this.candidateForm.$setSubmitted();
            return false;
        }
    }

    addCandidate() {
        _this.locationName = _this.geoAddress.name;
        if (!angular.isDefined(_this.email) || _this.email === '') {
            _this.errormessage = "Enter Email Id";
        }

        if (!angular.isDefined(_this.totalYears) || _this.totalYears === '') {
            _this.yearErrormessage = "Enter Experience In  Years";
        }

        if (!angular.isDefined(_this.totalMonths) || _this.totalMonths === '') {
            _this.monthErrormessage = "Enter Experience In Months";
        }

        if (!angular.isDefined(_this.contactNumber) || _this.contactNumber === '') {
            _this.errmsgcon = "Enter Contact Number";
        }

        if (_this.checkRequiredFields()) {
            //@Todo - validations to be implemented
            let candidate = {
                "companyId": _this.AuthService.user.companyId,
                "firstName": _this.firstName,
                "lastName": _this.lastName,
                "email": _this.email,
                "departmentId": _this.departmentId,
                "totalYears": _this.totalYears,
                "totalMonths": _this.totalMonths,
                "address": _this.locationName,
                "skillsetId": _this.skillsetId,
                "contactNumber": _this.contactNumber
            };
            _this.InterviewService.addCandidate(candidate);
            _this.InterviewService.activePromise.then((response) => {

                _this.GrowlerService.growl({
                    type: 'success',
                    message: 'Candidate Added successfully',
                    delay: 2000
                });
                if (response && response.data && response.data.id) {
                    _this.linkCompanyCandidateToInterview(response.data.id);
                }
                _this.close();

            },
                    (error) => {
                console.log(error);
            });
        } else {
            _this.GrowlerService.growl({
                type: 'warning',
                message: 'Please fill all the valid fields required!',
                delay: 2000
            });
        }

    }
    
    getDepartment() {
        let onSuccess = (response) => {
            _this.departmentList = response.data.data;
            console.log(response.data.data);
        },
                onError = (error) => {
            console.log(error);
        };
        _this.adminDepartmentService.getDepartment();
        _this.adminDepartmentService.activePromise.then(onSuccess, onError);
    }

    getSkillSet(departmentId) {
        if (angular.isDefined(_this.skillsetId)) {
            _this.skillsetId = '';
        }
        let onSuccess = (response) => {

            _this.skillsetList = response.data || [];
            console.log(_this.skillsetList);
        },
        onError = (error) => {
            console.log(error);
        };
        _this.CandidateProfileService.getSkillSet(departmentId);
        _this.CandidateProfileService.activePromise.then(onSuccess, onError);
        _this.candidateForm.$setPristine();
        _this.candidateForm.$setUntouched();
    }

    getPositionList() {
        let onSuccess = (response) => {
            _this.positionList = response.data || [];
            console.log(_this.positionList);
        },
        onError = (error) => {
            _this.positionList = [];
        };

        _this.CandidateReviewService.getPositionCodes();
        _this.CandidateReviewService.activePromise.then(onSuccess, onError);

    }

    getInterviewsList(positionId) {
        let onSuccess = (response) => {
            _this.interviewList = response.data || [];

        },
        onError = (error) => {
            _this.interviewList = [];
        };

        _this.CandidateReviewService.getInterviews(positionId);
        _this.CandidateReviewService.activePromise.then(onSuccess, onError);

    }

    clearCandidateFields() {
        _this.email = _this.firstName = _this.lastName = _this.contactNumber = _this.totalYears = _this.totalMonths = _this.locationName =
                _this.department.id = _this.skillsetId = _this.positionId = _this.interviewId = '';
    }

    linkCompanyCandidateToInterview(candidateId) {
        let onSuccess = (response) => {
            //_this.close();
        },
        onError = (error) => {
            console.log(error);
        };

        let data = {
            interviewId: _this.interviewId || 1,
            candidateIds: [candidateId],
            singleAdd: 'yes'
        };

        _this.InterviewService.linkCompanyCandidateToInterview(data);
        _this.InterviewService.activePromise.then(onSuccess, onError);
    } 

    isFileAdded(file) {
        //this.fileSelected = file.length > 0 ? false : true;
        if (file.length > 0) {
            this.fileNotSelected = true;
        } else {
            this.fileNotSelected = false;
        }
    };

    uploadCandidateFile(file) {
        _this.importCandidateFile = file[0];
        if (_this.importCandidateFile) {
            _this.importCandidateList();
        }
    };

    importCandidateList() {
        let onSuccess = (response) => {
            _this.GrowlerService.growl({
                type: 'success',
                message: "Candidates Imported Successfully",
                delay: 2000
            });
        },
        onError = (error) => {
            console.log(error);
        };
        _this.InterviewService.importCandidateList({file: _this.importCandidateFile});
        _this.InterviewService.activePromise.then(onSuccess, onError);

    };

    analyzePhoneNumber(contactNumber) {
        _this.errmsgcon = "";
        if (angular.isDefined(contactNumber) && contactNumber.length < 10) {
            _this.errmsgcon = "Enter Valid Contact Number";
            _this.contactCriteria = false;
        } else if (!angular.isDefined(contactNumber) || contactNumber === "" || contactNumber === null) {
            _this.errmsgcon = "Please Enter Contact Number";
        } else {
            _this.errmsgcon = "";
            _this.contactCriteria = true;
        }
    };

    analyzeEmailId(email) {
        let emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
        _this.errormessage = "";
        if (angular.isDefined(email) && !emailRegex.test(email)) {
            _this.errormessage = "Enter Valid Email Id";
            _this.emailCriteria = false;
        } else if (!angular.isDefined(email) || email === "" || email === null) {
            _this.errormessage = " Please Enter Email Id";
        } else {
            _this.errormessage = "";
            _this.emailCriteria = true;
        }
    };
    
    analyzeYearExp(totalYears) {
        if (angular.isDefined(totalYears) && totalYears > 65) {
            _this.yearErrormessage = "Enter valid Year";
        } else if (!angular.isDefined(totalYears) || totalYears === "" || totalYears === null) {
            _this.yearErrormessage = "Enter valid Year";
        } else {
            _this.yearErrormessage = "";
        }
    };
    
    analyzeMonthExp(totalMonths) {
        //return event.charCode >= 48 && event.charCode <= 57
        if (angular.isDefined(totalMonths) && totalMonths > 11) {
            _this.monthErrormessage = "Enter valid month";
        } else if (!angular.isDefined(totalMonths) || totalMonths === "" || totalMonths === null) {
            _this.monthErrormessage = "Enter valid month";
        } else {
            _this.monthErrormessage = "";
        }
    };
}



