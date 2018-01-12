let _this;

export class AdminConfirmationController {
	/** @ngInject  */
    constructor(AdminPaymentPlanService, $stateParams, $state, GrowlerService, LoaderService, AuthService, $window) {
      _this = this;
      _this.$stateParams = $stateParams;
      _this.$state = $state;
      _this.$window = $window;
      _this.LoaderService = LoaderService;
      _this.AuthService = AuthService;
      _this.AdminPaymentPlanService = AdminPaymentPlanService;
      _this.GrowlerService = GrowlerService;
      _this.planId = _this.$stateParams.planId;  
      _this.fetchPlanDetails(_this.planId);
      _this.showRenewalWarning = false;
    }
    
    backToAdminPayment(){
        if(_this.$state.current && _this.$state.current.name){
            let currentState = _this.$state.current.name;
              if(currentState.indexOf('conference.') >= 0){
                  _this.$state.go('conference.admin-payment-plan');
             }else if(currentState.indexOf('app.') >= 0 || currentState.indexOf('settings.') >= 0){
                  _this.$state.go('settings.admin-payment-plan');
             }          
          
        }
    }
  
    fetchPlanDetails(planId) {

      let onSuccess = (response) => {
          console.log(response.data);
          _this.plans = response.data || {};
          if(_this.plans && _this.plans.currentCompanyPlanStatus){
              _this.showRenewalWarning = true;
          }
           
        },
        onError = (error) => {
          console.log(error);
          //_this.$state.go('settings.admin-payment-plan');
            if(_this.$state.current && _this.$state.current.name){
              let currentState = _this.$state.current.name;
                if(currentState.indexOf('conference.') >= 0){
                      _this.$state.go('conference.admin-payment-plan');
                 }else if(currentState.indexOf('app.') >= 0 || currentState.indexOf('settings.') >= 0){
                      _this.$state.go('settings.admin-payment-plan');
                 }          

            }
        };
      _this.AdminPaymentPlanService.getPlanDetails(planId);
      _this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);
    }
    
    getTrial(planId){
        let data = {
            planId : planId,
            userId : 1
        };
        let onPromise = () => {
            _this.LoaderService.hide();
            //_this.$state.go('settings.admin-plan');
            if(_this.$state.current && _this.$state.current.name){
              let currentState = _this.$state.current.name;
                if(currentState.indexOf('conference.') >= 0){
                      _this.$state.go('conference.admin-plan');
                 }else if(currentState.indexOf('app.') >= 0 || currentState.indexOf('settings.') >= 0){
                      _this.$state.go('settings.admin-plan');
                 }          

            }
        };
        let onSuccess = (response) => {
           console.log(response.data);
            _this.GrowlerService.growl({
              type: 'success',
              message: 'Plan activated successfully',
              delay: 3000
            });
            let refreshTokenPromise = _this.AuthService.refreshToken(true);
            if(refreshTokenPromise) {
                _this.LoaderService.show();
                refreshTokenPromise['finally'](onPromise);
            }
         },
         onError = (error) => {
           console.log(error);
         };
       _this.AdminPaymentPlanService.getTrial(data);
       _this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);
    }
    
    getCardDetail(){
    let onSuccess = (response) => {
          _this.cardDetails = response.data;          
        },                
        onError = (error)=>{
          _this.cardDetails = [];
        };

      _this.AdminPaymentPlanService.getOwnerInfo();
      _this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);
  }
  
    goToPayment() {
        if (angular.isDefined(_this.cardDetails) && !_this.cardDetails.status) {
            //_this.$state.go('settings.admin-payment', {planId: _this.planId, type: "product"});
            if(_this.$state.current && _this.$state.current.name){
              let currentState = _this.$state.current.name;
                if(currentState.indexOf('conference.') >= 0){
                      _this.$state.go('conference.admin-payment', {planId: _this.planId, type: "product"});
                 }else if(currentState.indexOf('app.') >= 0 || currentState.indexOf('settings.') >= 0){
                      _this.$state.go('settings.admin-payment', {planId: _this.planId, type: "product"});
                 }          

            }
        } else
        {
            _this.paymentCallback(_this.cardDetails.threeDsecure);
        }
        $("body").removeClass("modal-open");
    }
    
    updateCardDetails() {
        //_this.$state.go('settings.admin-payment', {planId: _this.planId, type: "product"}); 
        if(_this.$state.current && _this.$state.current.name){
              let currentState = _this.$state.current.name;
                if(currentState.indexOf('conference.') >= 0){
                      _this.$state.go('conference.admin-payment', {planId: _this.planId, type: "product"});
                 }else if(currentState.indexOf('app.') >= 0 || currentState.indexOf('settings.') >= 0){
                      _this.$state.go('settings.admin-payment', {planId: _this.planId, type: "product"});
                 }          

            }
        $("body").removeClass("modal-open");
            
    }
  
    paymentIframeCallback(response) {
        
        let windowWidth = _this.$window.innerWidth,
        windowHeight = _this.$window.innerHeight,
        windowStyle = 'width:'+windowWidth+'px;height:'+windowHeight+'px;overflow: hidden;border:0px;position:absolute;top:-65px;left:-133px;z-index:9999;';

        //window.location.replace(response.redirect.url);
        let paymentContainer = document.querySelector('#product-plan-container');
            paymentContainer.style.display ='none';

        var iframe = document.createElement("iframe");
        iframe.src = response.redirect.url;
        iframe.setAttribute('style',windowStyle);
        iframe.className = "secure-iframe";
        $("#payment-product-iframe").append(iframe);
     };
     
  paymentCallback(isThreeD) {
        let product = _this.planId,
            portal = [], 
            candidateId = "",
            type = "product";
        
        let data = {
            "paymentType": type,
            "sourceId": "",
            "portalPlans": portal,
            "productPlan": product,
            "candidateId": candidateId,
            "positionId":"",
            "jobCode":"",
            "cardStatus":"x1ssdf1112dfdf1111df",
            "cardExpMonth":"",
            "cardExpYear":"",
            "cardLast4digit":"",
            "threed_secure":"",
            "owner": {
		"address": {
                    "city": "",
                    "country": "",
                    "line1": "",
                    "line2": "",
                    "postal_code": "",
                    "state": ""
		},
		"email": "",
		"name": "",
		"phone": "",
		"verified_address": null,
		"verified_email": null,
		"verified_name": null,
		"verified_phone": null
            }
        };        
        let onSuccess = (response) => {
            console.log(response.data);
            if(isThreeD === "supported"){
                _this.paymentIframeCallback(response.data);
            }else
            {
                _this.makePayment(response.data);                    
            }
        },
        onError = (error) => {
            console.log(error);
            _this.GrowlerService.growl({
                type: 'danger',
                message: 'Something went wrong, Please try again in sometime. If problem persist please contact customer support.',
                delay: 6000
            });
        };
        if(isThreeD === "supported"){
            _this.AdminPaymentPlanService.getThreeDSecureSource(data);
            _this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);
        }else
        {
            _this.AdminPaymentPlanService.getPaymentObject(data);
            _this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);               
        }
        
    }
    
    makePayment(token) {
        let data = {
            "autoRenew":"1",
            "customerCode":token.customerCode
        };        
        let onSuccess = (response) => {
            console.log(response.data);
            _this.GrowlerService.growl({
                type: 'success',
                message: 'Transaction Successfull !!',
                delay: 3000
            });
        },
        onError = (error) => {
            console.log(error);
            _this.GrowlerService.growl({
                type: 'danger',
                message: 'Something went wrong, Please try again in sometime. If problem persist please contact customer support.',
                delay: 6000
            });
        };
        _this.AdminPaymentPlanService.makePayment(data);
        _this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);
    }
}