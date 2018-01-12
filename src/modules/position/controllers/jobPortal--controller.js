var _this;
export class JobPortalController {
    /** @ngInject  */
    constructor($timeout, $scope, GrowlerService, $stateParams, $location, InterviewService,positionService, AdminPaymentPlanService, $state, $rootScope, $window) {
        _this = this;       
        _this.$scope = $scope; 
        _this.$stateParams = $stateParams;
        _this.$location = $location;
        _this.$state = $state;
        _this.$timeout = $timeout;
        _this.$window = $window;
        _this.InterviewService = InterviewService;
        _this.GrowlerService = GrowlerService;
        _this.positionService = positionService;
        _this.AdminPaymentPlanService = AdminPaymentPlanService;
        _this.positionId = "";
        _this.cart = [];
        _this.portalList = [];
        _this.portalId = "";
        _this.cartItems = [];
        _this.cartId = "";
        _this.subTotal = 0;
        _this.totalCount = 0;
        _this.showPositionCount = true;
        _this.isPaymentError = false;
        _this.paymentError = "";
        _this.currentNavItem = {
           "current" : "advertise",
           "prev":'app.application({positionId: '+_this.$stateParams.positionId+'})',
           "next":'app.applied({positionId: '+_this.$stateParams.positionId+'})'
         };
        _this.onLoad();        
        _this.jobPortal();
        _this.cardDetails = {};
        _this.getCardDetail();
        _this.checkedPortal = {};
        _this.isChecked = {};
        _this.$rootScope = $rootScope;
        _this.planId = [];
         _this.addPortalToList = function(product, state){
            _this.isChecked[product.portalId].isSelected = state;
             if(state) {
                 _this.checkedPortal[product.portalId] = product.portalId;
             } else {
                 delete _this.checkedPortal[product.portalId];
             }
        };
            //Object.values(_this.checkedPortal);
         _this.$rootScope.$on('planByModal',function(event, data){
             _this.updateList(data.planSelected, data.portalSelected);
         });

        _this.$scope.$on("saveData", function(event, data){
            if(data ==='app.advertise') {
               _this.postJobs();   
            }    
        });  
    }
    
    onLoad() {
        let url = _this.$location.path();
        if (url === "/position/add/new") {
            
        } else {
            _this.positionId = _this.$stateParams.positionId || 1;
            _this.fetchPositionCount(_this.positionId);
        }
        
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
   
    fetchPositionCount(positionId) {
        _this.PositionCount = {};
        let onSuccess = (response) => {
            _this.PositionCount = response.data;
        },
        onError = (error) => {
            console.log(error);
        };
        _this.positionService.getPositionCount(positionId);
        _this.positionService.activePromise.then(onSuccess, onError);
    };
    
    saveData(mode){
        _this.postJobs(mode);
    }  
    
    jobPortal() {
        let onSuccess = (response) => {
            _this.portalList = response.data;
            //_this.getCartItem();
        },
                onError = (error) => {
            console.log(error);
        };
        _this.InterviewService.jobPortals(_this.positionId);
        _this.InterviewService.activePromise.then(onSuccess, onError);
    }

    updateList(selectedPlan, portalId) {
        for (var i = 0; i < _this.portalList.length; i++) {
            if (portalId == _this.portalList[i].portalId) {
                _this.portalList[i].price = selectedPlan.planAmount;
                _this.portalList[i].planName = selectedPlan.plansName;
                _this.portalList[i].portalPlanId = selectedPlan.portalPlanId;
                _this.portalList[i].noOfPost = selectedPlan.noOfPost;
                _this.addItemToCart(_this.portalList[i]);
                break;
            }
        }
    }

    addItemToCart(product) {
        let subTotal = 0;
       if (_this.cart.length === 0) {
            _this.cart.push(product);
            _this.totalCount = 1;
            _this.subTotal = parseFloat(_this.cart[0].price);
            _this.portalId = product.portalId;
            _this.planId.push(product.portalPlanId);

        } else {
            let newData = true;
           _this.subTotal = 0;
            for(let cart=0;cart<_this.cart.length;cart++) {
                _this.subTotal += parseFloat(_this.cart[cart].price);
                if(_this.cart[cart].portalId == product.portalId) {
                    newData = false;
                    _this.planId.splice(cart, 1, product.portalPlanId);
                    _this.cart.splice(cart, 1, product);
                }
            }
            if (newData) {
                _this.cart.push(product);
                _this.planId.push(product.portalPlanId);
                _this.totalCount += 1;
                _this.subTotal += parseFloat(product.price);
                _this.portalId = product.portalId;
            } else {
                _this.GrowlerService.growl({
                    type: 'success',
                    message: "Selected Portal Is Already Added To The Cart.",
                    delay: 500
                });
                return false;
            }
        }
        let payload = {
            'portalId': _this.portalId
        };
        _this.InterviewService.addCartPortal(payload);

    }
    getCardDetail() {
        _this.newCard = false;
        let onSuccess = (response) => {
            _this.cardDetails = response.data; 
            if(!_this.cardDetails.status) {
               _this.newCard = true;
            }
          },
          onError = (error)=>{
            _this.cardDetails = {};
          };

        _this.InterviewService.getCompanyDetails();
        _this.InterviewService.activePromise.then(onSuccess, onError);
    }
      
    goToPayment() {
        _this.cart = [];
        if(angular.isDefined(_this.cardDetails) && !_this.cardDetails.status){
                _this.$state.go('settings.admin-portal-payment',{planId: _this.planId, type: "portal", positionId: _this.positionId});
        }else
        {
            _this.paymentCallback(_this.cardDetails.threeDsecure);
        }
        $("body").removeClass("modal-open");
    }
    
    updateCardDetails() {
        _this.$state.go('settings.admin-portal-payment',{planId: _this.planId, type: "portal", positionId: _this.positionId});   
        $("body").removeClass("modal-open");
    }
    
    paymentIframeCallback(response) {        
        let windowWidth = _this.$window.innerWidth,
        windowHeight = _this.$window.innerHeight,
        windowStyle = 'width:'+windowWidth+'px;height:'+windowHeight+'px;overflow: hidden;border:0px;position:absolute;top:-65px;left:-133px;z-index:9999;';

        //window.location.replace(response.redirect.url);
        let paymentContainer = document.querySelector('#job-portal-container');
            paymentContainer.style.display ='none';

        var iframe = document.createElement("iframe");
        iframe.src = response.redirect.url;
        iframe.setAttribute('style',windowStyle);
        iframe.className = "secure-iframe";
        $("#payment-portal-iframe").append(iframe);
     };
     
    paymentCallback(isThreeD) {
        let product = "",
            portal = _this.planId, 
            candidateId = "",
            type = "portal",
            position = _this.positionId;
        
        let data = {
            "paymentType": type,
            "sourceId": "",
            "portalPlans": portal,
            "productPlan": product,
            "candidateId": candidateId,
            "positionId": position,
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
        },
        onSuccess = (response) => {
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
        }else{
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
    
    getCartItem() {
        let onSuccess = (response) => {
            let tempCart = response.data;
            _this.cart = [];
            for (var j = 0; j < tempCart.length; j++) {
                for (var i = 0; i < _this.portalList.length; i++) {
                    if (tempCart[j].portalId == _this.portalList[i].portalId) {
                        _this.cart.push(_this.portalList[i]);
                        _this.subTotal += parseFloat(_this.portalList[i].price);
                        _this.planId.push(_this.portalList[i].portalPlanId);
                    }
                }
            }
        },
                onError = (error) => {
            console.log(error);
        };

        _this.InterviewService.getCartItems();
        _this.InterviewService.activePromise.then(onSuccess, onError);
    }

    deletCartPortal(site) {
        if (site) {          
            var index = _this.cart.indexOf(site);
            _this.cart.splice(index, 1);
            _this.subTotal -= parseFloat(site.price);
            _this.planId.splice(_this.planId.indexOf(site.portalPlanId), 1);
        }
        let portalId = site.portalId;
        _this.InterviewService.deletCartPortals(portalId);
    }

    postJobs(mode){
        let portalId = Object.values(_this.checkedPortal);
        let data = {
            "jobId": _this.positionId,
            "portalId": portalId
        };  
        
        let onSuccess = (response) => {
            if (mode === 'ACTIVATE') {
                _this.activatePosition();
            }
            if (mode !== 'ACTIVATE') {
                _this.GrowlerService.growl({
                   type: 'success',
                   message: 'Data Saved Successfully !!',
                   delay: 3000
                });
            }
            _this.$state.go('app.applied', { positionId: _this.positionId });
        },
        onError = (error) => {
            console.log(error);
        };
        
        if(portalId && portalId.length > 0){
            _this.positionService.publishJobs(data);
            _this.positionService.activePromise.then(onSuccess, onError);
        }else{
            if (mode === 'ACTIVATE') {
                _this.activatePosition();
            }
        }        
    }
    
    activatePosition() {
        let onSuccess = (response) => {
            _this.fetchPositionCount(_this.positionId);
            _this.GrowlerService.growl({
                type: 'success',
                message: "Position Activated Successfully",
                delay: 2000
            });
        },
            onError = (error) => {
                console.log(error);
            };
        _this.positionService.activatePosition(_this.positionId);
        _this.positionService.activePromise.then(onSuccess, onError);
    }
};
