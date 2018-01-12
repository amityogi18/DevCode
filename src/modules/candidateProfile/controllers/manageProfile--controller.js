let _this;

export class manageProfileController {
	/** @ngInject  */
  constructor($state, CandidateProfileService,$timeout) {
    _this = this;
    _this.$state = $state;
    _this.$timeout = $timeout;
    _this.CandidateProfileService = CandidateProfileService;
    _this.profileList;
    _this.maxprofileadded = false;
    _this.getCandidateProfileAll();
    _this.isProfileAvailable=true;
  }

  getCandidateProfileAll() {
    let onSuccess = (response) => {
        console.log(response.data);
        _this.profileList = response.data || [];
        if(_this.profileList && _this.profileList.length >0){
          for (var i = 0; i < _this.profileList.length; i++) {
            if(_this.profileList[i].statusId === 1){
              _this.profileList[i].active = true;
            }else {
              _this.profileList[i].active = false;
            }
          }
        }
      },
      onError = (error) =>{
        if(error.data.errorCode==="NO_RECORD_FOUND"){
          _this.isProfileAvailable=false;
        }
        console.log(error);
      };

    _this.CandidateProfileService.getCandidateProfileAll();
    _this.CandidateProfileService.activePromise.then(onSuccess, onError);
  }

  setActiveProfile(profileData) {
    let status;
    let onSuccess = (response) => {
      console.log('profile is active');
        _this.getCandidateProfileAll();
      },
      onError = (error) => {
        console.log(error);
      };
    
      if(profileData && profileData.checked){
        status = 1;
      }else{
        status = 2;
      }

    _this.CandidateProfileService.setActiveProfile(profileData.id,status);
    _this.CandidateProfileService.activePromise.then(onSuccess, onError);
  }
  
  editProfile(id){
    _this.$state.go('candidateProfile.update-profile', {profileId: id} );

  }
  
  viewProfile(id){
    _this.$state.go('candidateProfile.show-profile', {profileId: id} );
  }

  maxProfile() {
        if(_this.profileList.length >= 4) {
          _this.maxprofileadded = true;
          _this.$timeout(function(){
              _this.maxprofileadded = false;
          },6000);
        }
        else if(_this.profileList.length < 4){
          _this.$state.go('candidateProfile.create-profile');
        }
  }

};


