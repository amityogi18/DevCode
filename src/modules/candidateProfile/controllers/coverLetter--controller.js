let _this;

export class coverLetterController {
	/** @ngInject  */
  constructor(coverLetterService,GrowlerService) {
    _this = this;
    _this.coverLetterService = coverLetterService;
    _this.GrowlerService = GrowlerService;
    _this.profile;
    _this.coverLetter;
    _this.profileList;
    _this.showSave = false;
    _this.showEdit = false;
    _this.showView = false;
    _this.isEditMode = false;
    _this.coverLetterError = false;
    _this.disableProfile = false;
    _this.coverLetter = [];
    _this.coverLetterList = [];
    _this.isDisable = true;
    _this.init();    
  }

  init(){
         let onSuccess = (response) => {
              _this.profileList = response.data || [];
              if(_this.profileList && _this.profileList.length > 0){
                  for (var i = 0; i < _this.profileList.length; i++) {
                      if(_this.profileList[i].statusId === 1){
                            _this.profile =_this.profileList[i];
                           _this.getCoverLetterData(_this.profileList[i].id);
                           break;
                      }
                  }
                  _this.getAllCoverLetter();
              }
              else{
                  _this.coverLetterError = true;
              }
          },
          onError = (error) =>{
              console.log(error);
                      if(error
                              && error.data
                              && error.data.errorCode === "NO_RECORD_FOUND"){
                         _this.coverLetterError = true;
                     }
          };

          _this.coverLetterService.getProfileList();
          _this.coverLetterService.activePromise.then(onSuccess, onError);
      }

  getAllCoverLetter(){
      let onSuccess = (response) => {
          _this.coverLetterList = response.data || [];
          for(var idx=0;idx<_this.coverLetterList.length;idx++){
            _this.coverLetterList[idx].updatedAt = moment.utc(_this.coverLetterList[idx].updatedAt, 'MM-DD-YYYY HH:mm:ss').local().format('MM-DD-YYYY HH:mm:ss');
              for(var i=0;i<_this.profileList.length;i++){
                  if(_this.coverLetterList[idx].profileName == _this.profileList[i].name){
                      _this.coverLetterList[idx].profileName = _this.profileList[i];
                  }
              }
          }
          

      },
      onError = (error) =>{
          console.log(error);
      };
      _this.coverLetterService.getAllCoverLetter();
      _this.coverLetterService.activePromise.then(onSuccess, onError);
  }

  getCoverLetterData(id){
          let onSuccess = (response) => {
            _this.coverLetter = response.data || [];
          
        },
        onError = (error) =>{
            console.log(error);
        };
        if(angular.isDefined(id)){
            _this.coverLetterService.getCoverLetter(id);
            _this.coverLetterService.activePromise.then(onSuccess, onError);
        }         
    }

      isNotEmpty(prop, type){
        if(type ==1){
          if(angular.isDefined(prop) && prop !== "" && prop !== null){
              
            return true;
          }else
          { 
            _this.addCoverLetterForm.$setSubmitted();
           // _this.addCoverLetterForm.$setPristine();
          //  _this.addCoverLetterForm.$setUntouched();
            return false;
          }
          
        }
        else{
          if(angular.isDefined(prop) && prop !== "" && prop !== null){
          return true;
        }
          else
          { 
//            $('.panel-collapse').collapse('toggle');
//            _this.editCoverLetterForm.$setSubmitted();
            return false;
          }
        }
        
      }
  
  updateCoverLetter(element, coverLetterData){
       if(coverLetterData && _this.isNotEmpty(coverLetterData.coverletterTitle,2)
         && _this.isNotEmpty(coverLetterData.content,2) && _this.isNotEmpty(coverLetterData.profileId,2)){
           let onSuccess = (response) => {
           _this.GrowlerService.growl({
             type: 'success',
             message: 'Cover Letter Updated Successfully',
             delay: 2000
           });
           _this.disableView = false;
           _this.changeEditMode(element, coverLetterData);
           $('#collapse'+_this.profileId).collapse('toggle');
          // _this.editCoverLetterForm.$setSubmitted();
           _this.getAllCoverLetter();
            console.log(response.data);  
        },
        onError = (error) =>{
            console.log(error);
            _this.getAllCoverLetter();
        };
        if(angular.isDefined(coverLetterData)
                && angular.isDefined(coverLetterData.content)
                && coverLetterData.content.length > 0
                //&& angular.isDefined(coverLetterData.profile)
                && angular.isDefined(coverLetterData.profileId)){
            _this.coverLetterService.updateCoverLetter(coverLetterData.content, coverLetterData.profileId, coverLetterData.coverletterTitle);
            _this.coverLetterService.activePromise.then(onSuccess, onError);
        }else
        {
          //  _this.getAllCoverLetter();
          
            
        }   
      }
      else{
        _this.GrowlerService.growl({
              type: 'danger',
              message: 'Please Fill the Required Fields',
              delay: 500
            });
            element.preventDefault();
            element.stopPropagation();
      
      }
      
        
    }

  addCoverLetter(){
    if(_this.isNotEmpty(_this.profile.id,1) && _this.isNotEmpty(_this.coverletterTitle,1) && _this.isNotEmpty(_this.content,1) ){
      let onSuccess = (response) => {
          _this.GrowlerService.growl({
            type: 'success',
            message: 'Cover Letter Saved Successfully',
            delay: 2000
          });
        console.log(response.data);
        _this.coverletterTitle = "";
        _this.content = "";
        _this.getAllCoverLetter();
        //_this.close();
      },
      onError = (error) =>{
        console.log(error);
        _this.getAllCoverLetter();
      },

      data = {
        "candidateProfileId": _this.profile.id,
        "coverletterTitle": _this.coverletterTitle,
        "content": _this.content
      };

      _this.coverLetterService.addCoverLetter(data);
      _this.coverLetterService.activePromise.then(onSuccess, onError);
      $('#clModal3').modal('hide');
    }
    else{
      _this.GrowlerService.growl({
              type: 'danger',
              message: 'Please Fill the Required Fields',
              delay: 500
            });
    }
     
    }

  reset(){
      _this.coverLetter = [];
  }

  showTooltip(type){
  if(type === 'Save'){
    _this.showSave = !_this.showSave;
  }
  else if(type==='Edit'){
    _this.showEdit = !_this.showEdit;
  }
  else{
    _this.showView = !_this.showView;
    }
}


  clearForm (){
    _this.coverletterTitle = '';
    _this.content = '';
     _this.addCoverLetterForm.$setPristine();
    _this.addCoverLetterForm.$setUntouched();
  }
  changeEditMode(element, coverLetterData){
     _this.isEditMode = !_this.isEditMode;
      _this.disableProfile = true;
      _this.disableView = true;
      let id = element.currentTarget.id.split('_')[1];
      let saveBtn = $('#saveBtn_'+id);


      let isEditVisible = saveBtn.is(":visible");
      if(isEditVisible){
        _this.disableView = false;
        saveBtn.slideUp();
      }else{
        saveBtn.slideDown();
      }

      let editBtn = $('#editBtn_'+id);
      let isSaveVisible = editBtn.is(":visible");
      if( isSaveVisible){
        editBtn.slideUp();
      }
      else{
            editBtn.slideDown();
          }
  }
  
  filterProfile(){
    _this.coverLetterCtrl = {
      coverletterTitle : '',
      profile : '',
      content : ''
    }
     _this.addNewCoverList = _this.profileList.concat([]);
      for(var cover in _this.coverLetterList){
          for(var idx=0;idx<_this.addNewCoverList.length;idx++){
              if(_this.coverLetterList[cover].profileName.name == _this.addNewCoverList[idx].name){
                  _this.addNewCoverList.splice(idx,1);
              }
          }
          
      }

      _this.profile = _this.addNewCoverList[0];
  }
  
  //coverLetterCtrl.coverLetterList.length === 4
};

