let _this;
export class PortalIntegrationController {
  /** @ngInject  */
  constructor(PortalIntegartionService, GrowlerService) {
    console.log('Inside portal integration controller constructor');
    _this = this;
    _this.PortalIntegartionService= PortalIntegartionService;
    _this.GrowlerService= GrowlerService;
    _this.getPortalDetails();
    _this.getJobPortalList();
    _this.jobPortalList ={};
    _this.jobProtalListId = 0;
    _this.job = {};

    _this.updateSettings = function (portalId, portalName) {
      var payload = {
        'portalId' : portalId,
        'portalKeys' : []
      };
      payload.portalKeys.push(_this.job);
      console.log(payload)
      let onSuccess = (response) => {
           _this.GrowlerService.growl({
              type:'success',
              message : response.data.successMessage,
              delay :2000
          });
          },
          onError = (error) => {
            console.log(error);
      };
        _this.PortalIntegartionService.addupdateportalIntegration(payload);
        _this.PortalIntegartionService.activePromise.then(onSuccess, onError);
    }
  }

  getPortalDetails(portalId){
    let onSuccess = (response) => {
           _this.job = response.data.portalKey[0];
          },
          onError = (error) => {
            console.log(error);
      };
     _this.PortalIntegartionService.getPortalInfo(portalId);
     _this.PortalIntegartionService.activePromise.then(onSuccess, onError);
   }
   
  addUpdateLinkedIn(){
    let onSuccess = (response) => {
          
           _this.GrowlerService.growl({
              type:'success',
              message : response.data.successMessage,
              delay :2000
          });
            // window.alert(response.data.successMessage);
          },
          onError = (error) => {
            console.log(error);
      };
      
      let data = {
        linkedInContractId : _this.linkedInContractId
      }
     _this.PortalIntegartionService.addupdateportalIntegration(data);
     _this.PortalIntegartionService.activePromise.then(onSuccess, onError);
  }

  getJobPortalList(){
    let onSuccess = (response) => {
      
      _this.jobPortalList = response.data;
      _this.jobPortalList =  _this.jobPortalList.filter(function(portal){
        return (portal.status === 'Active')
      })
          },
          onError = (error) => {
            console.log(error);
      };
     _this.PortalIntegartionService.getJobPortalList();
     _this.PortalIntegartionService.activePromise.then(onSuccess, onError);
  }

}