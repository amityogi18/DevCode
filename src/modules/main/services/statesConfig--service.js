export class StatesConfig {
    /** @ngInject */
  constructor(AuthService) {
    this.AuthService = AuthService; 
     this.guestStates = [
          "app.user-login", 
          "app.candidate-login",
          "app.forget-password",
          "app.reset-password",
          "signup.assessment-home",
          "signup.company-signup",
          "signup.email-confirmation",
          "signup.company-info",
          "signup.candidate-signup",
          "signup.candidate-confirmation",
          "signup.candidate-email-confirmation"
      ];
      this.guestConfStates = [
          "conference.free-conference-participant",
          "conference.free-conference-host",
          "conference.host-webrtc",
          "conference.participant-webrtc",
          "conference.free-conference-hostcheck",
          "conference.free-conference",
          "conference.meeting-error",
          "conference.meeting-end",
          "conference.meeting-expired",
          "conference.host-login",
          "conference.participant-login",
          "conference.prepare",
          "public.profile",
          "public.job-description",
          "public.applied-job-description",
          "public.candidate-public-login",
          "ci.interview",
          "app.schedule-interview",
          "conference.candidate-interview"
      ];
  }
 
  checkAuthorizedStates(toState){
      let loggedInUser = this.AuthService.user;
      let isInt = false, isConf = false;
      //check if user is logged in
      if(loggedInUser){            
            //check for user type
            if(this.guestConfStates.indexOf(toState) > -1)
            {
                return true;
            }
            if(this.guestStates.indexOf(toState) > -1)
            {
                return false;
            }
            if(loggedInUser.userType === 1){
                // find products
                if(loggedInUser.products && loggedInUser.products.length > 0){
                    for (var i = 0; i < loggedInUser.products.length; i++) {
                        if(loggedInUser.products[i] === 1){
                            isInt = true;
                        }else if(loggedInUser.products[i] === 2){
                            isConf = true;
                        }

                    }
                }
                //check for both products
                if(isInt && isConf){
                    //check if user is not sa
                    if(loggedInUser.userRoles === 7 || loggedInUser.userRoles === 8 ||loggedInUser.userRoles === 9 || loggedInUser.userRoles === 10 ||loggedInUser.userRoles === 11 ||loggedInUser.userRoles === 12 ||loggedInUser.userRoles === 13 ||loggedInUser.userRoles === 14  || loggedInUser.userRoles === 15|| loggedInUser.userRoles === 16 || loggedInUser.userRoles === 17){
                        if(toState.indexOf("candidateProfile.") > -1)
                        {
                            return false;
                        }
                    }else
                    {   //check for conf user
                        if(loggedInUser.userRoles === 18){
                            if(toState.indexOf("conference.") > -1 || toState.indexOf("public.") > -1 || toState.indexOf("transaction.") > -1)
                            {
                                return true;
                            }
                            return false;
                        }else
                        { // check for all other users
                            if(toState.indexOf("candidateProfile.") > -1 || toState.indexOf("sa.") > -1)
                            {
                                return false;
                            }
                        }
                        
                    }
                    return true;
                }
                //check if only interview
                else if(isInt && !isConf){
                    
                    if(toState.indexOf("candidateProfile.") > -1 
                            || toState.indexOf("sa.") > -1 
                            || toState.indexOf("conference.") > -1)
                    {
                        // add exception for interview flow //TODO - check with manish
                        if(toState.indexOf("conference.candidate-webrtc") > -1
                                || toState.indexOf("conference.host-interview") > -1
                                || toState.indexOf("conference.candidate-interview") > -1
                                || toState.indexOf("conference.custom-question") > -1){
                              return true;
                        }
                        
                        return false;
                    }
                    return true;
                }
                // check if only conf
                else if(!isInt && isConf){
                    if(toState.indexOf("conference.") > -1 
                            || toState.indexOf("public.") > -1
                            || toState.indexOf("transaction.") > -1)
                    {
                        return true;
                    }
                    return false;
                }
            }
            // check for candidate
            else if(loggedInUser.userType === 2)
            {
                if(toState.indexOf("candidateProfile.") > -1 
                        || toState.indexOf("public.") > -1 
                        || toState.indexOf("ci.") > -1
                // add exception for test //TODO - check with manish
                        || toState.indexOf("conference.candidate-interview") > -1
                        || toState.indexOf("conference.candidate-webrtc") > -1
                        || toState.indexOf("candidateProfile.admin-payment") > -1
                        || toState.indexOf("transaction.") > -1
                    )
                {   
                    return true;
                }
                return false;
            }
          
      }
  }
}