let _this;
const EMAIL_REGEX = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
const phoneRegex = /^[7-9][0-9]{9}|\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/g;
const zipCodeRegex = new RegExp("^[1-9][0-9]{4,5}$");
let companyUrlRegex = /https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/;
let compUrlRegex=/https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/;

/*
 @clients--Controller
 @param {object} NgTableParams description - initialise the ng-table & provides configuration
 @param {object} ClientsService description - returns the object and provides all the values related to the clients.
 @param {object} $scope This is act like glue between view and controller.
 @param {object} $element This represent element of dom.
 @param  {object} $timeout
 @param {NestedTableService} It nested table accordian service which is used in table accordian.
 */
export class ClientController {
	/** @ngInject  */
  constructor(ClientsService, $timeout, locationService, CandidateProfileService, GrowlerService, AdminCompanyInfoService, SuperAdminService, $state, UtilsService) {
    _this = this;
    _this.ClientsService = ClientsService;
    _this.locationService = locationService;
    _this.CandidateProfileService = CandidateProfileService;
    _this.GrowlerService = GrowlerService;
    _this.AdminCompanyInfoService = AdminCompanyInfoService;
    _this.SuperAdminService = SuperAdminService;
    _this.UtilsService = UtilsService;
    _this.$timeout = $timeout;
    _this.$state = $state;
    _this.companyProfile = [];
    //_this.countryList = [];
    //_this.stateList = [];
    //_this.cityList = [];
    //_this.getCountryList();
    _this.companyUrlForms = [];
    _this.companyUrls = [];
    _this.getCompanyUrl();
    _this.isInterview =  true;
    _this.isConfrence = false;
    //_this.isStateDisabled = true;
    //_this.isCityDisabled = true;
    //_this.searchCountry;
    //_this.searchState;
   // _this.searchCity;
    _this.geoAddress = {};

      if(_this.infoData && _this.infoData === 'edit'){
          _this.IsEdit = true;
          _this.companyID = _this.data;
          _this.getCompanyProfile(_this.data);
      }else{
          _this.IsAdd = true;
      }
  }
  
  // clearSearchCountry(){
  //   _this.searchCountry ='';
  // }
  
  // clearSearchStateInput(){
  //   _this.searchState ='';
  // }
  
  // clearSearchCityInput(){
  //   _this.searchCity ='';
  // }
  
  analyzeComPanyUrl(value){

      _this.errmsgUrl = "";
      if(!angular.isDefined(value) || value === "" || value === null){
          _this.errmsgUrl = "Please Enter Company Url";
      }
      else if(angular.isDefined(value) && !companyUrlRegex.test(value)){
          _this.errmsgUrl = " Enter Valid Company Url";
          _this.isUrlValid = false;

      }
      else {
          _this.errmsgUrl = "";
          _this.isUrlValid = true;

      }
  }

    analyzeCompanyWebsite(urlWebsite){
        _this.errormessageWebsite = "";
        if(!angular.isDefined(urlWebsite) || urlWebsite === "" || urlWebsite === null){
            _this.errormessageWebsite = "Please Enter Company Url";

        }
        else if(angular.isDefined(urlWebsite) && !compUrlRegex.test(urlWebsite)){
            _this.errormessageWebsite = " Enter Valid Company Url";
            _this.isvalidUrl = false;
        }
        else {
            _this.errormessageWebsite = "";
            _this.isvalidUrl = true;

        }
    }


    isInvalidEmail(email){
      _this.errormessage = "";
     if(angular.isDefined(email) && !reg.test(email)){
        _this.errormessage = "Enter Valid Email Id";
         _this.isvalidEmail = false;
      }
      else if(!angular.isDefined(email) || email === "" || email === null){
        _this.errormessage = " Please Enter Email Id";
      }else {
        _this.errormessage = "";
         _this.isvalidEmail = true;
      }
  };
  
  analyzePhoneNumber(value){
    _this.errmsgcon = "";
    if(angular.isDefined(value) && value.length < 10){
      _this.errmsgcon = "Enter Valid Contact Number";
        _this.isvalidContact = false;
    }
    else if(!angular.isDefined(value) || value === "" || value === null){
      _this.errmsgcon = "Please Enter Contact Number";
    }else {
      _this.errmsgcon = "";
        _this.isvalidContact = true;
    }
  }
  
  // getCountryList(){
  //   let onSuccess = (response) => {
  //       _this.countryList = response.data;
  //     },
  //     onError = (error) => {
  //       console.log(error);
  //     }
  //   _this.locationService.getCountryList();
  //   _this.locationService.activePromise.then(onSuccess, onError);
  // }


  // getStateList(countryId, reset){
  //   _this.isStateDisabled = false;
  //   _this.isCityDisabled = true;
  //   let onSuccess = (response) => {
  //       if(reset){
  //           _this.stateId = '';
  //           _this.cityId = '';
  //       }
  //       _this.stateList = response.data;
  //     },
  //     onError = (error) => {
  //       console.log(error);
  //     }
  //   _this.locationService.getStateList(countryId);
  //   _this.locationService.activePromise.then(onSuccess, onError);
  // }

  // getCityList(stateId, reset){
  //   _this.isStateDisabled = false;
  //     let onSuccess = (response) => {
  //         if(reset) {
  //             _this.cityId = '';
  //         }
  //          _this.isCityDisabled = false;
  //         _this.cityList = response.data;
  //       },
  //       onError = (error) => {
  //         console.log(error);
  //       }
  //     _this.locationService.getCityList(stateId);
  //     _this.locationService.activePromise.then(onSuccess, onError);
  // }
  
  getCompanyUrl(){
    let onSuccess = (response) => {
        _this.customUrlList = response.data;
      },
      onError = (error) => {
        console.log(error);
      }
    _this.CandidateProfileService.getCandidateUrl();
    _this.CandidateProfileService.activePromise.then(onSuccess, onError);
  }

  checkEmptyFields(){
      if((!angular.isDefined(_this.companyUrlForms.urlType)
          || _this.companyUrlForms.urlType == ''
       ||!angular.isDefined(_this.companyUrlForms.url)
          || _this.companyUrlForms.url == '')
          ||   _this.isUrlValid == false
      ){
        _this.fieldMsg = 'Please Select Field';
        _this.fieldMsgUrl =  'Please Enter Url';
         return false;
      }
      else{
          return true;
      }
  }

    checkFilledField(){
        if(angular.isDefined(_this.companyUrlForms.urlType)
            || _this.companyUrlForms.urlType !== ''
        ){
            _this.fieldMsg = '';
        }
    }

    checkFilledFieldUrl(){
        if(angular.isDefined(_this.companyUrlForms.url)
            || _this.companyUrlForms.url !== ''
            ||   _this.isUrlValid == true
        ){
            _this.fieldMsgUrl =  '';
        }

    }

  addCompanyUrl() {
      if (_this.checkEmptyFields()) {
          let companyUrlForms = {};
          if (_this.companyUrlForms
              && _this.companyUrlForms.url
              && _this.companyUrlForms.url.length > 0
              && _this.companyUrlForms.urlType
              && _this.companyUrlForms.urlType.urlTypeId) {
              companyUrlForms.url = _this.companyUrlForms.url;
              companyUrlForms.urlTypeId = _this.companyUrlForms.urlType.urlTypeId;
              if (_this.companyUrls.length < 4) {
                  _this.companyUrls.push(companyUrlForms);
                  _this.companyUrlForms = {};
              } else {
                  _this.GrowlerService.growl({
                      type: 'success',
                      message: 'You Can Add Only 4 Urls.',
                      delay: 2000
                  });
              }
              _this.companyUrlForms = {};
          }
          _this.fieldMsg = '';
          _this.fieldMsgUrl =  '';
      }
  }
  deleteCandidateUrl(index){
    _this.companyUrls.splice(index, 1);
  }
  
  isValid(){
    if(_this.companyUrlForms && _this.companyUrlForms.url && _this.companyUrlForms.url.length > 0 && _this.companyUrlForms.urlTypeId){
      return true;
    }else{
      return false;
    }
  }

    checkMandatoryFields() {
        if(_this.firstName && _this.firstName !== ''
            && _this.lastName && _this.lastName !== ''
            && _this.jobTitle && _this.jobTitle !== ''
            && _this.companyName && _this.companyName !== ''
            && _this.companySize && _this.companySize !== ''
            && _this.companyAddress && _this.companyAddress !== ''
            && _this.companyContactNo && _this.companyContactNo !== ''
            && _this.companyWebsite && _this.companyWebsite !== ''
            && _this.email && _this.email !== ''
            && ( _this.isInterview == true || _this.isConfrence == true)
            && _this.isvalidUrl == true
            && _this.isvalidEmail == true
            && _this.isvalidContact == true

        ) {
            return true;
        }
        else{_this.clientForm.$setSubmitted();
            return false;
        }
    }

    checkProductSelection(){
        if( _this.isInterview == true || _this.isConfrence == true){
            _this.productMsg = " ";
        }
        else{
            _this.productMsg = "Please Select Product"
        }
    }

    addClient() {
        _this.companyAddress = _this.geoAddress.name;
        if( _this.isInterview == false  &&  _this.isConfrence == false){
            _this.productMsg = "Please Select Product"
        }

        if(!angular.isDefined(_this.email) || _this.email === "" || _this.email === null){
            _this.errormessage = " Please Enter Email Id";
        }

        if(!angular.isDefined(_this.companyContactNo) || _this.companyContactNo === "" || _this.companyContactNo === null) {
            _this.errmsgcon = "Please Enter Contact Number";
        }
        if(!angular.isDefined(_this.companyWebsite) || _this.companyWebsite === "" || _this.companyWebsite === null){
            _this.errormessageWebsite = "Please Enter Company Url";
        }

        if (_this.checkMandatoryFields()) {
            let onSuccess = () => {
                    _this.GrowlerService.growl({type: 'success', message: "Client Added Successfully", delay: 300});
                    _this.close();
                },
                onError = (error) => {
                    console.log(error);
                },
                clientData = {
                    email: _this.email,
                    interview: _this.isInterview,
                    conference: _this.isConfrence,
                    firstName: _this.firstName,
                    lastName: _this.lastName,
                    jobTitle: _this.jobTitle,
                    companyName: _this.companyName,
                    companySize: _this.companySize,
                    address: _this.companyAddress,
                    companyContactNo: _this.companyContactNo,
                    companyExtVideoUrl: _this.companyExtVideoUrl,
                    companyWebsite: _this.companyWebsite,
                    companyUrlForms: _this.companyUrls
                };

            _this.ClientsService.addClient(clientData);
            _this.ClientsService.activePromise.then(onSuccess, onError);
        }
    }
  getCompanyProfile(companyId){
       _this.isvalidUrl = true;
       _this.isvalidEmail = true;
       _this.isvalidContact = true;
      let onSuccess = (response) => {
              _this.companyProfile = response.data;
              _this.addressData( _this.companyProfile.companyAddress);
              _this.companyId = _this.companyProfile.companyId;
              _this.firstName = _this.companyProfile.firstName;
              _this.lastName = _this.companyProfile.lastName;
              _this.jobTitle = _this.companyProfile.jobTitle;
              _this.email = _this.companyProfile.emailId;
              _this.companyName = _this.companyProfile.companyName;
              _this.companySize = _this.companyProfile.companySize;
              _this.companyWebsite = _this.companyProfile.companyWebsite;
              _this.companyContactNo = _this.companyProfile.companyContactNo;
              _this.products = _this.companyProfile.products;
              _this.isInterview  = false;
              _this.isConfrence  = false;
              for(let i = 0; _this.companyProfile.products.length > i; i++){
                  if(_this.companyProfile.products[i].productId === 1) {
                      _this.isInterview  = true;
                  }
                  if(_this.companyProfile.products[i].productId === 2) {
                      _this.isConfrence = true;
                  }
              }
              //_this.getStateList(_this.countryId);
             // _this.getCityList(_this.stateId);
              if(response.data.companyUrlForms){
                  if(response.data.companyUrlForms.length >0){
                      for (var i = 0; i < response.data.companyUrlForms.length; i++) {
                          let companyUrlForms = {};
                          companyUrlForms.url = response.data.companyUrlForms[i].url;
                          companyUrlForms.urlTypeId = response.data.companyUrlForms[i].urlTypeId;
                          _this.companyUrls.push(companyUrlForms);
                      }
                  }

              }
          },
          onError = (error) => {
              console.log(error);
          };
      _this.AdminCompanyInfoService.getCompanyProfile(companyId);
      _this.AdminCompanyInfoService.activePromise.then(onSuccess, onError);
  }

  updateClientProfile() {
    _this.companyAddress = _this.geoAddress.name;
    if(!angular.isDefined(_this.companyWebsite) || _this.companyWebsite === "" || _this.companyWebsite === null){
          _this.errormessageWebsite = "Please Enter Company Url";
      }
      if (_this.checkMandatoryFields()) {
          let onSuccess = (response) => {

                  _this.GrowlerService.growl({
                      type: 'success',
                      message: 'Client Updated Successfully',
                      delay: 2000
                  });
                  _this.close();
              },
              onError = (error) => {
                  console.log(error);
              },
              data = {
                  firstName: _this.firstName,
                  lastName: _this.lastName,
                  jobTitle: _this.jobTitle,
                  companyName: _this.companyName,
                  companySize: _this.companySize,
                  address: _this.companyAddress,
                  companyContactNo: _this.companyContactNo,
                  companyExtVideoUrl: _this.companyExtVideoUrl,
                  companyWebsite: _this.companyWebsite,
                  companyUrlForms: _this.companyUrls
              };
          _this.ClientsService.updateClientProfile(_this.companyID, data);
          _this.ClientsService.activePromise.then(onSuccess, onError);
      }
  }


  setAddressValue(addressData) {
    _this.addressData = addressData;
    }
}
