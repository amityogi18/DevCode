let _this;

export class multipleApplyController {
	/** @ngInject  */
    constructor(multipleApplyService, CandidateProfileService,$timeout, GrowlerService){
        _this =  this;
        _this.multipleApplyService = multipleApplyService;
        _this.CandidateProfileService = CandidateProfileService;
        _this.GrowlerService = GrowlerService;
        _this.activeProfileId = -1;
        _this.isProfileAdded = true;
        _this.selectedPortals = [];
        _this.portalList = [];
        _this.$timeout = $timeout;
        _this.candidateProfileList = [];
        _this.getCandidateProfileAll();
        _this.getPortals();
        console.log("Multiple Apply Controller");
        _this.sharedProfileData ='';
         
   }

   
    
   addPortals(event, id){
      let isChecked = event.currentTarget.checked;      
      if(isChecked){
          _this.selectedPortals.push(id);
      }else{
        let index = _this.selectedPortals.indexOf(id);
        _this.selectedPortals.splice(index,1);        
      }
      _this.checkUncheckSelectAll();      
  }

  removeAllPortals(){
    let checkBoxs = document.querySelectorAll('.check-box-list input[type="checkbox"]');
    for(var i = 0; i < checkBoxs.length;i++){
      checkBoxs[i].checked = false;
    }
    _this.selectedPortals = [];
    _this.checkUncheckSelectAll();
  }


   getCandidateProfileAll() {
       let onSuccess = (response) => {
              _this.isProfileAdded = true;
              _this.candidateProfileList = response.data || [];
              if(_this.candidateProfileList && _this.candidateProfileList.length > 0){
                  for (var i = 0; i < _this.candidateProfileList.length; i++) {
                      if(_this.candidateProfileList[i].statusId === 1){
                           _this.activeProfileId = _this.candidateProfileList[i].id;
                           //_this.getCandidateProfileData(_this.activeProfileId);
                           _this.getShareProfilePortals(_this.activeProfileId)
                           break;
                      }
                  }
              }
              else{
                _this.isProfileAdded = false;  
              }
          },
          onError = (error) =>{
              _this.isProfileAdded = false;
              console.log(error);
          };

          _this.CandidateProfileService.getCandidateProfileAll();
          _this.CandidateProfileService.activePromise.then(onSuccess, onError);
    }

   getPortals(){
     let onSuccess = (response) => {
            _this.portalList = response.data || [];
            console.log(_this.portalList);
            _this.$timeout(function(){
               for(let idx=0;idx<_this.portalList.length;idx++){
                    if(_this.portalList[idx].selected){
                      _this.selectedPortals.push(_this.portalList[idx].id);  
                    }
           } 
            },1000)
             
         },
         onError = (error) =>{
            console.log(error);
         };

        _this.multipleApplyService.getPortals();
        _this.multipleApplyService.activePromise.then(onSuccess, onError);

   }

   shareProfilePortals(){
        let onSuccess = (response) => {
            _this.GrowlerService.growl({
              type: 'success',
              message: 'Portal Shared Successfully',
              delay: 2000
            });           
         },
         onError = (error) =>{
            console.log(error);
         };

         let data = {}, portalIdArray = [];
         if(angular.isDefined(_this.selectedPortals)){
              angular.forEach(_this.selectedPortals, function(value, key){
                if(angular.isObject(value)){
                  portalIdArray.push(Number(value.id));
                }
                else{

                  portalIdArray.push(value);
                }
              });

         }else
         {
             portalIdArray = _this.selectedPortals;
         }

         data.portals = portalIdArray;
         data.candidateProfileId = _this.activeProfileId;

        _this.multipleApplyService.shareProfilePortals(data);
        _this.multipleApplyService.activePromise.then(onSuccess, onError);
   }
   
   
   selectAllPortals(event){
      _this.selectedPortals =[];
      let checkBoxs = document.querySelectorAll('.check-box-list input[type="checkbox"]');
      for(var i = 0; i < checkBoxs.length;i++){
         checkBoxs[i].checked = event.currentTarget.checked;
         if(event.currentTarget.checked){
           if(!_this.isIdExist(checkBoxs[i].id)){
              _this.selectedPortals.push(checkBoxs[i].id);
           }
         }else{ _this.selectedPortals.pop(checkBoxs[i].id);}
      }
   }

    getAllCheck(){
      let cbSelectAl =angular.element( document.querySelector( '#cbSelectAll' ) );
    //  let cbSelectAll = document.getElementById('#cbSelectAll');
     
          if(_this.sharedProfileData.length  === _this.portalList.length){
          cbSelectAll.checked = true;
        }else{
          cbSelectAll.checked = false;
        }
    }

   getShareProfilePortals(activeProfileId){
     _this.activeProfileId = activeProfileId;
      let onSuccess = (response) => {
        _this.sharedProfileData = response.data;
        for(var i = 0; i < _this.sharedProfileData.length; i++){
          angular.forEach(_this.portalList, (portal) => {
            if(portal.id === _this.sharedProfileData[i].id){
               portal['selected'] = true;
               _this.allProtalSelected = portal['selected'];
              }  
                                  
            }); 
          
         }
          _this.getAllCheck(); 
        // if(_this.sharedProfileData && _this.sharedProfileData.length > 0){
        //   for(var i = 0; i< _this.sharedProfileData.length ; i++){
        //     _this.selectedPortalValue =_this.sharedProfileData[i].id;
        //     }
        //   }
        },
        
         onError = (error) =>{
            console.log(error);
         };
          
        _this.multipleApplyService.getShareProfilePortals(_this.activeProfileId);
        _this.multipleApplyService.activePromise.then(onSuccess, onError);
       
   }

   checkUncheckSelectAll(){
     let cbSelectAll = document.getElementById('cbSelectAll');
     let checkBoxs = document.querySelectorAll('.check-box-list input[type="checkbox"]');
     if(checkBoxs.length === _this.selectedPortals.length){
        cbSelectAll.checked = true;
     }else{
        cbSelectAll.checked = false;
     }
   }

   isIdExist(id){
     var returnValue = false;
     for(var i = 0; i < _this.selectedPortals.length;i++){
       if(_this.selectedPortals[i] == id){
         returnValue = true;
          break;
       }
     }
     return returnValue;
   }
}

