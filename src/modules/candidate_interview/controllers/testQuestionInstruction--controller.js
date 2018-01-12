let _this;
export class TestQuestionInstructionController {
	/** @ngInject  */
  constructor($state, $window, $location, PracticeTestQuestionService, CandidateProfileService) {
    _this = this;
    _this.$state =  $state;
    _this.$window = $window;
    _this.$location = $location;
    _this.PracticeTestQuestionService = PracticeTestQuestionService;
    _this.CandidateProfileService = CandidateProfileService;
    _this.ActiveProfileAndSkill = [];
    _this.getActiveProfileAndSkill();
    console.log('TestQuestionInstruction Controller Loaded!');
  }
  
  getActiveProfileAndSkill(){
      let onSuccess = (response) => {
          _this.ActiveProfileAndSkill = response.data;
          //_this.getPracticeVideoQuestion();
        },
        onError = (error) => {
          console.log(error);
        }
      _this.CandidateProfileService.getActiveProfileAndSkill();
      _this.CandidateProfileService.activePromise.then(onSuccess, onError);
  }

  startTest(){
        _this.$state.go('ci.practice-test-question', {skillsetId : _this.ActiveProfileAndSkill.skillsetId});
  }

}


