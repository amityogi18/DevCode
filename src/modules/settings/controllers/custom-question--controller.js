let _this;
const allowedSecs = 120;

export class CustomQuestionController {
	/** @ngInject  */
    constructor($stateParams, CustomQuestionService, AdminDepartmentService, InterviewService, $sce, $timeout, GrowlerService, mediaRecorderService, AuthService, $state, LoaderService, $rootScope) {
        _this = this;
        _this.$state = $state;
        _this.$timeout = $timeout;
        _this.$sce = $sce;
        _this.GrowlerService = GrowlerService;
        _this.LoaderService = LoaderService;
        _this.CustomQuestionService = CustomQuestionService;
        _this.AdminDepartmentService = AdminDepartmentService;
        _this.InterviewService = InterviewService;
        _this.GrowlerService = GrowlerService;
        _this.AuthService = AuthService;
        _this.mediaRecorderService = mediaRecorderService;
        _this.$rootScope = $rootScope;
        _this.optionArray = [];
        _this.localStream = {};
        _this.subCategory = [];
        _this.questionData = {};
        _this.question = [];
        _this.departmentList = [];
        _this.getDepartment();
        _this.questionTypeList = [];
        _this.recordedVideo = '';
        _this.hideBtn = true;
        _this.paused = false;
        _this.isAnswerChecked = false;
        _this.mediaRecorder = '';
        _this.existingTemplateQuestionList = [];
        _this.selectedquestionId = [];
        _this.templateDetail = [];
        _this.templateDetail.name = '';
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        if (_this.mediaRecorderService.getBrowser() === "Chrome") {
            _this.constraints = {"audio": true, "video": true};
        } else if (_this.mediaRecorderService.getBrowser() === "Firefox") {
            _this.constraints = {"audio": true, "video": true};
        }
        _this.chunks = [];
        _this.countdownStarted = false;
        _this.isVideoAvailable = true;
        _this.videoElement = '';
        _this.audioElement = '';
        _this.recordingOn = false;
        _this.videoUrl = '';
        _this.options = '';
        _this.videoFile = '';
        _this.audioFile = '';
        _this.isActive = false;
        _this.filePath = '';
        _this.fileType = '';
        _this.recordedBlob = {};
        _this.getQuestionBankInfo('company');
        _this.responseTypeList = [];
        _this.isDefaultQuestion = false;
        _this.answerOption1 = 0;
        _this.answerOption2 = 0;
        _this.answerOption3 = 0;
        _this.answerOption4 = 0;
        _this.option1 = "";
        _this.option2 = "";
        _this.option3 = "";
        _this.option4 = "";
        
            if(_this.infoData && _this.infoData === 'edit'){
                _this.isEdit = true;                
                _this.getQuestionType();
                if(_this.data){
                    let id = _this.data;
                    _this.getQuestionDetailsById(id);
                }
                
            }else if(_this.infoData && _this.infoData === 'add')
            {
                _this.isAdd = true;
                _this.showText = true
                _this.getQuestionType();
                
            }else if(_this.infoData && _this.infoData === 'add-template')
            {
                _this.isAdd = true;                
                _this.getcustomQuestionTemplateList();
            }else if(_this.infoData && _this.infoData === 'edit-template')
            {
                _this.isEdit = true;                    
                _this.getcustomQuestionTemplateList();
                if(_this.data){
                    let templateId = _this.data;
                    _this.getTemplateDetailsById(templateId);
                }                
            } 
            _this.isQuestionImageFileAdded = false;
            _this.$rootScope.videoImagePath = '';
        
            
    }


    getQuestionBankInfo(type) {
        _this.subCategory = [];
        _this.question = [];
        let companyId = 1;
        if (type === 'company') {
            companyId = this.AuthService.user.companyId;
        }
        let onSuccess = (response) => {
                //_this.questionBankList = response.data;
                 _this.questionBankList = _.filter(response.data.data, function(item){
            return item.status === "ACTIVE";
        });
            },
            onError = (error) => {
                console.log(error);
            };
        _this.InterviewService.getQuestionBankInfo(companyId);
        _this.InterviewService.activePromise.then(onSuccess, onError);
    }
    
    getDepartment() {
        let onSuccess = (response) => {
                _this.departmentList = response.data.data;
            },
            onError = (error) => {
                console.log(error);
            };
        _this.AdminDepartmentService.getCompanyDepartment();
        _this.AdminDepartmentService.activePromise.then(onSuccess, onError);
    }

    getSkillSet(departmentId) {
        if(angular.isDefined(_this.skillsetId)){
          _this.skillsetId='';  
        }
        let onSuccess = (response) => {
                _this.skillsetList = response.data;
            },
            onError = (error) => {
                console.log(error);
            };
        _this.AdminDepartmentService.getSkillSet(departmentId);
        _this.AdminDepartmentService.activePromise.then(onSuccess, onError);
    }

    getQuestionType() {
        let onSuccess = (response) => {
                _this.questionTypeList = response.data;
            },
            onError = (error) => {
                console.log(error);
            };
        _this.CustomQuestionService.getQuestionType();
        _this.CustomQuestionService.activePromise.then(onSuccess, onError);
    }

    questionTypeChanged() {
        _this.settingImagePath ='';
        _this.$rootScope.videoImagePath='';
        _this.removeImage();
        _this.isQuestionImageFileAdded = false;
        _this.selectedQuestionType && _this.selectedQuestionType === 4 ? _this.showMCQ = true : _this.showMCQ = false;
        _this.selectedQuestionType && _this.selectedQuestionType === 5 ? _this.showAudio = true : _this.showAudio = false;
        _this.selectedQuestionType && _this.selectedQuestionType === 6 ? _this.showImage = true : _this.showImage = false;
        _this.selectedQuestionType && _this.selectedQuestionType === 2 ? _this.showText = true : _this.showText = false;
        _this.selectedQuestionType && _this.selectedQuestionType === 3 ? _this.showMSQ = true : _this.showMSQ = false;
        _this.selectedQuestionType && _this.selectedQuestionType === 1 ? _this.showVideo = true : _this.showVideo = false;

        if (this.selectedQuestionType && this.selectedQuestionType === 4) {
            _this.responseTypeList = [{"id": 4, "responseType": "MCQ"}];
        } else if (this.selectedQuestionType && this.selectedQuestionType === 3) {
            _this.responseTypeList = [{"id": 3, "responseType": "MSQ"}];
        } else if (this.selectedQuestionType && this.selectedQuestionType === 2) {
            _this.responseTypeList = [{"id": 5, "responseType": "AUDIO"},
                {"id": 1, "responseType": "VIDEO"},
                {"id": 2, "responseType": "TEXT"}
            ];
        } else if (this.selectedQuestionType && (this.selectedQuestionType === 1 || this.selectedQuestionType === 5)) {
            _this.responseTypeList = [
                {"id": 5, "responseType": "AUDIO"},
                {"id": 1, "responseType": "VIDEO"},
                {"id": 2, "responseType": "TEXT"}
            ];
        }
    }

    checkMandatoryFields() {
        if( _this.selectedQuestionType  && _this.selectedQuestionType!== ''
            && _this.enteredQuestion && _this.enteredQuestion!==''
            &&  _this.departmentId &&  _this.departmentId!==''
            &&_this.selectedResponseType && _this.selectedResponseType!==''
            &&_this.skillsetId && _this.skillsetId!==''
        )
        {
        if((_this.selectedQuestionType == 1 || _this.selectedQuestionType == 5) && !(_this.recordedBlob instanceof Blob)){
         return false;
        }
        if((_this.selectedQuestionType == 3 || _this.selectedQuestionType == 4) && (_this.option1 == '' || _this.option2 == '' || _this.isAnswerChecked == false)){
            _this.customQuestionForm.$setSubmitted();
            return false;
            }
            return true;
        }
        else {
            _this.customQuestionForm.$setSubmitted();
            return false;
        }
    }

   checkAnswerSelection(){
        if( _this.answerOption1 == 2 || _this.answerOption2 == 3 ||  _this.answerOption3 == 4 || _this.answerOption4 == 5){
            _this.productMsg = " ";
            _this.isAnswerChecked = true;
        }
        else{
            _this.productMsg = "Please Select Right Answer"
            _this.isAnswerChecked = false;
        }
    }
    checkMsqAnswerSelection(){
        if( _this.answerOption1 == true || _this.answerOption2 == true ||  _this.answerOption3 == true || _this.answerOption4 == true){
            _this.answerMsg = " ";
            _this.isAnswerChecked = true;
        }
        else{
            _this.answerMsg = "Please Select Right Answer"
            _this.isAnswerChecked = false;
        }
    }

    saveNewCustomeQuesstion() {
        if( _this.answerOption1 == 0  &&  _this.answerOption2 == 0 &&  _this.answerOption3 == 0 &&  _this.answerOption4 == 0){
            _this.productMsg = "Please Select Right Answer"
        }
        if( _this.answerOption1 == false  &&  _this.answerOption2 == false &&  _this.answerOption3 == false &&  _this.answerOption4 == false){
            _this.answerMsg = "Please Select Right Answer"
        }
        
        _this.$timeout(function(){
        if (_this.checkMandatoryFields()) {
            _this.LoaderService.show();
            _this.showSelectedQuestions = true;
            let newQuestionData = {
                "companyId": _this.AuthService.user.companyId,
                "questionTypeId": _this.selectedQuestionType,
                "question": _this.enteredQuestion,
                "statusId": 1,
                "questionLevel": "medium",
                "thinkTimeSec": 10,
                "responseTimeSec": 20,
                "skillsetId": _this.skillsetId,
                "departmentId": _this.departmentId,
                "responseTypeId": _this.selectedResponseType,
                "filePath": _this.recordedBlob,
                "imagePath" : _this.settingImagePath,
                "isDefault" : _this.isDefaultQuestion == true ? 1 : 0,
                "options": [
                    {"option": _this.option1, "isCorrect": (_this.answerOption1 == 2 || _this.answerOption1) ? 1 : 0},
                    {"option": _this.option2, "isCorrect": (_this.answerOption2 == 3 || _this.answerOption2) ? 1 : 0},
                    {"option": _this.option3, "isCorrect": (_this.answerOption3 == 4 || _this.answerOption3) ? 1 : 0},
                    {"option": _this.option4, "isCorrect": (_this.answerOption4 == 5 || _this.answerOption4) ? 1 : 0}
                ]
            };

            if (newQuestionData) {
                let onSuccess = (response) => {
                        if (response.status && response.status === 200 && response.statusText && response.statusText.indexOf('OK') > -1) {
                            console.log('=== Saved Successfully');
                            _this.GrowlerService.growl({
                                type: 'success',
                                message: "Custom Question Added Successfully",
                                delay: 2000
                            });
                            _this.activeTab = 1;
                            _this.$timeout(function () {
                                _this.LoaderService.hide();
                                _this.close();
                            }, 1500);
                        }

                    },
                    onError = (error) => {
                        console.log(error);
                        _this.LoaderService.hide();
                    };
                _this.hideBtn = false;
                _this.CustomQuestionService.saveNewCustomeQuesstion(newQuestionData).then(onSuccess, onError);
            }

        }
         },1000);
    }

    startRecording(stream) {
        _this.localStream = stream;
        var timer = 0;
        _this.videoFile = "";
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
        //     if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        //         _this.options = {mimeType: 'video/webm;codecs=vp9'};
        //     } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        //         _this.options = {mimeType: 'video/webm;codecs=vp8'};
        //     }
        //     _this.mediaRecorder = new MediaRecorder(stream, _this.options);
        // } else {
        //     _this.mediaRecorder = new MediaRecorder(stream);
        // }
        //  _this.mediaRecorder.start(10);
        // let url = window.URL || window.webkitURL;
        // _this.videoElement = document.getElementById('questionBankVideoElement');
        // _this.videoElement.src = url ? url.createObjectURL(stream) : stream;
        // _this.videoElement.controls = true;
        // _this.videoElement.play();


        var mediarecorderoptions =  _this.mediaRecorderService.initializeStartMediaRecorder(stream, 'questionBankVideoElement');
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

        };
    }

    startAudioRecording(stream) {
        _this.localStream = stream;
        var timer = 0;
        _this.audioFile = '';
        _this.timer = setInterval(() => {
            if (!_this.paused) {
                timer++;
            }
            if (timer === allowedSecs) {
                _this.onStopAudio();
            }
        }, 1000);

        _this.mediaRecorder = new MediaRecorder(stream);
        _this.mediaRecorder.start(10);
        let url = window.URL || window.webkitURL;
        _this.audioElement = document.getElementById('questionBankAudioElement');
        _this.audioElement.src = url ? url.createObjectURL(stream) : stream;
        _this.audioElement.controls = true;
        _this.audioElement.play();

        _this.mediaRecorder.ondataavailable = e => {
            _this.chunks.push(e.data);
        };

        _this.mediaRecorder.onstop = () => {
            let blob = new Blob(_this.chunks, {type: "audio/ogg"});
            _this.chunks = [];
            _this.recordedBlob = blob;
            let audioURL = window.URL.createObjectURL(blob);
            _this.audioElement.src = audioURL;

        };
    }

    onStopAudio() {
        if (angular.isDefined(_this.mediaRecorder)
            && angular.isDefined(_this.mediaRecorder.state)
            && _this.mediaRecorder.state !== 'inactive') {
            _this.mediaRecorder.stop();
            _this.localStream.getTracks().forEach(function (track) {
                track.stop();
            });
            _this.audioElement.controls = true;
            clearInterval(_this.timer);
        }
    }

    onStopClick() {
        if (angular.isDefined(_this.mediaRecorder) && _this.mediaRecorder && angular.isDefined(_this.mediaRecorder.state) && _this.mediaRecorder.state !== 'inactive') {
            _this.mediaRecorder.stop();
            _this.localStream.getTracks().forEach(function (track) {
                track.stop();
            });
            _this.videoElement.controls = true;
            clearInterval(_this.timer);
        }
    }

    onRecordClick(type) {
        _this.countdownStarted = true;
        _this.recordingOn = false;
        _this.$timeout(() => {
            _this.countdownStarted = false;
            _this.recordingOn = true;
            if (type === 'video') {
                var constraints = {"audio": true, "video": true};
                navigator.getUserMedia(constraints, _this.startRecording.bind(this), _this.errorCallback.bind(this));
            } else {
                var constraints = {"audio": true, "video": false};
                navigator.getUserMedia(constraints, _this.startAudioRecording.bind(this), _this.errorCallback.bind(this));
            }
        }, 3000);
    }

    preview(type) {
        let videoElement, audioElement;
        if (type === 'audio') {

            if (angular.isDefined(_this.audioElement) && _this.audioElement !== '') {
                audioElement = _this.audioElement;
                audioElement.play();
            }
            else {
                audioElement = document.getElementById('questionBankAudioElement');
                audioElement.play();
            }

        } else if (type === 'video') {
            if (_this.recordingOn) {
                videoElement = _this.videoElement;
            }
            else {
                _this.recordedVideo = _this.$document.find('.video-iframe').contents().find('video')[0];
                videoElement = _this.recordedVideo;
            }
            _this.syncVideoAndBgMusic(videoElement);
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

    trustSrc(src) {
        return _this.$sce.trustAsResourceUrl(src);
    }

    errorCallback() {
        console.error('could not fetch stream');
    }

    syncVideoAndBgMusic(videoElement) {
        videoElement.onvolumechange = function (e) {
            _this.audioElement.volume = videoElement.volume;
        };

        videoElement.onplay = function (e) {
            _this.audioElement.play();
        };

        videoElement.onpause = function (e) {
            _this.audioElement.pause();
        };

        videoElement.ontimeupdate = function (e) {
            _this.audioElement.currentTime = videoElement.currentTime;
        };

        videoElement.onseeking = function (e) {
            _this.audioElement.currentTime = videoElement.currentTime;
        };

        videoElement.onplaying = function (e) {
            _this.audioElement.currentTime = videoElement.currentTime;
        };

        videoElement.onabort = function (e) {
            //_this.audioElement.pause();
        };

        videoElement.onerror = function (e) {
            //_this.audioElement.pause();
        };

        videoElement.onratechange = function (e) {
            // ToDo: to be done
        };

        videoElement.onseeked = function (e) {
            _this.audioElement.currentTime = videoElement.currentTime;
        };

        videoElement.stalled = function (e) {
            //_this.audioElement.pause();
        };

        videoElement.onsuspend = function (e) {
            //_this.audioElement.pause();
        };

        videoElement.onwaiting = function (e) {
            // _this.audioElement.pause();
        };
    }

    

    getQuestionDetailsById(questionId) {
        _this.questionId = questionId; 
        let onSuccess = (response) => {
                _this.questionData = response.data;
                _this.selectedQuestionType = response.data.questionTypeId;
                _this.questionTypeChanged();
                _this.enteredQuestion = response.data.question;
                _this.statusId = response.data.statusId;
                _this.questionLevel = response.data.questionLevel;
                _this.thinkTimeSec = response.data.thinkTimeSec;
                _this.responseTimeSec = response.data.responseTimeSec;
                _this.departmentId = response.data.departmentId;
                _this.getSkillSet(response.data.departmentId);
                _this.skillsetId = response.data.skillsetId;
                _this.isDefaultQuestion = response.data.isDefault == 1 ? true : false;
                _this.$timeout(() => {
                    $('select[name^="skillset"] option[value = ' + _this.skillsetId + ']').attr("selected", "selected");                     
                }, 100);
                _this.selectedResponseType = response.data.responseTypeId;
                _this.filePath = response.data.filePath;
                _this.settingImagePath = response.data.imagePath;
                _this.$rootScope.videoImagePath = response.data.imagePath;
               _this.isQuestionImageFileAdded = true;
               _this.showFileChooser = false;
                _this.fileType = response.data.fileType;
                _this.questionTypeName = response.data.questionTypeName;
                _this.departmentName = response.data.departmentName;
                _this.skillsetName = response.data.skillsetName;
                if (response.data.options && response.data.options.length > 0) {
                    _this.option1 = response.data.options[0].option;
                    _this.option2 = response.data.options[1].option;
                    _this.option3 = response.data.options[2].option;
                    _this.option4 = response.data.options[3].option;
                }

                if (_this.selectedQuestionType == 4) {
                    _this.answerOption1 = response.data.options[0].isCorrect == 1 ? 2 : 0;
                    _this.answerOption2 = response.data.options[1].isCorrect == 1 ? 3 : 0;
                    _this.answerOption3 = response.data.options[2].isCorrect == 1 ? 4 : 0;
                    _this.answerOption4 = response.data.options[3].isCorrect == 1 ? 5 : 0;
                } else if (_this.selectedQuestionType == 3) {
                    _this.answerOption1 = response.data.options[0].isCorrect == 1 ? true : false;
                    _this.answerOption2 = response.data.options[1].isCorrect == 1 ? true : false;
                    _this.answerOption3 = response.data.options[2].isCorrect == 1 ? true : false;
                    _this.answerOption4 = response.data.options[3].isCorrect == 1 ? true : false;
                }
                
                _this.optionArray = [_this.answerOption1, _this.answerOption2, _this.answerOption3, _this.answerOption4];

            },
            onError = (error) => {
            };

        _this.CustomQuestionService.getQuestionDetailsById(questionId);
        _this.CustomQuestionService.activePromise.then(onSuccess, onError);
    }

    updateCustomQuestion() {
          _this.isQuestionImageFileAdded =! _this.isQuestionImageFileAdded;
          if(typeof _this.settingImagePath !=='object'){
              _this.settingImagePath ='';
          }

          if(_this.isDefaultQuestion) {
                _this.isDefaultQuestion = 1;
            }
            else {
                _this.isDefaultQuestion = 0;
            }
          
            let onSuccess = (response) => {
                    _this.GrowlerService.growl({
                        type: 'success',
                        message: 'Custom Question Updated Successfully',
                        delay: 300
                    });
                    _this.activeTab = 1;
                    _this.close();
                },
                onError = (error) => {
                    _this.GrowlerService.growl({
                        type: 'warning',
                        message: 'Please add the required change to be updated',
                        delay: 300
                    });
                },
                customQuestionData = {
                    questionId: _this.questionId,
                    questionTypeId: _this.selectedQuestionType,
                    question: _this.enteredQuestion,
                    statusId: 1,
                    questionLevel: "medium",
                    thinkTimeSec: 10,
                    responseTimeSec: 20,
                    skillsetId: _this.skillsetId,
                    departmentId: _this.departmentId,
                    responseTypeId: _this.selectedResponseType,
                    filePath: _this.recordedBlob,
                    imagePath: _this.settingImagePath,
                    isDefault: _this.isDefaultQuestion,
                    options: [
                        {
                            "option": _this.option1,
                            "isCorrect": (_this.answerOption1 === 2 || _this.answerOption1) ? 1 : 0
                        },
                        {
                            "option": _this.option2,
                            "isCorrect": (_this.answerOption2 === 3 || _this.answerOption2) ? 1 : 0
                        },
                        {
                            "option": _this.option3,
                            "isCorrect": (_this.answerOption3 === 4 || _this.answerOption3) ? 1 : 0
                        },
                        {
                            "option": _this.option4,
                            "isCorrect": (_this.answerOption4 === 5 || _this.answerOption4) ? 1 : 0
                        }
                    ]
                };  
                if(_this.selectedResponseType === 1 || _this.selectedResponseType === 5){
                    if((_this.recordedBlob instanceof Blob || _this.questionData.questionTypeId !== customQuestionData.questionTypeId ||
                        _this.questionData.question !== customQuestionData.question ||
                        _this.questionData.departmentId !== customQuestionData.departmentId ||
                        _this.questionData.skillsetId !== customQuestionData.skillsetId ||
                        _this.questionData.responseTypeId !== customQuestionData.responseTypeId ||
                        _this.questionData.isDefault !== customQuestionData.isDefault) &&
                        _this.skillsetId !==''){

                            _this.CustomQuestionService.updateCustomQuestion(customQuestionData);
                            _this.CustomQuestionService.activePromise.then(onSuccess, onError);

                    } else{
                        _this.GrowlerService.growl({
                            type: 'warning',
                            message: 'Please add required change to be updated',
                            delay: 300
                        });  
                    }
                    
                }else if(_this.selectedResponseType === 2){
                    if((_this.questionData.questionTypeId !== customQuestionData.questionTypeId ||
                        _this.questionData.question !== customQuestionData.question ||
                        _this.questionData.departmentId !== customQuestionData.departmentId ||
                        _this.questionData.skillsetId !== customQuestionData.skillsetId ||
                        _this.questionData.responseTypeId !== customQuestionData.responseTypeId ||
                        _this.questionData.isDefault !== customQuestionData.isDefault) &&
                        _this.skillsetId !== ''){

                            _this.CustomQuestionService.updateCustomQuestion(customQuestionData);
                            _this.CustomQuestionService.activePromise.then(onSuccess, onError);
                    }else{
                        _this.GrowlerService.growl({
                            type: 'warning',
                            message: 'Please add required change to be updated',
                            delay: 300
                        });  
                    }

                }else{
                    if((_this.option1 !== '' && _this.answerOption1 > 0) ||
                        (_this.option2 !== '' && _this.answerOption2 > 0) ||
                        (_this.option3 !== '' && _this.answerOption3 > 0) ||
                        (_this.option4 !== '' && _this.answerOption4 > 0)){

                        let updatedArray = [_this.answerOption1, _this.answerOption2, _this.answerOption3, _this.answerOption4];
                            var isSame = (_this.optionArray.length === updatedArray.length) && _this.optionArray.every(function(element, index) {
                                return element === updatedArray[index]; 
                            });
                        if((_this.questionData.questionTypeId !== customQuestionData.questionTypeId ||
                            _this.questionData.question !== customQuestionData.question ||
                            _this.questionData.departmentId !== customQuestionData.departmentId ||
                            _this.questionData.skillsetId !== customQuestionData.skillsetId || 
                            _this.questionData.responseTypeId !== customQuestionData.responseTypeId ||
                            _this.questionData.isDefault !== customQuestionData.isDefault || !isSame)
                           && _this.skillsetId !== ''){

                                _this.CustomQuestionService.updateCustomQuestion(customQuestionData);
                                _this.CustomQuestionService.activePromise.then(onSuccess, onError);
                        }else{
                            _this.GrowlerService.growl({
                                type: 'warning',
                                message: 'Please add required change to be updated',
                                delay: 300
                            });  
                        }
                    }
                }
       
    }
    optionsChanged(val) {
        _this.answerOption1 = 0;
        _this.answerOption2 = 0;
        _this.answerOption3 = 0;
        _this.answerOption4 = 0;
        if (val == 2) {
            _this.answerOption1 = 2;
        } else if (val == 3) {
            _this.answerOption2 = 3;
        } else if (val == 4) {
            _this.answerOption3 = 4;
        } else if (val == 5) {
            _this.answerOption4 = 5;
        }
    }

    getcustomQuestionTemplateList() {
        let onSuccess = (response) => {
                _this.selectedCustomQuestionTemplateList = response.data;
            },
            onError = (error) => {
                console.log(error);
            };
        _this.CustomQuestionService.getcustomQuestionTemplateList();
        _this.CustomQuestionService.activePromise.then(onSuccess, onError);
    }

    getExistingTemplateQuestion(id) {
        let onSuccess = (response) => {
                _this.existingTemplateQuestionList = response.data;
            },
            onError = (error) => {
                console.log(error);
            };
        _this.CustomQuestionService.getExistingTemplateQuestion(id);
        _this.CustomQuestionService.activePromise.then(onSuccess, onError);
    }

    checkRequiredFields() {
        if(  _this.templateDetail.name  && _this.templateDetail.name !== ''
           && _this.selectedquestionId && _this.selectedquestionId.length > 0)
        { _this.errorcmsg=''
            return true;
        }
        else if(_this.templateDetail.name == ''
            &&  _this.selectedquestionId.length > 0){
            _this.errorcmsg=''
            _this.templateForm.$setSubmitted();
            return false;
        }
        else
        {  _this.errorcmsg='Please Select Question'
            _this.templateForm.$setSubmitted();
            return false;
        }
    }

    saveNewQuesstionTemplate() {
        if (_this.checkRequiredFields()) {
            _this.errorcmsg='';
            let questionIdArray = _this.selectedquestionId.map((v) => {
                return v.questionId;
            });
            _this.showSelectedQuestions = true;

            let data = {
                "name": _this.templateDetail.name,
                "questionIds": questionIdArray
            };
            
            let onSuccess = (response) => {
                    console.log(response.data);
                    _this.GrowlerService.growl({
                        type: 'success',
                        message: "New Question Template Added Successfully",
                        delay: 300
                    });
                    _this.activeTab = 2;
                    _this.close();
                },
                onError = (error) => {
                    console.log(error);
                };
            _this.CustomQuestionService.saveNewQuesstionTemplate(data);
            _this.CustomQuestionService.activePromise.then(onSuccess, onError);

        }
    }


  addTemplateQuestionId(element, id) {
    if (element.currentTarget.checked) {
      _this.selectedquestionId.push(id);
    } else {
      _this.selectedquestionId.pop(id);
    }
  }
  
  
  updateTemplate(templateId) {
      if (_this.checkRequiredFields()) {
          _this.errorcmsg='';
          let questionIdArray = _this.selectedquestionId.map((v) => {
              return v.questionId;
          });

          let onSuccess = (response) => {
                  _this.IsView = false;
                  _this.getcustomQuestionTemplateList();
                  console.log(response.data);
                  _this.GrowlerService.growl({
                      type: 'success',
                      message: "Question Template Updated Successfully",
                      delay: 300
                  });
                  _this.activeTab = 2;
                  _this.close();
              },
              onError = (response) => {
                  console.log('inside update template');
              },
              data = {
                  "name": _this.templateDetail.name,
                  "questionIds": questionIdArray
              };
          _this.CustomQuestionService.updateTemplate(templateId, data);
          _this.CustomQuestionService.activePromise.then(onSuccess, onError);

      }
  }
  getTemplateDetailsById(templateId) {
    let onSuccess = (response) => {
        _this.templateDetail = response.data;
        _this.activeTemplate = templateId;
        _this.existingTemplateQuestionList = response.data.questions;
        _this.$timeout(function () {
          _this.showSelectedQuestions = true;
        if(_this.existingTemplateQuestionList.length>0){
          let tempList = _this.existingTemplateQuestionList;
          for(var i=0;i<tempList.length;i++){
            let questions = {
            'question': tempList[i].name,
            'questionType': tempList[i].type,
            'skill': _this.skillSetName,
            'questionId': tempList[i].id
          };
           _this.selectedquestionId.push(questions);
        }
        }
        }, 1000);
      },
      onError = (error) => {
        console.log(error);
      };
    _this.CustomQuestionService.getTemplateDetailsById(templateId);
    _this.CustomQuestionService.activePromise.then(onSuccess, onError);
    
  }  
  
  selectCategory(id) {
    _this.subCategory = [];
    _this.question = [];
    let onSuccess = (response) => {
        _this.subCategory = response.data;
      },
      onError = (error) => {
        console.log(error);
      };
    _this.InterviewService.getSkillSet(id);
    _this.InterviewService.activePromise.then(onSuccess, onError);

  }


  selectSubCategory(index, type) {
    let companyId = 1;
    if (type === 'company') {
      companyId = this.AuthService.user.companyId;
    }
    _this.question = [];
    _this.skillSetName = this.subCategory[index].skillsetName;
    let onSuccess = (response) => {
        _this.question = response.data;
      },
      onError = (error) => {
        console.log(error);
      };
    _this.InterviewService.getQuestionsBySkills(companyId, this.subCategory[index].id);
    _this.InterviewService.activePromise.then(onSuccess, onError);

  }

  selectQuestions(question, type) {
      _this.errorcmsg='';
    _this.showSelectedQuestions = true;
    if(type === "T"){
      _this.selectedquestionId.push({
        'question': question.question,
        'questionType': question.questionType,
        'skill': _this.skillSetName,
        'questionId': question.questionId
      });
    }else{
      _this.selectedquestionId.push({
        'question': question.name,
        'questionType': question.type,
        'skill': _this.skillSetName,
        'questionId': question.id
      });
    }
    
    _this.selectedquestionId = _.uniqBy(_this.selectedquestionId, function (question) {
        return question.questionId;
    });
  }

  removeSelectedQuestion(i) {
    this.selectedquestionId.splice(i, 1);
    this.selectedquestionId.length === 0 ? this.showSelectedQuestions = false : this.showSelectedQuestions = true;
  }
  
  cameraOffButton(){
    let noData = _.isEmpty(_this.localStream);    
    if(!noData){
      _this.localStream.getTracks().forEach(function (track) {
          track.stop();
       });
    }
    _this.activeTab = 1;
    _this.close();
  }

  setActiveTab(){
    if(_this.activeTab !== ""){
        let activeTabId = _this.activeTab === 1 ? 'customQuestion' : 'template';
        let inActiveTabId = _this.activeTab === 1 ? 'template' : 'customQuestion';
        $('#'+activeTabId).addClass('active');
        $('#'+activeTabId+'Li').addClass('active');
        $('#'+inActiveTabId).removeClass('active');
        $('#'+inActiveTabId+'Li').removeClass('active');
    }
  }
  isFileAdded(file){
   if(angular.isDefined(file) && file.length>0){
     /*   var fr = new FileReader();
       fr.onload = function () {
          _this.$rootScope.imagePath = fr.result;
       }
       fr.readAsDataURL(file[0]);
       _this.isQuestionImageFileAdded =! _this.isQuestionImageFileAdded;
    } */
          _this.fileNotSelected = true;
        }
        else{
          _this.fileNotSelected = false;
        }
     }
     
     
  uploadImage(file) {
         _this.$rootScope.videoImagePath = URL.createObjectURL(file[0]);
         _this.settingImagePath = file[0];
         _this.myTextQuestion = _this.$rootScope.videoImagePath;
         _this.myaudiopic = _this.settingImagePath;
         _this.showFileChooser = false;
         _this.isQuestionImageFileAdded =! _this.isQuestionImageFileAdded;
    }
  
    removeImage(){
      _this.showFileChooser = true;
      _this.$rootScope.imagePath = "";
      _this.settingImagePath = '';
      _this.myTextQuestion = '';
      _this.myaudiopic = "";
      _this.isQuestionImageFileAdded =! _this.isQuestionImageFileAdded;
    }

    checkDefaultQuestion(element){
    
    if(element.currentTarget.checked){
      _this.isDefaultQuestion = 1;
    }else{
      _this.isDefaultQuestion = 0;
    }
  }
}
