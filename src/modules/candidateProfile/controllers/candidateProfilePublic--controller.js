let _this,
reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
export class candidateProfilePublicController {
	/** @ngInject  */
  constructor( $sce,$state, candidateProfilePublicService, GrowlerService, $window){
    _this = this;
    _this.$sce = $sce;
    _this.$state = $state;
    _this.$window = $window;
    _this.candidateProfilePublicService =  candidateProfilePublicService;
    _this.GrowlerService = GrowlerService;
    _this.viewCandidateData = {};
    _this.randomToken =  _this.$state.params.randomToken;    
    _this.viewPublicProfile();
    _this.candidateEmailId = '';
    _this.videoElement = '';
    _this.isShowPage = false;
    _this.isShowModel = false;
    _this.percentageSkill = '';
    _this.profilePic = ''; 
    _this.videoUrl = '';
    _this.isVideoAvailable = true;
    _this.skillTyper = ['temp'];
    _this.candidateSkillsSet = [];
  

  }
 
  getVideo(path){
    // _this.videoElement = document.getElementById('intro_video');
    // _this.videoElement.src = path;
    // _this.videoElement.load();
    if(path && typeof path == 'string'){	
         // let value = _this.$sce.trustAsResourceUrl(path);
          //let youtubePath =  _this.$sce.trustAsResourceUrl(value);
          _this.isVideoAvailable = true;
          if(path.indexOf('youtube') >= 0){
            path = path.replace("watch?v=", "embed/");
            console.log(path);
            _this.videoUrl = path;
          }
          else {
            _this.videoElement = document.getElementById('intro_video').contentWindow.document;                  
            let video = document.createElement('video');
            video.setAttribute('id', 'tempVideoObject');
            video.setAttribute('style', 'width:100%;height:100%;');
            video.preload = 'metadata';
            video.src = path;
            video.controls = true;
            _this.videoElement.open();
            _this.videoElement.appendChild(video);
            _this.videoElement.close();
          }
    } 
    else{
      _this.isVideoAvailable = false;
    }
  }
  
  viewPublicProfile(){
      let onSuccess = (response) => {
         if(response && response.data){
           if (response.data.shareType === 'off'){
              _this.isShowPage = false;
               _this.GrowlerService.growl({
                type:'success',
                message : 'Sorry the Profile is not shared with you',
                delay :500
              });
              // window.alert("Sorry the Profile is not shared with you");
          }
          else if(response.data.shareType === 'private'){
            _this.isShowModel = true;
          }
          else{            
            _this.viewCandidateData = response.data ;
            _this.skillTyper = [];
                if(_this.viewCandidateData.candidateSkills.length>0){
                    _this.candidateSkillsSet = _this.viewCandidateData.candidateSkills;
                  for( var i=0; i < _this.viewCandidateData.candidateSkills.length; i++){
                    var percentageSkill = parseInt((_this.viewCandidateData.candidateSkills[i].yearsOfExperience/_this.viewCandidateData.candidate.experience)*100);
                    _this.skillTyper.push(_this.viewCandidateData.candidateSkills[i].skillsetName);   
                    _this.candidateSkillsSet[i].percentageSkill = percentageSkill;                
                     
                   }
                   
                 
                }
              if(_this.viewCandidateData.candidate.thumbnailPath !== null && _this.viewCandidateData.candidate.thumbnailPath !== ''){
                  _this.profilePic =_this.viewCandidateData.candidate.thumbnailPath ;
              }
              else{
                _this.profilePic =   '../../../public/img/user3.png';
              }
             if(_this.viewCandidateData.resume !==null && _this.viewCandidateData.resume !==''){
               console.log("Success");
             }
             else{
               console.log("Resume Not Found");
             }

           // _this.viewCandidateData.twoMinIntroVideo = _this.viewCandidateData.twoMinIntroVideo || 'https://www.youtube.com/embed/mcixldqDIEQ';
            if(_this.viewCandidateData.twoMinIntroVideo.length>0){
              _this.viewCandidateData.twoMinIntroVideo = _this.viewCandidateData.twoMinIntroVideo;
            }
            else{
              _this.viewCandidateData.twoMinIntroVideo = '../../../public/img/video_image.jpg';
              }
            _this.getVideo(_this.viewCandidateData.twoMinIntroVideo);            
            _this.isShowPage = true;
          }
         }
       },
       onError = (response) => {
         console.log(response.data);
      };
 
     _this.candidateProfilePublicService.viewSharedProfile(_this.randomToken,"");
     _this.candidateProfilePublicService.activePromise.then(onSuccess, onError);

  }
  

  viewPrivateProfile(){
    let onSuccess = (response) => {
      _this.isShowModel = false;     
       _this.viewCandidateData = response.data ;
       _this.skillTyper = [];
        if(_this.viewCandidateData.candidateSkills.length>0){
          _this.candidateSkillsSet = _this.viewCandidateData.candidateSkills;
         for( var i=0; i < _this.viewCandidateData.candidateSkills.length; i++){
            var percentageSkill = (_this.viewCandidateData.candidateSkills[i].yearsOfExperience/this.viewCandidateData.candidate.experience)*100;
            _this.skillTyper.push(_this.viewCandidateData.candidateSkills[i].skillsetName);
            _this.candidateSkillsSet[i].percentageSkill = percentageSkill;  
          }
        }
        if(_this.viewCandidateData.candidate.thumbnailPath !== null && _this.viewCandidateData.candidate.thumbnailPath !== ''){
                  _this.profilePic =   _this.viewCandidateData.candidate.thumbnailPath ;
             }
        else{
                _this.profilePic =   '../../../public/img/user3.png';
            }
          
        if(_this.viewCandidateData.resume !==null && _this.viewCandidateData.resume !==''){
               console.log("Sucess");
             }
        else{
               console.log("Resume Not Found");
          }   
        //  _this.profilePic = _this.viewCandidateData.candidate.thumbnailPath || 'images/user3.png';
       //_this.viewCandidateData.twoMinIntroVideo = _this.viewCandidateData.twoMinIntroVideo || 'https://www.youtube.com/embed/mcixldqDIEQ';
       if(_this.viewCandidateData.twoMinIntroVideo.length>0){
              _this.viewCandidateData.twoMinIntroVideo = _this.viewCandidateData.twoMinIntroVideo;
            }
            else{
              _this.viewCandidateData.twoMinIntroVideo = '../../../public/img/video_image.jpg';
              }
       _this.getVideo(_this.viewCandidateData.twoMinIntroVideo);
       _this.isShowPage = true;
    },
    onError = (response) => {
       console.log(response.data);
        };
    
     _this.candidateProfilePublicService.viewSharedProfile(_this.randomToken, _this.candidateEmailId);
     _this.candidateProfilePublicService.activePromise.then(onSuccess, onError);
  }

  trustSrc(src) {
      return _this.$sce.trustAsResourceUrl(src);
   }

   cancel(){
     _this.isShowModel = false;   
   }
   
   analyzeEmailId(email){
    _this.isEmailIdvalid = "";
   if(angular.isDefined(email) && !reg.test(email)){
      _this.isEmailIdvalid = "Enter Valid Email Id";
    }
    else if(!angular.isDefined(email) || email === "" || email === null){
      _this.isEmailIdvalid = "This field is required";
    }else {
      _this.isEmailIdvalid = "";
    }
  }
}

candidateProfilePublicController.$inject = ["$sce","$state", "candidateProfilePublicService", "GrowlerService", "$window"]



