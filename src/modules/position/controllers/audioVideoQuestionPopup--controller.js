let _this;
const allowedSecs = 120;
export class audioVideoQuestionPopupController {
	/** @ngInject  */
  constructor(items, $uibModalInstance, $timeout, $sce, InterviewService, $rootScope, mediaRecorderService,AuthService, GrowlerService,LoaderService) {
    console.log("Inside newQuestionPopupController");
    _this = this;
    _this.items = items;
    _this.$sce = $sce;
    _this.subCategory = [];
    _this.question = [];
    _this.selectedQuestions = [];
    _this.showSelectedQuestions = false;
    _this.$timeout = $timeout;
    _this.$modalInstance = $uibModalInstance;
    _this.InterviewService = InterviewService;
    _this.GrowlerService = GrowlerService;
    _this.AuthService = AuthService;
    _this.LoaderService = LoaderService;
    _this.localStream={};
    _this.selectedQuestionType = 1;
    _this.selectedResponseType = 1;
    _this.showVideo = true;
    _this.showAudio = false;
    _this.$rootScope = $rootScope;
    _this.recordedVideo = '';
    _this.paused = false;
    _this.mediaRecorderService = mediaRecorderService;
    _this.mediaRecorder = '';
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (_this.mediaRecorderService.getBrowser() == "Chrome") {
      _this.constraints = {"audio": true, "video": true};
    } else if (_this.mediaRecorderService.getBrowser() == "Firefox") {
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
    _this.ddlQuestionTypeList = [];
    _this.PrevPositionList = [];
    _this.existingTemplateList = [];
    _this.questionBankList = [];
    _this.avQuestionTypeList = [];
    _this.getAVQuestionTypeInfo();
     _this.showFileChooser = false;
    _this.defaultQuestions = [];
    _this.showFromQuestionBank = false;
    _this.showNewQuestion = false;
    _this.showExistingTemplate = false;
    _this.showPrevPositionTemplate = false;
    _this.isQuestionImageFileAdded = false;
    _this.$rootScope.audioVideoImagePath = '';
    //Default Questions
    _this.responseTypeList = [   
                            {"id": 5,"responseType": "AUDIO"},
                            {"id": 1,"responseType": "VIDEO"}                                   
                            ];

  }

  getPreviousPositionInfo() {
    _this.prevPositionId ='';
    let query="exceptPosition="+_this.items;
    let onSuccess = (response) => {
        _this.PrevPositionList = response.data;
      },
      onError = (error) => {
        console.log(error);
      };
    _this.InterviewService.getPreviousPositionInfo(query);
    _this.InterviewService.activePromise.then(onSuccess, onError);
  }

  getExistingTemplateInfo() {
    _this.templateId = '';
    let onSuccess = (response) => {
        _this.existingTemplateList = response.data;
      },
      onError = (error) => {

      };
    _this.InterviewService.getExistingTemplateInfo();
    _this.InterviewService.activePromise.then(onSuccess, onError);
  }

  getQuestionBankInfo(type) {
    _this.subCategory = [];
    _this.question = [];
    _this.categoryId = '';
    _this.subCategoryId = '';
    let companyId= 1;
    if(type === 'company'){
      companyId = this.AuthService.user.companyId;
    }
    let onSuccess = (response) => {
        //_this.questionBankList = response.data;
        _this.questionBankList = _.filter(response.data.data, function(item){
            return item.status === "ACTIVE";
        });
      },
      onError = (error) => {

      };
    _this.InterviewService.getQuestionBankInfo(companyId);
    _this.InterviewService.activePromise.then(onSuccess, onError);
  }

  getAVQuestionTypeInfo() {
    let onSuccess = (response) => {
        _this.avQuestionTypeList = response.data;
        _this.questionTypeList = _this.getQuestiontypeList(_this.avQuestionTypeList);
      },
      onError = (error) => {
        console.log(error);
      };
    this.InterviewService.getAVQuestionTypeInfo();
    this.InterviewService.activePromise.then(onSuccess, onError);
  }

  selectCategory(id) {
    _this.categoryId = id; 
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

  controlTabsDisplay() {
    this.showFromQuestionBank = true;
    this.showNewQuestion = false;
    this.getQuestionBankInfo('custom');
  }
  
  controlNewTabsDisplay(){
    this.showFromQuestionBank = false;
    this.showNewQuestion = true;
    this.getQuestionBankInfo('company');
  }
  
  selectSubCategory(index,type) {
    _this.subCategoryId = this.subCategory[index].id;
    let companyId= 1;
    if(type === 'company'){
        companyId = this.AuthService.user.companyId;
    }
    _this.question = [];
    _this.skillSetName = this.subCategory[index].skillsetName;

    let onSuccess = (response) => {
        _this.question = _.filter(response.data, function(item){
            return (item.responseTypeId === 1 || item.responseTypeId === 5);
        });
       // _this.question = response.data;
      },
      onError = (error) => {
        console.log(error);
      };
    _this.InterviewService.getQuestionsBySkills(companyId, this.subCategory[index].id);
    _this.InterviewService.activePromise.then(onSuccess, onError);

  }

  selectQuestions(index, q) {
    var self = this;
    this.showSelectedQuestions = true;
    this.selectedQuestions.push({
      'question': q.question,
      'questionType': q.questionType,
      'responseType': q.responseTypeId,
      'skill': self.skillSetName,
      'questionId': q.questionId
    });
    this.selectedQuestions = _.uniqBy(this.selectedQuestions, function (question) {
        return question.questionId;
    });
  }

  removeSelectedQuestion(i) {
    this.selectedQuestions.splice(i, 1);
    this.selectedQuestions.length === 0 ? this.showSelectedQuestions = false : this.showSelectedQuestions = true;
  }

  //On Final Finish
  chooseQuestionFinish() {
    var self = this;
    this.$rootScope.$broadcast('updateMain', {
      'dataArray': self.selectedQuestions
    });
    this.defaultQuestions.push(...this.question);
    this.$modalInstance.close();
  }

  //On Question type selection
  questionTypeChanged() {
    _this.$rootScope.audioVideoImagePath = '';
    _this.audioVideoImage ='';
    _this.removeImage();
    _this.isQuestionImageFileAdded = false;
    this.selectedQuestionType && this.selectedQuestionType === 1 ? this.showVideo = true : this.showVideo = false;
    this.selectedQuestionType && this.selectedQuestionType === 5 ? this.showAudio = true : this.showAudio = false;
    
    if(this.selectedQuestionType && this.selectedQuestionType === 5){
        this.selectedResponseType = 5;
    }else if(this.selectedQuestionType && this.selectedQuestionType === 1){
        this.selectedResponseType = 1;
    }
    
  }

  categoryChanged() {
    let onSuccess = (response) => {
        _this.subCategoryList = response.data;
      },
      onError = (error) => {
        console.log(error);
      };
    _this.InterviewService.getSkillSet(_this.selectedCategory);
    _this.InterviewService.activePromise.then(onSuccess, onError);
      _this.selectedSubCategory='';
  }

  saveNewCustomeQuesstion() {
    _this.showSelectedQuestions = true;
    _this.IsView = false;
    _this.close();
    let newQuestionData = {
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
      "imagePath" : _this.audioVideoImage,
      "options": [
        {"option": _this.option1, "isCorrect": _this.answerOption1 || false},
        {"option": _this.option2, "isCorrect": _this.answerOption2 || false},
        {"option": _this.option3, "isCorrect": _this.answerOption3 || false},
        {"option": _this.option4, "isCorrect": _this.answerOption4 || false}
      ]
    };

    if (newQuestionData) {
      _this.CustomQuestionService.saveNewCustomeQuesstion(newQuestionData).then((response) => {
        console.log(response);
        if (response.status && response.status === 200 && response.statusText && response.statusText.indexOf('OK') > -1) {
          console.log('=== Saved Successfully');
          _this.GrowlerService.growl({
            type: 'success',
            message: "Question Saved Successfully",
            delay: 2000
          });
        }
      });
    }
  }
  checkRequiredFields(){
         if(_this.selectedQuestionType === ''
            || !angular.isDefined(_this.selectedQuestionType)
            || _this.enteredQuestion === ''
            || !angular.isDefined(_this.enteredQuestion)
            || _this.selectedCategory === ''
            || !angular.isDefined(_this.selectedCategory)
            || !angular.isDefined(_this.selectedResponseType)
            || _this.selectedResponseType === ''
            || _this.selectedSubCategory === ''
            || !angular.isDefined(_this.selectedSubCategory)
            || !(_this.recordedBlob instanceof Blob)) {
            _this.questionBankForm.$setSubmitted();
            return false;
        }else
        {
            return true;
        }
         
  }

  //Save Question
  saveQuesstion() {
    _this.$timeout(function(){ 
        if(_this.checkRequiredFields()) {
            var self = _this;
            let newQuestionData;
            _this.showSelectedQuestions = true;
            newQuestionData = {
              "companyId": 1,
              "questionTypeId": _this.selectedQuestionType,
              "question": _this.enteredQuestion,
              "statusId": 1,
              "questionLevel": "medium",
              "thinkTimeSec": 10,
              "responseTimeSec": 20,
              "skillsetId": _this.selectedSubCategory,
              "departmentId": _this.selectedCategory,
              "responseTypeId": _this.selectedResponseType,
              "options": [],
              "filePath": _this.recordedBlob,
              "imagePath" :_this.audioVideoImage
            }

            if (newQuestionData) {
              _this.LoaderService.show();
              _this.InterviewService.saveNewQuestion(newQuestionData,).then((response) => {
                if (response.status && response.status === 200 && response.statusText && response.statusText.indexOf('OK') > -1) {
                    if(response.data && response.data.responseTypeId){
                        response.data.responseType = response.data.responseTypeId;
                    } 
                  self.selectedQuestions.push(response.data);
                  _this.GrowlerService.growl({
                    type: 'success',
                    message: "Question Saved Successfully",
                    delay: 2000
                  });
                  _this.clearQuestionbankFields();
                  _this.LoaderService.hide();
                }
              },(error) => {
                _this.LoaderService.hide();
              });
            }
        }
    },1000);
  }

  clearQuestionbankFields(){
    _this.selectedQuestionType = _this.enteredQuestion = _this.selectedCategory = _this.selectedResponseType = _this.selectedSubCategory= '';
    _this.recordedBlob  ={};
    _this.chunks =[];
    if( _this.videoElement !=='') {
      _this.videoElement.src = '';
    }
    if( _this.audioElement !=='') {
      _this.audioElement.src = '';
    }
    _this.questionBankForm.$setPristine();
    _this.questionBankForm.$setUntouched();
  }
  /* ========== Existing Template section =========== */

  selectExistingTemplateQuestions(i, q) {
    var self = this;
    this.showSelectedQuestions = true;
    this.selectedQuestions.push({
      'question': q.name,
      'questionType': q.type,
      'responseType': q.responseTypeId,
      'skill': self.existingTemplateName,
      'questionId': q.id
    });
    this.selectedQuestions = _.uniqBy(this.selectedQuestions, function (question) {
        return question.questionId;
    });
  }

  //Control display behaviour of existing template
  controlExistingTemplateTabsDisplay() {      
    this.getExistingTemplateInfo();
    this.showFromQuestionBank = false;
    this.showNewQuestion = false;
    this.showExistingTemplate = true;
  }

  //Selected temlate list
  selectedExistingTemplate(index) {
    if (_this.existingTemplateList) {
      _this.existingTemplateQuestion = [];
      _this.templateId = _this.existingTemplateList[index].id;
      _this.existingTemplateName = _this.existingTemplateList[index].name;
      let onSuccess = (response) => {
           _this.existingTemplateQuestion = _.filter(response.data, function(item){
            return (item.responseType === 1 || item.responseType === 5);
        });
          //_this.existingTemplateQuestion = response.data;
        },
        onError = (error) => {
          console.log(error);
        };
      _this.InterviewService.getExsTemplateQuestions(_this.existingTemplateList[index].id);
      _this.InterviewService.activePromise.then(onSuccess, onError);
    }
  }

  /* ========== Prev Position section =========== */

  selectPrevPositionQuestions(i, q) {
    var self = this;
    this.showSelectedQuestions = true;
    this.selectedQuestions.push({
      'question': q.question,
      'questionType': q.questionTypeId,
      'responseType': q.responseTypeId,
      'skill': self.PrevPostionName,
      'questionId': q.id
    });
    this.selectedQuestions = _.uniqBy(this.selectedQuestions, function (question) {
        return question.questionId;
    });
  }

  //Control display behaviour of existing template
  controlPrevPosTabsDisplay() {      
    this.getPreviousPositionInfo();
    this.showFromQuestionBank = false;
    this.showNewQuestion = false;
    this.showExistingTemplate = false;
    this.showPrevPositionTemplate = true;
    
  }

  //Selected temlate list
  selectedPrevPosition(index) {
    if (_this.PrevPositionList) {
      _this.PrevPositionQuestion = [];
      _this.prevPositionId = _this.PrevPositionList[index].id;
      _this.PrevPostionName = _this.PrevPositionList[index].positionName;
      let onSuccess = (response) => {
        _this.PrevPositionQuestion = _.filter(response.data, function(item){
            return (item.responseTypeId === 1 || item.responseTypeId === 5);
        });
         // _this.PrevPositionQuestion = response.data;
        },
        onError = (error) => {
          console.log(error);
        };
      _this.InterviewService.getPreviousPositionQuestions(this.PrevPositionList[index].id);
      _this.InterviewService.activePromise.then(onSuccess, onError);
    }
  }

  /* ===== Close Modal ===== */
  closeModal() {
    if (this.$modalInstance) {
      this.$modalInstance.dismiss();
    }    
    _this.cameraOffButton();
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
    //   if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
    //     _this.options = {mimeType: 'video/webm;codecs=vp9'};
    //   } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
    //     _this.options = {mimeType: 'video/webm;codecs=vp8'};
    //   }
    //   _this.mediaRecorder = new MediaRecorder(stream, _this.options);
    // } else {
    //   _this.mediaRecorder = new MediaRecorder(stream);
    // }
    // _this.mediaRecorder.start(10);
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

    }
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

    }
  }

  onStopAudio() {
    if (angular.isDefined(_this.mediaRecorder)
      && angular.isDefined(_this.mediaRecorder.state)
      && _this.mediaRecorder.state !== 'inactive') {
      _this.mediaRecorder.stop();
       _this.localStream.getTracks().forEach(function (track) {
            track.stop();
        });
      if( _this.audioElement !=='') {
        _this.audioElement.controls = true;
      }
      clearInterval(_this.timer);
    }
  }

  onStopClick() {
    if (angular.isDefined(_this.mediaRecorder)
      && angular.isDefined(_this.mediaRecorder.state)
      && _this.mediaRecorder.state !== 'inactive') {
      _this.mediaRecorder.stop();
        _this.localStream.getTracks().forEach(function (track) {
            track.stop();
        });
     if( _this.videoElement !=='') {
       _this.videoElement.controls = true;
     }
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
        navigator.getUserMedia(_this.constraints, _this.startRecording.bind(this), _this.errorCallback.bind(this));
      } else {
        navigator.getUserMedia(_this.constraints, _this.startAudioRecording.bind(this), _this.errorCallback.bind(this));
      }
    }, 3000);
  }

    preview(type) {
        let videoElement,audioElement;
        if(type==='audio') {

            if(angular.isDefined(_this.audioElement) && _this.audioElement !=='') {
                audioElement = _this.audioElement;
                audioElement.play();
            }
            else{
                audioElement = document.getElementById('questionBankAudioElement');
                audioElement.play();
            }

        } else if(type==='video') {
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

  getQuestiontypeList(questionTypeList) {
    let returnArray = [];
    if (angular.isDefined(questionTypeList) && questionTypeList.length > 0) {
      for (var i = 0; questionTypeList.length > i; i++) {
        if (questionTypeList[i].questionType == "AUDIO" || questionTypeList[i].questionType == "VIDEO") {
          returnArray.push(questionTypeList[i]);
        }
      }
    }
    return returnArray;
  }

    cameraOffButton(){
        let noData = _.isEmpty(_this.localStream);
        if(!noData){
            _this.localStream.getTracks().forEach(function (track) {
                track.stop();
            });
        }
    }
    
    isFileAdded(file){
    if(angular.isDefined(file) && file.length>0){
       /*var fr = new FileReader();
       fr.onload = function () {
          _this.$rootScope.audioVideoImagePath = fr.result;
       }
       fr.readAsDataURL(file[0]);
       _this.isQuestionImageFileAdded =! _this.isQuestionImageFileAdded; */
      if(file.length > 0){
        this.fileNotSelected = true;
       }
        else{
          this.fileNotSelected = false;
        }
    }
    
  }
  
   uploadImage(file) {
         _this.$rootScope.audioVideoImagePath = URL.createObjectURL(file[0]);
        
         _this.audioVideoImage = file[0];
         _this.showTextQuestion =  _this.$rootScope.audioVideoImagePath;
         _this.isQuestionImageFileAdded =! _this.isQuestionImageFileAdded;
         _this.showFileChooser = false;
    }
  
    removeImage(){
      _this.imagePath = "";
      _this.showFileChooser = true;
      _this.isQuestionImageFileAdded =! _this.isQuestionImageFileAdded;
    }
    clearSearchCategory(){
        _this.searchCategory = '';
    }
    clearSearchSubCategory(){
        _this.searchSubCategory = '';
    }
}
