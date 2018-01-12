let _this;

export class multipleSelectQuestionController {
	/** @ngInject  */
  constructor($interval) {
    _this = this;
    _this.$interval = $interval;
    _this.options = {};
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


}
