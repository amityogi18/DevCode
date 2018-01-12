let _this;

export class CandidateInterviewPrepareController {
	/** @ngInject  */
  constructor($rootScope, $window, $state, AuthService, GrowlerService, UtilsService, CandidateInterviewService, $storage) {
    _this = this;
    document.addEventListener("contextmenu", function (e) {
      alert('Right Click is Not Allowed.');
      e.preventDefault();      
    }, false);
    _this.$rootScope = $rootScope;
    _this.$window = $window;
    _this.$state =  $state;
    _this.AuthService = AuthService;
    _this.GrowlerService = GrowlerService;
    _this.UtilsService = UtilsService;
    _this.CandidateInterviewService = CandidateInterviewService;
    _this.$storage = $storage;
    _this.speedCheck = true;
    _this.audioCheck = true;
    _this.videoCheck = true;

    _this.$rootScope.$on("speedCheckOk", function(){
       _this.speedCheck = false;
    });

   _this.$rootScope.$on("audioCheckOk", function(){
       _this.audioCheck = false;
   });

   _this.$rootScope.$on("videoCheckOk", function(){
       _this.videoCheck = false;
   });
  }
   
  goBack(){
      if(angular.isDefined(_this.AuthService.user) && _this.AuthService.user.userType == 2){
        if(angular.isDefined(_this.$storage.getItem('interviewDetails'))){
           let interviewDetails = JSON.parse(_this.$storage.getItem('interviewDetails'));
           let additionalInfo = _this.filterBlankOption(interviewDetails.criteria.options);
           if(angular.isDefined(additionalInfo) && additionalInfo.length > 0){
              _this.$state.go('ci.profile');
           }else{
              _this.$state.go('ci.interview', {'interviewCode': interviewDetails.interviewCode});
           }
        }else{
           _this.$state.go('ci.prepare');
        }
      }else{
         let interviewDetails = JSON.parse(_this.$storage.getItem('interviewDetails'));
         _this.$state.go('ci.interview', {'interviewCode': interviewDetails.interviewCode});
      }
  }

  filterBlankOption(additionalInfoArray){
    let criteriaOption = [];
    if(angular.isDefined(additionalInfoArray) && additionalInfoArray.length > 0){
      for(var i=0; additionalInfoArray.length > i; i++){
        if(additionalInfoArray[i].option != ""){
           criteriaOption.push(additionalInfoArray[i]);
        }
      }
    }
    return criteriaOption;
  }
}


