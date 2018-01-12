let _this;
export class SuperadminController {
	/** @ngInject  */
  constructor(SuperAdminService, AuthService, $rootScope, $timeout) {
      _this = this;
      _this.AuthService= AuthService;
      _this.$timeout = $timeout;
      _this.SuperAdminService = SuperAdminService;
      _this.statusCountList =[];
      _this.twoMinStaticsData = [];
      _this.clientList = [];
      _this.ticketList = [];
      _this.companyCandidateList = [];
      _this.profileSocialList = [];
      _this.interviewSocialList = [];
      _this.storageQuotaList = [];
      _this.diskUsageList = [];
      _this.getStatusCount();
      _this.getTwoMinStatics();
      _this.getClient();
      _this.getCompanyCandidate();
      _this.getTicketDetail();
      _this.getProfileSocialDetail();
      _this.getInterviewSocialDetail();
      _this.getStorageQuotaDetail();
      _this.getDiskUsageDetail();
      _this.$timeout(function () {
        $rootScope.setActiveLi(2);
    },1000);
    console.log('Inside Super Admin Controller constructor');

  }
  
  getStatusCount(){
        let onSuccess = (response) => {
                _this.statusCountList = response.data;
            },
            onError = (error) => {
                console.log(error);
            };
        _this.SuperAdminService.getStatusCount();
        _this.SuperAdminService.activePromise.then(onSuccess, onError);
    }
    
  getTwoMinStatics(){
        let onSuccess = (response) => {
                _this.twoMinStaticsData = response.data;
            },
            onError = (error) => {
                console.log(error);
            };
        _this.SuperAdminService.getTwoMinStatics();
        _this.SuperAdminService.activePromise.then(onSuccess, onError);
    }
  
  getClient(){
        let onSuccess = (response) => {
                _this.clientList = response.data;
            },
            onError = (error) => {
                console.log(error);
            };
        _this.SuperAdminService.getClient();
        _this.SuperAdminService.activePromise.then(onSuccess, onError);
    }
    
  getCompanyCandidate(){
        let onSuccess = (response) => {
                _this.companyCandidateList = response.data;
            },
            onError = (error) => {
                console.log(error);
            };
        _this.SuperAdminService.getCompanyCandidate();
        _this.SuperAdminService.activePromise.then(onSuccess, onError);
    }
    
  getTicketDetail(){
        let onSuccess = (response) => {
                _this.ticketList = response.data;
            },
            onError = (error) => {
                console.log(error);
            };
        _this.SuperAdminService.getTicketDetail();
        _this.SuperAdminService.activePromise.then(onSuccess, onError);
    }
    
  getProfileSocialDetail(){
        let onSuccess = (response) => {
                _this.profileSocialList = response.data;
            },
            onError = (error) => {
                console.log(error);
            };
        _this.SuperAdminService.getProfileSocialDetail();
        _this.SuperAdminService.activePromise.then(onSuccess, onError);
    }
    
  getInterviewSocialDetail(){
        let onSuccess = (response) => {
                _this.interviewSocialList = response.data;
            },
            onError = (error) => {
                console.log(error);
            };
        _this.SuperAdminService.getInterviewSocialDetail();
        _this.SuperAdminService.activePromise.then(onSuccess, onError);
    }
    
    getStorageQuotaDetail(){
        let onSuccess = (response) => {
                _this.storageQuotaList = response.data;
            },
            onError = (error) => {
                console.log(error);
            };
        _this.SuperAdminService.getStorageQuotaDetail();
        _this.SuperAdminService.activePromise.then(onSuccess, onError);
    }
    
    getDiskUsageDetail(){
        let onSuccess = (response) => {
                _this.diskUsageList = response.data;
            },
            onError = (error) => {
                console.log(error);
            };
        _this.SuperAdminService.getDiskUsageDetail();
        _this.SuperAdminService.activePromise.then(onSuccess, onError);
    }
}
