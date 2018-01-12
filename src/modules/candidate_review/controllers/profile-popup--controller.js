var _this;

export class ProfilePopupController {
  constructor() {
    console.log('Inside candidate controller constructor');
      _this = this;
      _this.selectedCandidate = {};
      _this.selectedCandidate.profile = {};
      _this.selectedCandidate.profile.skillsets = [];
     _this.selectedCandidate = _this.data;
     
     if(_this.selectedCandidate && _this.selectedCandidate.profile &&
             _this.selectedCandidate.profile.skillsets && _this.selectedCandidate.profile.skillsets.length>0){
         _this.selectedCandidate.profile.skillsets = _.uniqBy(_this.selectedCandidate.profile.skillsets,
            function (skill) {
                return skill.skillsetName;
              });
     }
     if(_this.selectedCandidate && _this.selectedCandidate.profile 
             && _this.selectedCandidate.profile.totalMonths >12 
             && (_this.selectedCandidate.profile.totalyearsOfExperience === 0 || _this.selectedCandidate.profile.totalyearsOfExperience === '')){
        
            let n = Number(_this.selectedCandidate.profile.totalMonths),
              years = Math.floor(n/12), 
              month = n % 12;
              _this.selectedCandidate.profile.totalMonths = "";
              _this.selectedCandidate.profile.totalyearsOfExperience = "";
             if(month >= 1){
                 _this.selectedCandidate.profile.totalMonths = month;
             }
             if(years >= 1)
             {
                _this.selectedCandidate.profile.totalyearsOfExperience = years; 
             }    
       }
     
     console.log( _this.selectedCandidate);
  }
}
