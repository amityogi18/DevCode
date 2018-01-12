let _this;
export class InterviewPrepareController {
	/** @ngInject  */
  constructor($state, $rootScope, $stateParams, $window, $location, CandidateInterviewService, $storage){
    _this = this;
    _this.$state = $state;
    _this.$stateParams = $stateParams;
    _this.$rootScope = $rootScope;
    _this.$window = $window;
    _this.$location = $location;
    _this.CandidateInterviewService = CandidateInterviewService;
    _this.$storage = $storage;
    _this.interviewCode = _this.$stateParams.interviewCode;
    _this.interviewDetails = {};
    _this.speedCheck = true;
    _this.audioCheck = true;
    _this.videoCheck = true;
    console.log('Interview Prepare Controller Loaded');

    _this.$rootScope.$on("speedCheckOk", function(){
       _this.speedCheck = false;
    });

   _this.$rootScope.$on("audioCheckOk", function(){
       _this.audioCheck = false;
   });

   _this.$rootScope.$on("videoCheckOk", function(){
       _this.videoCheck = false;
   });

    _this.getInterviewDetailsByCode();
  }

  getInterviewDetailsByCode(){
      let onSuccess = (response) => {
         _this.interviewDetails = response.data;
         _this.interviewDetails.interviewCode = _this.interviewCode;
         _this.$storage.setItem('interviewDetails',  JSON.stringify(_this.interviewDetails));
      },
      onError = (error) =>{
         console.log(error);
      };
      _this.CandidateInterviewService.getInterviewDetailsByCode(_this.interviewCode);
      _this.CandidateInterviewService.activePromise.then(onSuccess, onError);
  }

  joinMeeting(user) {
    let stateParams = { participantName : user.fullName, confId : _this.interviewCode, meetingTypeM : 'interview' }
    if(user.participantType == "host") {
      _this.$state.go('conference.host-webrtc', stateParams);
    }
    else if(user.participantType == "participant") {
      _this.$state.go('conference.participant-webrtc', stateParams);
    }
  }

  getUserDetailForInterview(){
    let url = _this.$location.path();
    if(url.indexOf("host-interview") >=0){
        let host  = _this.interviewDetails.hosts[0];
        host.participantType = "host";
        _this.joinMeeting(host);
    }else{
       let candidate = _this.interviewDetails.candidateDetails;
       candidate.participantType = "participant";
       _this.$storage.setItem('interviewCandidateId', candidate.id);
       _this.joinMeeting(candidate);
    }
  }


//  checkForRecordingExtension(){
//    if($('#extajloadedd').length > 0){
//      $window.alert('Extension Found');
//    }else if(document.getElementById('extajloadedd') !== null){
//      $window.alert('Extension Found');
//    }else{
//     $window.alert('Extension Not Found');
//    }
//  }
}
