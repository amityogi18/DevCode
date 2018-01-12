let _this,
    urlRegex = /https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/;

export class positionAutomationController {
	/** @ngInject  */
    constructor(AdminPaymentPlanService, NgTableParams, GrowlerService, AuthService, interviewSettingService, $element, $timeout, UtilsService, $sce, CustomQuestionService, dataTableService) {
        _this = this;
        _this.AuthService = AuthService;
        _this.AdminPaymentPlanService = AdminPaymentPlanService;
        _this.GrowlerService = GrowlerService; 
        _this.interviewSettingService = interviewSettingService;
        _this.$element = $element;
        _this.$timeout = $timeout;
        _this.UtilsService = UtilsService;
        _this.$sce = $sce;
        _this.CustomQuestionService = CustomQuestionService;
        _this.certificateList =[];        
        _this.searchCertificate = null; 
        _this.showSaveButton = false;
        _this.showOndemandSaveButton = false;
        _this.showLiveSaveButton = false;
        _this.autocompleteDemoRequireMatch = true;
        _this.selectedCertificateItem = null;
        _this.dataTableService = dataTableService;
        _this.dataTableService.initTable([], {});
         var minDate = new Date();
        _this.minDate = minDate.toISOString();
        _this.saveField=false;
        _this.responseLimit = {};
        _this.certificateData =[];
        _this.retryPerQuestion = {};
        _this.welcomeVideoList =[];
        _this.exitVideoList =[];
        _this.selectedCertificate = [];
        _this.welcomeVideo = {};        
        _this.isResumeParse = 1;        
        _this.primarySkill = 1;
        _this.experience = 1;
        _this.location = 1;        
        _this.searchTerm;
        _this.certification = 1;
        _this.exitVideo = {};
        _this.shareLink = 0;
        _this.welcomeVieoFileId ='';
        _this.exitVideoFileId = '';
        _this.questionLimit = '';
        _this.responseLimitList = [
            {
              id: "1",
              value: '1 Mins'
            },{
              id: "2",
              value: '2 Mins'
            },{
              id: "3",
              value: '3 Mins'
            },{
              id: "4",
              value: '4 Mins'
            },{
              id: "5",
              value: '5 Mins'
            },{
              id: "6",
              value: '6 Mins'
            },{
              id: "7",
              value: '7 Mins'
            },{
              id: "8",
              value: '8 Mins'
            },{
              id: "9",
              value: '9 Mins'
            },{
              id: "10",
              value: '10 Mins'
              }
            ];
        _this.retryPerQuestionList = [
            {
              id: "1",
              value: '1 Retry'
            },{
              id: "2",
              value: '2 Retry'
            },{
              id: "3",
              value: '3 Retry'
            },{
              id: "4",
              value: '4 Retry'
            },{
              id: "5",
              value: '5 Retry'
              }
            ]; 
        $element.find('input').on('keydown', function(ev) {
            ev.stopPropagation();
        }); 
        _this.getResumeParsing();  
        _this.getOndemandInterview();
        _this.getWelcomeVideo();
        _this.getExitVideo();
        _this.getLiveInterview();
        
        _this.customQuestions = function () {
        _this.customQuestionTableParams = new NgTableParams({
            page: 1,
            count: 5
          },
          {
            counts: [5, 10, 20],
            getData: function (params) {
              let filter = params.filter(),
                sorting = params.sorting(),
                count = params.count(),
                page = params.page(),
                filterFields = [],
                sortFields = [],
                queryString = '',
                queryURL = '?';
              angular.forEach(sorting, (value, key) => {
                console.log(key + '---' + value);
                sortFields.push(`${key}&order=${value}`);
              });
              angular.forEach(filter, (value, key) => {
                console.log(key + '---' + value);
                filterFields.push(`${key}=${value}`);
              });
              if (sortFields.length) {
                queryString += `orderBy=${sortFields.join('&')}&`;
              }
              if (filterFields.length) {
                queryString += filterFields.join('&');
              }
              queryURL += `${queryString}&limit=${count}&page=${page}&isDefault=true`;
              let onSuccess = (response) => {                
                  _this.customQuestionList = response.data.data;
                  _this.customQuestionCount = response.data.total;

                  params.total(_this.customQuestionCount);
                  if(!_this.dataTableService.totalColumn.length) {
                    _this.dataTableService.initTable(_this.cols, _this.customQuestionTableParams);
                  }
                  return (_this.customQuestionList);

                },
                onError = (error) => {
                  console.log(error);
                };
              _this.CustomQuestionService.getcustomQuestionList(queryURL);
              return _this.CustomQuestionService.activePromise.then(onSuccess, onError);
            }
          });
      };
      
      _this.userTableParams = new NgTableParams({
            page: 1,
            count: 5,
            filter: _this.userTableFilter
        }, {
            counts: [5, 10, 20],
            getData: function(params) {
                let filter = params.filter(),
                    sorting = params.sorting(),
                    count = params.count(),
                    page = params.page(),
                    filterFields = [],
                    sortFields = [],
                    queryString = '',
                    queryURL = '?';
                angular.forEach(sorting, (value, key) => {
                    console.log(key + '---' + value);
                    sortFields.push(`${key}&order=${value}`);
                });
                angular.forEach(filter, (value, key) => {
                    console.log(key + '---' + value);
                    filterFields.push(`${key}=${value}`);
                });
                if (sortFields.length) {
                    queryString += `orderBy=${sortFields.join('&')}&`;
                }
                if (filterFields.length) {
                    queryString += filterFields.join('&');
                }
                let companyid = _this.AuthService.user.companyId;
                queryURL += `${queryString}&limit=${count}&page=${page}&companyId=${companyid}&isDefault=true&role=EVALUATOR`;
                let onSuccess = (response) => {

                        _this.userList = response.data.data;
                        _this.userListCount = response.data.total;
                       
                            params.total(_this.userListCount);
                            if(!_this.dataTableService.totalColumn.length) {
                               _this.dataTableService.initTable(_this.cols, _this.userTableParams);  
                            }
                            return (_this.userList);
                        
                    },
                onError = (error) => {
                    console.log(error);
                };

                _this.interviewSettingService.getUserList(queryURL);
               return  _this.interviewSettingService.activePromise.then(onSuccess, onError);
            }
        });
        
        _this.userInterviewTableParams = new NgTableParams({
            page: 1,
            count: 5,
            filter: _this.userTableFilter
            }, {
                counts: [5, 10, 20],
                getData: function(params) {
                    let filter = params.filter(),
                        sorting = params.sorting(),
                        count = params.count(),
                        page = params.page(),
                        filterFields = [],
                        sortFields = [],
                        queryString = '',
                        queryURL = '?';
                    angular.forEach(sorting, (value, key) => {
                        console.log(key + '---' + value);
                        sortFields.push(`${key}&order=${value}`);
                    });
                    angular.forEach(filter, (value, key) => {
                        console.log(key + '---' + value);
                        filterFields.push(`${key}=${value}`);
                    });
                    if (sortFields.length) {
                        queryString += `orderBy=${sortFields.join('&')}&`;
                    }
                    if (filterFields.length) {
                        queryString += filterFields.join('&');
                    }
                    let companyid = _this.AuthService.user.companyId;
                    queryURL += `${queryString}&limit=${count}&page=${page}&companyId=${companyid}&isDefault=true&role=INTERVIEWER`;
                    let onSuccess = (response) => {

                            _this.userInterviewerList = response.data.data;
                            _this.userListCount = response.data.total;

                                params.total(_this.userListCount);
                                if(!_this.dataTableService.totalColumn.length) {
                                   _this.dataTableService.initTable(_this.cols, _this.userInterviewTableParams);  
                                }
                                return (_this.userInterviewerList);

                        },
                    onError = (error) => {
                        console.log(error);
                    };

                    _this.interviewSettingService.getUserList(queryURL);
                   return  _this.interviewSettingService.activePromise.then(onSuccess, onError);
                }
          });
        
        _this.customQuestions();
    }
    
    toggleSharebleLink(value){ 
        _this.shareLinkvalue = value ;   
    }
    
    clearSearchTerm() {
        _this.searchTerm = '';
    };     
    closeModal(){
        //$('#id').children('iframe').attr('src', '');
        _this.UtilsService.stopVideoPlayer();
    }
    getAllCertificate(query){
        var data = '';
        let onSuccess = (response) => {
            return _this.certificateList = response.data || [];
        },
        onError = (error) =>{
            console.log(error);
        };
        
        if (angular.isDefined(query)
                && query !== ''
                && query !== null) {
                data = '?search=' + query;
            }
        
               _this.interviewSettingService.getAllCertificateList(data);
        return _this.interviewSettingService.activePromise.then(onSuccess, onError);
    }

    
    checkedAllResumeParse(value,entity){
        if(entity === 'SecondarySkill'){
            _this.secondarySkill = value;
            
        }else if(entity === 'TertiarySkill'){            
             _this.tertiarySkill = value;
             
        }else if(entity === 'EmploymentType'){
             _this.employmentType = value;
             
        }else if(entity === 'Education'){
             _this.education = value;
             
        }else if(entity === 'IsResumeParse'){
             _this.isResumeParse = value;
             if(value === 0){
                _this.secondarySkill =
                _this.employmentType = _this.tertiarySkill = _this.education = 0;
                _this.certificateData = [];
            }
        }else if(entity === 'Certification'){
            
             _this.parseCertification = value;
             
        }
        
    }
    
    getWelcomeVideo(){
       let onSuccess = (response) => {
            _this.welcomeVideoList =[];
            let welcomeVideoList = response.data || [];
            for(var i=0; i<welcomeVideoList.length; i++){
                let videoList = {}; 
                videoList.videoPath = welcomeVideoList[i].videoPath;
                videoList.fileId = welcomeVideoList[i].fileId;
                videoList.name = 'Welcome Video '+(i+1);
                _this.welcomeVideoList.push(videoList);
            }
            if(welcomeVideoList.length > 0 && _this.welcomeVideo.fileId === ''){
                let index = (welcomeVideoList.length - 1);
                _this.welcomeVideo.fileId = welcomeVideoList[index].fileId;
                _this.getWelcomeVideos(_this.welcomeVideo.fileId);
            }   
        },
        onError = (error) =>{
            console.log(error);
        };
      _this.interviewSettingService.getWelcomeVideoList();
      _this.interviewSettingService.activePromise.then(onSuccess, onError);
  }
  
  getWelcomeVideos(fileId) {
    let onSuccess = (response) => {
        if (response && response.data && response.data.file) {
          _this.welcomeVideo.videoPath = response.data.file || "";
          _this.videoUpdated(1,_this.welcomeVideo);
        }
        else {
          _this.welcomeVideo.videoPath = "";
        }

      },
      onError = (error) => {
        console.log(error);
      };
    _this.interviewSettingService.getWelcomeVideo(fileId);
    _this.interviewSettingService.activePromise.then(onSuccess, onError);
  }
  
  getExitVideo(){
       let onSuccess = (response) => {           
            _this.exitVideoList =[];
            let exitVideoList = response.data || [];
          for(var i=0; i<exitVideoList.length; i++){
               let videoList = {}; 
                videoList.videoPath = exitVideoList[i].videoPath;
                videoList.fileId = exitVideoList[i].fileId;
                videoList.name = 'Exit Video '+(i+1);
               _this.exitVideoList.push(videoList);
          }
          if(exitVideoList.length > 0 && _this.exitVideo.fileId === ''){
                let index = (exitVideoList.length - 1);
                _this.exitVideo.fileId = exitVideoList[index].fileId;
                _this.getExitVideos(_this.exitVideo.fileId);
            }     
        },
        onError = (error) =>{
            console.log(error);
        };
      _this.interviewSettingService.getExitVideoList();
      _this.interviewSettingService.activePromise.then(onSuccess, onError);
  }
  
  getExitVideos(fileId) {
    let onSuccess = (response) => {
        if (response && response.data && response.data.file) {
          _this.exitVideo.videoPath = response.data.file || "";
          _this.videoUpdated(2,_this.exitVideo);
        } else {
          _this.exitVideo.videoPath = "";
        }
      },
      onError = (error) => {
        console.log(error);
      };
    _this.interviewSettingService.getExitVideo(fileId);
    _this.interviewSettingService.activePromise.then(onSuccess, onError);
  }
  
   trustSrc(src) {
    return _this.$sce.trustAsResourceUrl(src);
  }
 
  videoUpdated(val,url){
      _this.UtilsService.stopVideoPlayer();
      if(url !== null && url !== "" && url.videoPath !== null){
        let path =  url.videoPath;
        if(path.indexOf('youtube') >= 0){
            if(val === 1){
                _this.isYoutubeWelcomeVideo = true;
            }else{
                _this.isYoutubeExitVideo = true;
            }
        }else{
            if(val === 1){
                _this.isYoutubeWelcomeVideo = false;
                _this.UtilsService.initVideoPlayer('welcomeVideo', path);
            }else{
                _this.isYoutubeExitVideo = false;
                 _this.UtilsService.initVideoPlayer('exitVideo', path);
            }
        }
      }
  };
 
    getResumeParsing(){
        let onSuccess = (response) => {
            let data = response.data;
                _this.secondarySkill = data.secondarySkill;
                _this.tertiarySkill = data.tertiarySkill;
                _this.employmentType = data.employmentType;
                _this.education = data.education;
                _this.selectedCertificate = data.externalCertificates;
                _this.candidateResumeRatingRatio = data.candidateResumeRatingRatio;
                if(_this.secondarySkill === '' && _this.tertiarySkill === '' &&
                   _this.employmentType === '' && _this.education === '' && _this.selectedCertificate.length === 0){
                    _this.showSaveButton = true;
                }else{
                    _this.showSaveButton = false;
                }
          },
          onError = (error) =>{
              console.log();
          };
        
        _this.interviewSettingService.getResumeParsingData();
        _this.interviewSettingService.activePromise.then(onSuccess, onError);
    }
    
    saveUpdateResumeParsingData(value){    
        let onSuccess = (response) => {
                if(value === 'save'){                
                    _this.GrowlerService.growl({
                      type: 'success',
                      message: 'Resume parsing default setting has been saved successfully',
                      delay: 2000
                    });
                }else{
                   _this.GrowlerService.growl({
                      type: 'success',
                      message: 'Resume parsing default setting has been updated successfully',
                      delay: 2000
                    }); 
                }
            },
            onError = (error) =>{
                _this.GrowlerService.growl({
                  type: 'warning',
                  message: 'Please fill all the required fields',
                  delay: 2000
                });
            };
          
          if(_this.selectedCertificate !== []){
            for(var i=0; i< _this.selectedCertificate.length;i++){
                _this.certificateData.push(_this.selectedCertificate[i].id);
            }
          }
           let payload = {
                    "candidateResumeRatingRatio":_this.candidateResumeRatingRatio,
                    "isResumeParse": _this.isResumeParse,
                    "primarySkill": _this.primarySkill,
                    "secondarySkill" : _this.secondarySkill,
                    "tertiarySkill" : _this.tertiarySkill,
                    "employmentType" : _this.employmentType,
                    "experience" : _this.experience,
                    "education" : _this.education,
                    "location" : _this.location,
                    "externalCertificates" : _this.certificateData
            };
            
            _this.interviewSettingService.saveResumeParsing(payload);
            _this.interviewSettingService.activePromise.then(onSuccess, onError);
    }
    
    analyzeUrl(companyWebsite){
        _this.errormessageurl = "";
        if(!angular.isDefined(companyWebsite) || companyWebsite === "" || companyWebsite === null){
          _this.errormessageurl = "Please Enter Company Url";
          _this.urlCriteria = false;
        }
        else if(angular.isDefined(companyWebsite) && !urlRegex.test(companyWebsite)){
          _this.errormessageurl = "Please Enter Valid Company Url";
        }
        else {
          _this.errormessageurl = "";
          _this.urlCriteria = true;
        }
    }
    
    getOndemandInterview(){
        let onSuccess = (response) => {
            let data = response.data;
                _this.shareLink = data.ondemandEnableShareLink;
                _this.welcomeVideo.fileId = data.ondemandWelcomeVideo;
                _this.getWelcomeVideos(_this.welcomeVideo.fileId);
                _this.exitVideo.fileId = data.ondemandExitVideo;
                _this.getExitVideos(_this.exitVideo.fileId);
                _this.responseLimit.id = data.ondemandResponseLimit;
                _this.retryPerQuestion.id = data.ondemandNoOfRetry;
                _this.redirectUrl = data.ondemandRedirectUrl;
                _this.questionLimit = data.ondemandQuestionLimit;
                _this.expDay = data.ondemandNoOfExpiryDay;
                
                if(_this.shareLink === 0 && _this.responseLimit.id === '' && _this.retryPerQuestion.id === '' 
                    && _this.retryPerQuestion.id === '' && _this.redirectUrl === '' && _this.questionLimit === '' && _this.expDay === ''){
               
                        _this.showOndemandSaveButton = true;
                    
                }else{
                        _this.showOndemandSaveButton = false;
                }
           
          },
          onError = (error) =>{
              console.log();
          };
        
        _this.interviewSettingService.getOndemandData();
        _this.interviewSettingService.activePromise.then(onSuccess, onError);
    }
  
    saveUpdateOndemandInterview(value){
        let onSuccess = (response) => {   
                if(value === 'save'){
                    _this.GrowlerService.growl({
                        type: 'success',
                        message: 'ondemand interview default setting has been saved successfully',
                        delay: 2000
                    });
                }else{
                    _this.GrowlerService.growl({
                        type: 'success',
                        message: 'ondemand interview default setting has been updated successfully',
                        delay: 2000
                    });
                }
          },
          onError = (error) =>{
              _this.GrowlerService.growl({
                type: 'warning',
                message: 'Please fill all the required fields',
                delay: 2000
              });
          };
           
           let payload = {
                    "ondemandEnableShareLink": _this.shareLink,
                    "ondemandWelcomeVideoId": _this.welcomeVideo.fileId,
                    "ondemandExitVideoId" : _this.exitVideo.fileId,
                    "ondemandResponseLimit" : _this.responseLimit.id,
                    "ondemandNoOfRetry" : _this.retryPerQuestion.id,
                    "ondemandRedirectUrl" : _this.redirectUrl,
                    "ondemandQuestionLimit" : _this.questionLimit,
                    "ondemandNoOfExpiryDay" : _this.expDay
            };
            
                if((_this.welcomeVideo.fileId !== '' && _this.welcomeVideo.fileId !== undefined) &&
                    (_this.exitVideo.fileId !== '' && _this.exitVideo.fileId !== undefined) && 
                    (_this.responseLimit.id !== '' && _this.responseLimit.id !== undefined)&&
                    (_this.retryPerQuestion.id !=='' && _this.retryPerQuestion.id !== undefined)&&
                    (_this.redirectUrl !== '' && _this.redirectUrl !== undefined)&&
                    (_this.questionLimit !== '' && _this.questionLimit !== undefined)&& 
                    (_this.expDay !== '' && _this.expDay !== undefined)){
                             
                    _this.interviewSettingService.saveOndemandData(payload);
                    _this.interviewSettingService.activePromise.then(onSuccess, onError);
                    
                }else {
                    _this.GrowlerService.growl({
                        type: 'warning',
                        message: 'Please fill all the required fields',
                        delay: 2000
                    });
               }
    }
    
    getLiveInterview(){    
        let onSuccess = (response) => {
            let data = response.data;
                _this.startInterviewDay = data.liveNoOfStartDay;
                _this.endInterviewDay = data.liveNoOfEndDay;
                _this.interviewDuration = data.liveInterviewDuration;
                _this.intervalTime = data.liveIntervalTime;
                _this.perDaySlot = data.livePerDaySlot;
                let startTime = moment(this.minDate).format('YYYY-MM-DD') + ' ' + data.liveStartTime;
                let endTime =  moment(this.minDate).format('YYYY-MM-DD') + ' ' + data.liveEndTime;
                _this.startTime = new Date(startTime);
                _this.endTime =  new Date(endTime);
                
                if(data.liveStartTime === '' && data.liveEndTime === '' &&
                   _this.startInterviewDay === '' && _this.endInterviewDay === '' && 
                   _this.interviewDuration === '' && _this.intervalTime === '' && 
                   _this.perDaySlot === ''){
               
                        _this.showLiveSaveButton = true;
                    
                }else{
                        _this.showLiveSaveButton = false;
                }
          },
          onError = (error) =>{
              console.log();
          };
  
        _this.interviewSettingService.getLiveData();
        _this.interviewSettingService.activePromise.then(onSuccess, onError);
    }
    
    saveUpdateLiveInterview(value){
        let onSuccess = (response) => {              
            if(value === 'save'){                
                _this.GrowlerService.growl({
                  type: 'success',
                  message: 'live interview default setting has been saved successfully',
                  delay: 2000
                });
            }else{
                _this.GrowlerService.growl({
                  type: 'success',
                  message: 'live interview default setting has been updated successfully',
                  delay: 2000
                });
            }
          },
          onError = (error) =>{
              _this.GrowlerService.growl({
                type: 'warning',
                message: 'Please fill all the required fields',
                delay: 2000
              });
          };         
           
           let payload = {
                    "liveNoOfStartDay": _this.startInterviewDay,
                    "liveNoOfEndDay": _this.endInterviewDay,
                    "liveInterviewDuration" : _this.interviewDuration,
                    "liveIntervalTime" : _this.intervalTime,
                    "livePerDaySlot" : _this.perDaySlot,
                    "liveStartTime" : moment(_this.startTime).format('HH:mm:ss'),
                    "liveEndTime" : moment(_this.endTime).format('HH:mm:ss')
            };
            
           if((_this.startInterviewDay !== '' && _this.startInterviewDay !== undefined) && 
                (_this.endInterviewDay !== '' && _this.endInterviewDay !== undefined) && 
                (_this.interviewDuration !== '' && _this.interviewDuration !== undefined)&&
                (_this.intervalTime !=='' && _this.intervalTime !== undefined)&&
                (_this.perDaySlot !== '' && _this.perDaySlot !== undefined)){ 
            
                    _this.interviewSettingService.saveAutomationLive(payload);
                    _this.interviewSettingService.activePromise.then(onSuccess, onError);
           }
           else {
               _this.GrowlerService.growl({
                type: 'warning',
                message: 'Please fill all the required fields',
                delay: 2000
              });
           }

    }
    
}