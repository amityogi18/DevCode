/**
 * Created by Administrator on 9/14/2016.
 */
let _this;
const allowedSecs = 120;
export class ExitVideoRecorderController {
	/** @ngInject  */
    constructor($scope, $sce, $timeout,mediaRecorderService, AdminCompanyInfoService,GrowlerService,interviewSettingService,LoaderService, UtilsService) {
        _this =  this;
        _this.mediaRecorderService = mediaRecorderService;
        _this.AdminCompanyInfoService = AdminCompanyInfoService;
        _this.GrowlerService = GrowlerService;
        _this.localStream="";
        this.$scope = $scope;
        this.$sce = $sce;
        this.$timeout = $timeout;
        _this.interviewSettingService = interviewSettingService;
        _this.LoaderService = LoaderService;
        _this.UtilsService = UtilsService;
        this.chunks = [];
        _this.videoUrl = '';
        _this.exitVideo = {};
        _this.exitVideo.videoPath = "";
        _this.recordedBlob = {};
        _this.showUploadBtn = false;
        _this.hideBtn = false;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        this.mediaRecorder = '';
        this.countdownStarted = false;
        this.options = '';
        this.localstream = '';
        _this.exitVideoList =[];
        _this.getExitVideoList();
        //browser ID
        this.getBrowser = ()=> {
            let nVer = navigator.appVersion;
            let nAgt = navigator.userAgent;
            let browserName = navigator.appName;
            let fullVersion = '' + parseFloat(navigator.appVersion);
            let majorVersion = parseInt(navigator.appVersion, 10);
            let nameOffset, verOffset, ix;

            // In Opera, the true version is after "Opera" or after "Version"
            if ((verOffset = nAgt.indexOf("Opera")) != -1) {
                browserName = "Opera";
                fullVersion = nAgt.substring(verOffset + 6);
                if ((verOffset = nAgt.indexOf("Version")) != -1)
                    fullVersion = nAgt.substring(verOffset + 8);
            }
            // In MSIE, the true version is after "MSIE" in userAgent
            else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
                browserName = "Microsoft Internet Explorer";
                fullVersion = nAgt.substring(verOffset + 5);
            }
            // In Chrome, the true version is after "Chrome"
            else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
                browserName = "Chrome";
                fullVersion = nAgt.substring(verOffset + 7);
            }
            // In Safari, the true version is after "Safari" or after "Version"
            else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
                browserName = "Safari";
                fullVersion = nAgt.substring(verOffset + 7);
                if ((verOffset = nAgt.indexOf("Version")) != -1)
                    fullVersion = nAgt.substring(verOffset + 8);
            }
            // In Firefox, the true version is after "Firefox"
            else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
                browserName = "Firefox";
                fullVersion = nAgt.substring(verOffset + 8);
            }
            // In most other browsers, "name/version" is at the end of userAgent
            else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
                (verOffset = nAgt.lastIndexOf('/'))) {
                browserName = nAgt.substring(nameOffset, verOffset);
                fullVersion = nAgt.substring(verOffset + 1);
                if (browserName.toLowerCase() == browserName.toUpperCase()) {
                    browserName = navigator.appName;
                }
            }
            // trim the fullVersion string at semicolon/space if present
            if ((ix = fullVersion.indexOf(";")) != -1)
                fullVersion = fullVersion.substring(0, ix);
            if ((ix = fullVersion.indexOf(" ")) != -1)
                fullVersion = fullVersion.substring(0, ix);

            majorVersion = parseInt('' + fullVersion, 10);
            if (isNaN(majorVersion)) {
                fullVersion = '' + parseFloat(navigator.appVersion);
                majorVersion = parseInt(navigator.appVersion, 10);
            }


            return browserName;
        };
        if (this.getBrowser() == "Chrome") {
            this.constraints = {
                "audio": true,
                "video": {
                    "mandatory": {
                        "minWidth": 320,
                        "maxWidth": 320,
                        "minHeight": 240,
                        "maxHeight": 240
                    },
                    "optional": []
                }
            }; //Chrome
        } else if (this.getBrowser() == "Firefox") {
            this.constraints = {
                audio: true,
                video: {
                    width: {
                        min: 320,
                        ideal: 320,
                        max: 1280
                    },
                    height: {
                        min: 240,
                        ideal: 240,
                        max: 720
                    }
                }
            }; //Firefox
        }
        this.randomId = Math.random().toString(36).substr(2, 10);
        this.recordingOn = false;
        console.log(this.$scope);
        _this.getExitVideos();
    
    }

    uploadBrowsedVideo() {
        console.log(this.mediaRecorder.state);
        if(this.mediaRecorder.state === 'running') {
            this.mediaRecorder.stop();
        }
        _this.videoFile = {};
        this.recordingOn = false;
    }

    trustSrc(src)  {
        return this.$sce.trustAsResourceUrl(src);
    }
    getRecordingMode() {
        return this.recordingOn;
    }

    uploadYoutubeLink() {
        _this.isVideoAvailable = true;
        if (_this.mediaRecorder.state && _this.mediaRecorder.state === 'running') {
            _this.mediaRecorder.stop();
        }
        _this.recordingOn = false;
        _this.videoFile = '';
        let path = _this.youTubeLink;
        if(path.indexOf('youtube') >= 0){
           path = path.replace("watch?v=", "embed/");
           _this.videoUrl = path;
           _this.upload();
        }else{
            _this.GrowlerService.growl({
                type: 'warning',
                message: 'Please Add Youtube Video Path To Upload',
                delay: 1000
            });
        }
    }

    upload(){ 
        _this.hideBtn = true;
        this.onStopClicked();
        this.isVideoAvailable = true;
        if (_this.videoFile) {
        _this.recordingOn = false;
        let fileReader = new FileReader();
        let type = _this.videoFile.type;
        fileReader.readAsArrayBuffer(_this.videoFile);
        fileReader.onload = (event) => {
            let blob = new Blob([event.target.result], { type: type });
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
        _this.saveExitVideos(this.videoFile, true);
        }
        else{
            if(_this.youTubeLink && _this.youTubeLink.length>0){
                let path = _this.youTubeLink;
                if(path.indexOf('youtube') >= 0){
                    path = path.replace("watch?v=", "embed/");
                    console.log(path);
                    _this.videoUrl = path;
                }
                _this.saveExitVideos(_this.videoUrl, false);
            }
            else{  
                _this.$timeout(function(){
                    _this.saveExitVideos(_this.recordedBlob, true);   
                },500);                
            };       
        }
    }


   saveExitVideos(data, isVideo){
       if(_this.youTubeLink){
        _this.showUploadBtn = true;
        _this.LoaderService.show();
        _this.AdminCompanyInfoService.saveExitVideos(data, isVideo).then(()=>{
            _this.getExitVideos();
            _this.hideBtn = false;
            _this.GrowlerService.growl({
                type: 'success',
                message: 'Exit video uploaded successfully',
                delay: 2000
            });
              _this.getExitVideoList();
              _this.youTubeLink = '';
              _this.showUploadBtn = false;
              _this.LoaderService.hide();

        },(error) => {
          _this.LoaderService.hide();
        });
        }else{
            _this.GrowlerService.growl({
                    type: 'warning',
                    message: 'Please Add The Link To Upload',
                    delay: 2000
                });
        }
  }

    onRecordClicked() {
        if (typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
            alert('MediaRecorder not supported on your browser, use Firefox 30 or Chrome 49 instead.');
        } else {
            this.countdownStarted = true;
            this.$timeout(() =>{
                this.countdownStarted = false;
                this.recordingOn = true;
                navigator.getUserMedia(this.constraints, this.startRecording.bind(this), this.errorCallback.bind(this));
            }, 3000);
        }
    }

    onStopClicked() {
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
    

    onPauseClicked() {
        this.mediaRecorder.pause();
    }

    onResumeClicked(){
        this.mediaRecorder.resume();
    }

    errorCallback(err) {
        console.log(err);
    }

    startRecording(stream) {
        _this.localStream = stream;
        var timer = 0;
        this.videoFile = "";
        _this.youTubeLink = "";
        this.isVideoAvailable = true;
        this.timer = setInterval(() => {
        if (!_this.paused) {
            timer++;
        }
        if (timer === allowedSecs) {
            this.onStopClicked();
        }
        }, 1000);
        // if (typeof MediaRecorder.isTypeSupported == 'function') {
        // if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        //     this.options = { mimeType: 'video/webm;codecs=vp9' };
        // } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        //     this.options = { mimeType: 'video/webm;codecs=vp8' };
        // }
        // this.mediaRecorder = new MediaRecorder(stream, this.options);
        // } else {
        // this.mediaRecorder = new MediaRecorder(stream);
        // }
        // this.mediaRecorder.start(10);
        // let url = window.URL || window.webkitURL;
        // this.videoElement = document.getElementById('exitRecorderElement');
        // this.videoElement.src = url ? url.createObjectURL(stream) : stream;
        // this.videoElement.controls = true;
        // this.videoElement.play();

        var mediarecorderoptions =  _this.mediaRecorderService.initializeStartMediaRecorder(stream, 'exitRecorderElement');
        this.mediaRecorder = mediarecorderoptions.mediaRecorder;
        this.options = mediarecorderoptions.options;
        this.videoElement = mediarecorderoptions.element;

        this.mediaRecorder.ondataavailable = e => {
        this.chunks.push(e.data);
        };

        this.mediaRecorder.onstop = () => {
        let blob = new Blob(this.chunks, { type: "video/webm" });
        this.chunks = [];
        this.recordedBlob = blob;
        let videoURL = window.URL.createObjectURL(blob);
        this.videoElement.src = videoURL;
        }

  }

  getExitVideos(){
      let onSuccess = (response) => {
            console.log(response.data.length-1)
            if(response && response.data.length > 0){
                let length = response.data.length - 1;
                let fileId = response.data[length].fileId;
                let videoPath = response.data[length].videoPath;
                
                _this.videoFileId = fileId;
                if(videoPath){
                    let path = videoPath;
                    _this.isVideoAvailable = true;
                    if(path.indexOf('youtube') >= 0){
                        _this.recordingOn = false;
                        path = path.replace("watch?v=", "embed/");

                        console.log(path);
                        _this.videoUrl = path;

                    }else if(path.indexOf('blob') == -1 && path.indexOf('video/webm') == -1){
                        _this.recordingOn = true;
                        path = path+"?autoplay=false";
                        _this.videoUrl = path;

                    }else{

                        _this.recordingOn = true;
                        _this.videoElement = document.getElementById('exitRecorderElement');
                        _this.videoElement.src = path;
                        _this.videoElement.controls = true;
                        //_this.videoElement.play();

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

        _this.AdminCompanyInfoService.getExitVideos();
        _this.AdminCompanyInfoService.activePromise.then(onSuccess, onError);
  }

    getExitVideoList(){
        let onSuccess = (response) => {
              console.log(response.data);
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
    
     getExitVideos(fileId) {
        let onSuccess = (response) => {
            if (response && response.data && response.data.file) {
              _this.exitVideo.videoPath = response.data.file || "";
              _this.exitVideoUpdated(_this.exitVideo);
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


    exitVideoUpdated(url){
      _this.UtilsService.stopVideoPlayer();
        if(url !== null && url.videoPath !== null){
            let path = url.videoPath;
            _this.isVideoAvailable = true;
            if(path.indexOf('youtube') >= 0){
                _this.recordingOn = false;
                path = path.replace("watch?v=", "embed/");
                _this.videoUrl = path;

            }else if(path.indexOf('blob') == -1 && path.indexOf('video/webm') == -1){
                _this.recordingOn = true;
                //path = path+"?autoplay=false";
                _this.videoUrl = path;

            }else{
                _this.recordingOn = true;
                _this.videoElement = document.getElementById('exitRecorderElement');
                _this.videoElement.src = path;
                _this.videoElement.controls = true;
                //_this.videoElement.play();

            }
        }
    };


}



