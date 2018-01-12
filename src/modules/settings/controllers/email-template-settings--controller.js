let _this ;
export class EmailTemplateSettingsController {
	/** @ngInject  */
  constructor(EmailTemplateSettingsService, $timeout, NgTableParams, GrowlerService, $state) {
    _this = this;
    _this.$timeout = $timeout;
    _this.EmailTemplateSettingsService = EmailTemplateSettingsService;    
    _this.$timeout = $timeout;
    _this.resetTemplate();
    _this.emailTemplateList = [];
    _this.templateId = 0;
    _this.getTemplateType();
    _this.GrowlerService = GrowlerService;
    _this.$state = $state;
    _this.isAdd = true;
    _this.isEdit = false;
    _this.IsView = false;
    
    _this.emaiTemplatetableParams = new NgTableParams({
          page : 1,
          count: 10
         }, 
         {
           counts: [5, 10, 20],
           getData: function ($defer, params) {
                 let filter = params.filter(),
                   sorting = params.sorting(),
                   count = params.count(),
                   page = params.page(),
                   filterFields = [],
                   sortFields = [],
                   queryString = '',
                   queryURL = '?';
                 angular.forEach(sorting, (value, key) => {
                   console.log(key + '---' + value);
                   sortFields.push(`${key}&order=${value}`);
                 });
                 angular.forEach(filter, (value, key) => {
                   console.log(key + '---' + value);
                   filterFields.push(`${key}=${value}`);
                 });
                 if (sortFields.length) {
                   queryString += `orderBy=${sortFields.join('&')}&`;
                 }
                 if (filterFields.length) {
                   queryString += filterFields.join('&');
                 }
                 queryURL += `${queryString}&page=${page}`;
                      let onSuccess = (response) => {
                       _this.emailTemplateCount = response.data.length;
                       _this.emailTemplateList = response.data || [];
                       if(_this.emailTemplateList && _this.emailTemplateList.length > 0){
                       _this.totalemailTemplates = _this.emailTemplateCount;    
                       params.total(response.data.length);
                       $defer.resolve(response.data);
                     } 
                    if(_this.emailTemplateList && _this.emailTemplateList.length > 0){
                            _this.totalemailTemplates = _this.emailTemplateCount;    
                            params.total(_this.emailTemplateCount);
                            $defer.resolve( _this.emailTemplateList);
                    }                  
                   },
                     onError = (error) => {
                       _this.totalemailTemplates = 0;
                   };
               _this.EmailTemplateSettingsService.getemailTemplateList(queryURL);
               _this.EmailTemplateSettingsService.activePromise.then(onSuccess, onError);
        }
    }); 
    
    console.log('Inside EmailTemplateSettings Controller');
  }  
  
  
  onClose() {
    console.log("Table reload successfully");    
    _this.$state.go(_this.$state.current, {}, {reload: true});
    
  }
  resetTemplate(){
    _this.template = {};
  }
  
  openTemplate(id,readOnly){
    _this.viewMode = readOnly?readOnly:false;
    _this.EmailTemplateSettingsService.getTemplate(id).then((template)=>{
      _this.template = template;
      console.log("Template-");
      console.log(_this.template);
      _this.openTemplateView();
    },(error)=>{
      console.log("Error while getting template");
      console.log(error);
    });
  } 
  
  saveNewTemplate(){
      let data = {
          "name":  _this.name,
          "subject": _this.subject,
          "templateTypeId": _this.templateTypeId,
          "content": _this.content
        };
      let onSuccess = (response) => {
        _this.IsView = false;
        _this.templateId = response.data.id;
        //_this.hideTemplateView();
        _this.resetTemplate();
        
        //_this.emaiTemplatetableParams.total();
        //_this.emaiTemplatetableParams.reload();
        console.log(response.data);
            _this.GrowlerService.growl({
                  type: 'success',
                  message: "New Template Added Successfully",
                  delay: 2000
              });
        _this.onClose();      
        },
        onError = (response) => {
            console.log;
        };
      _this.EmailTemplateSettingsService.saveNewTemplate(data);
      _this.EmailTemplateSettingsService.activePromise.then(onSuccess, onError);
  }
  
  openTemplateView(){
    angular.element("#myModal").modal("show");
    angular.element("#myModal").on('hidden.bs.modal',()=>{
      _this.resetTemplate();
    });
  }
  
  hideTemplateView(){
    _this.viewMode=false;
    angular.element("#myModal").modal("hide");

  }
  
  getTemplateType(){
    let onSuccess = (response) => {
        _this.templateList = response.data;       
      },
      onError = (error) => {
        console.log(error);
      };
    _this.EmailTemplateSettingsService.getTemplateType();
    _this.EmailTemplateSettingsService.activePromise.then(onSuccess, onError);
  }
  
  deleteTemplate(templateId){      
             let onSuccess = (response) => {
                 _this.emaiTemplatetableParams.reload();
                  _this.GrowlerService.growl({
                   type: 'success',
                   message: "Template Removed Successfully",
                   delay: 2000
               });
                  console.log(response.data);
                  _this.onClose();      
                 },
                  onError = (error) => {
                      console.log(error);
                 };
              _this.EmailTemplateSettingsService.deleteTemplate(templateId);
              _this.EmailTemplateSettingsService.activePromise.then(onSuccess, onError);

         }
         
  showTemplate(template, viewMode) { 
        _this.$timeout(function() {
            if(viewMode === 'EDIT'){
                _this.isEdit = true;
                _this.isAdd = false;                
                _this.isView = false;
            }
            else{
                _this.isView = true;
                _this.isAdd = false;   
                _this.isEdit = false;
            };
            _this.templateTypeId = template.templateTypeId;
            _this.name = template.name;
            _this.subject = template.subject;
            _this.templateType = template.templateType;
            _this.templateId = template.id;
            _this.content = template.content;
            
        }, 30);
    }
  
  updateTemplate() {
        let onSuccess = (response) => {           
                _this.GrowlerService.growl({
                    type: 'success',
                    message: 'Template Updated Successfully',
                    delay: 2000
                });
                _this.onClose();
            },
            onError = (error) => {

            },
           templateData = {
                name : _this.name,
               content : _this.content,
               templateId : _this.templateId,
               subject : _this.subject,
               templateTypeId : _this.templateTypeId
            };

        _this.EmailTemplateSettingsService.updateTemplate(templateData);
        _this.EmailTemplateSettingsService.activePromise.then(onSuccess, onError);
    }
    
 }

