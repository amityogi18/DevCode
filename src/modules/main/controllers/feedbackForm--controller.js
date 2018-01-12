let reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
export class FeedbackFormController {
    /** @ngInject */
	constructor(feedbackService, GrowlerService) {
      this.feedbackService = feedbackService;
      this.GrowlerService = GrowlerService;
      this.containerPOS = false;
      this.emailCriteria = false;
      this.selectMsg='Please Select Topic';
      
      $(document).mouseup(function(e) {
        var container = $(".md-select-menu-container");

        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) 
        {
            container.hide();
        }
      });
	}

	toggleFeedbackContainer(){
            this.containerPOS = !this.containerPOS;

            if(!this.containerPOS){
                angular.element(".feedback-form").animate({
                    bottom: "-30",
                    color:"white"
                }, 150, function() {
                    angular.element(".feedback-form-container").hide();
                });
            }
            else{
               angular.element(".feedback-form-container").show().animate({
                   bottom: "0",
                   color:"white"
               }, 150, function() {

               });
            }
	}
	
    closeFeedback(invalid){
        this.containerPOS = false;
        if(!invalid){
            angular.element(".feedback-form").animate({
                bottom: "-30"
            }, 150, function() {
                angular.element(".feedback-form-container").hide();
            });
        }
    }
    
    clearAll(){
        this.emailId = '';
        this.topic = '';
        this.description = '';
        this.ratings = 0;
    }

    checkMandatoryFields(){
        if(this.emailId && this.emailId !==''
        && this.topic && this.topic !==''
        && this.emailCriteria == true){
          return true;
        }
        else{
            this.selectMsg='Please Select Topic';
            this.feedbacform.$setSubmitted();
            return false;
        }
    }

    saveFeedback() {
        if(!angular.isDefined(this.emailId) || this.emailId === "" || this.emailId === null){
            this.errormessage = "Please Enter Email Id";
        }
        if (this.checkMandatoryFields()) {
            var feedbackData = {
                "email": this.emailId,
                "subject": this.topic,
                "message": this.description,
                "ratingPoints": this.ratings
            };

            this.feedbackService.getfeedback(feedbackData);
            this.feedbackService.activePromise.then((response) => {

                console.log(response);
                this.GrowlerService.growl({
                    type: 'success',
                    message: "Thank you for your valuable feedback",
                    delay: 2000
                });
                this.clearAll();
            }, (error) => {
                console.log(error);
            });
            this.closeFeedback(this.feedbacform.$invalid);
            //this.feedbacform.$setSubmitted();
        }
    }
    
    isEmailValid(emailId){
    this.errormessage = "";
  
    if(angular.isDefined(emailId) && !reg.test(emailId)){
      this.errormessage = "Enter Valid Email Id";
      this.emailCriteria = false;
    }
  else if(!angular.isDefined(emailId) || emailId === "" || emailId === null){
      this.errormessage = "Please Enter Email Id";
    }
    else {
      this.errormessage = "";
      this.emailCriteria = true;
    }

  };
    clearMsgField(){
        this.errormessage = "";
        this.selectMsg="";
    }
}