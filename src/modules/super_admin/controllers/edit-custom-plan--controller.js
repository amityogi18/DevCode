let _this,
    _activePromise;

export class EditCustomPlanController {
	/** @ngInject  */
  constructor(SuperAdminService, GrowlerService) {
    _this = this;
    _this.SuperAdminService = SuperAdminService;
    _this.GrowlerService = GrowlerService;
    _this.companyList = [];
    _this.isInterview =  1;
    _this.getCompanyList();
    _this.productId = '1';
    _this.searchCompany;
    _this.hideInterviewFiled = false;
    _this.hideConferenceFiled = false;
    _this.fieldCheck();

    if(_this.infoData && _this.infoData === 'edit'){
          _this.isEdit = true;
          _this.showUpdateCustomPlan(_this.data);
          console.log(_this.data);
     }else{
          _this.IsAdd = true;
      }
      
      $(document).mouseup(function(e) {
        var container = $(".md-select-menu-container");

        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) 
        {
            container.hide();
        }
    });
  }
  
  clearSearchCompany(){
    _this.searchCompany= '';
  }

    checkMandatoryFields() {
        if(_this.planName && _this.planName !== ''
            && _this.description && _this.description !== ''
            && _this.noOfUsers && _this.noOfUsers !== ''
            && _this.noOfPosition && _this.noOfPosition !== ''
            && _this.price && _this.price !== ''
            && _this.validity && _this.validity !== ''
            && _this.id && _this.id !== ''

        ) {
            return true;
        }
        else{_this.clientForm.$setSubmitted();
            return false;
        }
    }

  addCustomPlan() {
      if (_this.checkMandatoryFields()) {
          let onSuccess = () => {

                  _this.GrowlerService.growl({
                      type: 'success',
                      message: "Plan Added Successfully",
                      delay: 2000
                  });
                  _this.close();
              },
              onError = (error) => {
                  console.log(error);
              },
              customPlanData = {
                  planName: _this.planName,
                  companyId: _this.id,
                  productId: _this.productId,
                  description: _this.description,
                  noOfUsers: _this.noOfUsers || "",
                  noOfPosition: _this.noOfPosition || "",
                  noOfInterviewInEachPosition: _this.noOfInterviewInEachPosition || "",
                  //noOfCandidate: _this.noOfCandidate,
                  noOfLivenowInterviewInEachPosition: _this.noOfLivenowInterviewInEachPosition || "",
                  noOfMeetings: _this.noOfMeetings || "",
                  totalStorage: _this.totalStorage,
                  noOfParticipantsInConfrence: _this.noOfParticipantsInConfrence || "",
                  recording: _this.recording,
                  callUsingNumber: _this.callUsingNumber,
                  analytics: _this.analytics || "",
                  customWelcomeVideo: _this.customWelcomeVideo,
                  validity: _this.validity,
                  price: _this.price,
                  registrationAndFee: _this.registrationAndFee
              };
          _this.SuperAdminService.addCustomPlan(customPlanData);
          _this.SuperAdminService.activePromise.then(onSuccess, onError);
      }
  }
    getCompanyList(){
        let onSuccess = (response) => {
            _this.companyList = response.data;
            for(let i = 0; _this.companyList.length > i;i++) {
                if (_this.companyList[i].name === 'I-TECH') {
                    _this.companyList.splice(i, 1);
                }
            }
          },
          onError = (error) => {
            console.log(error);
          }
        _this.SuperAdminService.getCompanyList();
        _this.SuperAdminService.activePromise.then(onSuccess, onError);
      }
      
    showUpdateCustomPlan(customs) {
              if (customs.productId === 1) {
                _this.hideInterviewFiled = true;
                _this.hideConferenceFiled = false;
              }else if(customs.productId === 2){
                _this.hideConferenceFiled = true;
                _this.hideInterviewFiled = false;
              }
                _this.planId = customs.planId;
                _this.id = customs.companyId;
                _this.productId = customs.productId;
                _this.planName = customs.planName;
                _this.companyId = customs.companyId;
                _this.description = customs.description;
                _this.noOfUsers = customs.noOfUsers;
                _this.noOfPosition = customs.noOfPosition,
                _this.noOfInterviewInEachPosition = parseInt(customs.noOfInterviewInEachPosition);
                _this.noOfCandidate = customs.noOfCandidate;
                _this.noOfLivenowInterviewInEachPosition = customs.noOfLivenowInterviewInEachPosition,
                _this.noOfMeetings = customs.noOfMeetings,
                _this.totalStorage = customs.totalStorage;
                _this.noOfParticipantsInConfrence = customs.noOfParticipantsInConfrence;
                _this.recording = customs.recording;
                _this.callUsingNumber = customs.callUsingNumber;
                _this.analytics = customs.analytics;
                _this.customWelcomeVideo = customs.customWelcomeVideo;
                _this.validity = customs.validity;
                _this.price = customs.price;
                _this.registrationAndFee = customs.registrationAndFee;
    }
    
    updateCustomPlan() {
        if (_this.checkMandatoryFields()) {
            let onSuccess = (response) => {
                    _this.GrowlerService.growl({
                        type: 'success',
                        message: 'Plan Updated Successfully',
                        delay: 2000
                    });
                    _this.close();
                },
                onError = (error) => {
                    console.log(error);
                },
                data = {
                    planId: _this.planId,
                    companyId: _this.id,
                    productId: _this.productId,
                    planName: _this.planName,
                    description: _this.description,
                    noOfUsers: _this.noOfUsers || "",
                    noOfPosition: _this.noOfPosition || "",
                    noOfInterviewInEachPosition: _this.noOfInterviewInEachPosition || "",
                   // noOfCandidate: _this.noOfCandidate,
                    noOfLivenowInterviewInEachPosition: _this.noOfLivenowInterviewInEachPosition || "",
                    noOfMeetings: _this.noOfMeetings || "",
                    totalStorage: _this.totalStorage,
                    noOfParticipantsInConfrence: _this.noOfParticipantsInConfrence || "",
                    recording: _this.recording,
                    callUsingNumber: _this.callUsingNumber,
                    analytics: _this.analytics || "",
                    customWelcomeVideo: _this.customWelcomeVideo,
                    validity: _this.validity,
                    price: _this.price,
                    registrationAndFee: _this.registrationAndFee
                };
            _this.SuperAdminService.updateCustomPlan(data);
            _this.SuperAdminService.activePromise.then(onSuccess, onError);
        }
    }

    fieldCheck() {
        if(_this.productId=== '1') {
            _this.hideInterviewFiled = true;
            _this.hideConferenceFiled = false;
        } 
        else if(_this.productId === '2') {
            _this.hideConferenceFiled = true;
            _this.hideInterviewFiled = false;
        }
    }
}