let _this;
export class ThirdPartyIntegrationController {
	/** @ngInject  */
  constructor(NgTableParams, SocialMediaService, $timeout, GrowlerService) {
    _this = this;
    _this.$timeout = $timeout;
    _this.GrowlerService = GrowlerService;
       
    }
  

}