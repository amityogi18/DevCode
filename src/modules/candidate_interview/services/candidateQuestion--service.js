let _this,
    _activePromise,
    _errorTranslationKey,
    _questions,
    _videoUrl;

export class candidateQuestionService {
	/** @ngInject  */
  constructor($http, Upload, $state, UtilsService, AuthService, APP_CONSTANTS) {
    _this = this;
    _this.$http = $http;
    _this.Upload = Upload;
    _this.$state = $state;
    _this.UtilsService = UtilsService;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.AuthService = AuthService;

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

  get questions() {
    return _questions;
  }

  set questions(value) {
    _questions = value;
  }
  
  get videoUrl(){
      return _videoUrl;
  }

  saveAndGetNextQuestion(answerData, responseType){
    answerData.candidateId = _this.AuthService.user.userId;
    let config  = _this.UtilsService.postCofigObj();
    if(angular.isDefined(responseType) && responseType === 1){
     _activePromise = _this.Upload.upload({
                           url: _this.APP_CONSTANTS.SERVER_URL +'/candidate-view/interview/question/answer',
                           data: answerData,
                           headers: config.headers
                       });
    }
    else if(angular.isDefined(responseType) && responseType === 5){
         _activePromise = _this.Upload.upload({
                               url: _this.APP_CONSTANTS.SERVER_URL +'/candidate-view/interview/question/answer',
                               data: answerData,
                               headers: config.headers
                           });
    } else{
       _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL +'/candidate-view/interview/question/answer', answerData, config);
    }
  }
  
  getVideo(url){
     var onSuccess = (response) => {
        _videoUrl = response.data.videoPath;
        _activePromise = null;
      },
      onError = (error) => {
        if (error.status === 409) {
          _errorTranslationKey = error.data.errorCode;
        }
        _activePromise = null;
      };
     
    _activePromise = _this.$http.get(url);
    _activePromise.then(onSuccess, onError); 
  }
}

