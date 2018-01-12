let _this,
    meetingId;

export class conferenceMeetingController {
	/** @ngInject  */
  constructor(conferenceMeetingService, $sce, UtilsService, $timeout, $rootScope){
    _this = this;
    _this.$sce = $sce;
    _this.conferenceMeetingService =  conferenceMeetingService;
    _this.UtilsService = UtilsService;
  	_this.getAllMeeting();
    _this.limitTo = 5;
    _this.search = {};
    _this.$timeout = $timeout;
    _this.meetingInfo = {};
    _this.isMeetnow = false;
    _this.startDate = null;
    _this.endDate = null;
    _this.currentDate = new Date();
    //_this.activemenu = 'Meetings';
    
    _this.$timeout(function () {
            $rootScope.setActiveLi(9);
        },1000);
        
    _this.dateOptions = {
	    formatYear: 'yy',
	    maxDate: new Date(2020, 5, 22),	    
      startingDay: 1
     };
    _this.fromDatePopup = {
	    opened: false
	  };
    _this.toDatePopup = {
       opened: false
    }
    _this.dateformat = 'MM-dd-yyyy';
    _this.altInputFormats = ['M!/d!/yyyy'];
  }
  
    openFromDatePopup(){
       _this.fromDatePopup.opened = true;
    }
    openToDatePopup(){
      _this.toDatePopup.opened = true;
    }

  getAllMeeting() {
  	var onSuccess = (response) => {
			_this.allmeeting = response.data;
      _this.allmeetingbkp = _this.allmeeting;
      //_this.allmeeting.meetingScheduledAt = _this.allmeeting.meetingScheduledAt.format('MM-DD-YYYY HH:mm');
      for(var i=0; i <_this.allmeeting.length; i++) {
          var localTime = moment.utc(_this.allmeeting[i].meetingScheduledTimeStamp, 'YYYY-MM-DD HH:mm:ss').local().format('MM-DD-YYYY HH:mm');
          //var localTime = _this.upcomingmeeting[i].meetingScheduledOn + " " + _this.upcomingmeeting[i].meetingScheduledAt + " UTC";
              //var meetingDateTime = new Date(localTime);

          var datetimeS = localTime.split(" ");

          _this.allmeeting[i].meetingScheduledOn = datetimeS[0];
          _this.allmeeting[i].meetingScheduledAt = datetimeS[1];

        //}
        
      }
		},
		onError = (error) => {
			console.log(error);
		};
  	_this.conferenceMeetingService.fetchAllMeetings();
	  _this.conferenceMeetingService.activePromise.then(onSuccess, onError);
  }

  showMore(){
    _this.limitTo = _this.limitTo + 5; 
    _this.getAllMeeting();
  }

  showLess(){
     _this.limitTo =  5; 
     _this.getAllMeeting();
  }

  meetingDetail(allmeeting) {
    _this.meetingInfo  = allmeeting;
    _this.UtilsService.stopVideoPlayer();
    _this.UtilsService.initVideoPlayer('meetingVideo', _this.meetingInfo.videoFilePath);

  }

  trustSrc(src) {
    return _this.$sce.trustAsResourceUrl(src);
  }

  isActive(id) {
    return _this.meetingInfo.id === id; 
  }

  filterByDate() {
    console.log("From Date", _this.startDate);
    console.log("To Date", _this.endDate);
    if (_this.startDate || _this.endDate) {
        _this.allmeeting = _this.allmeetingbkp.filter((meeting, index) => {
           let createdDate = moment(meeting.meetingScheduledOn,"MM-DD-YYYY")._d.getTime()
            if (_this.startDate && !_this.endDate) {
                return createdDate>=_this.startDate.getTime();
            } else if (!_this.startDate && _this.endDate) {
                return createdDate<=_this.endDate.getTime();
            } else if (_this.startDate && _this.endDate) {
                    return (createdDate>=_this.startDate.getTime()) && (createdDate<=_this.endDate.getTime());
            }
        })
    }
  }
 }

