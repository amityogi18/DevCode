var _activePromise,
  _errorTranslationKey,
  _candidateReviewList,
  _screenConfigData,
  _questionList,
  _comments,
  _otherPositionRatings;

export class candidateReviewService {
	/** @ngInject  */
  constructor($http, Upload, $state, UtilsService, APP_CONSTANTS, AuthService) {
   
    this.$http = $http;
    this.Upload = Upload;
    this.$state = $state;
    this.UtilsService = UtilsService;
    this.AuthService = AuthService;
    this.APP_CONSTANTS = APP_CONSTANTS;   
  }

  get activePromise() {
    return _activePromise;
  }

  get errorTranslationKey() {
    return _errorTranslationKey;
  }

  set errorTranslationKey(value) {
    _errorTranslationKey = value;
  }

 
  get candidateReviewList() {
    return _candidateReviewList;
  }

  get screenConfigData(){
    return _screenConfigData;
  }


  getPositionCodes(){
    let companyId = this.AuthService.user.companyId || 1;
    var onSuccess = (response) => {
        _activePromise = null;
        return response.data;
      },
      onError = (error) => {
        if (error.status === 409) {
          _errorTranslationKey = error.data.errorCode;
        }
        _activePromise = null;
        return error;
      },
      config  = this.UtilsService.getCofigObj(); 

    _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL+'/position/allpositionforfilter/'+companyId,config );
    return _activePromise.then(onSuccess, onError);
  }

  getInterviews(positionId){
    var onSuccess = (response) => {
        _activePromise = null;
        return response.data;
      },
      onError = (error) => {
        if (error.status === 409) {
          _errorTranslationKey = error.data.errorCode;
        }
        _activePromise = null;
        return error;
      },
      config  = this.UtilsService.getCofigObj(); 

    _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL+'/position/allpositionforfilter/'+positionId+'/interview',config);
    return _activePromise.then(onSuccess, onError);
  }
  getComment(candidateId,interviewId,questionId,commentTypeId,perPage,page){
    var onSuccess = (response) => {
        _activePromise = null;
        return response.data;
      },
      onError = (error) => {
        if (error.status === 409) {
          _errorTranslationKey = error.data.errorCode;
        }
        _activePromise = null;
        return error;
      },
      config  = this.UtilsService.getCofigObj(); 

    _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL+'/candidate/InterviewQuestions/getComment?candidateId='+candidateId+'&interviewId='+interviewId+'&genericId='+questionId+'&commentTypeId='+commentTypeId+'&perPage='+perPage+'&page='+page, config);
    return _activePromise.then(onSuccess, onError);
  }

  getInterviewQuestionResponse(candidateId,interviewId,questionId){
    var onSuccess = (response) => {
        _activePromise = null;
        return response.data;
      },
      onError = (error) => {
        if (error.status === 409) {
          _errorTranslationKey = error.data.errorCode;
        }
        _activePromise = null;
        return error;
      },
      config  = this.UtilsService.getCofigObj(); 

    _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL+'/candidate/InterviewQuestions/get/'+questionId+'?candidateId='+candidateId+'&interviewId='+interviewId, config);
    return _activePromise.then(onSuccess, onError);
  }

  getInterviewQuestions(candidateId,interviewId){
    var onSuccess = (response) => {
        _activePromise = null;
        return response.data;
      },
      onError = (error) => {
        if (error.status === 409) {
          _errorTranslationKey = error.data.errorCode;
        }
        _activePromise = null;
        return error;
      },
      config  = this.UtilsService.getCofigObj(); 

    _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL+'/candidate/InterviewQuestions/get?candidateId='+candidateId+'&interviewId='+interviewId, config);
    return _activePromise.then(onSuccess, onError);
  }
  
   getLiveRecordings(candidateId,interviewId){
    var onSuccess = (response) => {
        _activePromise = null;
        return response.data;
      },
      onError = (error) => {
        if (error.status === 409) {
          _errorTranslationKey = error.data.errorCode;
        }
        _activePromise = null;
        return error;
      },
      config  = this.UtilsService.getCofigObj(); 
                                                                   
    _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL+'/candidate/'+candidateId+'/liveinterview/'+interviewId+'/recording', config);
    return _activePromise.then(onSuccess, onError);
  }
  postComment(commentInfo){
      let userId = this.AuthService.user.userId || 1;
      commentInfo.userId = userId;
    var onSuccess = (response) => {
        _activePromise = null;
        return  response.data;
      },
      onError = (error) => {
        if (error.status === 409) {
          _errorTranslationKey = error.data.errorCode;
        }
        _activePromise = null;
        return error;
      },
      config  = this.UtilsService.postCofigObj(); 

    _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL+"/candidate/InterviewQuestions/comment",commentInfo, config);

    return   _activePromise.then(onSuccess, onError);;
  }

  compareCandidates(ids, query){
    let config  = this.UtilsService.postCofigObj(); 
    let candidateIds = {
                        "candidateIds": ids
                    };
    return _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL+"/position/interview/comparecandidates"+query, candidateIds, config);

  }

  updateCandidateInfo(candidateId,candidateInfo){
    var onSuccess = (response) => {
        _activePromise = null;
        return  response.data;
      },
      onError = (error) => {
        if (error.status === 409) {
          _errorTranslationKey = error.data.errorCode;
        }
        _activePromise = null;
        return error;
      },
      config  = this.UtilsService.putCofigObj();

    _activePromise = this.$http.put(this.APP_CONSTANTS.SERVER_URL+"/candidate-review/candidate/"+candidateId,candidateInfo, config);

    return   _activePromise.then(onSuccess, onError);;
  }
  
  getRecommendationCount(candidateId, interviewId){
      let userId = this.AuthService.user.userId || 1;
    var onSuccess = (response) => {
        _activePromise = null;
        return response.data;
      },
      onError = (error) => {
        if (error.status === 409) {
          _errorTranslationKey = error.data.errorCode;
        }
        _activePromise = null;
        return error;
      },
      config  = this.UtilsService.getCofigObj(); 

    _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL+'/candidate/recommendations/'+userId+'/'+candidateId+'/'+interviewId, config);
    return _activePromise.then(onSuccess, onError);
  }

  saveRecommendation(recommendation){
    let userId = this.AuthService.user.userId || 1;
    recommendation.userId = userId;
    var onSuccess = (response) => {
        _activePromise = null;
        return  response.data;
      },
      onError = (error) => {
        if (error.status === 409) {
          _errorTranslationKey = error.data.errorCode;
        }
        _activePromise = null;
        return error;
      },
       config  = this.UtilsService.postCofigObj();

    _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL+"/evaluator/candidate/recommendations",recommendation, config);

    return   _activePromise.then(onSuccess, onError);;
}

getEvaluators(candidateId){
  var onSuccess = (response) => {
      _activePromise = null;
      return response.data;
    },
    onError = (error) => {
      if (error.status === 409) {
        _errorTranslationKey = error.data.errorCode;
      }
      _activePromise = null;
      return error;
    },
    config  = this.UtilsService.getCofigObj();

  _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL+'/candidate-review/evaluatedcandidate/'+candidateId+'/evaluators', config);
  return _activePromise.then(onSuccess, onError);
}

toggleFavorite(data){
  let userId = this.AuthService.user.userId || 1;
  data.userId = userId;
  var onSuccess = (response) => {
      _activePromise = null;
      return  response.data;
    },
    onError = (error) => {
      if (error.status === 409) {
        _errorTranslationKey = error.data.errorCode;
      }
      _activePromise = null;
      return error;
    },
    config = this.UtilsService.postCofigObj();

  _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL+"/candidate-review/favourite",data, config);

  return _activePromise.then(onSuccess, onError);;
}

getFavorite(candidateId){
    let userId = this.AuthService.user.userId || 1;
  var onSuccess = (response) => {
      _activePromise = null;
      return  response.data;
    },
    onError = (error) => {
      if (error.status === 409) {
        _errorTranslationKey = error.data.errorCode;
      }
      _activePromise = null;
      return error;
    },
    config = this.UtilsService.getCofigObj();

  _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL+"/candidate-review/favourite/"+userId+"/"+candidateId, config);

  return _activePromise.then(onSuccess, onError);;
}

addRating(data){
     let userId = this.AuthService.user.userId || 1;
     data.userId = userId;
  var onSuccess = (response) => {
      _activePromise = null;
      return  response.data;
    },
    onError = (error) => {
      if (error.status === 409) {
        _errorTranslationKey = error.data.errorCode;
      }
      _activePromise = null;
      return error;
    },
    config = this.UtilsService.postCofigObj();

  _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL+"/ratings/create-rating",data, config);

  return   _activePromise.then(onSuccess, onError);;
}

getEvaluatorRatings(data){
  var onSuccess = (response) => {
      _activePromise = null;
      return  response.data;
    },
    onError = (error) => {
      if (error.status === 409) {
        _errorTranslationKey = error.data.errorCode;
      }
      _activePromise = null;
      return error;
    },
    config = this.UtilsService.postCofigObj();
  _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL+"/ratings/fetch-all-ratings",data, config);

  return   _activePromise.then(onSuccess, onError);;
}

getAllRatings(data){
  var onSuccess = (response) => {
      _activePromise = null;
      return  response.data;
    },
    onError = (error) => {
      if (error.status === 409) {
        _errorTranslationKey = error.data.errorCode;
      }
      _activePromise = null;
      return error;
    },
    config = this.UtilsService.postCofigObj();
  _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL+"/ratings/fetch-candidate-all-ratings",data, config);

  return   _activePromise.then(onSuccess, onError);;
}

getRating(data){
    let userId = this.AuthService.user.userId || 1;
        data.userId = userId;
    var onSuccess = (response) => {
      _activePromise = null;
      return  response.data;
    },
    onError = (error) => {
      if (error.status === 409) {
        _errorTranslationKey = error.data.errorCode;
      }
      _activePromise = null;
      return error;
    },
    config = this.UtilsService.postCofigObj();
  _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL+"/interview/candidate/user/rating",data, config);

  return   _activePromise.then(onSuccess, onError);;
}

getRatingTypes(){
  var onSuccess = (response) => {
      _activePromise = null;
      return response.data;
    },
    onError = (error) => {
      if (error.status === 409) {
        _errorTranslationKey = error.data.errorCode;
      }
      _activePromise = null;
      return error;
    },
    config = this.UtilsService.getCofigObj();

  _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL+'/ratings/fetch-rating-types', config);
  return _activePromise.then(onSuccess, onError);
}

getOtherPositionRatings(data){
  var onSuccess = (response) => {
      _activePromise = null;
      return  response.data;
    },
    onError = (error) => {
      if (error.status === 409) {
        _errorTranslationKey = error.data.errorCode;
      }
      _activePromise = null;
      return error;
    },
    config = this.UtilsService.postCofigObj();
  _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL+"/ratings/get-candidate-other-ratings",data, config);

  return   _activePromise.then(onSuccess, onError);;
}
getCandidates(filter){ 
  let companyId = this.AuthService.user.companyId || 1;
  let url = this.APP_CONSTANTS.SERVER_URL+'/position/candidates/company/'+companyId+'/companycandidates'+filter;

  let config = this.UtilsService.getCofigObj();

  return _activePromise = this.$http.get(url,config);
}

getAllCandidateInterviews(candidateId,positionId){
  var onSuccess = (response) => {
      _activePromise = null;
      return response.data;
    },
    onError = (error) => {
      if (error.status === 409) {
        _errorTranslationKey = error.data.errorCode;
      }
      _activePromise = null;
      return error;
    },
    config = this.UtilsService.getCofigObj();

  _activePromise =positionId? this.$http.get(this.APP_CONSTANTS.SERVER_URL+'/position/'+positionId+'/candidate/'+candidateId+'/interviews', config): this.$http.get(this.APP_CONSTANTS.SERVER_URL+'/position/0/candidate/'+candidateId+'/interviews', config);
  return _activePromise.then(onSuccess, onError);
}
getCandidateProfile(candidateId, interviewId){
    let companyId = this.AuthService.user.companyId || 1;
  var onSuccess = (response) => {
      _activePromise = null;
      return response.data;
    },
    onError = (error) => {
      if (error.status === 409) {
        _errorTranslationKey = error.data.errorCode;
      }
      _activePromise = null;
      return error;
    },
    config = this.UtilsService.getCofigObj();
 
  _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL+'/candidate-review/'+candidateId+ '/' +interviewId, config);
  return _activePromise.then(onSuccess, onError);
}
 
  getAllInterviewQuestion(data){
        let config  = this.UtilsService.postCofigObj();
        _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL+ '/position/getinterviewquestions?limit=2&page=1', data, config);
   }
        
    shareInterviewQuestion(data){ 
        let config  = this.UtilsService.postCofigObj();
          _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL + '/interview_questions/share-interview-questions', data, config);  
    }   
    
  getDepartments(){
    let companyId = this.AuthService.user.companyId || 1,
    config  = this.UtilsService.getCofigObj();
    _activePromise = this.$http.get(this.api+"/position/company/department/"+companyId, config);
  }
  
  getOtherRatings(interviewId, candidateId){
    var onSuccess = (response) => {
        _activePromise = null;
        return  response.data;
      },
      onError = (error) => {
        if (error.status === 409) {
          _errorTranslationKey = error.data.errorCode;
        }
        _activePromise = null;
        return error;
      },
      config = this.UtilsService.postCofigObj();
    _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL+'/admin/userwise/overall/rating/'+interviewId+ '/' +candidateId, config);

    return   _activePromise.then(onSuccess, onError);
  }
  
  updateCandidateStatus(data){
    let config  = this.UtilsService.postCofigObj();
    _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL+'/position/interview/candidate/updatestatus',data, config);
  }
  
  getAllEvaluatorList(query) {
		let companyId = this.AuthService.user.companyId || 1,
		    config = this.UtilsService.getCofigObj();
		_activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL +'/candidate-review/share-interview-questions/users/' + companyId + query, config);
	}
  
  getCandidatesList(filter){ 
    let companyId = this.AuthService.user.companyId || 1,
        config = this.UtilsService.getCofigObj();
    let url = this.APP_CONSTANTS.SERVER_URL+'/admin/ondemand/payment-status/candidates'+filter;

    return _activePromise = this.$http.get(url,config);
  }

  getCandidateData(candidateId){ 
    let  config = this.UtilsService.getCofigObj(),
        url = this.APP_CONSTANTS.SERVER_URL+'/private/candidate/candidate-details/'+candidateId;

    return _activePromise = this.$http.get(url,config);
  }
  
  getCompanyDetails(){
    let  config = this.UtilsService.getCofigObj(),
        url = this.APP_CONSTANTS.SERVER_URL+'/setting/company/card-details';

    return _activePromise = this.$http.get(url,config);
  }
  
  getResume(candidateId){
    let  config = this.UtilsService.getCofigObj(),
        url = this.APP_CONSTANTS.SERVER_URL+'/job-search/company/candidate-confidential-info/'+candidateId;

    return _activePromise = this.$http.get(url,config);
  }
  
  getJobData(data){
    let  config = this.UtilsService.getCofigObj(),
        url = this.APP_CONSTANTS.SERVER_URL+'/search/keyword/job-title/suggestion'+data;

    return _activePromise = this.$http.get(url,config);
  }
  
  getSearchList(data){
    let  config = this.UtilsService.getCofigObj(),
        url = this.APP_CONSTANTS.SERVER_URL+'/search/keyword/suggestion'+data;

    return _activePromise = this.$http.get(url,config);
  }
}