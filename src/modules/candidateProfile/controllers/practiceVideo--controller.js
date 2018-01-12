let _this;
export class PracticeVideoController {
	/** @ngInject  */
  constructor($state, $window, $location, PracticeVideoQuestionService, $storage) {
    _this = this;
    _this.$state =  $state;
    _this.$window = $window;
    _this.$location = $location;
    _this.PracticeVideoQuestionService = PracticeVideoQuestionService;
    _this.$storage = $storage;
  }

  startTest(){
      //_this.$state.go('ci.test-instruction', {skillId : _this.ActiveProfileAndSkill.skillsetId});
      _this.$storage.setItem('oldPage', "cp");
      if(window.mobile){
        _this.$state.go('ci.test-instruction');
      }
      else{
        _this.$window.childWindow = _this.popupwindow(_this.$window.location.origin + "/ci/test-instruction", "Interview");
      }
      
  }

   popupwindow(url, title, width, height, left, top) {
        if(!width){ width = screen.width; }
        if(!height){ height = (screen.height * 90)/100; }
        if(!left){ left = 0; }
        if(!top){ top = 0; }
        return _this.$window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+width+', height='+height+', top='+top+', left='+left);
    }
}




