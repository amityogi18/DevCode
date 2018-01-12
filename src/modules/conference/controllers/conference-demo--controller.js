let _this;
export class ConferenceDemoController {
	/** @ngInject  */
  constructor($state, $stateParams, $rootScope, $window, DemoService, $storage){
    _this = this;
    _this.$state = $state;
    _this.$stateParams = $stateParams;
    _this.$rootScope = $rootScope;
    _this.DemoService = DemoService;
    _this.$storage = $storage;
    _this.$window = $window;
    _this.confId = _this.$stateParams.confId;
    _this.meetingRole = _this.$storage.getItem('quickMeetRole') || "";
    _this.displayName = _this.$storage.getItem('quickMeetName') || "";
    _this.$rootScope.$on("$stateChangeSuccess", function(event, to, toParams, from, fromParams){
          // $rootScope.previousState = from;
           if(from.name === 'conference.free-conference-host' || from.name ==='conference.free-conference-participant') {
             window.stream.getVideoTracks()[0].stop();
             window.stream.getAudioTracks()[0].stop();  
            _this.$window.location.replace("https://www.jottp.com");
           }
     });
    _this.validateMeeting();
 }
    // checkstatus(){
    //     if(_this.participantName) {
    //        _this.$state.go('conference.free-conference', {confId : _this.confId, meetingRole : 'host', displayName :_this.participantName });
    //     }
    //     else {
    //       var role = _this.meetingRole || 'participant';
    //         if(role==='host'){
    //           _this.$state.go('conference.free-conference-host', {confId : _this.confId, participantName :_this.displayName });
    //         }
    //         else 
    //         if(role==='participant'){
    //            let onSuccess = (response) => {
    //             console.log('meeting validate');
    //               _this.$state.go('conference.free-conference-participant', {confId : _this.confId});

    //           };

    //           let onError = (response) => {
    //               if(response.data.errorCode == 'INVALID_MEETING_ID') {
    //                  _this.$state.go('conference.meeting-error');
    //                }
    //           };
    //            _this.DemoService.validateConference(_this.confId);
    //            _this.DemoService.activePromise.then(onSuccess, onError);
              
    //         }
          
    //     }
    // }
    validateMeeting() {
        let onSuccess = (response) => {
          if(_this.meetingRole && _this.displayName) {
            _this.$state.go('conference.free-conference-host', {confId : _this.confId, participantName :_this.displayName, meetingRole :"host" });
          }
          else {
            _this.$state.go('conference.free-conference-host', {confId : _this.confId,  meetingRole :"participant" });
          }
        }, 
        onError = (response) => {
          if(response.data.errorCode == 'INVALID_MEETING_ID') {
               _this.$state.go('conference.meeting-error');
          }
        };

        _this.DemoService.validateConference(_this.confId);
        _this.DemoService.activePromise.then(onSuccess, onError);
    }
}
