let _this;
let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
export class ConferenceContactController {
	/** @ngInject  */
	constructor(NgTableParams, $state, ConferenceService, GrowlerService, AuthService, $window, ContactService, $timeout, $rootScope, dataTableService){
		_this =  this;
		_this.ConferenceService = ConferenceService;
		_this.$state = $state;
		_this.GrowlerService = GrowlerService;
    _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});   
    _this.colNum = 6;
    _this.isEmailValid=false;
		_this.AuthService = AuthService;
    _this.$window = $window;
    _this.ContactService = ContactService;
    _this.$timeout = $timeout;
    _this.isEdit = false;
    _this.contactTableFilter = {};
    // _this.activemenu = 'Contacts';
    _this.selectedContactId = [];
    
     _this.$timeout(function () {
        $rootScope.setActiveLi(10);
    },1000);
    _this.contactTableParams = new NgTableParams(
             {
            page: 1,
            count: 5,
            filter: _this.contactTableFilter
        }, 
             {
                counts: [5, 10, 20],
                getData: function(params) {
                    let filter = params.filter(),
                        sorting = params.sorting(),
                        count = params.count(),
                        page = params.page(),
                        filterFields = [],
                        sortFields = [],
                        queryString = '',
                        queryURL = '?';
                    angular.forEach(sorting, (value, key) => {
                        sortFields.push(`${key}&order=${value}`);
                    });
                    angular.forEach(filter, (value, key) => {
                        filterFields.push(`${key}=${value}`);
                    });
                    if (sortFields.length) {
                        queryString += `orderBy=${sortFields.join('&')}&`;
                    }
                    if (filterFields.length) {
                        queryString += filterFields.join('&');
                    }
                    queryURL += `${queryString}&limit=${count}&page=${page}`;
                    let onSuccess = (response) => {

                            _this.contactList = response.data.data;
                            _this.contactListCount = response.data.total;
                            if (_this.contactList &&
                                _this.contactList.length > 0) {                               
                                params.total(_this.contactListCount);
                                    if(!_this.dataTableService.totalColumn.length) {
                                       _this.dataTableService.initTable(_this.cols, _this.contactTableParams);  
                                    }
                                    return (_this.contactList);
                                    }
                        },
                    onError = (error) => {
                        console.log(error);
                    };

                    _this.ContactService.getContactData(queryURL);
                    return _this.ContactService.activePromise.then(onSuccess, onError);
                }
            });
    _this.toggle = function() {
        _this.dataTableService.setColumn(-1);
        _this.dataTableService.toggle(_this.cols, event.target.value);
    };

        window.onbeforeunload = function(e) {
              console.log('window cloasing');
              console.log('obj :' , window._object);
              /*var dialogText = 'Dialog text here';
              e.returnValue = dialogText;
              return dialogText;*/
             // if(window.stream) window._object.hangup();

            };
    }

    checkRequiredFields(){
	    if(_this.name && _this.name !==''
        && _this.email && _this.email !==''
        &&  _this.isEmailValid == true){
	        return true;
        }
        else{
	        _this.clientForm.$setSubmitted();
        }
    }

    checkMandatoryFields(){
        if(_this.name && _this.name !==''
           ){
            return true;
        }
        else{
            _this.clientForm.$setSubmitted();
        }
    }

    isInvalidEmail(email){
        _this.errormessage = "";
       if(angular.isDefined(email) && !reg.test(email)){
          _this.errormessage = "Enter Valid Email Id";
          _this.isEmailValid = false;
        }
        else if(!angular.isDefined(email) || email === "" || email === null){
          _this.errormessage = " Please Enter Email Id";
        }else {
          _this.errormessage = "";
           _this.isEmailValid = true;
        }
    };
    
    addContact() {
        if (!angular.isDefined(_this.email) || _this.email === "" || _this.email === null) {
            _this.errormessage = " Please Enter Email Id";
        }
        if (_this.checkRequiredFields()) {
            let onSuccess = () => {

                    _this.GrowlerService.growl({
                        type: 'success',
                        message: "Contact Added Successfully",
                        delay: 2000
                    });
                    _this.onClose();
                },
                onError = (error) => {
                    console.log(error);
                },
                contactData = {
                    name: _this.name,
                    email: _this.email
                };

            _this.ContactService.addContact(contactData);
            _this.ContactService.activePromise.then(onSuccess, onError);
        }
    }
    
    addContactId(element, contactId){
        if(element.currentTarget.checked){
            _this.selectedContactId.push(contactId);
        }else{
            if(_this.selectedContactId.length > 0){
                for(var i =0; _this.selectedContactId.length > i; i++){
                    if(_this.selectedContactId[i] == contactId){
                        _this.selectedContactId.splice(i, 1);
                    }
                }
            }
        }
    }  
    
    deleteContact() {
        let onSuccess = () => {
                _this.GrowlerService.growl({
                    type: 'success',
                    message: "Contact Deleted Successfully",
                    delay: 2000
                });
                _this.selectedContactId = [];
                _this.onClose();
            },
            onError = (error) => {
                console.log(error);
            };
        let contactIdsData = {
            contactIds : _this.selectedContactId
        }
        _this.ContactService.deleteContact(contactIdsData);
        _this.ContactService.activePromise.then(onSuccess, onError);
    }
    
    
    showUpdateContact(contacts) {
           _this.$timeout(function() {
            _this.isEdit = true;
            _this.id = contacts.id;
            _this.name = contacts.name;
            _this.email = contacts.email;
        }, 20);     
    }
    
    
    updateContact() {
        if (_this.checkMandatoryFields()) {
            let onSuccess = (response) => {
                    _this.GrowlerService.growl({
                        type: 'success',
                        message: 'Contact Updated Successfully',
                        delay: 2000
                    });
                    _this.onClose();
                },
                onError = (error) => {
                    console.log(error);
                },
                data = {
                    name: _this.name,
                    email: _this.email
                };
            _this.ContactService.updateContact(_this.id, data);
            _this.ContactService.activePromise.then(onSuccess, onError);
        }
    }
    
    
    uploadAttachment(file) {
       _this.attachment = file;
       _this.importContactList();
    }

    isFileAdded(file){
      if(file.length > 0){
        this.fileNotSelected = true;
      }
      else{
        this.fileNotSelected = false;
      }
    }
  
  importContactList(){
      let onSuccess = (response) => {

          if(response.data.uploaded > 0) {
              let successMessage = response.data.uploaded + ' Contact Imported Successfully';
             _this.GrowlerService.growl({
             type: 'success',
             message: successMessage,
             delay: 2000
           });  
          }
          else {
              let errorMessage = response.data.failded + ' Contact Import Unsuccessful';
             _this.GrowlerService.growl({
             type: 'danger',
             message: errorMessage,
             delay: 2000
           }); 
          }
          _this.onClose();
        },
        onError = (error) => {
          console.log(error);
        };
      let fileData = {
          file :  _this.attachment[0]
      }
      _this.ContactService.importContactList(fileData);
      _this.ContactService.activePromise.then(onSuccess, onError);
    }

    onClose(){
         _this.$state.go(_this.$state.current, {}, {reload: true});
    }

}

