let _this;

export class audioResponseQuestionController {
    /** @ngInject  */
    constructor($rootScope, $interval, $sce, $window, mediaRecorderService, GrowlerService, UtilsService, $storage) {
        _this = this;
        _this.$rootScope = $rootScope;
        _this.$interval = $interval;
        _this.$sce = $sce;
        _this.$window = $window;
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
            _this.audioElement.play();
        }
    }

    retry() {
        let GivenRetryCount = parseInt(_this.$storage.getItem('numberOfRetries') || 1);
        _this.retryCount++;
        if (GivenRetryCount >= _this.retryCount) {
            if (_this.recordingCompleted) {
                _this.question = angular.copy(_this.questionCopy);
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
                let audio = document.createElement('audio');
                audio.setAttribute('id', 'tempAudioObject');
                audio.preload = 'metadeta';
                audio.src = url;
                audio.addEventListener('loadedmetadata', () => {
                    console.log(audio.duration);
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
        var mediarecorderoptions = _this.mediaRecorderService.initializeStartMediaRecorder(stream, 'audioResponse');
        _this.mediaRecorder = mediarecorderoptions.mediaRecorder;
        _this.options = mediarecorderoptions.options;
        _this.audioElement = mediarecorderoptions.element;

        _this.mediaRecorder.ondataavailable = e => {
            _this.chunks.push(e.data);
        };

        _this.mediaRecorder.onstop = () => {
            _this.blob = new Blob(_this.chunks, { type: "audio/ogg; codecs=opus" });
            _this.question.answerFile = _this.blob;
            _this.isQuestionUpdate();
            _this.chunks = [];
            let audioURL = window.URL.createObjectURL(_this.blob);
            _this.audioElement = document.getElementById('audioResponse');
            _this.audioElement.src = audioURL;
        }
    }

    isQuestionUpdate() {
        _this.onUpdate({ question: _this.question });
    }

    stopRecording() {
        if (_this.mediaRecorder) {
            _this.mediaRecorder.stop();
        }
        if (_this.audioElement) {
            _this.audioElement.controls = true;
        }
        _this.recordingCompleted = true;
    }

    startRecording() {
        // TODO:set actual answer
        _this.question.answer = "";
        _this.recordingStarted = true;
        navigator.getUserMedia(_this.constraints, _this.startRecordingCallback.bind(_this), _this.errorCallback.bind(_this));

        _this.recordingTimer = _this.$interval(function () {
            if (_this.question.responseTime > 0) {
                _this.question.responseTime -= 1;
            } else if (angular.isDefined(_this.recordingTimer)) {
                _this.$interval.cancel(_this.recordingTimer);
                _this.stopRecording();
                _this.recordingTimer = undefined;
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
        _this.audioFile = '';
        _this.chunks = [];
        _this.mediaRecorder = null;
        _this.options = null;
        _this.audioElement = null;
    }

    init() {
        debugger;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        if (_this.mediaRecorderService.getBrowser() === "Chrome") {
            _this.constraints = {
                "audio": true,
                "video": false
            };
        } else if (_this.mediaRecorderService.getBrowser() === "Firefox") {
            _this.constraints = {
                "audio": true,
                "video": true
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
            $(".video-container-mobile").hide();
            $(".responsebtn").hide();
            $(".audio-response-container").show();
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
            $(".video-container-mobile").show();
            $(".response-video").hide();
            _this.toggleVideoButtons(false);
        }
    }

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
             $(".audio-response-container").hide();
         }
     }
}