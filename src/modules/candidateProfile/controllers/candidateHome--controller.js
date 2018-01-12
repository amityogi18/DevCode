const allowedSecs = 120;
let _this,
youTubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
export class CandidateHomeController {
	/** @ngInject  */
  constructor(mediaRecorderService, $document, $sce, $uibModal, $state, candidateProfilePublicService, $timeout,GrowlerService,LoaderService, UtilsService) {
    _this = this;
    _this.$timeout = $timeout;
    _this.$document = $document;
    _this.localStream="";
    _this.$sce = $sce;
    _this.$uibModal = $uibModal;
    _this.mediaRecorderService = mediaRecorderService;
    _this.candidateProfilePublicService = candidateProfilePublicService;
    _this.GrowlerService = GrowlerService;
    _this.LoaderService = LoaderService;
    _this.UtilsService = UtilsService;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (_this.mediaRecorderService.getBrowser() == "Chrome") {
      _this.constraints = { "audio": true, "video": true };
    } else if (_this.mediaRecorderService.getBrowser() == "Firefox") {
      _this.constraints = { "audio": true, "video": true };
    }
    _this.chunks = [];
    _this.recordedBlob = {};
    _this.mediaRecorder = '';
    _this.options = '';
    _this.recordingOn = false;
    _this.paused = false;
    _this.videoUrl = '';
    _this.countdownStarted = false;
    _this.youtubeLink = '';
    _this.shareProfileUrl = '';
    _this.hideLink = false;
    _this.profileStatus = '';
    _this.videoFile = '';
    _this.isActive = false;
    _this.init();
    _this.$state = $state;
    _this.twoMinIntro = { views : 0, emailSharing : 0, bonusPointEarned:0, lastUpdated : '', fileId :'', backgroundMusic:'', backgroundMusicFileId:''};
    _this.updateTwoMinIntro = {candidateId : 0, videoPath : ''}
    _this.getCandidateTwoMinIntroData();
    _this.sharableEmailId = [];
    _this.isVideoAvailable= true;
    _this.videoFileId='';
    _this.getCandidatePoints();
  }

  getCandidateTwoMinIntroData(){
        let onSuccess = (response) => {
            console.log(response.data)
            if(response && response.data){
                _this.twoMinIntro = response.data;
                _this.twoMinIntro.views = response.data.views || 0;
                _this.twoMinIntro.emailSharing = response.data.emailSharing || 0;
                _this.twoMinIntro.bonusPointEarned = response.data.bonusPointEarned || 0;
                _this.twoMinIntro.backgroundMusic = response.data.backgroundMusic ||'';
                _this.twoMinIntro.backgroundMusicFileId = response.data.backgroundMusicFileId ||0;
                if(response.data.lastUpdated !== '' && response.data.lastUpdated !== null ){
                  //_this.twoMinIntro.lastUpdated=_this.UtilsService.getLocalTimeFromGMT(response.data.lastUpdated, 'MDY');
                  _this.twoMinIntro.lastUpdated =moment.utc(response.data.lastUpdated, 'MM-DD-YYYY HH:mm:ss').local().format('MM-DD-YYYY HH:mm');
                }
                else{
                  _this.twoMinIntro.lastUpdated = 'None' ;
                }
                 _this.videoFileId = response.data.fileId;
                _this.profileStatus = response.data.profileStatus;
                _this.shareProfileUrl =  response.data.shareProfileUrl;
                _this.hideLink =  response.data.profileStatus == 'off' ? true : false;
                if(response.data.videoPath){
                    let path = response.data.videoPath;
                    _this.isVideoAvailable = true;
                    if(path.indexOf('youtube') >= 0){
                       path = path.replace("watch?v=", "embed/");
                       console.log(path);
                       _this.videoUrl = path;
                    }
                    // else if(path.indexOf('video.webm') == -1){
                    //    path = path+"?autoplay=false";
                    //    _this.videoUrl = path;
                    // }
                    else{
                        _this.videoElement = document.getElementById('video-cdiframe').contentWindow.document;                  
                        let video = document.createElement('video');
                        video.setAttribute('id', 'tempVideoObject');
                        video.setAttribute('style','video::-webkit-media-controls-fullscreen-button {display: none;};width:100%;height:100%;overflow: hidden;');
                        video.preload = 'metadata';
                        video.src = path;
                        video.controls = true;
                        video.autoplay = 0;
                        _this.videoElement.open();
                        _this.videoElement.appendChild(video);
                        _this.videoElement.close();  
                    }
                }
                else{
                  _this.isVideoAvailable = false;
                }
          } 
        },
        onError = (error) =>{
            console.log(error);
        };
        _this.candidateProfilePublicService.getCandidateTwoMinIntro();
        _this.candidateProfilePublicService.activePromise.then(onSuccess, onError);
       
    }
  
  updateCandidateTwoMinIntroData(data, videoFileId, isVideo){
      _this.LoaderService.show();
    let onSuccess = (response) => {
        _this.youtubeValid= false;       
         _this.GrowlerService.growl({
          type: 'success',
          message: 'Video Uploaded successfully',
          delay: 2000
        });
          _this.LoaderService.hide();
         _this.$timeout(function(){
           _this.getCandidateTwoMinIntroData();
       },1000);
      
    },
    onError = (error) => {
        console.log(error);
        _this.LoaderService.hide();
      }
      _this.candidateProfilePublicService.updateCandidateTwoMinIntro(data, videoFileId, isVideo).then(onSuccess,onError);
     // _this.candidateProfilePublicService.activePromise.then(onSuccess, onError);
      
  }
  
  toggle(shareType){
    if(shareType === 'private-toggle'){
         _this.profileStatus = 'private';
         
  }
  }
  shareProfile(shareType){
    let onSuccess = (response) => {
              if(response.data){
                  _this.GrowlerService.growl({
               type: 'success',
               message: response.data.successMessage,
               delay: 1000
            });
              }
             
            //   window.alert(response.data.successMessage);
            },
            onError = (error) =>{
                console.log(error);
            };
     if(shareType === 'private-toggle'){
         _this.profileStatus = 'private';
         return false;
     }else{
        _this.profileStatus=shareType;
        _this.shareUrl = {};
        _this.hideLink = false;

        if(_this.shareProfileUrl){
          if(shareType === 'public'){
          _this.shareUrl = {            
                shareType : shareType,
                statusId: '1'
              }
               _this.candidateProfilePublicService.shareProfile(shareType, _this.shareUrl);  
          _this.candidateProfilePublicService.activePromise.then(onSuccess, onError); 
          }
          else if(shareType === "off"){
            _this.hideLink = true;
            _this.shareUrl = {           
                shareType : shareType,
                statusId: '1'
              }
               _this.candidateProfilePublicService.shareProfile(shareType, _this.shareUrl);  
          _this.candidateProfilePublicService.activePromise.then(onSuccess, onError); 
          }
          else{
            _this.profileStatus='private';
            if(_this.sharableEmailId.length){ 
                let sharableEmailId = [];
                if(_this.sharableEmailId.length > 0){
                    sharableEmailId = _this.sharableEmailId.split(',');
                }
               if(_this.twoMinIntro && _this.twoMinIntro.emailIds && _this.twoMinIntro.emailIds.length > 0){
                   for (var i=0; i < _this.twoMinIntro.emailIds.length; i++) {
                        sharableEmailId.push( _this.twoMinIntro.emailIds[i] );
                   } 
               }
               
                _this.shareUrl = {         
                    shareType:shareType,
                    emailIds : sharableEmailId,
                    statusId : '1'
                } 
          _this.candidateProfilePublicService.shareProfile(shareType, _this.shareUrl);  
          _this.candidateProfilePublicService.activePromise.then(onSuccess, onError); 
            }else{
              _this.GrowlerService.growl({
               type: 'danger',
               message: "Please enter email id.",
               delay: 1000
            });
               //window.alert("Please enter email id.");
               return false;
            }    
          }
        }
       else{
         console.log('No link to share.');
       }
     } 
    
  }  
  

 addBackgroundMusic() {
    var modalInstance = _this.$uibModal.open({
      animation: true,
      templateUrl: 'candidateProfile/partials/add-bg-music-modal.jade',
      controller: 'addBackgroundMusicController',
      controllerAs: '$ctrl',
      size: 'md'
    });

    modalInstance.result.then(function (backgroundMusic) {
      _this.audioElement.src = backgroundMusic;
    }, function () {
    });
  }

  syncVideoAndBgMusic(videoElement) {
    videoElement.onvolumechange = function (e) {
      _this.audioElement.volume = videoElement.volume;
    }

    videoElement.onplay = function (e) {
      _this.audioElement.play();
    }

    videoElement.onpause = function (e) {
      _this.audioElement.pause();
    }

    videoElement.ontimeupdate = function (e) {
      _this.audioElement.currentTime = videoElement.currentTime;
    }

    videoElement.onseeking = function (e) {
      _this.audioElement.currentTime = videoElement.currentTime;
    }

    videoElement.onplaying = function (e) {
      _this.audioElement.currentTime = videoElement.currentTime;
    }

    videoElement.onabort = function (e) {
      //_this.audioElement.pause();
    }

    videoElement.onerror = function (e) {
      //_this.audioElement.pause();
    }

    videoElement.onratechange = function (e) {
      // ToDo: to be done
    }

    videoElement.onseeked = function (e) {
      _this.audioElement.currentTime = videoElement.currentTime;
    }

    videoElement.stalled = function (e) {
      //_this.audioElement.pause();
    }

    videoElement.onsuspend = function (e) {
      //_this.audioElement.pause();
    }

    videoElement.onwaiting = function (e) {
     // _this.audioElement.pause();
    }
}

  preview() {
    debugger;
    let videoElement;
    if(_this.recordingOn){
      videoElement = _this.videoElement;
    }
    else{
      _this.recordedVideo = _this.$document.find('.video-iframe').contents().find('video')[0];
      videoElement = _this.recordedVideo;
    }

    _this.syncVideoAndBgMusic(videoElement);
    if(angular.isDefined(videoElement)){
      videoElement.play();
    }
    
  }

 onPauseClick() {
    if (angular.isDefined(_this.mediaRecorder)
      && angular.isDefined(_this.mediaRecorder.state)
      && _this.mediaRecorder.state !== 'inactive') {
      _this.paused = true;
      _this.mediaRecorder.pause();
    }
  }

  onResumeClick() {
    _this.paused = false;
    _this.mediaRecorder.resume();
  }

  onStopClick() {
    debugger;
    console.log('stop outer loop');
    if(angular.isDefined(_this.mediaRecorder) && _this.mediaRecorder
            && angular.isDefined(_this.mediaRecorder.state) 
            && _this.mediaRecorder.state !== 'inactive'){
        console.log('stop clicked');
        _this.mediaRecorder.stop();
        console.log("On Stop Click------------->"+_this.localStream);
        _this.localStream.getTracks().forEach(function (track) {
          track.stop();
        });
        _this.videoElement.controls = true;
        clearInterval(_this.timer);
        //console.log("Finding stream ------------->"+ window.stream);
    }    
  }

  onRecordClick() {
    debugger;
    _this.countdownStarted = true;
    _this.recordingOn = false;
    _this.$timeout(() => {
      _this.countdownStarted = false;
      _this.recordingOn = true;
      navigator.getUserMedia(_this.constraints, _this.startRecording.bind(this), _this.errorCallback.bind(this));
    }, 3000);
    
  }
  
 errorCallback() {
    console.error('could not fetch stream');
  }

  uploadYoutubeLink() {
    
    _this.isVideoAvailable = true;
    if (_this.mediaRecorder.state && _this.mediaRecorder.state === 'running') {
      _this.mediaRecorder.stop();
    }
    _this.recordingOn = false;
    _this.videoFile = '';
    _this.videoUrl =  _this.youtubeLink;
    console.log(_this.youtubeLink);
    _this.upload();
  }
 
startRecording(stream) {
  
  _this.localStream = stream;
  console.log("Finding stream--------------------------->"+_this.localStream)
    var timer = 0;
    _this.videoFile = "";
    _this.youtubeLink = "";
    _this.isVideoAvailable = true;
    _this.timer = setInterval(() => {
      if (!_this.paused) {
        timer++;
      }
      if (timer === allowedSecs) {
        _this.onStopClick();
      }
    }, 1000);
    // if (typeof MediaRecorder.isTypeSupported == 'function') {
    //   if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
    //     _this.options = { mimeType: 'video/webm;codecs=vp9' };
    //   } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
    //     _this.options = { mimeType: 'video/webm;codecs=vp8' };
    //   }
    //   _this.mediaRecorder = new MediaRecorder(stream, _this.options);
    // } else {
    //   _this.mediaRecorder = new MediaRecorder(stream);
    // }
    // _this.mediaRecorder.start(10);
    // let url = window.URL || window.webkitURL;
    // _this.videoElement = document.getElementById('candidateProfileVideoElement');
    // _this.videoElement.src = url ? url.createObjectURL(stream) : stream;
    // _this.videoElement.controls = true;
    // _this.videoElement.play();

    var mediarecorderoptions =  _this.mediaRecorderService.initializeStartMediaRecorder(stream, 'candidateProfileVideoElement');
    _this.mediaRecorder = mediarecorderoptions.mediaRecorder;
    _this.options = mediarecorderoptions.options;
    _this.videoElement = mediarecorderoptions.element;

    _this.mediaRecorder.ondataavailable = e => {
      _this.chunks.push(e.data);
    };

    _this.mediaRecorder.onstop = () => {
      let blob = new Blob(_this.chunks, { type: "video/webm" });
      _this.chunks = [];
      _this.recordedBlob = blob;
      let videoURL = window.URL.createObjectURL(blob);
      _this.videoElement.src = videoURL;
    }

  }

  upload() {
      
    _this.onStopClick();
    _this.isVideoAvailable = true;
    if (_this.videoFile) {
      _this.recordingOn = false;
      let fileReader = new FileReader();
      let type = _this.videoFile.type;
      fileReader.readAsArrayBuffer(_this.videoFile);
      fileReader.onload = (event) => {
        let blob = new Blob([event.target.result], { type: video });
        let url = (window.URL || window.webkitURL).createObjectURL(blob);
        let video = document.createElement('video');
        video.setAttribute('id', 'tempVideoObject');
        video.preload = 'metadata';
        video.src = url;
        video.addEventListener('loadedmetadata', () => {
          console.log(video.duration);
          (window.URL || window.webkitURL).revokeObjectURL(blob);
        });
      };
       _this.$timeout(function(){
          _this.updateCandidateTwoMinIntroData(_this.videoFile,_this.videoFileId, true);
       },3000);
     }
     else{
          if(_this.youtubeLink && _this.youtubeLink.length>0){
           // _this.validateYoutube(_this.youtubeLink);

           if(window.mobile){
            debugger;
            // function getParameterByName(name, url) {
              // if (!url) url = window.location.href;
              _this.url = _this.videoUrl;
              var name = "v".replace(/[\[\]]/g, "\\$&");
              var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                  results = regex.exec(_this.url);
              if (!results) return null;
              if (!results[2]) return '';
              _this.videoID = results[2].replace(/\+/g, " ")
              // return decodeURIComponent(results[2].replace(/\+/g, " "));
          // }
          // var v = getParameterByName('foo','http//youtube....');
            console.log("videoID",_this.videoID);
            _this.updateCandidateTwoMinIntroData('http://www.youtube.com/embed/'+_this.videoID, _this.videoFileId, false);

           }
           else{
            _this.updateCandidateTwoMinIntroData(_this.videoUrl, _this.videoFileId, false);
           }
            

          }
          else{  
              _this.$timeout(function(){
                if(_this.recordedBlob){
                  _this.updateCandidateTwoMinIntroData(_this.recordedBlob,_this.videoFileId, true);
                 // clearInterval(_this.timer);
                }
              },3000);                
          };       
       }
    
    let uploadedVideoFile = angular.element(document.querySelector('#file-upload')).val(null);
    let youtube =  angular.element(document.querySelector('#youtube')).val(null);
  }

  matchYoutubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    var matches = url.match(p);
    if(matches){
        return matches[1];
    }
    return false;
  }

  validateYoutube(url){
    var url = $('#txt').val();
    var id = matchYoutubeUrl(url);
    if(id!=false){
        alert(id);
    }else{
        a
  }
}

analyzeYoutubeUrl(youtubeurl){
    _this.isYouTubeUrlvalid = "";
   if(angular.isDefined(youtubeurl) && !youTubeRegex.test(youtubeurl)){
      _this.isYouTubeUrlvalid = "Enter Valid YouTube Url";
      _this.youtubeValid = false
    }
    else if(!angular.isDefined(youtubeurl) || youtubeurl === "" || youtubeurl === null){
      _this.isYouTubeUrlvalid = "This field is required";
      _this.youtubeValid = false
    }else {
      _this.isYouTubeUrlvalid = "";
      _this.youtubeValid = true
    }
}
   copyLink(){
        if( document.selection ) {
            document.selection.empty();
        }
        if ( window.getSelection ) {
            window.getSelection().removeAllRanges();
        }
        var  myelement = document.getElementById('sharedLink'),
        range = document.createRange();
        range.selectNode(myelement);
        console.dir(range);
        window.getSelection().addRange(range);
        try {
            document.execCommand('copy');
        } catch(e) {
            console.log('e');
        };
  }

  trustSrc(src) {
    return _this.$sce.trustAsResourceUrl(src);
  }  

  init() {
    _this.audioElement = document.getElementById('background-music');
  }

  removePrivateIds(id){
    console.log(id);
    if (id > -1) {
        if(_this.twoMinIntro && _this.twoMinIntro.emailIds && _this.twoMinIntro.emailIds.length > 0){
             _this.twoMinIntro.emailIds.splice(id, 1);
        }  
    }
  }

  getCandidatePoints(){
    let onSuccess = (response) => {
       _this.candidatePoints = response.data;       
      },
      onError = (error) => {
            console.log(error);
     };
     _this.candidateProfilePublicService.getCandidatePoints();
     _this.candidateProfilePublicService.activePromise.then(onSuccess, onError);
  }

}