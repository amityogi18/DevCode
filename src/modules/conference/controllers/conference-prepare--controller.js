let _this;
export class ConferencePrepareController {
	/** @ngInject  */
  constructor($state, $rootScope, $stateParams){
    _this = this;
    _this.$state = $state;
    _this.$rootScope = $rootScope;
    _this.$stateParams = $stateParams;
    _this.participantName = _this.$stateParams.participantName;
    _this.participantType = _this.$stateParams.participantType;
    _this.confId = _this.$stateParams.confId;
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
    console.log('Conference Prepare Controller Loaded');
    
  }
  
  joinMeeting1() {
   
    if(_this.participantType == "host") {
      console.log('joining the meeting:  name: ' +  _this.participantName + ' type is: ' + _this.participantType + ' confid is : ' + _this.confId);
      _this.$state.go('conference.host-webrtc', {participantName : _this.participantName, confId : _this.confId});  
    }
    else if(_this.participantType == "participant") {
       console.log('joining the meeting:  name: ' +  _this.participantName + ' type is: ' + _this.participantType + ' confid is : ' + _this.confId);
      _this.$state.go('conference.participant-webrtc', {participantName : _this.participantName, confId : _this.confId});  
    }
  }

}
