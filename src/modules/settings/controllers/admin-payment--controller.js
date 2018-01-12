let _this;

export class AdminPaymentController {
    /** @ngInject  */
    constructor(AdminPaymentPlanService, $stateParams, $state, GrowlerService, AuthService, LoaderService) {
        _this = this;
        _this.$stateParams = $stateParams;
        _this.AdminPaymentPlanService = AdminPaymentPlanService;
        _this.$state = $state;
        _this.GrowlerService = GrowlerService;
        _this.LoaderService = LoaderService;
        _this.AuthService = AuthService;
        _this.planId = _this.$stateParams.planId;
        _this.positionId = _this.$stateParams.positionId;
        _this.type = _this.$stateParams.type;
        if (_this.AuthService.user && (_this.AuthService.user.userRoles !== 1 && _this.AuthService.user.userRoles !== 5)) {
            _this.$state.go('settings.admin-payment-plan');
        }
        if (!angular.isDefined(_this.planId) || _this.planId === "" || _this.planId === null
            || !angular.isDefined(_this.type) || _this.type === "" || _this.type === null) {
            if (_this.planId.length > 1 && _this.type === "portal") {
                return false;
            } else {
                _this.$state.go('settings.admin-payment-plan');
            }
        }
    }

    threeDCallback(token, type) {
        let product = "", portal = [], candidateId = "", positionId = "", candidateJobId = "";
        if (_this.type === "portal") {
            portal = _this.planId;
            positionId = _this.positionId;
        } else if (_this.type === "product") {
            product = _this.planId;
        } else if (_this.type === "candidate") {
            candidateId = _this.planId;
        } else if (_this.type === "paymentBycandidate") {
            candidateId = _this.AuthService.user.userId;
            candidateJobId = _this.planId;
        } else if (_this.type === "paymentByPublicCandidate") {
            candidateId = _this.AuthService.user.userId;
            candidateJobId = _this.planId;
        }
        var stripe3DSecureObj = {
            "paymentType": _this.type,
            "sourceId": token.id,
            "portalPlans": portal,
            "productPlan": product,
            "candidateId": candidateId,
            "positionId": positionId,
            "cardStatus": "x1ssdf1112nnnnnnnnnn",
            "cardExpMonth": token.card.exp_month,
            "cardExpYear": token.card.exp_year,
            "cardLast4digit": token.card.last4,
            "threed_secure": token.card.three_d_secure,
            "owner": token.owner,
            "jobCode": candidateJobId
        };
        let onSuccess = (response) => {
            console.log(response.data);
            // return response.data;
        },
            onError = (error) => {
                console.log(error);
            };
        return _this.AdminPaymentPlanService.getThreeDSecureSource(stripe3DSecureObj);
        //return _this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);

    }

    paymentCallback(token) {
        let product = "", portal = [], candidateId = "", positionId = "", candidateJobId = "";
        if (_this.type === "portal") {
            portal = _this.planId;
            positionId = _this.positionId;
        } else if (_this.type === "product") {
            product = _this.planId;
        } else if (_this.type === "candidate") {
            candidateId = _this.planId;
        } else if (_this.type === "paymentBycandidate") {
            candidateId = _this.AuthService.user.userId,
                candidateJobId = _this.planId;
        } else if (_this.type === "paymentByPublicCandidate") {
            candidateId = _this.AuthService.user.userId,
                candidateJobId = _this.planId;
        }
        let data = {
            "paymentType": _this.type,
            "sourceId": token.id,
            "portalPlans": portal,
            "productPlan": product,
            "candidateId": candidateId,
            "cardStatus": "x1ssdf1112nnnnnnnnnn",
            "positionId": positionId,
            "cardExpMonth": token.card.exp_month,
            "cardExpYear": token.card.exp_year,
            "cardLast4digit": token.card.last4,
            "threed_secure": token.card.three_d_secure,
            "owner": token.owner,
            "jobCode": candidateJobId
        };

        let onSuccess = (response) => {
            console.log(response.data);
            _this.makePayment(response.data);
        },
            onError = (error) => {
                console.log(error);
                if (_this.type === "portal") {
                    _this.$state.go('app.advertise', { positionId: _this.positionId, e:error.data });
                } else if (_this.type === "product") {
                    let currentState = _this.$state.current.name;
                    if(currentState.indexOf('conference.') >= 0){
                        _this.$state.go('conference.admin-plan',{e:error.data});
                   }else{
                       _this.$state.go('settings.admin-plan',{e:error.data});
                   }                    
                } else if (_this.type === "candidate") {
                    _this.$state.go('app.candidate-profile',{candidateId:_this.planId, e:error.data});
                } else if (_this.type === "paymentBycandidate") {
                    _this.$state.go('candidateProfile.job-openings',{jobId:_this.planId, e:error.data});
                } else if (_this.type === "paymentByPublicCandidate") {
                    _this.$state.go('public.applied-job-description',{jobId:_this.planId, e:error.data});
                }
                _this.GrowlerService.growl({
                    type: 'danger',
                    message: 'Something went wrong, Please try again in sometime. If problem persist please contact customer support.',
                    delay: 6000
                });
            };
        _this.AdminPaymentPlanService.getPaymentObject(data);
        _this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);
    }

    makePayment(token) {
        let data = {
            "autoRenew": "1",
            "customerCode": token.customerCode
        };
        let onPromise = () => {
            _this.LoaderService.hide();
            if (_this.type === "portal") {
                _this.$state.go('app.advertise({positionId:_this.positionId})');
            } else if (_this.type === "product") {
                let currentState = _this.$state.current.name;
                    if(currentState.indexOf('conference.') >= 0){
                        _this.$state.go('conference.admin-plan');
                   }else{
                       _this.$state.go('settings.admin-plan');
                   } 
                _this.$state.go('settings.admin-plan');
            } else if (_this.type === "candidate") {
                _this.$state.go('app.candidate-profile',{candidateId:_this.planId});
            } else if (_this.type === "paymentBycandidate") {
                _this.$state.go('candidateProfile.job-openings',{jobId:_this.planId});
            } else if (_this.type === "paymentByPublicCandidate") {
                _this.$state.go('public.applied-job-description',{jobId:_this.planId});
            }
        };
        let onSuccess = (response) => {
            console.log(response.data);
            window.localStorage.setItem('paymentResponse', JSON.stringify(response.data));
            _this.GrowlerService.growl({
                type: 'success',
                message: 'Transaction Successfull !!',
                delay: 3000
            });

            let refreshTokenPromise = _this.AuthService.refreshToken(true);
            if (refreshTokenPromise) {
                _this.LoaderService.show();
                refreshTokenPromise['finally'](onPromise);
            }
        },
            onError = (error) => {
                console.log(error);
                if (_this.type === "portal") {
                    _this.$state.go('app.advertise', { positionId: _this.positionId, e:error.data });
                } else if (_this.type === "product") {
                    let currentState = _this.$state.current.name;
                    if(currentState.indexOf('conference.') >= 0){
                        _this.$state.go('conference.admin-plan',{e:error.data});
                   }else{
                       _this.$state.go('settings.admin-plan',{e:error.data});
                   }                    
                } else if (_this.type === "candidate") {
                    _this.$state.go('app.candidate-profile',{candidateId:_this.planId, e:error.data});
                } else if (_this.type === "paymentBycandidate") {
                    _this.$state.go('candidateProfile.job-openings',{jobId:_this.planId, e:error.data});
                } else if (_this.type === "paymentByPublicCandidate") {
                    _this.$state.go('public.applied-job-description',{jobId:_this.planId, e:error.data});
                }
                _this.GrowlerService.growl({
                    type: 'danger',
                    message: 'Something went wrong, Please try again in sometime. If problem persist please contact customer support.',
                    delay: 6000
                });
            };
        _this.AdminPaymentPlanService.makePayment(data);
        _this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);
    }

    getOwnerInfo() {
        return _this.AdminPaymentPlanService.getOwnerInfo();
        //_this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);
    }
}
