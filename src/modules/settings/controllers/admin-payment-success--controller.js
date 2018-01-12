let _this;
export class AdminPaymentSuccessController {
    /** @ngInject  */
    constructor(AdminPaymentPlanService, GrowlerService, LoaderService, AuthService, $state, $location) {
        _this = this;
        _this.AdminPaymentPlanService = AdminPaymentPlanService;
        _this.GrowlerService = GrowlerService;
        _this.LoaderService = LoaderService;
        _this.AuthService = AuthService;
        _this.$state = $state;
        _this.$location = $location;
        _this.getStatus();
    }
    
    inIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    getStatus() {
        //let redirect = window.location.href;// document.getElementById("payment-iframe").contentWindow.location.href;
        //let params = _this.checkParams(redirect);
        
        let params = _this.$location.$$search;
        console.log(params);
        _this.paymentCallback(params, params.paymentType, params.data);
    };
    
    checkParams(query) {
        if (!query) {
            return {};
        }
        query.replace("?", "&");
        return (/^[?#]/.test(query) ? query.slice(1) : query)
                .split('&')
                .reduce((params, param) => {
                    let [key, value] = param.split('=');
                    params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
                    return params;
                }, {});
    };
    
    paymentCallback(token, type, dataId) {
        let product = "", portal = [], candidateId = "", url="";
        let data = { 
            "autoRenew":"0",
            "customerCode":token.customerCode 
        };
        let onPromise = () => {            
           // _this.LoaderService.hide();
           
            if (type === "portal") {
                url = location.origin+"/position/advertise/"+dataId;
                window.top.location.href = url;
                //_this.$state.go('app.advertise({positionId:planId})');
            } else if (type === "product") {
                let currentState = _this.$state.current.name;
                if(currentState.indexOf('conference.') >= 0){
                     url = location.origin+"/conference/admin-plan-settings";
                }else{
                    url = location.origin+"/settings/admin-plan";
                }                
                window.top.location.href = url;
                //_this.$state.go('settings.admin-plan');
            } else if (type === "candidate") {
                url = location.origin+"/candidate-profile/"+dataId;
                window.top.location.href = url;
                //_this.$state.go('app.candidate-profile({candidateId:planId})');
            }else if (type === "paymentBycandidate") {
                url = location.origin+"/job-openings/"+dataId;
                window.top.location.href = url;
            }else if (type === "paymentByPublicCandidate") {
                url = location.origin+"/public/applied-job-description/"+dataId;
                window.top.location.href = url;
            }
            document.getElementById("payment-iframe").remove();
        };
        let onSuccess = (response) => {
            window.localStorage.setItem('paymentResponse', JSON.stringify(response));
            console.log(response.data);
            _this.GrowlerService.growl({
                type: 'success',
                message: 'Transaction Successfull !!!',
                delay: 3000
            });
             
            let refreshTokenPromise = _this.AuthService.refreshToken(true);
            if (refreshTokenPromise) {
                //_this.LoaderService.show();
                refreshTokenPromise['finally'](onPromise);
            }
        },
        onError = (error) => {
            console.log(error);
            if (type === "portal") {
                url = location.origin+"/position/advertise/"+dataId+"?e="+error.data;
                window.top.location.href = url;
                //_this.$state.go('app.advertise({positionId:planId})');
            } else if (type === "product") {
                let currentState = _this.$state.current.name;
                if(currentState.indexOf('conference.') >= 0){
                     url = location.origin+"/conference/admin-plan-settings?e="+error.data;
                }else{
                    url = location.origin+"/settings/admin-plan?e="+error.data;
                } 
                window.top.location.href = url;
                //_this.$state.go('settings.admin-plan');
            } else if (type === "candidate") {
                url = location.origin+"/candidate-profile/"+dataId+"?e="+error.data;
                window.top.location.href = url;
                //_this.$state.go('app.candidate-profile({candidateId:planId})');
            }else if (type === "paymentBycandidate") {
                url = location.origin+"/job-openings/"+dataId+"?e="+error.data;
                window.top.location.href = url;
            }else if (type === "paymentByPublicCandidate") {
                url = location.origin+"/public/applied-job-description/"+dataId+"?e="+JSON.stringify(error.data);
                window.top.location.href = url;
            }
            document.getElementById("payment-iframe").remove();
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