let _this;

export class textResponseQuestionController {
    /** @ngInject  */
    constructor($interval, $sce, $window, mediaRecorderService, GrowlerService,UtilsService) {
        _this = this;
        _this.$interval = $interval;
        _this.$sce = $sce;
        _this.$window = $window;
        _this.mediaRecorderService = mediaRecorderService;
        _this.GrowlerService = GrowlerService;
        _this.UtilsService = UtilsService;
        _this.answerGiven = '';
        _this.isShowNext = true;
        _this.screenDetails =  _this.UtilsService.getScreenDetails();
        _this.$onInit = function(){
            _this.question = _this.question;
            _this.answerGiven = '';
        }
        _this.$onChanges = function (changesObj) {
            _this.question = _this.question;
            _this.answerGiven = '';
            _this.isShowNext = false;

            if(_this.question.questionTypeId === 5){
                _this.retryCount = 0;
                _this.changeQuestionFileAudio(_this.question.questionFile);
            }
            else if(_this.question.questionTypeId === 1){
                _this.retryCount = 0;
                _this.changeQuestionFileVideo(_this.question.questionFile);
            }
            if(changesObj.question && (changesObj.question.currentValue !== changesObj.question.previousValue)){

            }
            if(changesObj.isNewQuestion && (changesObj.isNewQuestion.currentValue !== changesObj.isNewQuestion.previousValue)){
            }
        }
    }

    startTimer(){
        _this.timer = _this.$interval(function () {
            if(_this.question.timeLeft > 0){
                _this.question.timeLeft -= 1;
            }
            else{
                _this.$interval.cancel(_this.timer);
                _this.showNext();
            }
        },1000);
    }

    textResponse() {
        _this.question.answer = _this.answerGiven;
    }

    trustSrc(src) {
        return _this.$sce.trustAsResourceUrl(src);
    }

    changeQuestionFileVideo(questionFile){
        _this.UtilsService.initVideoPlayer('questionFileVideo', questionFile);
    }

    changeQuestionFileAudio(questionFile){
        let questionFileAudio = $('#questionFileAudio')[0];
        questionFileAudio.src = questionFile;
        if(questionFileAudio.readyState !== 4){
            questionFileAudio.load();
        }
        questionFileAudio.pause();
        setTimeout(function () {
            questionFileAudio.play();
        }, 150);
    }


}
