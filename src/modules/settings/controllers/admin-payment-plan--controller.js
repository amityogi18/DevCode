let _this,
    _activePromise;

export class AdminPaymentPlanController {
	/** @ngInject  */
  constructor(AdminPaymentPlanService, $timeout, $state) {
    _this = this;
    _this.AdminPaymentPlanService = AdminPaymentPlanService;
    _this.$timeout = $timeout;
    _this.$state = $state;
    _this.dataPlan = {};
    _this.conferenceData ={};
    _this.interviewData ={};
    _this.getPlans();
  }
  backToAdminPlan(){
      if(_this.$state.current && _this.$state.current.name){
            let currentState = _this.$state.current.name;
              if(currentState.indexOf('conference.') >= 0){
                  _this.$state.go('conference.admin-plan');
             }else if(currentState.indexOf('app.') >= 0 || currentState.indexOf('settings.') >= 0){
                  _this.$state.go('settings.admin-plan');
             }          
          
        }
  }
  adminConfirmation(planId){
        if(_this.$state.current && _this.$state.current.name){
            let currentState = _this.$state.current.name;
              if(currentState.indexOf('conference.') >= 0){
                  _this.$state.go('conference.admin-confirmation', { planId: planId });
             }else if(currentState.indexOf('app.') >= 0 || currentState.indexOf('settings.') >= 0){
                  _this.$state.go('settings.admin-confirmation', { planId: planId });
             }          
          
        }

    }
  
  getPlans(){
    let onSuccess = (response) => {
        _this.dataPlan = response.data || [];
        console.log(_this.dataPlan);
        for(var i=0;i<_this.dataPlan.length;i++){
            if(_this.dataPlan[i].id === 2){
                 _this.conferenceData =_this.dataPlan[i].plans || []; 
                 console.log(_this.conferenceData);
            } 
            if(_this.dataPlan[i].id === 1){
                _this.interviewData = _this.dataPlan[i].plans || [];
                console.log(_this.interviewData);
            }
        }    
      },
      onError = (error) => {
        console.log(error);
      }
    _this.AdminPaymentPlanService.getPlansData();
    _this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);
    
  }
}