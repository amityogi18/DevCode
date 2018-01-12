let _this;
export class jobPortalDetailsController {
    /** @ngInject  */
    constructor(positionService, $rootScope) {
        _this = this;
        _this.positionService = positionService;
        _this.selectedPortalDetails = _this.data;
        _this.selectedPortalId = _this.data.portalId;
        _this.selectedPortal = [];
        _this.getSelectedPortalDetail();
        _this.$rootScope = $rootScope;
        _this.selectedPlan = function(detail) {
            _this.positionService.setSelectedPlan(detail);
             _this.$rootScope.$broadcast('planByModal',{
                'planSelected': detail,
                'portalSelected': _this.selectedPortalId,
            });
        }
    }
    getSelectedPortalDetail(){
      
        let onSuccess = (response) => {
              _this.selectedPortal =response.data?response.data:[];
            },
            onError = (error) => {
              console.log(error);
            } 
      _this.positionService.portalDetail(_this.selectedPortalId);
      _this.positionService.activePromise.then(onSuccess, onError);
      
    }

    
}
