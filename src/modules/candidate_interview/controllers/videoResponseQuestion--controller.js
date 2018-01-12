let _this;

export class videoResponseQuestionController {
    /** @ngInject  */
    constructor($scope, $rootScope, $interval,$timeout, $sce, $window, mediaRecorderService, GrowlerService, UtilsService, $storage) {
        _this = this;
        _this.$scope = $scope;
        _this.$rootScope = $rootScope;
        _this.$interval = $interval;
        _this.$sce = $sce;
        _this.$window = $window;
        _this.$timeout = $timeout;
        _this.mediaRecorderService = mediaRecorderService;
        _this.GrowlerService = GrowlerService;
        _this.UtilsService = UtilsService;
        _this.$storage = $storage;
        _this.retryCount = 0;
        _this.triggerStopRecording = false;
        _this.isShowNext = true;
        _this.screenDetails = _this.UtilsService.getScreenDetails();
        _this.$onInit = function () {
            _this.question = _this.question;
            _this.triggerStopRecording = false;
        }
        _this.$onChanges = function (changesObj) {
            _this.question = _this.question;
            _this.triggerStopRecording = false;
            _this.retryCount = 0;

            if (changesObj.question && (changesObj.question.currentValue !== changesObj.question.previousValue)) {

                if (_this.screenDetails.deviceType === "desktop") {
                    _this.init();
                    _this.isShowNext = false;
                }
            }
            if (changesObj.isNewQuestion && (changesObj.isNewQuestion.currentValue !== changesObj.isNewQuestion.previousValue)) {
                _this.finishRecording();
            } else if (_this.triggerStopRecording == "true") {
                _this.finishRecording();
            }
        }

        setTimeout(function () {
            if (window.mobile) {
                if (_this.question.questionTypeId === 1) {
                    _this.changeQuestionFileVideo(_this.question.questionFile);
                } else if (_this.question.questionTypeId === 5) {
                    _this.changeQuestionFileAudio(_this.question.questionFile);
                }
                _this.toggleVideoButtons(false);
            }
        }, 500);

    }

    showPrevious() {
        if (_this.recordingCompleted) {
            _this.onPrevious();
        }
    }

    showNext() {
        if (_this.recordingCompleted) {
            _this.onNext();
        }
    }

    finishRecording() {
        if (!_this.recordingCompleted && _this.question.preparationTime === 0) {
            _this.question.responseTime = 0;
        }
    }

    preview() {
        if (_this.recordingCompleted) {
            _this.videoElement.play();
        }
    }

    retry() {
        let GivenRetryCount = parseInt(_this.$storage.getItem('numberOfRetries') || 1);
        _this.retryCount++;
        if (GivenRetryCount >= _this.retryCount) {
            if (_this.recordingCompleted) {
                _this.question = angular.copy(_this.questionCopy);
                _this.question.answerFile = "";
                _this.chunks = [];
                if (angular.isDefined(_this.recordingTimer)) {
                    _this.$interval.cancel(_this.recordingTimer);
                    _this.recordingTimer = undefined;
                }
                if (angular.isDefined(_this.countdownTimer)) {
                    _this.$interval.cancel(_this.countdownTimer);
                    _this.countdownTimer = undefined;
                    _this.$rootScope.$emit("countdownFinish", {});
                }
                _this.initializeMediaRecorder();
                _this.startCountdown();
            }
        } else {
            let message = 'You can only retry ' + GivenRetryCount + ' time(s)';
            _this.GrowlerService.growl({
                type: 'success',
                message: message,
                delay: 300
            });
        }
    }

    tempFile() {
        var selectedFile = document.getElementById('tempId').files[0];
        this.question.answerFile = selectedFile;
    }

    upload() {
        if (this.videoFile) {
            let fileReader = new FileReader();
            let type = this.videoFile.type;
            fileReader.readAsArrayBuffer(this.videoFile);
            fileReader.onload = (event) => {
                let blob = new Blob([event.target.result], {
                    type: type
                });
                let url = (window.URL || window.webkitURL).createObjectURL(blob);
                let video = document.createElement('video');
                video.setAttribute('id', 'tempVideoObject');
                video.preload = 'metadeta';
                video.src = url;
                video.addEventListener('loadedmetadata', () => {
                    (window.URL || window.webkitURL).revokeObjectURL(blob);
                });
            };
        }
    }

    submit() {
        if (_this.recordingCompleted) {
            _this.upload();
        }
    }

    errorCallback() {
        console.error('could not fetch stream');
    }

    startRecordingCallback(stream) {
        _this.localStream = stream;
        console.log("Finding stream--------------------------->"+_this.localStream);
        var mediarecorderoptions = _this.mediaRecorderService.initializeStartMediaRecorder(stream, 'videoResponse');
        _this.mediaRecorder = mediarecorderoptions.mediaRecorder;
        _this.options = mediarecorderoptions.options;
        _this.videoElement = mediarecorderoptions.element;
        // if (!window.mobile) {
            _this.mediaRecorder.ondataavailable = e => {
                _this.chunks.push(e.data);
            // };

        }
        // else {
        //     var options = {
        //         mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
        //         audioBitsPerSecond: 128000,
        //         videoBitsPerSecond: 128000,
        //         bitsPerSecond: 128000 // if this line is provided, skip above two
        //     };
        //     _this.recordRTC = RecordRTC(stream, options);
        //     _this.recordRTC.startRecording();

        //     return;

        //     var path = [];
        //     for (i = 0, len = stream.length; i < len; i += 1) {
        //         path = mediaFiles[i].fullPath;
        //         // do something interesting with the file
        //     }
        // }

        //let url = window.URL || window.webkitURL;
      //  _this.videoElement = document.getElementById('videoResponse');
       // _this.videoElement.src = url ? url.createObjectURL(stream) : stream;
        
        _this.mediaRecorder.onstop = () => {
             debugger;
            let blob = new Blob(_this.chunks, {
                type: "video/webm"
            });
            _this.chunks = [];
            _this.$timeout(function() {
                _this.video_preview = document.getElementById("videoResponse");
                _this.video_preview.controls = true;
    
                var sorc =  document.createElement('source');
                sorc.src = window.URL.createObjectURL(blob);
                sorc.type = 'video/mp4; codecs=mpeg4';
                _this.video_preview.appendChild(sorc);
                _this.video_preview.tabIndex = 0;
                _this.video_preview.focus();
                _this.video_preview.play(); 
             }, 3000); //
           
           // let url = window.URL || window.webkitURL;
            //debugger;
            //let videoURL = url ? url.createObjectURL(blob) : blob;
            //window.URL.createObjectURL(blob);
            console.log("videoURL-------------->"+URL.createObjectURL(blob));
            
            //let videoPlayer = videojs(_this.videoElement, { "controls": true, "preload": "auto" }, function () { });
           // _this.videoElement.src = videoURL ;
            // setTimeout(function(){
            // if (window.mobile) {
            //     videoPlayer.src({
            //         //"type": "video/webm", 
            //         "src": videoURL
            //     });
            // }
            // else {
            //     videoPlayer.src({ "type": "video/webm", "src": videoURL });
            // }
            //_this.videoElement.src = videoURL;
            _this.question.answerFile = blob;
            _this.isQuestionUpdate();

        }
    }

    isQuestionUpdate() {
        _this.onUpdate({ question: _this.question });
    }

    stopRecording() {
        console.log('stop outer loop');
//         if (window.mobile) {
//             _this.recordRTC.stopRecording(function (audioVideoWebMURL) {
//                 debugger;
//                 var videoPlayer = videojs(document.getElementById('videoResponse'), { "controls": true, "preload": "auto" }, function () { });
//                 videoPlayer.src({
//                     "type": "video/ogg", 
//                     "src": audioVideoWebMURL
//                 });
//                 let recordedURL = audioVideoWebMURL.split('blob:')[1]; 
//                 VideoPlayer.play(recordedURL);
//                 // // setTimeout(function(){
//                 // debugger;
//                 // videoPlayer.src({ 
//                 // "type": "video/webm", 
//                 // "src": audioVideoWebMURL });

//                 // video.src = audioVideoWebMURL;

//                 // var recordedBlob = _this.recordRTC.getBlob();
//                 // debugger;
//                 // _this.recordRTC.getDataURL(function (dataURL) {
//                 //     debugger;
//                 //     videoPlayer.src({
//                 //         //"type": "video/webm", 
//                 //         "src": dataURL
//                 //     });
//                 //     debugger;
// //});
//                 _this.recordingCompleted = true;
//             });
//             return;
//         }
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
          //  clearInterval(_this.timer);
    //console.log("Finding stream ------------->"+ window.stream);
  
        // if (angular.isDefined(_this.mediaRecorder) && angular.isDefined(_this.mediaRecorder.state) && _this.mediaRecorder.state !== 'inactive') {
        //     if (_this.mediaRecorder) {
        //         console.log('stop clicked');
        //         _this.mediaRecorder.stop();
        //     }
        //     if (_this.videoElement) {
        //         _this.videoElement.controls = true;
        //     }
            _this.recordingCompleted = true;
        }
    }

    startRecording() {
        // TODO:set actual answer
        _this.question.answer = "";
        _this.recordingStarted = true;
        debugger;
        //navigator.mediaDevices.getUserMedia(_this.constraints, _this.startRecordingCallback.bind(_this), _this.errorCallback.bind(_this));
        //_this.constraints.audio = true;
        navigator.mediaDevices.getUserMedia(_this.constraints).then(_this.startRecordingCallback.bind(_this)).catch(_this.errorCallback.bind(_this));
        _this.recordingTimer = _this.$interval(function () {
            if (_this.question.responseTime > 0) {
                _this.question.responseTime -= 1;
            } else {
                if (angular.isDefined(_this.recordingTimer)) {
                    _this.$interval.cancel(_this.recordingTimer);
                    _this.stopRecording();
                    _this.recordingTimer = undefined;
                }
            }
        }, 1000);
    }

    startCountdown() {
        _this.countdownTimer = _this.$interval(function () {
            if (_this.question.preparationTime > 0) {
                _this.question.preparationTime -= 1;
            } else {
                if (angular.isDefined(_this.countdownTimer)) {
                    _this.$interval.cancel(_this.countdownTimer);
                    _this.startRecording();
                    _this.countdownTimer = undefined;
                    _this.$rootScope.$emit("countdownFinish", {});
                }
            }
        }, 1000);
    }

    initializeMediaRecorder() {
        _this.recordingStarted = false;
        _this.recordingCompleted = false;
        _this.videoFile = '';
        this.videoFile = '';
        _this.chunks = [];
        _this.mediaRecorder = null;
        _this.options = null;
        _this.videoElement = null;
    }

    init() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        if (_this.mediaRecorderService.getBrowser() === "Chrome") {
            //_this.constraints = {"audio": true, "video": true};
            var videoSource = _this.$storage.getItem('video');
            var audioSource = _this.$storage.getItem('audio');
            _this.constraints = {
                video: {
                    deviceId: videoSource ? {
                        exact: videoSource
                    } : undefined
                },
                audio: {
                    deviceId: audioSource ? {
                        exact: audioSource
                    } : undefined
                }
            };
        } else if (_this.mediaRecorderService.getBrowser() === "Firefox") {
            // _this.constraints = {"audio": true, "video": true};
            var videoSource = _this.$storage.getItem('video');
            var audioSource = _this.$storage.getItem('audio');
            _this.constraints = {
                video: {
                    deviceId: videoSource ? {
                        exact: videoSource
                    } : undefined
                },
                audio: {
                    deviceId: audioSource ? {
                        exact: audioSource
                    } : undefined
                }
            };
        }
        _this.question['preparationTime'] = _this.question.thinkTimeSec || 10;
        _this.question['responseTime'] = _this.question.responseTimeSec || 120;
        _this.questionCopy = angular.copy(_this.question);

        _this.initializeMediaRecorder();
        // if (_this.question.questionTypeId === 1) {
        //     _this.changeQuestionFileVideo(_this.question.questionFile);
        // } else if (_this.question.questionTypeId === 5) {
        //     _this.changeQuestionFileAudio(_this.question.questionFile);
        // }

        if (window.mobile) {
            $(".mobile-video").hide();
            $(".response-video").show();
            _this.toggleVideoButtons(true);
        }

        _this.startCountdown();

    }

    textResponse() {
        _this.question.answer = _this.answerGiven;
    }

    trustSrc(src) {
        return _this.$sce.trustAsResourceUrl(src);
    }

    changeQuestionFileVideo(questionFile) {
        console.log(questionFile);
        _this.UtilsService.initVideoPlayer('questionFileVideo', questionFile);
    }

    changeQuestionFileAudio(questionFile) {
        let questionFileAudio = $('#questionFileAudio')[0];
        questionFileAudio.src = questionFile;
        if (questionFileAudio.readyState !== 4) {
            questionFileAudio.load();
        }
        questionFileAudio.pause();
        setTimeout(function () {
            questionFileAudio.play();
        }, 150);
    }
    backToQuestion() {
        if (_this.screenDetails.deviceType !== "desktop") {
            $(".mobile-video").show();
            $(".response-video").hide();
            _this.toggleVideoButtons(false);
        }
    }

    /****  *****/
    toggleVideoButtons(display) {
       if (display) {
            $(".retry-button").show();
            $(".finish-recording").show();
            $(".back-to-question").show();
            $(".preparation-response-time").show();
        }
        else {
            $(".retry-button").hide();
            $(".finish-recording").hide();
            $(".back-to-question").hide();
            $(".preparation-response-time").hide();
        }
    }
}