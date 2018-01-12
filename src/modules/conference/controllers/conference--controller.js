let _this;
export class ConferenceController {
	/** @ngInject  */
	constructor($state,$stateParams, $sce,LoaderService, $location, ConferenceService, ConferenceScheduleService, conferenceMeetingService,conferenceStartMeetService, GrowlerService, AuthService, $window, ContactService,$rootScope, $timeout ){
		_this =  this;
		_this.ConferenceService = ConferenceService;
		_this.ConferenceScheduleService = ConferenceScheduleService;
		_this.conferenceMeetingService = conferenceMeetingService;
		_this.conferenceStartMeetService = conferenceStartMeetService;
		_this.$state = $state;
		_this.GrowlerService = GrowlerService;
		_this.AuthService = AuthService;
		_this.isLoggedIn = _this.AuthService.isUserLoggedIn();
		_this.$location = $location;
		_this.LoaderService = LoaderService;
        _this.$window = $window;
        _this.isMeetingSceduled = false;
        _this.userFieldLabel = false;
        _this.userInviteFieldLabel = false;
    _this.$stateParams = $stateParams;
    _this.showIntroConferenceOverlay =_this.$stateParams.introConferenceParam;
		_this.user = _this.AuthService.user;
		_this.ContactService = ContactService;
    //Control display setting for meetnow and join by number
    _this.showConferenceMeetNowPopup = false;
    _this.showJoinByNumberPopup = false;
    _this.showTextBox=false;
    _this.count = 1;
    _this.validEmail = false;
    _this.validEmailSch = false;
    _this.invalidEmailError = false;
    _this.allContact = [];
    _this.noMeetingToShow = false;
    _this.isPastTimeMeeting =  false;
    console.log('count is :', _this.count);
    //_this.defaultImagePath = "http://54.209.30.211/storage/user/profilepicture/abc.jpg";
    _this.fetchUpcomingMeetings();
    _this.getAllContact();
    var  minDate = new Date();
    _this.minDate = minDate.toISOString();
    _this.participantlist = [];
    _this.upcomingmeeting = [];
    _this.Istoggle = true;
    _this.uplimit = 2;
    var meetingTime = new Date();
    _this.pastTimePickError = false;
    _this.schmeetingdate = new Date();
    _this.currentDate = new Date();
    _this.processMeetnow = false;
    _this.processSchdule = false;
    _this.isMeetingSceduled = false;
    _this.isMeetInvited = false;
      _this.schmeetingdurationh = "";
      _this.schmeetingdurationm = "";
    _this.userId = _this.AuthService.user.userId;
    //_this.activemenu = 'Conference';
    _this.$timeout = $timeout;
    
     _this.$timeout(function () {
        $rootScope.setActiveLi(8);
       angular.element('.carousel').triggerHandler('onload');
         $('.carousel').carousel();
    },1000);
    /*_this.hstep = 1;
    _this.mstep = 15;
    var timerange = new Date();
     timerange.setHours( 14 );
    timerange.setMinutes( 0 );
    _this.schmeetingtime = timerange;
    		
     }

     datechanged() {
     	if(moment(_this.schmeetingdate).format('MM-DD-YYYY') == moment().format('MM-DD-YYYY')) {
    	 var timelimit = new Date();
    	 _this.mintime = timelimit;
        }*/
        for(var i=0;i<_this.participantlist.length;i++) {
			var addedemail = _this.participantlist[i];
			var posAt = addedemail.indexOf("@");
    		var posDot = addedemail.lastIndexOf(".");
    		if (posAt<1 || posDot<posAt+2 || posDot+2>=x.length) {
    			console.log('invalid email')
    		}
		}

	_this.dateOptions = {
	    formatYear: 'yy',
	    maxDate: new Date(2020, 5, 22),
	    minDate: new Date(),
        startingDay: 1
     };

     _this.popup = {
	    opened: false
	  };
	_this.dateformat = 'MM-dd-yyyy';
	_this.altInputFormats = ['M!/d!/yyyy'];
    console.log('user info', _this.AuthService.user);
    }

    opendatepicker() {
    	_this.popup.opened = true;
    }
	openConferenceModal(type){
		switch(type){
			case "meetnow":
			this.showConferenceMeetNowPopup = true;
			this.showJoinByNumberPopup = false;
			break;
			case "joinbynumber":
			this.showConferenceMeetNowPopup = false;
			this.showJoinByNumberPopup = true;
			break;
		}
	}
    openTextBox(type){
    this.showTextBox=! _this.showTextBox;
    }
	closeConferenceModal(){
		this.showConferenceMeetNowPopup = false;
		this.showJoinByNumberPopup = false;
	}
	checkMail() {
		_this.validEmail = false;
        _this.errMsgEmail=''
		console.log('changes',_this.participantlist.length);
		for(let i=0;i<_this.participantlist.length;i++) {
			var atpositionc = _this.participantlist[i].email.indexOf("@");
			var dotpositionc = _this.participantlist[i].email.lastIndexOf(".");
			    if (atpositionc<1 || dotpositionc<atpositionc+2 || dotpositionc+2>=_this.participantlist[i].email.length) {
			        console.log('invalid email:',_this.participantlist[i].email);
			        _this.validEmail = true;
			        //var test = document.querySelector('.ui-select-match').lastChild.previousElementSibling.firstChild.style = "border-bottom:2px dotted red";
			   		 setTimeout(function() {

			   		 var spanvalue = document.getElementById('meetInvite').querySelector('.ui-select-match').lastChild.previousElementSibling.firstChild.lastChild.innerHTML;
			   		 var emailvalue = _this.participantlist[i].email;
				   		 if(spanvalue === emailvalue) {	
				   		  	document.getElementById('meetInvite').querySelector('.ui-select-match').lastChild.previousElementSibling.firstChild.style = "border-bottom:2px dotted red";	  
	                     }
			   		 }, 100);
			   		 
			   		 

			    }
		}
	}
	meetnowInvite() {
        if(_this.validEmail == true){
            _this.errMsgEmail='Please Enter Valid Email Id'
        }
		if(this.checkRequiredFields()) {
            _this.LoaderService.show();
            _this.processMeetnow = true;
            _this.isMeetInvited = true;
            var meetnowInvitation = {};
            var participantEmails = [];
            meetnowInvitation.name = _this.meetingname;
            meetnowInvitation.meetingType = 'MEETNOW';
            for (var i = 0; i < _this.participantlist.length; i++) {
                participantEmails.push(_this.participantlist[i].email);
            }
            console.log('participantlist', participantEmails);
            meetnowInvitation.participants = participantEmails;
            meetnowInvitation.meetingScheduledOn = '';
            meetnowInvitation.meetingScheduledAt = '';
            meetnowInvitation.meetingScheduledTimeStamp = '';
            meetnowInvitation.meetingDurationHr = '';
            meetnowInvitation.meetingScheduledAt = '';
            meetnowInvitation.meetingDurationMin = '';
            meetnowInvitation.agenda = '';

            var onSuccess = (response) => {
                    _this.processMeetnow = false;
                    _this.isMeetInvited = false;
                    console.log('success response is:', response);
                    var ConfId = response.data.meetingJoiningID;
                    var userName = _this.AuthService.user.fullName;
					/*var currentUrlmeetnow = _this.$location.absUrl();
					 var routeurlmeetnow = currentUrlmeetnow + "/" + ConfId + "/host";
					 console.log('route url is:', routeurlmeetnow);
					 _this.$window.childWindow = _this.popupwindow(routeurlmeetnow);*/
                    _this.$state.go('conference.prepare', {
                        participantName: userName,
                        confId: ConfId,
                        participantType: 'host'
                    });

                },
                onError = (error) => {
                    _this.processMeetnow = false;
                    _this.isMeetInvited = false;
                    console.log(error);
                };
            _this.ConferenceService.meetnowInvite(meetnowInvitation);
            _this.ConferenceService.activePromise.then(onSuccess, onError)['finally'](_this.LoaderService.hide);


        }
	}
	checkMailSch() {
		_this.validEmailSch = false;
        _this.errMsg='';
		console.log('changes',_this.schinviteparticipant.length);
		for(let i=0;i<_this.schinviteparticipant.length;i++) {
			var atpositionc = _this.schinviteparticipant[i].email.indexOf("@");
			var dotpositionc = _this.schinviteparticipant[i].email.lastIndexOf(".");
			    if (atpositionc<1 || dotpositionc<atpositionc+2 || dotpositionc+2>=_this.schinviteparticipant[i].email.length) {
			        console.log('invalid email:',_this.schinviteparticipant[i].email);
			        _this.validEmailSch = true;
			        //var test = document.querySelector('.ui-select-match').lastChild.previousElementSibling.firstChild.style = "border-bottom:2px dotted red";
			   		 setTimeout(function() {

			   		 var spanvalue = document.getElementById('schInvite').querySelector('.ui-select-match').lastChild.previousElementSibling.firstChild.lastChild.innerHTML;
			   		 var emailvalue = _this.schinviteparticipant[i].email;
				   		 if(spanvalue === emailvalue) {	
				   		  	document.getElementById('schInvite').querySelector('.ui-select-match').lastChild.previousElementSibling.firstChild.style = "border-bottom:2px dotted red";	  
	                     }
			   		 }, 100);
			   		 
			   		 

			    }
		}
	}
	schedulemeeting() {
        
		if(_this.schmeetingtime == '' || !angular.isDefined(_this.schmeetingtime)){
            _this.errMsgTime='Please Select Time'
		}
		if(_this.validEmailSch == true){
			_this.errMsg='Please Enter Valid Email Id'
		}
        if (_this.checkMandatoryFields()) {
            _this.LoaderService.show();
            _this.isMeetingSceduled = true;
            _this.processSchdule = true;
            var participantEmailsch = [];
            for (var i = 0; i < _this.schinviteparticipant.length; i++) {
                participantEmailsch.push(_this.schinviteparticipant[i].email);
            }
            let schemeetingdate = moment(_this.schmeetingdate).format('MM-DD-YYYY');
            let schemeetingtime = moment(_this.schmeetingtime).format('HH:mm');
            let schemeetingdatatime = schemeetingdate + " " + schemeetingtime;
            let gmtDateTime = moment(schemeetingdatatime, 'MM-DD-YYYY HH:mm').utc().format('YYYY-MM-DD HH:mm');
            if (moment(schemeetingdatatime, 'MM-DD-YYYY H:mm') < moment()) {
                _this.isPastTimeMeeting = true;
            } else {
                _this.isPastTimeMeeting = false;
            }
            let scheduleMeetingInvite = {};
            scheduleMeetingInvite.name = _this.schmeetingname;
            scheduleMeetingInvite.meetingType = 'SCHEDULED';
            scheduleMeetingInvite.participants = participantEmailsch;
            scheduleMeetingInvite.meetingScheduledOn = schemeetingdate;
            scheduleMeetingInvite.meetingScheduledAt = schemeetingtime;
            scheduleMeetingInvite.meetingScheduledTimeStamp = gmtDateTime;
            scheduleMeetingInvite.meetingDurationHr = _this.schmeetingdurationh;
            scheduleMeetingInvite.meetingDurationMin = _this.schmeetingdurationm;
            scheduleMeetingInvite.agenda = _this.schmeetingagenda;

            var onSuccess = (response) => {
                    _this.processSchdule = false;
                    //_this.$state.go('conference.conference-meeting');
                    scheduleMeetingInvite = {};
                    _this.schmeetingname = "";
                    _this.schmeetingdate = "";
                    _this.schmeetingdurationh = "";
                    _this.schmeetingdurationm = "";
                    _this.isschrecording = "";
                    _this.isschaudioconnect = "";
                    _this.isschmeetingpsw = "";
                    _this.schinviteparticipant = "";
                    _this.schmeetingagenda = "";
                    _this.schmeetingtime = "";
                    _this.fetchUpcomingMeetings();
                    _this.GrowlerService.growl({
                        type: 'success',
                        message: 'meeting schedule successfully',
                        delay: 2000
                    });
                    _this.scheduleForm.$setPristine();
                    _this.isMeetingSceduled = false;
                },
                onError = (error) => {
                    _this.processSchdule = false;
                    console.log(error);
                    scheduleMeetingInvite = {};
                    _this.schmeetingname = "";
                    _this.schmeetingdate = "";
                    _this.schmeetingdurationh = "";
                    _this.schmeetingdurationm = "";
                    _this.isschrecording = "";
                    _this.isschaudioconnect = "";
                    _this.isschmeetingpsw = "";
                    _this.schinviteparticipant = "";
                    _this.schmeetingagenda = "";
                    _this.schmeetingtime = "";
                    _this.scheduleForm.$setPristine();
                    _this.isMeetingSceduled = true;
                };

            _this.ConferenceScheduleService.scheduleMeetingInvitation(scheduleMeetingInvite);
            _this.ConferenceScheduleService.activePromise.then(onSuccess, onError)['finally'](_this.LoaderService.hide);
            this.scheduleForm.$setPristine();
            this.scheduleForm.$setUntouched();

        }
    }
	fetchUpcomingMeetings() {
		var onSuccess = (response) => {
			if(response.data[0].successMessage == "conference_meeting_upcoming_empty") {
				_this.noMeetingToShow = true;
			}
			else {
				_this.noMeetingToShow = false;
			}
			console.log('got the meeting list');
			_this.upcomingmeeting = response.data;
			
			for(var i=0; i <_this.upcomingmeeting.length; i++) {
				_this.upcomingmeeting[i].meetingScheduledAt = moment(_this.upcomingmeeting[i].meetingScheduledAt).format('MM-DD-YYYY HH:mm');
				console.log('time stamp',_this.upcomingmeeting[i].meetingScheduledTimeStamp);
				var localTime = moment.utc(_this.upcomingmeeting[i].meetingScheduledTimeStamp, 'YYYY-MM-DD HH:mm:ss').local().format('MM-DD-YYYY HH:mm');
				console.log('local time:',localTime);
				var datetimeS = localTime.split(" ");
				_this.upcomingmeeting[i].meetingScheduledOn = datetimeS[0];
				_this.upcomingmeeting[i].meetingScheduledAt = datetimeS[1];
				console.log('date coming as: ',_this.upcomingmeeting[i].meetingScheduledOn);
				console.log('time coming as: ',_this.upcomingmeeting[i].meetingScheduledAt);

			}
			console.log(_this.upcomingmeeting);
		},
		onError = (error) => {
			console.log(error);

		};

		_this.conferenceMeetingService.fetchUpcomingMeetings();
		_this.conferenceMeetingService.activePromise.then(onSuccess, onError);
	}
	enterMeeting(confId) {
		var onSuccess = (response) => {
			console.log('success response is:', response);
			var stratdatetime = moment.utc(response.data.meetingScheduledTimeStamp, 'YYYY-MM-DD H:mm:ss').local().format('MMMM Do YYYY, hh:mm a')
			console.log('start time:',stratdatetime);
			if(moment(response.data.meetingScheduledTimeStamp).format('MM-DD-YYYY HH:mm') > moment.utc().format('MM-DD-YYYY HH:mm')) {
				_this.GrowlerService.growl({
                  type: 'danger',
                  message: 'Meeting not started yet, Please join at:  '+ stratdatetime,
                  delay: 2000
              });
			}
			else if(response.data.hostId == _this.AuthService.user.userId ) {
			  var ConfId1 = confId;
			  var userName1 = _this.AuthService.user.fullName;
			 /* var currentUrl = _this.$location.absUrl();
			  var routeurl = currentUrl + "/" + ConfId1 + "/host";
			  console.log('route url is:', routeurl);
			  _this.$window.childWindow = _this.popupwindow(routeurl);*/
			  _this.$state.go('conference.prepare', {participantName : userName1, confId : ConfId1, participantType: 'host'});
			} else {
			  var ConfId2 = confId;
			  var userName2 = _this.AuthService.user.fullName;
			  _this.$state.go('conference.prepare', {participantName : userName2, confId : ConfId2, participantType: 'participant'});
			}
			

		},
		onError = (error) => {
			console.log(error);
		};

		_this.conferenceStartMeetService.MeetingInfo(confId);
  	    _this.conferenceStartMeetService.activePromise.then(onSuccess, onError);
	}
        
    /*popupwindow(url, width, height, left, top) {
        if(!width){
          width = screen.width;
        }
        if(!height){
          height = (screen.height * 90)/100;
        }
        if(!left){
          left = 0;
        }
        if(!top){
          top = 0;
        }

        return _this.$window.open(url,'_blank','toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+width+', height='+height+', top='+top+', left='+left);
      }

        doLogout() {
            _this.AuthService.user = null;
            _this.storage.removeItem('user');
            _this.$window.sessionStorage.removeItem('user');
            _this.user = "";
            _this.isLoggedIn = false;
            _this.$state.go('app.login');
    }*/


    setUserField() {
        _this.userFieldLabel = !_this.userFieldLabel;
    }

    setInviteUserField() {
        _this.userInviteFieldLabel = !_this.userInviteFieldLabel;
    }

    getAllContact() {
    	var onSuccess = (response) => {
    		console.log(response);
			var emptyarray = [];
    		_this.allContact = response.data.data || emptyarray;
    	}, 
    	onError = (error) => {
    		console.log(error);
    	};
    	console.log('getting the list');
    	_this.ContactService.getAllContactList();
        _this.ContactService.activePromise.then(onSuccess, onError);
    }

    tagTransform(newTag){
    	var item = {
    		name:newTag,
    		email:newTag
    	}
    	return item;
    }
    showmoreUpcoming() {
    	_this.Istoggle = !_this.Istoggle;
    	if(_this.Istoggle) {
    		_this.uplimit = 2;
    	}
    	else {
    		_this.uplimit = 50;
    	}
    }

    checkMandatoryFields() {
        if(this.schmeetingname && this.schmeetingname !== ''
            && this.schmeetingdate && this.schmeetingdate !== ''
            && this.schmeetingtime && this.schmeetingtime !== ''
            && this.schmeetingdurationh && this.schmeetingdurationh !== ''
            && this.schmeetingdurationm && this.schmeetingdurationm !== ''
            && this.schinviteparticipant && this.schinviteparticipant.length !== 0
			&& this.validEmailSch == false

        ) {
            return true;
        }
        else{
            this.scheduleForm.$setSubmitted();
            return false;
        }
    }

    checkRequiredFields() {
        if(this.meetingname && this.meetingname !== ''
            && this.participantlist && this.participantlist.length !== 0
			&& this.validEmail == false

        ) {
            return true;
        }
        else{this.meetNowForm.$setSubmitted();
            return false;
        }
    }
    
    closeIntro(){
    _this.showIntroConferenceOverlay = false;
  }

  clearForm() {
      _this.meetingname = null;
      _this.participantlist = null;
      this.meetNowForm.$setPristine();
      this.meetNowForm.$setUntouched();  
  }
  clearSchduleForm() {
      _this.schmeetingname = null;
      _this.schmeetingdate = null;
      _this.schmeetingdurationh = null;
      _this.schmeetingdurationm = null;
      _this.schinviteparticipant = null;
      _this.schmeetingagenda = null;
      this.scheduleForm.$setPristine();
      this.scheduleForm.$setUntouched();
  }
}

