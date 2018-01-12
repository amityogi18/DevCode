let _this;
export class candidateInterviewProfileController {
	/** @ngInject  */
  constructor($window, $state, CandidateInterviewService, AuthService, $storage) {
    _this = this;
    _this.$window = $window;
    _this.$state = $state;
    _this.CandidateInterviewService = CandidateInterviewService;
    _this.$storage = $storage;
    _this.AuthService = AuthService;
    _this.additionalInfo = [];
    _this.positionId = 1;
    _this.init();
  }

  init(){
      if(angular.isDefined(_this.AuthService.user) && _this.AuthService.user.userType == 2){
        if(angular.isDefined(_this.$storage.getItem('interviewDetails'))){
           _this.interviewDetails = JSON.parse(_this.$storage.getItem('interviewDetails'));
           _this.additionalInfo = _this.getCriteriaOptionForUI(_this.interviewDetails.criteria.options);
           _this.positionId = _this.interviewDetails.criteria.positionId;
        }else{
           _this.$state.go('ci.prepare');
        }
      }else{
        _this.$state.go('ci.prepare');
      }
  }

  getAdditionalInfo(){
      let onSuccess = (response) => {
         _this.additionalInfo = _this.getCriteriaOptionForUI(response.data.options);
         _this.positionId = response.data.positionId;
         if(angular.isDefined(_this.additionalInfo) && _this.additionalInfo.length > 0 && _this.checkForBlankOptions()){
            _this.$state.go('ci.prepare');
         }
      },
      onError = (error) => {
         console.log(error);
      },
       interviewId = _this.$storage.getItem('interviewId') || 1;
      _this.CandidateInterviewService.getAdditionalInfo(interviewId);
      _this.CandidateInterviewService.activePromise.then(onSuccess, onError);
  }

  saveCriteriaAndGoNext(){
    _this.checkForManadatory();
    if(_this.count === 0){
        let onSuccess = (response) => {
          _this.$state.go('ci.prepare');
        },
        onError = (error) => {
           console.log(error);
        },
        criteriaReplyData = {
              options : _this.getCriteriaOptionData()
        };
        _this.CandidateInterviewService.saveCriteriaReply(criteriaReplyData);
        _this.CandidateInterviewService.activePromise.then(onSuccess, onError);
    }
  }

  getCriteriaOptionData(){
    let criteriaOptionData = [];
    if(_this.additionalInfo.length > 0){
      for(var i=0; _this.additionalInfo.length > i; i++){
       let data = {
                   optionId : _this.additionalInfo[i].optionId,
                   answer : $('#txt_'+_this.additionalInfo[i].optionId).val()
                  };
       criteriaOptionData.push(data);
      }
    }
    return criteriaOptionData;
  }

  getCriteriaOptionForUI(additionalInfoArray){
      let criteriaOption = [];
      if(additionalInfoArray.length > 0){
        for(var i=0; additionalInfoArray.length > i; i++){
          if(additionalInfoArray[i].option != ""){
             criteriaOption.push(additionalInfoArray[i]);
          }
        }
      }
      return criteriaOption;
    }

  checkForBlankOptions(){
    let returnValue = true;
     for(let i = 0; _this.additionalInfo.length > i; i++){
        if(_this.additionalInfo[i].option !== ""){
             returnValue = false;
        }
     }
     return returnValue;
  }

  checkForRequired(info){
    let returnValue = false;
    if(info.isManadatory){
        _this.isManadatory = info.isManadatory;
        let txtbox  = $('#txt_'+info.optionId);
        let spnError  = $('#spn_'+info.optionId);
        let value = txtbox.val();
        if(value.trim() === ""){
          spnError.show('slow');
          returnValue = true;
        }else{
          spnError.hide('slow');
        }
    }
    return returnValue
  }

  checkForManadatory(){
     _this.count = 0;
     if(_this.additionalInfo.length > 0){
       for(let i = 0; _this.additionalInfo.length > i; i++){
         if(_this.checkForRequired(_this.additionalInfo[i])){
            _this.count++;
         };
       }
     }
    }

}

