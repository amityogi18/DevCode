let _this;
export class certificateTemplateController {
	/** @ngInject  */
  constructor($window, $state, $location, CertificationTemplateService, CandidateProfileService, GrowlerService, candidateProfilePublicService, $storage) {
    _this = this;
    _this.$window = $window;
    _this.$state = $state;
    _this.$location = $location;
    _this.CertificationTemplateService = CertificationTemplateService;
    _this.GrowlerService = GrowlerService;
    _this.CandidateProfileService = CandidateProfileService;
    _this.candidateProfilePublicService = candidateProfilePublicService;
    _this.$storage =$storage; 
    _this.candidateProfileId = 1;
    _this.certificationContent = {
                                   "id": "",
                                   "certificationCode": "",
                                   "statusId": "",
                                   "issueDate": "",
                                   "firstName": "",
                                   "lastName": "",
                                   "certificationType": "",
                                   "skillsetName": ""
                                 };
    _this.allCertificates;
    _this.getAllCertificates();
    _this.shareCertification = false;
    _this.isCertificateFound = true;
    _this.getShareProfile();
    _this.isShowShareCheckBox = false;
    _this.getVideoUrl();
  }

  getCertificationDetails(){
   let onSuccess = (response) => {
       _this.certificationContent = response.data;
     },
     onError = (error) =>{
       console.log(error);
     };

   _this.CertificationTemplateService.getCertificationDetails(_this.candidateProfileId);
   _this.CertificationTemplateService.activePromise.then(onSuccess, onError);
 }

  getAllCertificates(){
    let onSuccess = (response) => {
        _this.allCertificates = response.data.certifications;
      },
      onError = (error) =>{
        if(error.data.errorCode === "CERTIFICATION_NOT_FOUND_ERROR"){
          _this.isCertificateFound = false;
        }
        console.log(error);
      };

    _this.CertificationTemplateService.getAllCertificates();
    _this.CertificationTemplateService.activePromise.then(onSuccess, onError);
  }

  downloadCertificate(certificate){
    let onSuccess = (response) => {
        _this.certificationContent = response.data;
        //_this.generatePDF(_this.certificationContent);
      },
      onError = (error) =>{
        console.log(error);
      };

    _this.CertificationTemplateService.getCertificationDetails(certificate.certificateId);
    _this.CertificationTemplateService.activePromise.then(onSuccess, onError);
  }

  getVideoUrl(){
    let onSuccess = (response) => {
            console.log(response.data)
            if(response && response.data){
                _this.twoMinIntro = response.data.videoPath;
                if(_this.twoMinIntro && _this.twoMinIntro != ""){
                   _this.isShowShareCheckBox = true;
                }
          } 
        },
        onError = (error) =>{
            console.log(error);
        };
        _this.candidateProfilePublicService.getCandidateTwoMinIntro();
        _this.candidateProfilePublicService.activePromise.then(onSuccess, onError);
  }

  shareMyCertification(value){
      _this.certificationShare = {};

      _this.certificationShare = {
        "certificationShare" : value
      }
     _this.CandidateProfileService.addToMyProfile(_this.certificationShare);
     let onSuccess = (response) => {
            // window.alert(response.data.successMessage);
            _this.GrowlerService.growl({
            type:'success',
            message : response.data.successMessage,
            delay :2000
          });
          },
          onError = (error) => {
            console.log(error);
     };
    _this.CandidateProfileService.activePromise.then(onSuccess, onError);
  }

  getShareProfile(){
    let onSuccess = (response) => {
        _this.shareCertification =  response.data.certificationShare === 1 ? true : false;
      },
      onError = (error) => {
            console.log(error);
     };
     _this.CandidateProfileService.getShareLink();
     _this.CandidateProfileService.activePromise.then(onSuccess, onError);
  }

  generatePDF(){
      $('.form').scrollTop(0);
      let data = _this.certificationContent;
  	  let fullName = data.firstName + " "+data.lastName;
      let certificationCode = data.certificationCode;
      let issueDate = data.issueDate;
      let certificationType = data.certificationType.toLowerCase();
      let skillName = data.skillsetName;
      let date = moment().format('dddd Do MMM YYYY');
  	  _this.getCanvas().then(function(canvas){
      		var
      		form = $('.form'),
          cache_width = form.width(),
      		img = canvas.toDataURL("image/png"),
      		doc = new jsPDF({
                unit:'px',
                format:'a4'
              });
              doc.addImage(img, 'JPEG', 20, 20);
              let certificateName = certificationType+' certificate ' + fullName + ' '+ date +'.pdf';
              doc.save(certificateName);
              form.width(cache_width);
      	});


  }

  getCanvas(){
    var form = $('.form'),
        cache_width = form.width(),
    	  a4  =[ 595.28,  841.89];
  	form.width((a4[0]*1.33333) -80).css('max-width','none');
  	return html2canvas(form,{
      	imageTimeout:2000,
      	removeContainer:true
      });
  }

  startCertificate(certificate){
        _this.$storage.setItem('skillName', certificate.skillsetName);
        _this.$storage.setItem('skillId', certificate.skillsetId);
        //_this.$state.go('ci.certificate', {skillId : certificate.skillsetId});
        if(window.mobile){
          _this.$state.go('ci.certificate', {skillId : certificate.skillsetId});
        }
        else{
          let url = _this.$location.$$host == 'localhost' ? "/ci/certificate/"+certificate.skillsetId : "/ci/certificate/"+certificate.skillsetId;
          _this.$window.childWindow = _this.popupwindow(_this.$window.location.origin + url, "Certificate");
        }
        _this.$window.childWindow.openedFromCandidateInstructionPage = true;
    }

  popupwindow(url, title, width, height, left, top) {
        if(!width){
          width = screen.width;
        }
        if(!height){
          height = (screen.height * 90)/100;
        }
        if(!left){
          left = 0;
        }
        if(!top){
          top = 0;
        }

        return _this.$window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+width+', height='+height+', top='+top+', left='+left);
      }
};
