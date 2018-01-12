let _this;
export class ConferenceLoginController {
	/** @ngInject  */
  constructor($state, $interval, $stateParams, $rootScope, LoaderService, AuthService, conferenceStartMeetService){
    _this = this;
    _this.conferenceStartMeetService = conferenceStartMeetService;
    _this.$state = $state;
    _this.$stateParams = $stateParams;
    _this.LoaderService = LoaderService;
    _this.AuthService = AuthService;
    _this.$interval = $interval;
    _this.$rootScope = $rootScope;
    _this.confId = _this.$stateParams.ConfId;
    _this.isSignup = true;
    _this.meetingExpired = false;
    _this.meetingStart = false;
    _this.isExpired = false;
    _this.meetingScheduledDate = "";
    _this.IsMeetNow = true;
    _this.waitForMeetingInfo = true;
    _this.livetime = moment().format('MMMM Do YYYY, h:mm a');
    if(_this.$rootScope.isLoggedIn && _this.AuthService.user.userType === 1) {
       _this.isLogin = true;
    }
    else {
      _this.isLogin = false;
    }
   _this.getMeetingInfo();
    _this.meetingDetail=[];

  }
  
  // getMeetingInfo(){
  // 	var confId = _this.$stateParams.ConfId;
  // 	console.log('confid from cand --> ', confId);
  // 	var onSuccess = (response) => {
	// 		console.log('meeting detail:', response);
  //     _this.meetingDetail = response.data;
  //     _this.IsMeetNow =  _this.meetingDetail.meetingType==='MEETNOW' ? true : false;
  //     var closeInterval = _this.$interval(function() {
  //       console.log('interval start');
  //       var localTime = moment.utc(_this.meetingDetail.meetingScheduledTimeStamp, 'YYYY-MM-DD HH:mm:ss').local().format('YYYY-MM-DD HH:mm:ss');
  //       _this.meetingScheduledDate = moment(localTime).format('MMMM Do YYYY, h:mm a');
  //       var expireTime = moment(_this.meetingDetail.meetingScheduledTimeStamp, 'YYYY-MM-DD HH:mm:ss').add(2, 'hours').format('YYYY-MM-DD HH:mm:ss');

  //       if(expireTime < moment.utc().format('YYYY-MM-DD HH:mm:ss')) {
  //           _this.isExpired = true;
  //       }

  //       if(_this.meetingDetail.statusId == 3 || _this.isExpired) {
  //         _this.meetingExpired = true;
  //         _this.$interval.cancel(closeInterval);
  //         console.log('interval closed');
  //       }

  //       if(moment.utc().format('YYYY-MM-DD HH:mm:ss') > _this.meetingDetail.meetingScheduledTimeStamp) {
  //         _this.meetingStart = true;
  //         _this.$interval.cancel(closeInterval);
  //         console.log('interval closed');
  //       } else {
  //         _this.meetingStart = false;
          
  //       }
  //       if(_this.meetingDetail.meetingType === 'MEETNOW') {
  //         _this.$interval.cancel(closeInterval);
  //         console.log('interval closed');
  //       }
  //     }, 1000);  
	// 	},
	// 	onError = (response) => {
	// 		if(response.data.errorCode == 'CONFERENCE_MEETING_SCHEDULED_ID_NOT_FOUND_ERROR') {
  //       _this.$state.go('conference.meeting-error');
  //     }
	// 	};

  // 	_this.conferenceStartMeetService.MeetingInfo(confId);
  // 	_this.conferenceStartMeetService.activePromise.then(onSuccess, onError);

  // }

  getMeetingInfo(){
  	var confId = _this.$stateParams.ConfId;
  	var onSuccess = (response) => {
			console.log('meeting detail:', response);
      _this.meetingDetail = response.data;
      var localTime = moment.utc(_this.meetingDetail.meetingScheduledTimeStamp, 'YYYY-MM-DD HH:mm:ss').local().format('YYYY-MM-DD HH:mm:ss');
      _this.meetingScheduledDate = moment(localTime).format('MMMM Do YYYY, h:mm a');
      _this.IsMeetNow =  _this.meetingDetail.meetingType==='MEETNOW' ? true : false;
      _this.meetingExpired =  _this.meetingDetail.statusId != 1 ? true : false;
      if(_this.IsMeetNow) {
          _this.meetingStart = true;
          _this.waitForMeetingInfo = false;
      }
      if(!_this.IsMeetNow && !_this.meetingExpired) {
        var closeInterval = _this.$interval(function() {
          console.log('interval start');
          //
          // var expireTime = moment(_this.meetingDetail.meetingScheduledTimeStamp, 'YYYY-MM-DD HH:mm:ss').add(2, 'hours').format('YYYY-MM-DD HH:mm:ss');

          // if(expireTime < moment.utc().format('YYYY-MM-DD HH:mm:ss')) {
          //     _this.meetingExpired = true;
          //     _this.$interval.cancel(closeInterval);
          //     console.log('interval closed');
          // }

          if(moment.utc().format('YYYY-MM-DD HH:mm:ss') > _this.meetingDetail.meetingScheduledTimeStamp) {
            _this.meetingStart = true;
            _this.$interval.cancel(closeInterval);
            console.log('interval closed');
          } else {
            _this.meetingStart = false;
            
          }
          _this.waitForMeetingInfo = false;
        }, 1000);

        console.log('printer');
      }
        
		},
		onError = (response) => {
			if(response.data.errorCode == 'CONFERENCE_MEETING_SCHEDULED_ID_NOT_FOUND_ERROR') {
        _this.$state.go('conference.meeting-error');
      }
		};

  	_this.conferenceStartMeetService.MeetingInfo(confId);
  	_this.conferenceStartMeetService.activePromise.then(onSuccess, onError);

  }
  joinMeeting(participantName) {
  	console.log('par name',participantName);
    var participantType = 'participant';
  	_this.$state.go('conference.prepare', {participantName : participantName, confId : _this.confId, participantType: participantType});
  }
  login() {

        let onSuccess = (response) => {
          _this.AuthService.saveCurrentUser(response.data);
          console.log('login success');
            _this.joinAsLogin();

        };

        let onError = (response) => {
            if (response !== null) {
                console.log('error');
            }
        };
        _this.LoaderService.show();
        _this.AuthService.doLogin({
            username: _this.username,
            password: _this.password,
            userType: 1
            //,rememberMe: _this.isRemember
        });
        _this.AuthService.activePromise.then(onSuccess, onError)['finally'](_this.LoaderService.hide);
   

    /*console.log('par name',participantName);
    var participantName = 'pappu'*/
    
    //_this.joinMeeting(participantName);

    /*if(_this.meetingDetail.hostId == loggedInuserId) {
       var participantType = 'host';
      _this.$state.go('conference.prepare', {participantName : participantName, confId : _this.confId, participantType: participantType});
    }
    else {
      var participantType = 'participant';
      _this.$state.go('conference.prepare', {participantName : participantName, confId : _this.confId, participantType: participantType});
    }*/
    
  }
  joinAsLogin() {
    console.log('in join method');
    let userId = _this.AuthService.user.userId;
    let  userName = _this.AuthService.user.fullName;
    if(_this.meetingDetail.hostId == userId ) {
       var participantType = 'host';
      _this.$state.go('conference.prepare', {participantName : userName, confId : _this.confId, participantType: participantType});
    }
    else {
       var participantType = 'participant';
      _this.$state.go('conference.prepare', {participantName : userName, confId : _this.confId, participantType: participantType});
    }
  }

}

   