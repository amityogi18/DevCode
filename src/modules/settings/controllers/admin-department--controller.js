let _this;

export class AdminDepartmentController {
	/** @ngInject  */
    constructor(LoaderService, AdminDepartmentService, GrowlerService) {
        _this = this;
        _this.LoaderService = LoaderService;
        _this.adminDepartmentService = AdminDepartmentService;
        _this.GrowlerService = GrowlerService;
        _this.departmentList = [];
        _this.getDepartment();
        _this.skillsetList = [];
        _this.deleteList = [];
        _this.skillCount = 0;
        _this.addSkillsetList = [{
            skillsetName: ""
        }];
        _this.skillsetArray = [];
        
        if(_this.infoData && _this.infoData === 'edit'){
         _this.IsEdit = true;
         _this.showUpdate(_this.data);
        }else{
            _this.IsAdd = true;
        }
    }
    
    

    get activePromise() {
        return _this.adminDepartmentService.activePromise;
    }

    saveDepartment() {
        //let skillsetArray = _this.getSkillsetArrayForSave();
        let skillsetArray = _.uniq(_this.getSkillsetArrayForSave());
        if(skillsetArray.length > 0){
           let onSuccess = () => {
                  _this.GrowlerService.growl({ type: 'success', message: 'Department Added Successfully', delay: 300 });
                  _this.skillsetArray = [];
                  _this.addSkillsetList = [];
                  _this.close();
              },
              onError = (error) => {
                  console.log(error);
              },
              departmentData = { "name": _this.name, "skillsetArray": skillsetArray };
          _this.adminDepartmentService.saveDepartment(departmentData);
          _this.adminDepartmentService.activePromise.then(onSuccess, onError);
        }else{
            _this.GrowlerService.growl({ type: 'warning',  message: 'Please Enter Skillset Name.', delay: 300 });
        }
    }

    getDepartment() {
        let onSuccess = (response) => {
                _this.departmentList = response.data.departments;
            },
            onError = (error) => {};
        _this.adminDepartmentService.getDepartment();
        _this.adminDepartmentService.activePromise.then(onSuccess, onError);
    }

    showUpdate(department) {
        _this.getSkillSet(department.id);
            _this.id = department.id;
            _this.name = department.name;
            _this.statusId = department.statusId;
    }

    updateDepartment() {
        let skillsetArray = _.uniqBy(_this.getSkillsetArrayForUpdate(), function (skill) {
                return skill.id;
              });
        if(skillsetArray.length > 0){
            let onSuccess = (response) => {
                _this.GrowlerService.growl({ type: 'success',  message: 'Department Updated Successfully', delay: 300 });
                _this.skillsetArray = [];
                _this.addSkillsetList = [];
                _this.close();
            },
                onError = (error) => {
                   console.log(error);
                },
                departmentData = {
                    departmentId : _this.id,
                    name : _this.name,
                    statusId : _this.statusId,
                    skillsetArray : skillsetArray
                };
        _this.adminDepartmentService.updateDepartment(departmentData);
        _this.adminDepartmentService.activePromise.then(onSuccess, onError);
        }else{
           _this.GrowlerService.growl({ type: 'warning',  message: 'Please Enter Skillset Name.', delay: 300 });
        }
    }

    getSkillSet(departmentId) {
        let onSuccess = (response) => {
                _this.skillsetList = response.data;
            },
            onError = (error) => {
                console.log(error);
                _this.addMoreSkill();
            };
        _this.adminDepartmentService.getSkillSet(departmentId);
        _this.adminDepartmentService.activePromise.then(onSuccess, onError);
    }

    addMoreSkill() {
        _this.skillCount++;
        if (_this.IsEdit) {
            _this.skillsetList.push({
                id: "new"+_this.skillCount,
                skillsetName: ""
            });
        } else {
            _this.addSkillsetList.push({
                skillsetName: ""
            });
        }
    }

    removeSkill() {
       _this.addSkillsetList.pop();
    }
    
    removeUpdateSkill(skill){
      
      for(let i=0; i < _this.skillsetList.length; i++){
        if(_this.skillsetList[i].id == skill.id){
            _this.skillsetList[i].delete = true;
            if(_this.skillsetList[i].skillsetName !== ""){
                _this.deleteList.push(skill);
                if(_this.skillsetList.length === _this.deleteList.length){
                    _this.hideSkill = false;
                    _this.skillsetList = [{
                    skillsetName: ""
                }];
                }else
                {
                    _this.hideSkill = true;                
                }
            }else{
                _this.skillsetList.pop();
            }
            
            //_this.skillsetList.splice(i, 1);
        }
      }
    }

    getSkillsetArrayForSave() {
        for (let i = 0; _this.addSkillsetList.length > i; i++) {
          if(_this.addSkillsetList[i].skillsetName !== ""){
           _this.skillsetArray.push(_this.addSkillsetList[i].skillsetName);
          }
        }
        return _this.skillsetArray;
    }

    getSkillsetArrayForUpdate() {
        for (let i = 0; _this.skillsetList.length > i; i++) {
            if(_this.skillsetList[i].skillsetName !== ""){
                if(_this.skillsetList[i].delete){
                  _this.skillsetArray.push({ 
                      id: _this.skillsetList[i].id,
                      skillsetName: _this.skillsetList[i].skillsetName,
                      delete: _this.skillsetList[i].delete
                  });
                }else{
                   _this.skillsetArray.push({ 
                      id: _this.skillsetList[i].id,
                      skillsetName: _this.skillsetList[i].skillsetName,
                      delete: false
                  }); 
                }
            }
        }
        return _this.skillsetArray;
    }
}