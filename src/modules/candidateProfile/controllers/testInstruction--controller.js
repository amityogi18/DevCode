let _this;
const modalCloseSeconds = 5;
export class testInstructionController {
	/** @ngInject  */
  constructor($window, $location, $uibModal, $timeout, $state, $storage) {
    _this = this;
    _this.$window = $window;
    _this.$location = $location;
    _this.focus = false;
    _this.$uibModal = $uibModal;
    _this.$timeout = $timeout;
    _this.$state = $state;
    _this.$storage = $storage;
    _this.interviewId  = _this.$storage.getItem( 'interviewId ') || 1;
    _this.init();
  }

  popupwindow(url, title, width, height, left, top) {
    if(!width){
      width = screen.width;
    }
    if(!height){
      height = (screen.height * 90)/100;
    }
    if(!left){
      left = 0;
    }
    if(!top){
      top = 0;
    }

    return _this.$window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+width+', height='+height+', top='+top+', left='+left);
  }

  subscribePageUnloadHandler() {

  }

  startTest(){
//    if(!window.childWindow) {
//      window.childWindow = _this.popupwindow(_this.$window.location.origin + "/#/assessment", "assessment");
//      window.childWindow.openedFromCandidatePage = true;
//    }
//    else{
//      window.childWindow.focus();
//    }

    _this.$state.go('assessment');
  }

  submit() {
    $(window.childWindow).off('blur');
    _this.assessmentSubmissionHandler();
  }

  closeAssessmentWindow(){
    window.childWindow.close();
    window.childWindow = null;
  }

  assessmentSubmissionHandler(){
    $(window.childWindow).off('beforeunload');
    window.childWindow = null;
    window.location.hash = '/assessment/result';

  }

  init(){
    _this.$window.assessmentSubmissionHandler = _this.assessmentSubmissionHandler;
    _this.$window.closeAssessmentWindow = _this.closeAssessmentWindow;
  }
}


