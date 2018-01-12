let _this;

export class AdminPlanController {
	/** @ngInject  */
    constructor(AdminPaymentPlanService, $state, $location, $timeout) {
      _this = this;
      _this.AdminPaymentPlanService = AdminPaymentPlanService;
      _this.$state = $state;
      _this.$location = $location;
      _this.$timeout = $timeout;
      _this.isPaymentError = false;
      _this.paymentError = "";
      _this.getActivePlans();
      _this.getPlanUsage();
      _this.getPaymentError();
    }
    getPaymentError(){
        let errorParam = _this.$location.$$search;
            if(angular.isDefined(errorParam) && angular.isDefined(errorParam.e)){
                if(errorParam.e !== ""){
                    _this.isPaymentError = true;
                    _this.paymentError = errorParam.e;
                    _this.$timeout(function () {
                        _this.isPaymentError = false;
                        _this.paymentError = "";
                        _this.$location.search('e', null);
                    }, 10000);
                }
            }
    }
    showBrowsingPlan(){
        if(_this.$state.current && _this.$state.current.name){
            let currentState = _this.$state.current.name;
              if(currentState.indexOf('conference.') >= 0){
                  _this.$state.go('conference.admin-payment-plan');
             }else if(currentState.indexOf('app.') >= 0 || currentState.indexOf('settings.') >= 0){
                  _this.$state.go('settings.admin-payment-plan');
             }          
          
        }

    }
    
    getActivePlans(){
        let onSuccess = (response) => {
            _this.dataPlan = response.data || [];
            for(var i=0;i<_this.dataPlan.length;i++){
                if(_this.dataPlan[i].id === 2){
                     _this.conferenceData =_this.dataPlan[i].plans || []; 
                     for(var j=0;j<_this.conferenceData.length;j++){
                         if(_this.conferenceData[j].currentCompanyPlanStatus){
                             _this.confPlanDetails =_this.conferenceData[j];
                         }
                         
                     }
                } 
                if(_this.dataPlan[i].id === 1){
                    _this.interviewData = _this.dataPlan[i].plans || [];
                    for(var j=0;j<_this.interviewData.length;j++){
                        if(_this.interviewData[j].currentCompanyPlanStatus){
                             _this.intPlanDetails =_this.interviewData[j];
                         }
                     }
                }
            }    
          },
          onError = (error) => {
            console.log(error);
          }
        _this.AdminPaymentPlanService.getPlansData();
        _this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);
      
    }
  
    getPlanUsage(){
      let onSuccess = (response) => {
            _this.dataPlanUsage = response.data || [];            
            for(var i=0;i<_this.dataPlanUsage.length;i++){
                if(_this.dataPlanUsage[i].productName === "Conference"){
                     _this.conferenceDataUsage =_this.dataPlanUsage[i];
                     
                } 
                if(_this.dataPlanUsage[i].productName === "Interview"){
                    _this.interviewDataUsage = _this.dataPlanUsage[i];
                }
            }
            
          },
          onError = (error) => {
            console.log(error);
          }
        _this.AdminPaymentPlanService.getPlansDataUsage();
        _this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);
    }  
}
