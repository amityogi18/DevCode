var _this;

export class interviewSettingsAccordionController {
	/** @ngInject  */
  constructor($sce,$uibModal, videoModal, checkPeripheralStatusService, mediaRecorderService, interviewSettingService, $scope, $timeout, $rootScope, GrowlerService, LoaderService, UtilsService) {
    _this = this;
    _this.$sce = $sce;
    _this.interviewSettingService = interviewSettingService;
    _this.LoaderService = LoaderService;
    _this.sampleVideos = videoModal;
    _this.selectedVideo = _this.sampleVideos[0];
    _this.$scope = $scope;
    _this.UtilsService = UtilsService;
    _this.$timeout = $timeout;
    _this.checkPeripheralStatusService = checkPeripheralStatusService;
    _this.mediaRecorderService = mediaRecorderService;    
    _this.initializeParams();
    _this.openModal = false;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if(_this.mediaRecorderService.getBrowser() == "Chrome"){
      _this.constraints = {"audio": true, "video": {  "mandatory": {  "minWidth": 320,  "maxWidth": 320, "minHeight": 240,"maxHeight": 240 }, "optional": [] } };//Chrome
    }else if(_this.mediaRecorderService.getBrowser() == "Firefox"){
      _this.constraints = {audio: true,video: {  width: { min: 320, ideal: 320, max: 1280 },  height: { min: 240, ideal: 240, max: 720 }}}; //Firefox
    }
    _this.$modal = $uibModal;
    _this.GrowlerService = GrowlerService;
    _this.countdownStarted = false;
    _this.interviewSetting ={};
    _this.isRequiredField=false;
    _this.isEditMode = _this.mode;
    _this.interviewId = _this.interviewid;
    _this.positionId = _this.pid;        
    _this.welcomeVideoList =[];
    _this.exitVideoList =[];
    _this.getWelcomeVideo();
    _this.getExitVideo();
    _this.welcomeVideo = {};
    _this.exitVideo = {};
    _this.responseLimit = {};
    _this.retryPerQuestion = {};
    _this.localStream={};
    _this.$timeout(function () {
        $rootScope.setActiveLi(3);
          },1000);
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
        _this.$onInit = function(){
            _this.isEditMode = _this.mode;
            _this.interviewId = _this.interviewid;
            _this.positionId = _this.pid;            
            _this.responseLimit.id = "2";
            _this.retryPerQuestion.id = "3";
            _this.interviewSetting ={};
            _this.interviewSetting.redirectUrl = 'https://www.jottp.com';
            if(angular.isDefined(_this.pid) && _this.pid !== "" && _this.pid !== null){
                _this.getInterviewSettings();
            }
            
        };
        _this.$onChanges = function (changesObj) {
            console.log("updated object interviewSetting "+changesObj);
            _this.isEditMode = _this.mode;
            _this.interviewId = _this.interviewid;
            _this.positionId = _this.pid;  
            if(changesObj.isReset   
                    && (changesObj.isReset.previousValue === true || changesObj.isReset.previousValue === false)
                    && (changesObj.isReset.currentValue !== changesObj.isReset.previousValue)){
                _this.interviewSetting ={};
                _this.welcomeVideo = {};
                _this.exitVideo = {};
                _this.responseLimit = {};
                _this.retryPerQuestion = {};
                _this.responseLimit.id = "2";
                _this.retryPerQuestion.id = "3";
                _this.interviewSetting.redirectUrl = 'https://www.jottp.com';
            }else if(changesObj.isFetch   
                    && (changesObj.isFetch.previousValue === true || changesObj.isFetch.previousValue === false)
                    && (changesObj.isFetch.currentValue !== changesObj.isFetch.previousValue)){
                _this.getInterviewSettings();                                
            } 
            else if(changesObj.currentState  
                    && (changesObj.currentState.previousValue === true || changesObj.currentState.previousValue === false)
                    && (changesObj.currentState.currentValue !== changesObj.currentState.previousValue)){
                _this.saveInterviewSettings();
            }            
        };
  }

  initializeParams() {
    _this.videoUrl = '';
    _this.youtubeLink = '';
    _this.options = '';
    _this.mediaRecorder = '';
    _this.chunks = [];
    _this.recordingMode = false;
    _this.isRecordingOn = false;
    _this.isRecordingPaused = false;
    _this.alreadyCalled = false;
    _this.recordedBlob = {};
    _this.videoFile = '';
    _this.exitVideo = {};
    _this.welcomeVideo = {};
    _this.exitVideo.videoPath = "";
    _this.welcomeVideo.videoPath = "";
    if (_this.mediaRecorder.state && _this.mediaRecorder.state === 'running') {
      _this.mediaRecorder.stop();
    }
  }

  dismiss() {
    _this.openModal = false;
    _this.text = '';
  }

  closeModal() {
    _this.initializeParams();
    //_this.welcomeVideoList =[];
    //_this.exitVideoList =[];
    _this.getWelcomeVideo();
    _this.getExitVideo();
    _this.welcomeVideo = {};
    _this.exitVideo = {};
    $('#wlcm-video').modal('hide');
    $('#exit-video').modal('hide');
    _this.onStopClick();
     _this.initializeParams();
    //_this.isYoutubeWelcomeVideo = false;
    //_this.isYoutubeExitVideo = false;
  }

  openWelcomeRecordModal() {
    _this.initializeParams();
    $('#wlcm-video').modal('show');

  }

  openExitRecordModal(){
    _this.initializeParams();
    $('#exit-video').modal('show');
  }

  errorCallback(error){
    console.log('navigator.getUserMedia error: ', error);
  }

  trustSrc(src) {
    return _this.$sce.trustAsResourceUrl(src);
  }

  upload(type) {
    _this.isInternetConnected = _this.checkPeripheralStatusService.isInternetConnected();
    if(_this.isInternetConnected) {
          _this.onStopClick();
          _this.isVideoAvailable = true;
          if (_this.videoFile) {
            _this.recordingOn = false;
            let fileReader = new FileReader();
            let videotype = _this.videoFile.type;
            fileReader.readAsArrayBuffer(_this.videoFile);
            fileReader.onload = (event) => {
              let blob = new Blob([event.target.result], { type: videotype });
              let url = (window.URL || window.webkitURL).createObjectURL(blob);
              let video = document.createElement('video');
              video.setAttribute('id', 'tempVideoObject');
              video.preload = 'metadata';
              video.src = url;
              video.addEventListener('loadedmetadata', () => {
                (window.URL || window.webkitURL).revokeObjectURL(blob);
              });
            };
            _this.uploadVideos(_this.videoFile, true, type);
            _this.recordingMode = false;
           }
           else{
                if(_this.youtubeLink && _this.youtubeLink.length>0){
                    let path = _this.youtubeLink;
                    if(path.indexOf('youtube') >= 0){
                       path = path.replace("watch?v=", "embed/");
                       _this.videoUrl = path;
                    }
                  _this.uploadVideos(_this.videoUrl, false, type);
                }
                else{  
                    _this.$timeout(function(){
                        _this.uploadVideos(_this.recordedBlob, true, type);   
                    },500);                
                };       
             }
      
    }else
    {        
      _this.text = 'Please connect to internet to upload video.';
      _this.openModal = true;
      
    }
  }

  uploadYoutubeLink(type) {
    _this.isVideoAvailable = true;
    _this.videoFile = "";
    if (_this.mediaRecorder.state && _this.mediaRecorder.state === 'running') {
      _this.mediaRecorder.stop();
    }
    _this.recordingOn = false;
    
    _this.videoUrl =  _this.youtubeLink;
    _this.upload(type);
  }

  onRecordClick(selector) {
    _this.selector = selector;
    _this.videoUrl = '';
    _this.youtubeLink = '';
    _this.videoFile = '';
    _this.checkPeripheralStatusService.isAudioDetected(_this.audioStatusFn.bind(_this));
    _this.checkPeripheralStatusService.isVideoDetected(_this.videoStatusFn.bind(_this));
  }

  initiateRecording() {
    console.log(_this.audioPeripheralStatus, _this.videoPeripheralStatus);
    if(!_this.audioPeripheralStatus || !_this.videoPeripheralStatus) {
      _this.text = _this.mediaRecorderService.getPeripheralStatusText(_this.audioPeripheralStatus, _this.videoPeripheralStatus);
      _this.openModal = true;
      return;
    }
    _this.isRecordingOn = false;
    _this.recordingMode = true;
    _this.countdownStarted = true;
    _this.$scope.$apply();
    _this.$timeout(() =>{
      _this.isRecordingOn = true;
      _this.countdownStarted = false;
      navigator.getUserMedia(_this.constraints, _this.startRecording.bind(_this), _this.errorCallback);
    }, 3000);
  }

  audioStatusFn(status) {
    _this.audioPeripheralStatus = status;
    if(!_this.alreadyCalled) {
      _this.alreadyCalled = true;
    }else {
      _this.initiateRecording();
      _this.alreadyCalled = false;
    }
  }

  videoStatusFn(status) {
    _this.videoPeripheralStatus = status;
    if (!_this.alreadyCalled) {
      _this.alreadyCalled = true;
    } else {
      _this.initiateRecording();
      _this.alreadyCalled = false;
    }
  }

  onPauseClick() {
    if(angular.isDefined(_this.mediaRecorder)
      && angular.isDefined(_this.mediaRecorder.state)
      && _this.mediaRecorder.state !== 'inactive'){
      _this.paused = true;
      _this.mediaRecorder.pause();
    }
  }

  onResumeClick() {
    _this.paused = false;
    _this.mediaRecorder.resume();
  }

  onStopClick() {
    if(angular.isDefined(_this.mediaRecorder)
      && angular.isDefined(_this.mediaRecorder.state)
      && _this.mediaRecorder.state !== 'inactive'){

            _this.mediaRecorder.stop();
            _this.localStream.getTracks().forEach(function (track) {
                track.stop();
            });
            _this.videoElement.controls = true;
            clearInterval(_this.timer);

    }
  }



  startRecording(stream) {
    _this.localStream = stream;
    console.log('in start Recording');
    _this.videoFile = "";
    _this.youtubeLink = "";
    _this.isVideoAvailable = true;
    // if (typeof MediaRecorder.isTypeSupported == 'function'){
    //   if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
    //     _this.options = {mimeType: 'video/webm;codecs=vp9'};
    //   } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
    //     _this.options = {mimeType: 'video/webm;codecs=vp8'};
    //   }
    //   _this.mediaRecorder = new MediaRecorder(stream, _this.options);
    // }else{
    //   _this.mediaRecorder = new MediaRecorder(stream);
    // }
    // _this.mediaRecorder.start(10);
    // let url = window.URL || window.webkitURL;
    // _this.videoElement = document.getElementById(_this.selector);
    // _this.videoElement.src = url ? url.createObjectURL(stream) : stream;
    // _this.videoElement.controls = true;
    // _this.videoElement.play();

    var mediarecorderoptions =  _this.mediaRecorderService.initializeStartMediaRecorder(stream, _this.selector);
    _this.mediaRecorder = mediarecorderoptions.mediaRecorder;
    _this.options = mediarecorderoptions.options;
    _this.videoElement = mediarecorderoptions.element;

    _this.mediaRecorder.ondataavailable = e => {
      _this.chunks.push(e.data);
    };

    _this.mediaRecorder.onstop = () => {
      let blob = new Blob(_this.chunks, {type: "video/webm"});
      _this.chunks = [];
      _this.recordedBlob = blob;
      let videoURL = window.URL.createObjectURL(blob);
      _this.videoElement.src = videoURL;
    }
  };
  previewVideo() {
    _this.recordingOn = false;
    _this.videoUrl = _this.selectedVideo.url;
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
            if(welcomeVideoList.length > 0){
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
          if(exitVideoList.length > 0){
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
 
  saveInterviewSettings(){
      _this.isRequiredField=false;
      let onSuccess = (response) => {
        },
        onError = (error) =>{
            console.log(error);
        };
        _this.interviewSetting.interviewId = _this.interviewId;
        if(_this.welcomeVideo){
            _this.interviewSetting.welcomeVideoFileId = _this.welcomeVideo.fileId ;
        }else{
            _this.interviewSetting.welcomeVideoFileId = '';
        }
        
        if(_this.exitVideo){
            _this.interviewSetting.exitVideoFileId = _this.exitVideo.fileId ;
        }else{
            _this.interviewSetting.exitVideoFileId = '';
        }
        if(_this.responseLimit && _this.responseLimit.id){
            _this.interviewSetting.responseLimit = _this.responseLimit.id ;
        }
        if(_this.retryPerQuestion && _this.retryPerQuestion.id){
             _this.interviewSetting.retryPerQuestion = _this.retryPerQuestion.id ;
         }

        _this.interviewSettingService.saveInterviewSetting(_this.interviewSetting);
        _this.interviewSettingService.activePromise.then(onSuccess, onError);

  }
  
  
   getInterviewSettings(){
       if(angular.isDefined(_this.interviewid) && _this.interviewid !== ""){
            _this.isRequiredField=false;
            let onSuccess = (response) => {
                 _this.responseLimit = {};
                 _this.retryPerQuestion = {};
                  _this.interviewSetting = response.data || [];
                  _this.welcomeVideo.fileId = _this.interviewSetting.welcomeVideoFileId;
                  _this.exitVideo.fileId = _this.interviewSetting.exitVideoFileId;
                  _this.responseLimit.id = ""+_this.interviewSetting.responseLimit;
                  _this.retryPerQuestion.id = ""+_this.interviewSetting.retryPerQuestion;
                  _this.getWelcomeVideos(_this.interviewSetting.welcomeVideoFileId);
                  _this.getExitVideos(_this.interviewSetting.exitVideoFileId);
             },
             onError = (error) =>{
                 console.log(error);
             };
           _this.interviewSettingService.getInterviewSetting(_this.interviewid);
           _this.interviewSettingService.activePromise.then(onSuccess, onError);
       }       
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
  
  cancelInterviewSetting(){
      _this.interviewSetting = {};
  }

  uploadVideos(data, isVideo, type){
      _this.LoaderService.show();
      let onSuccess = (response) => {
          _this.LoaderService.hide();
          _this.GrowlerService.growl({
            type : 'success',
            message: 'Video Uploaded Successfully'
          });
      };
      let onError  = (error) => {
          console.log(error);
          _this.LoaderService.hide();
      };
    
      _this.interviewSettingService.uploadVideo(data, isVideo, type).then(onSuccess, onError);
  }
  
  interviewSettingUpdated(){
    _this.onUpdate({value: true});
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
}

