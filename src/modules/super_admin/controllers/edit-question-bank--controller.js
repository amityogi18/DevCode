import _ from 'lodash';
let _this;
const allowedSecs = 120;

/*
 @question--Controller
 @param {object} NgTableParams description - initialise the ng-table & provides configuration
 @param {object} clientsService description - returns the object and provides all the values related to the company questions.
 @param {object} $scope This is act like glue between view and controller.
 @param {object} $element This represent element of dom.
 @param  {object} $timeout
 @param {NestedTableService} It nested table accordian service which is used in table accordian.
 */
export class EditQuestionBankController {
	/** @ngInject  */
  constructor(QuestionBankService, $timeout, GrowlerService, AdminDepartmentService, CandidateProfileService, CustomQuestionService, $sce, mediaRecorderService, SuperAdminService, LoaderService, $rootScope) {
    _this = this;
    _this.QuestionBankService = QuestionBankService;
    _this.$timeout = $timeout;
    _this.GrowlerService = GrowlerService;
    _this.$sce = $sce;
    _this.mediaRecorderService = mediaRecorderService;
    _this.CustomQuestionService = CustomQuestionService;
    _this.AdminDepartmentService = AdminDepartmentService;
    _this.CandidateProfileService = CandidateProfileService;
    _this.LoaderService = LoaderService;
    _this.SuperAdminService = SuperAdminService;
    _this.$rootScope = $rootScope;
    _this.isMCQ = true;
    _this.subCategory = [];
    _this.question = [];
    _this.isAudioVideo = false;
    _this.isWritten = false;
    _this.departmentList = [];    
    _this.getDepartment();
    _this.questionTypeList;
    _this.getQuestionType();
    _this.showMCQ = true;
    _this.showAudio = false;
    _this.showVideo = false;
    _this.showText = false; 
    _this.showMSQ = false;
    _this.showImage = false;
    _this.isAnswerChecked = false;
    _this.recordedVideo ='';
    _this.paused = false;
    _this.mediaRecorder = '';    
    _this.companyList= [];
    _this.id = {};
    _this.getCompanyList();
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (_this.mediaRecorderService.getBrowser() === "Chrome") {
      _this.constraints = { "audio": true, "video": true };
    } else if (_this.mediaRecorderService.getBrowser() === "Firefox") {
      _this.constraints = { "audio": true, "video": true };
    }
    _this.chunks = [];
    _this.countdownStarted = false;
    _this.isVideoAvailable= true;
    _this.videoElement ='';
    _this.audioElement = '';
    _this.recordingOn = false;
    _this.videoUrl = '';
    _this.options = '';
    _this.videoFile = '';
    _this.audioFile = '';
    _this.isActive = false;
    _this.filePath = '';
    _this.fileType ='';
    _this.recordedBlob = {};
    _this.questionType = 'Select';
    _this.responseTypeList = [];
    _this.answerOption1 = 0;
    _this.answerOption2 = 0;
    _this.answerOption3 = 0;
    _this.answerOption4 = 0;
    _this.option1 = "";
    _this.option2 = "";
    _this.option3 = "";
    _this.option4 = "";
    _this.localstream = '';
    if(_this.infoData && _this.infoData === 'edit'){
        _this.isEdit = true;
        _this.getQuestionType();
        if(_this.data){
            let questionId = _this.data;
            _this.getQuestionDetailsById(questionId);
        }
    }else{
        _this.isAdd = true;
        _this.showText = true
        _this.getQuestionType();
    }
    
    _this.isQuestionImageFileAdded = false;
    _this.$rootScope.settingsImagePath = '';
  }
  
  getCompanyList(){
        let onSuccess = (response) => {
            _this.companyList = response.data;
            _this.id = _this.companyList[0].id;
          },
          onError = (error) => {
            console.log(error);
          }
        _this.SuperAdminService.getCompanyList();
        _this.SuperAdminService.activePromise.then(onSuccess, onError);
      }


  getDepartment(){
        let onSuccess = (response) => {
            _this.departmentList = response.data.data;
            for(let i = 0; _this.departmentList.length > i; i++){
                if(_this.departmentList[i].name === 'Any Other'){
                    _this.departmentList.splice(i, 1);
                }
            }
          },
          onError = (error) => {
            console.log(error);
          };
        _this.AdminDepartmentService.getDepartment();
        _this.AdminDepartmentService.activePromise.then(onSuccess, onError);
    }
  
  getSkillSet(departmentId){
      if(angular.isDefined(departmentId) && departmentId !== null && departmentId !== ''){
          //_this.skillId = skillsetId;
          //_this.practiceQuestionTableParams.skillId = skillsetId;
          let onSuccess = (response) => {
                  _this.skillsetList = response.data;
              },
              onError = (error) => {
                  console.log(error);
              };
          _this.CandidateProfileService.getSkillSet(departmentId);
          _this.CandidateProfileService.activePromise.then(onSuccess, onError);
          _this.skillsetId ='';
      }
   }
  
  getQuestionType(){
        let onSuccess = (response) => {
            _this.questionTypeList = response.data;       
          },
          onError = (error) => {
            console.log(error);
          };
        _this.CustomQuestionService.getQuestionType();
        _this.CustomQuestionService.activePromise.then(onSuccess, onError);
   }
   
  questionTypeChanged(){
     _this.selectedQuestionType && _this.selectedQuestionType === 4 ? _this.showMCQ = true : _this.showMCQ = false;
     _this.selectedQuestionType && _this.selectedQuestionType === 5 ? _this.showAudio = true : _this.showAudio = false;
     _this.selectedQuestionType && _this.selectedQuestionType === 6 ? _this.showImage = true : _this.showImage = false;
     _this.selectedQuestionType && _this.selectedQuestionType === 2 ? _this.showText = true : _this.showText = false;
     _this.selectedQuestionType && _this.selectedQuestionType === 3 ? _this.showMSQ = true : _this.showMSQ = false;
     _this.selectedQuestionType && _this.selectedQuestionType === 1 ? _this.showVideo = true : _this.showVideo = false;

    if(this.selectedQuestionType && this.selectedQuestionType === 4){
      _this.responseTypeList = [{"id": 4,"responseType": "MCQ"}];
    }else if(this.selectedQuestionType && this.selectedQuestionType === 3){
      _this.responseTypeList = [{"id": 3,"responseType": "MSQ"}];
    }else if(this.selectedQuestionType && this.selectedQuestionType === 2){
      _this.responseTypeList = [  {"id": 5,"responseType": "AUDIO"},
        {"id": 1,"responseType": "VIDEO"},
        {"id": 2,"responseType": "TEXT"}
      ];
    }else if(this.selectedQuestionType && (this.selectedQuestionType === 1 || this.selectedQuestionType === 5)){
      _this.responseTypeList = [
        {"id": 5,"responseType": "AUDIO"},
        {"id": 1,"responseType": "VIDEO"},
        {"id": 2,"responseType": "TEXT"}
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
        { if((_this.selectedQuestionType == 1 || _this.selectedQuestionType == 5) && !(_this.recordedBlob instanceof Blob) ){
                  return false;
                 }
            if((_this.selectedQuestionType == 3 || _this.selectedQuestionType == 4) && (_this.option1 == '' || _this.option2 == '' || _this.option3 == '' || _this.option4 == '' ||  _this.isAnswerChecked == false)){
                _this.clientForm.$setSubmitted();
                return false;  }
            return true;
        }else
        {
            _this.clientForm.$setSubmitted();
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
          _this.showSelectedQuestions = true;
          _this.close();
          let customCompanyId = 1;
          if (_this.id != "" && _this.id != "questionPopModal") {
              customCompanyId = _this.id;
          }
          let newQuestionData = {
              "questionTypeId": _this.selectedQuestionType,
              "question": _this.enteredQuestion,
              "companyId": customCompanyId,
              "statusId": 1,
              "questionLevel": "medium",
              "thinkTimeSec": 10,
              "responseTimeSec": 20,
              "skillsetId": _this.skillsetId,
              "departmentId": _this.departmentId,
              "responseTypeId": _this.selectedResponseType,
              "filePath": _this.recordedBlob,
              "imagePath" : _this.$rootScope.settingsImagePath,
              "options": [
                  {"option": _this.option1, "isCorrect": (_this.answerOption1 == 2 || _this.answerOption1) ? 1 : 0},
                  {"option": _this.option2, "isCorrect": (_this.answerOption2 == 3 || _this.answerOption2) ? 1 : 0},
                  {"option": _this.option3, "isCorrect": (_this.answerOption3 == 4 || _this.answerOption3) ? 1 : 0},
                  {"option": _this.option4, "isCorrect": (_this.answerOption4 == 5 || _this.answerOption4) ? 1 : 0}
              ]
          };

          if (newQuestionData) {
              _this.LoaderService.show();
              _this.CustomQuestionService.saveNewCustomeQuesstion(newQuestionData).then((response) => {
                  if (response.status && response.status === 200 && response.statusText && response.statusText.indexOf('OK') > -1) {
                      _this.GrowlerService.growl({
                          type: 'success',
                          message: "Question Added Successfully",
                          delay: 500
                      });
                      _this.close();
                      _this.LoaderService.hide();
                  }
              }, (error) => {
                  _this.LoaderService.hide();
              });
          }
      }
  },500);
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
      let blob = new Blob(_this.chunks, { type: "video/webm" });
      _this.chunks = [];
      _this.recordedBlob = blob;
      let videoURL = window.URL.createObjectURL(blob);
      _this.videoElement.src = videoURL;
      
    };
  }

  startAudioRecording(stream){
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
      let blob = new Blob(_this.chunks, {type : "audio/ogg"});
      _this.chunks = [];
      _this.recordedBlob = blob;
      let audioURL = window.URL.createObjectURL(blob);
      _this.audioElement.src = audioURL;

    };
  }

  onStopAudio(){
        if(angular.isDefined(_this.mediaRecorder) && _this.mediaRecorder
                && angular.isDefined(_this.mediaRecorder.state) 
                && _this.mediaRecorder.state !== 'inactive'){
              console.log('stop clicked');
            _this.mediaRecorder.stop();
            console.log("On Stop Click------------->"+_this.localStream);  
        _this.localStream.getTracks().forEach(function (track) {
                track.stop();
            });
            _this.audioElement.controls = true;
            clearInterval(_this.timer);
        }    
  }

  onStopClick() {
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
    }    
  }

  onRecordClick(type) {
    _this.countdownStarted = true;
    _this.recordingOn = false;
    _this.$timeout(() => {
        _this.countdownStarted = false;
        _this.recordingOn = true;
        if(type === 'video'){
          navigator.getUserMedia(_this.constraints, _this.startRecording.bind(this), _this.errorCallback.bind(this));
        }else{
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

            videoElement.play();
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
  
  getQuestionDetailsById(questionId){

        let onSuccess = (response) => {
                _this.selectedQuestionType =  response.data.questionTypeId;
                _this.questionTypeChanged();
                _this.enteredQuestion =  response.data.question;
                _this.id =  response.data.companyId;
                _this.statusId =  response.data.statusId;
                _this.questionLevel =  response.data.questionLevel;
                _this.thinkTimeSec =  response.data.thinkTimeSec;
                _this.responseTimeSec =  response.data.responseTimeSec;
                _this.departmentId = response.data.departmentId;
                _this.getSkillSet(response.data.departmentId);
                _this.skillsetId = response.data.skillsetId;
                _this.selectedResponseType = response.data.responseTypeId;
                $('select[name^="skillset"] option[value = '+ _this.skillsetId + ']').attr("selected","selected");
                _this.questionId = questionId;
                _this.responseTypeId =  response.data.responseTypeId;
                _this.filePath =  response.data.filePath;
                _this.fileType =  response.data.fileType;
                _this.questionTypeName = response.data.questionTypeName;
                _this.departmentName = response.data.departmentName;
                _this.skillsetName = response.data.skillsetName;

                if(_this.selectedQuestionType == 4 || _this.selectedQuestionType == 3){
                  _this.option1 = response.data.options[0].option;
                  _this.option2 = response.data.options[1].option;
                 _this.option3 = response.data.options[2].option;
                 _this.option4 = response.data.options[3].option;
                if(_this.selectedQuestionType == 4){
                    _this.answerOption1 = response.data.options[0].isCorrect == 1 ? 2: 0;
                    _this.answerOption2 = response.data.options[1].isCorrect == 1 ? 3: 0;
                    _this.answerOption3 = response.data.options[2].isCorrect == 1 ? 4: 0;
                    _this.answerOption4 = response.data.options[3].isCorrect == 1 ? 5: 0;
                }else if(_this.selectedQuestionType == 3){
                    _this.answerOption1 = response.data.options[0].isCorrect == 1 ? true: false;
                    _this.answerOption2 = response.data.options[1].isCorrect == 1 ? true: false;
                    _this.answerOption3 = response.data.options[2].isCorrect == 1 ? true: false;
                    _this.answerOption4 = response.data.options[3].isCorrect == 1 ? true: false;
                }
                }

            },
            onError = (error) => {
            };

        _this.CustomQuestionService.getQuestionDetailsById(questionId);
        _this.CustomQuestionService.activePromise.then(onSuccess, onError);
    }

  updateCustomQuestion() {

          let onSuccess = (response) => {
                  _this.onClose();
                  _this.GrowlerService.growl({
                      type: 'success',
                      message: 'Question Updated Successfully',
                      delay: 2000
                  });
                  _this.close();
              },
              onError = (error) => {
                  
              };
              let customQuestionData = {
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
                  options: [
                      {"option": _this.option1, "isCorrect": (_this.answerOption1 == 2 || _this.answerOption1) ? 1 : 0},
                      {"option": _this.option2, "isCorrect": (_this.answerOption2 == 3 || _this.answerOption2) ? 1 : 0},
                      {"option": _this.option3, "isCorrect": (_this.answerOption3 == 4 || _this.answerOption3) ? 1 : 0},
                      {"option": _this.option4, "isCorrect": (_this.answerOption4 == 5 || _this.answerOption4) ? 1 : 0}
                  ]
              };
        if((_this.option1 !== '' && _this.option1 !== undefined) && 
                (_this.option2 !== '' && _this.option2 !== undefined) &&
                (_this.option3 !== '' && _this.option3 !== undefined) && 
                (_this.option4 !== '' &&  _this.option4 !== undefined))
        {
          _this.CustomQuestionService.updateCustomQuestion(customQuestionData);
          _this.CustomQuestionService.activePromise.then(onSuccess, onError);
        }
        else{
            _this.GrowlerService.growl({
                type: 'danger',
                message: 'Please fill all required fields',
                delay: 1000
            });
        }
      }
  
    
    optionsChanged(val){
      //window.alert('click');
      _this.answerOption1 = 0;
      _this.answerOption2 = 0;
      _this.answerOption3 = 0;
      _this.answerOption4 = 0;
      if(val == 2){
          _this.answerOption1 = 2;
      }else if(val == 3){
          _this.answerOption2 = 3;
      }else if(val == 4){
          _this.answerOption3 = 4;
      }else if(val == 5){
          _this.answerOption4 = 5;
      }
  }
    
  setChecked(inputArray, questionType){
        for(var i = 0; inputArray.length > i; i++){
           let element = questionType === "MCQ" ? "rb" : "cb";
           let index = i+1;
           $("#"+element+"Option"+index).prop('checked', inputArray[i].isCorrect);
        }        
    }
    
    cameraOffButton(){
    let noData = _.isEmpty(_this.localStream);    
    if(!noData){
      _this.localStream.getTracks().forEach(function (track) {
          track.stop();
       });
    }
    _this.close();
  }
  
  isFileAdded(file){
    if(angular.isDefined(file) && file.length>0){
      /* var fr = new FileReader();
       fr.onload = function () {
          _this.imagePath = fr.result;
       }
       fr.readAsDataURL(file[0]);
       _this.isQuestionImageFileAdded =! _this.isQuestionImageFileAdded;
    }*/
        _this.fileNotSelected = true;
        }
        else{
          _this.fileNotSelected = false;
        }
    
  }
  
     uploadImage(file) {
         _this.$rootScope.settingsImagePath = URL.createObjectURL(file[0]);
         _this.isQuestionImageFileAdded =! _this.isQuestionImageFileAdded;
    }
  
    removeImage(){
      _this.$rootScope.settingsImagePath = "";
      _this.isQuestionImageFileAdded =! _this.isQuestionImageFileAdded;
    }

}
