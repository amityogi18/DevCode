let _activePromise,
    _errorTranslationKey,
    _slotList,
    _schedulesList;

export class scheduleService {
	/** @ngInject  */
  constructor($http,Upload,$state,APP_CONSTANTS,$q, UtilsService, AuthService) {
    this.$http = $http;
    this.Upload = Upload;
    this.$state = $state;
    this.$q = $q;
    this.APP_CONSTANTS = APP_CONSTANTS; 
    this.UtilsService = UtilsService;
    this.AuthService =AuthService;
  }

  get activePromise() {
    return _activePromise;
  }

  get errorTranslationKey() {
    return _errorTranslationKey;
  }

  set errorTranslationKey(value) {
    _errorTranslationKey = value;
  }

  get schedulesList() {
    return _schedulesList;
  }

  get scheduleSlotList(){
    return _slotList;
  }


  // getSchedulesList(searchFilter){
  //   var onSuccess = (response) => {
  //       _schedulesList = response.data;
  //       _activePromise = null;
  //     },
  //     onError = (error) => {
  //       if (error.status === 409) {
  //         _errorTranslationKey = error.data.errorCode;
  //       }
  //       _activePromise = null;
  //     };

  //   _activePromise = this.$http.post('/test/schedules', searchFilter);
  //   _activePromise.then(onSuccess, onError);
  // }
  
  getSchedulesList(searchFilter){
    if(searchFilter){
      var bm = moment.duration(moment(searchFilter.endTime,"DD/MM/YYYY HH:mm:ss").diff(moment(searchFilter.startTime,"DD/MM/YYYY HH:mm:ss")));
      //var baseMinutes = (parseInt(bm.asHours())*60)+parseInt(bm.asMinutes());
      var baseMinutes = parseInt(bm.asMinutes());
      //handling 24 hr format issue 
      if(baseMinutes < 0){
            baseMinutes = Math.abs(1440 + baseMinutes);
        }
      var availableSlots = Math.abs(baseMinutes / (parseInt(searchFilter.duration) + parseInt(searchFilter.interval)));
      var scheduleSlots = [];
      //Make start time to  0 0 0 0
      var startDateAndTime = moment(searchFilter.fromDate).set({hour:moment(searchFilter.startTime).hour(),minute:moment(searchFilter.startTime).minute(),second:moment(searchFilter.startTime).second(),millisecond:moment(searchFilter.startTime).millisecond()});
      var diffInDates = moment(searchFilter.toDate).diff(moment(searchFilter.fromDate),'days');
      var startDT = startDateAndTime;
      var diffDate = parseInt(diffInDates)+1;
      if(parseInt(bm.asMinutes()) < 0){
          diffDate = parseInt(diffInDates);
      }
      for(var day = 0;day < diffDate;day++){
        console.log('------------------- day:'+day);
        for(var i=0;i < availableSlots;i++){
          var startDAndT = moment(startDT).toDate();
          var endDAndT = moment(startDT).add(parseInt(searchFilter.duration),'minutes').toDate();
          console.log('--------------SLOT'+i+'-----StartAt'+startDAndT+'-----End At'+endDAndT);
          scheduleSlots.push({
            title: "SLOT ("+new Date(moment(startDAndT).format('MM-DD-YYYY HH:mm'))+")",
            startsAt: startDAndT,
            endsAt: endDAndT,
            candidatesAllowed : 10,
            candidatesOpted : 5,
          });
          startDT = moment(startDT).add((parseInt(searchFilter.duration)+parseInt(searchFilter.interval)),'minutes').toDate();
        }
        startDT = moment(startDateAndTime).add(day+1,'days');
      }
      _schedulesList = scheduleSlots;
    }
  }

  getScheduleInterviewSlots(interviewid){
    let config  = this.UtilsService.getCofigObj(); 
    _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL+'/position/interview/schedule/interview/'+interviewid, config);
   
  }
  
  getScheduleInterview(interviewid){ 
     let config  = this.UtilsService.getCofigObj();
    _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/position/interview/schedule/interview/'+interviewid, config);
    
  }

  saveScheduleInterviewSlots(data){
    let id = this.AuthService.user.userId || 1;
    data.userId = id;
    var config  = this.UtilsService.postCofigObj();
    var deferred = this.$q.defer();
    var onSuccess = (response) => {
      deferred.resolve(response);
      _activePromise = null;
    },
    onError = (error) => {
      if (error.status === 409) {
        _errorTranslationKey = error.data.errorCode;
      }
      _activePromise = null;
      deferred.reject(error);
    };

    _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL+'/position/interview/schedule/interview',data,config);
    _activePromise.then(onSuccess, onError);
    return deferred.promise;
  }

  saveReScheduleInterviewSlots(data,liveID){
    let id = this.AuthService.user.userId || 1;
    data.userId = id;
    var config  = this.UtilsService.postCofigObj();
    var deferred = this.$q.defer();
    var onSuccess = (response) => {
      deferred.resolve(response);
      _activePromise = null;
    },
    onError = (error) => {
      if (error.status === 409) {
        _errorTranslationKey = error.data.errorCode;
      }
      _activePromise = null;
      deferred.reject(error);
    };

    _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL+'/position/interview/reschedule/interview/'+liveID,data,config);
    _activePromise.then(onSuccess, onError);
    return deferred.promise;
  }

//Canidate Reschedule a slot
  candidateBookRescheduleSlot(slotId,candidateId){
    var config  = this.UtilsService.postCofigObj();
    var deferred = this.$q.defer();
    var onSuccess = (response) => {
      deferred.resolve(response);
      _activePromise = null;
    },
    onError = (error) => {
      if (error.status === 409) {
        _errorTranslationKey = error.data.errorCode;
      }
      _activePromise = null;
      deferred.reject(error);
    };

    _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL+'/position/interview/schedule/slot/'+slotId+'/'+candidateId,config);
    _activePromise.then(onSuccess, onError);
    return deferred.promise;
  }

  saveCandidateBookedSlots(cid,slotid){
    var config  = this.UtilsService.postCofigObj();
    var deferred = this.$q.defer();
    var onSuccess = (response) => {
      deferred.resolve(response);
      _activePromise = null;
    },
    onError = (error) => {
      if (error.status === 409) {
        _errorTranslationKey = error.data.errorCode;
      }
      _activePromise = null;
      deferred.reject(error);
    };

    _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL+'/position/interview/schedule/slot/'+slotid+'/'+cid,config);
    _activePromise.then(onSuccess, onError);
  }
  
  getCandidateEmailId(emailScheduleCalender){
      let config  = this.UtilsService.getCofigObj(); 
     _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL+'/position/schedule/slot/candidate/email', emailScheduleCalender, config);
    
  }

  //Rescheduling a slot User Action
  reScheduleSlotByUser(data,slotId){
    var config  = this.UtilsService.postCofigObj();
    var deferred = this.$q.defer();
    var onSuccess = (response) => {
      deferred.resolve(response);
      _activePromise = null;
    },
    onError = (error) => {
      if (error.status === 409) {
        _errorTranslationKey = error.data.errorCode;
      }
      _activePromise = null;
      deferred.reject(error);
    };

    _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL+'/position/interview/reschedule/slot/'+slotId,data,config);
    _activePromise.then(onSuccess, onError);
    return deferred.promise;
  }

  //Cancel a  slot
  cancelSlot(slotId,candidateId){
    var config  = this.UtilsService.postCofigObj();
    var deferred = this.$q.defer();
    var onSuccess = (response) => {
      deferred.resolve(response);
      _activePromise = null;
    },
    onError = (error) => {
      if (error.status === 409) {
        _errorTranslationKey = error.data.errorCode;
      }
      _activePromise = null;
      deferred.reject(error);
    };

    _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL+'/position/interview/schedule/cancel/slot/'+slotId+'/'+candidateId,config);
    _activePromise.then(onSuccess, onError);
    return deferred.promise;
  }

  //Delete Live Interivew
  deleteLiveInterview(liveId){
    var config  = this.UtilsService.postCofigObj();
    var deferred = this.$q.defer();
    var onSuccess = (response) => {
      deferred.resolve(response);
      _activePromise = null;
    },
    onError = (error) => {
      if (error.status === 409) {
        _errorTranslationKey = error.data.errorCode;
      }
      _activePromise = null;
      deferred.reject(error);
    };

    _activePromise = this.$http.delete(this.APP_CONSTANTS.SERVER_URL+'/position/interview/schedule/interview/'+liveId,config);
    _activePromise.then(onSuccess, onError);
    return deferred.promise;
  }
}
