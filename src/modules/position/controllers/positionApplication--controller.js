var _this;
export class applicationController {
    /** @ngInject  */
    constructor($location, $scope, $stateParams, positionService, GrowlerService, $state, LoaderService) {
        _this = this;
        _this.$scope = $scope;
        _this.$state = $state;
        _this.$location = $location;
        _this.$stateParams = $stateParams;
        _this.LoaderService = LoaderService;
        _this.positionService = positionService;
        _this.GrowlerService = GrowlerService;
        _this.currentNavItem = {
           "current" : "application",
           "prev":'app.create-position({positionId: '+_this.$stateParams.positionId+'})',
           "next":'app.advertise({positionId: '+_this.$stateParams.positionId+'})'
         };
        _this.onLoad();
        //_this.getApplicationDetails();
        _this.applicationResponse = {};
        _this.email = 1;
        _this.phoneNumber = 1;
        _this.photo = 0;
        _this.coverLetter = 0;
        _this.cvResume = 1;
        _this.showPositionCount = true;
        _this.$scope.$on("saveData", function(event, data){
            if(data ==='app.application' && _this.applicationFields.$dirty) {
               _this.saveApplicationDetails();   
            }    
        }); 

    }
    
    onLoad() {
        let url = _this.$location.path();
        if (url === "/position/application/") {
           // _this.positionId = "new";
        } else {
            _this.positionId = _this.$stateParams.positionId || 1;
            _this.fetchPositionCount(_this.positionId);
        }
    }
    
    saveData(mode){
        _this.saveApplicationDetails(mode);              
    }

    fetchPositionCount(positionId) {
        _this.PositionCount = {};
        let onSuccess = (response) => {
            _this.PositionCount = response.data;
            _this.jobCode = response.data.jobCode;
            _this.getApplicationDetails(this.jobCode);
        },
        onError = (error) => {
            console.log(error);
        };
        _this.positionService.getPositionCount(positionId);
        _this.positionService.activePromise.then(onSuccess, onError);
    }
    getApplicationDetails(jobCode) {
        let onSuccess = (response) => {
               _this.email = 1;
               _this.phoneNumber = 1;
               _this.photo = response.data.photo;
               _this.coverLetter = response.data.coverLetter;
               _this.cvResume = 1;
        },
                onError = (error) => {
        };
        _this.positionService.getApplicationDetails(jobCode);
        _this.positionService.activePromise.then(onSuccess, onError);
    }
    
    saveApplicationDetails(mode) {
        let onSuccess = (response) => {
            if (mode === 'ACTIVATE') {
                _this.activatePosition();
            }
            if (mode !== 'ACTIVATE') {
                _this.GrowlerService.growl({
                    type: 'success',
                    message: "Data Saved Successfully",
                    delay: 400
                });
            }
            _this.$state.go('app.advertise', { positionId: _this.positionId });
        },
        onError = (error) => {
        };
        let data = {
            email:  1,
            phoneNumber: 1,
            photo: _this.photo,
            coverLetter: _this.coverLetter,
            cvResume: 1
        };

        _this.positionService.saveApplicationDetails(_this.positionId ,data);
        _this.positionService.activePromise.then(onSuccess, onError);
    };
    
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
}
