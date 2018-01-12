let _this;
const EMAIL_REGEX = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
let strongRegex=/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,15}$/;

export class CandidateCredentialsController {
    /** @ngInject  */
    constructor(CandidateCredentialsService, NgTableParams, dataTableService, GrowlerService) {
        _this = this;
        _this.CandidateCredentialsService = CandidateCredentialsService;
        _this.dataTableService = dataTableService;
        _this.dataTableService.initTable([], {});
        _this.GrowlerService = GrowlerService;
        _this.IsEdit = false;
        _this.candidateCredentailsData = '';
        _this.candidateOfficialEmail = '';
        _this.candidateOfficialPassword = '';
        _this.hostName = '';
        _this.showPassword = false;
        _this.isPasswordRight = false;
        if (_this.infoData && _this.infoData === 'edit') {
            _this.IsEdit = true;
            _this.showUpdateCandidate(_this.data);
        } else {
            _this.IsAdd = true;
            _this.candidateInfodata = _this.data;
        }
    }

    checkMandatoryFields() {
        if (_this.candidateOfficialEmail && _this.candidateOfficialEmail !== ''
            && _this.candidateOfficialPassword && _this.candidateOfficialPassword !== ''
            && _this.isvalidEmail === true) {
            return true;
        }
        else {
            _this.credentialForm.$setSubmitted();
            return false;
        }
    }

    addCandidateCredentials() {
        if (!angular.isDefined(_this.candidateOfficialEmail) || _this.candidateOfficialEmail === "" || _this.candidateOfficialEmail === null) {
            _this.errormessage = " Please Enter Email Id";
        }
        if (_this.checkMandatoryFields()) {
            let onSuccess = () => {
                _this.GrowlerService.growl({
                    type: 'success',
                    message: "Credentials Added Successfully",
                    delay: 2000
                });
                _this.close();
            },
                onError = (error) => {
                    console.log(error);
                };

            let userData = {
                candidateId: _this.candidateInfodata.candidateId,
                candidateOfficialEmail: _this.candidateOfficialEmail,
                candidateOfficialPassword: _this.candidateOfficialPassword,
                hostName: _this.hostName,
            };

            _this.CandidateCredentialsService.addCandidateCredentials(userData);
            _this.CandidateCredentialsService.activePromise.then(onSuccess, onError);
        }

    }

    showUpdateCandidate(credentailsData) {
        _this.isvalidEmail = true;
        _this.candidateId = credentailsData.candidateId;
        _this.fetchCandidateDetailsById(_this.candidateId);
        
    }

    fetchCandidateDetailsById(id) {
        _this.accountDetailsDataId = id;
        let onSuccess = (response) => {
            _this.accountDetailsData = response.data;
            _this.candidateOfficialEmail = _this.accountDetailsData.candidateOfficialEmail;
            _this.candidateOfficialPassword = _this.accountDetailsData.candidateOfficialPassword;
            _this.hostName = _this.accountDetailsData.hostName;
        },
            onError = (error) => {
                console.log(error);
            };

        _this.CandidateCredentialsService.getCandidateCredentialsById(_this.accountDetailsDataId);
        _this.CandidateCredentialsService.activePromise.then(onSuccess, onError);
    }


    updateCandidateCredentials() {
        if (_this.checkMandatoryFields()) {
            let onSuccess = () => {
                _this.GrowlerService.growl({
                    type: 'success',
                    message: "User Updated Successfully",
                    delay: 2000
                });
                _this.close();
            },
                onError = (error) => {
                    console.log(error);
                };
            let candidateUpdateData = {
                candidateId: _this.candidateId,
                candidateOfficialEmail: _this.candidateOfficialEmail,
                candidateOfficialPassword: _this.candidateOfficialPassword,
                hostName: _this.hostName,
            };
            _this.CandidateCredentialsService.updateCandidateCredentials(candidateUpdateData);
            _this.CandidateCredentialsService.activePromise.then(onSuccess, onError);
        }
    }

    isInvalidEmail(email) {
        _this.errormessage = "";
        if (angular.isDefined(email) && !EMAIL_REGEX.test(email)) {
            _this.errormessage = "Enter Valid Email Id";
            _this.isvalidEmail = false;
        }
        else if (!angular.isDefined(email) || email === "" || email === null) {
            _this.errormessage = " Please Enter Email Id";
        } else {
            _this.errormessage = "";
            _this.isvalidEmail = true;
        }
    };

    onClose() {
        _this.credentialsTableParams.reload();
    }

    analyzePassword(value) {
        _this.isPasswordRight = strongRegex.test(value);
    }

    togglePassword(){
        _this.showPassword = ! this.showPassword;
    }

}