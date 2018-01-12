
var _activePromise,
	_errorTranslationKey,
	_countryList,
	_departmentList,
	_experienceList,
	_evaluatorList,
	_linkedEvaluatorLists,
	_linkedEvaluatorCount,
	_linkedInterviewerLists,
	_linkedInterviewerCount,
	_interviewerList,
	_candidateList,
	_previouspositionList,
	_existingtemplateList,
	_questionbankList,
	_avquestiontypeList,
	_avsubcategory,
	_skillSetList,
	_questionsList,
	_previouspositionquestionsList,
	_existingTemplateQuestions,
	_woquestiontypeList,
	_newCandidateId;

var _this;
export class InterviewService {
		/** @ngInject  */
	constructor($http, $q, AuthService, Upload, APP_CONSTANTS, UtilsService) {

		this.$http = $http;
		_this = this;
		this.AuthService = AuthService;
		this.Upload = Upload;
		this.APP_CONSTANTS = APP_CONSTANTS;
		this.$q = $q;
		this.UtilsService = UtilsService;
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

	get countryList() {
		return _countryList;
	}

	get departmentList() {
		return _departmentList;
	}

	get experienceList() {
		return _experienceList;
	}

	get linkedEvaluatorList() {
		return _linkedEvaluatorLists;
	}

	get linkedEvaluatorCount() {
		return _linkedEvaluatorCount;
	}

	get evaluatorList() {
		return _evaluatorList;
	}

	get interviewerList() {
		return _interviewerList;
	}

	get linkedInterviewerList() {
		return _linkedInterviewerLists;
	}

	get linkedInterviewerCount() {
		return _linkedInterviewerCount;
	}

	get candidateList() {
		return _candidateList;
	}

	get previouspositionList() {
		return _previouspositionList;
	}

	get existingtemplateList() {
		return _existingtemplateList;
	}

	get questionbankList() {
		return _questionbankList;
	}

	get avquestiontypeList() {
		return _avquestiontypeList;
	}

	get avsubCategory() {
		return _avsubcategory;
	}

	get woquestiontypeList() {
		return _woquestiontypeList;
	}

	get skillsetList() {
		return _skillSetList;
	}

	get questionsList() {
		return _questionsList;
	}

	get PrevPositionQuestionList() {
		return _previouspositionquestionsList;
	}

	get ExistingTemplateQuestionList() {
		return _existingTemplateQuestions;
	}

	get newCandidateId() {
		return _newCandidateId;
	}


	getEvaluatorInfo() {
		var onSuccess = (response) => {
				_evaluatorList = response.data.data;
				_activePromise = null;
			},
			onError = (error) => {
				if (error.status === 409) {
					_errorTranslationKey = error.data.errorCode;
				}
				_activePromise = null;
			},
			companyId = this.AuthService.user.companyId || 1,
			config = _this.UtilsService.getCofigObj();

		_activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/company/' + companyId + '/evaluators', config);
		_activePromise.then(onSuccess, onError);
	}

	getEvaluatorList(query) {
		let companyId = this.AuthService.user.companyId || 1;
		let  config = _this.UtilsService.getCofigObj();
		_activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/company/' + companyId + '/evaluators' + query, config);
	}

	getCandidateList(query, positionId) {
		let companyId = this.AuthService.user.companyId || 1,
		config = _this.UtilsService.getCofigObj();
		_activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/position/allcandidates/' + companyId + query + "&positionId=" + positionId, config);
	}

	getProfileCandidateList(query) {
		let config = _this.UtilsService.getCofigObj();
		_activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/position/all-profile-candidates' + query, config);
	}

	getLinkedEvaluatorList(query, interviewId) {
		let config = _this.UtilsService.getCofigObj();
		_activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/position/interview/' + interviewId + '/linkedevaluator' + query, config);
	}

	getLinkedInterviewerList(query, interviewId) {
		let config = _this.UtilsService.getCofigObj();
		_activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/position/interview/' + interviewId + '/linkedinterviewer' + query, config);
	}


	getInterviewerInfo() {
		var onSuccess = (response) => {
				_interviewerList = response.data.data;
				_activePromise = null;
			},
			onError = (error) => {
				if (error.status === 409) {
					_errorTranslationKey = error.data.errorCode;
				}
				_activePromise = null;
			},
			companyId = this.AuthService.user.companyId || 1,
			config = _this.UtilsService.getCofigObj();

		_activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/company/' + companyId + '/interviewer', config);
		_activePromise.then(onSuccess, onError);
	}

	getInterviewerList(query) {
		let companyId = this.AuthService.user.companyId || 1,
			config = _this.UtilsService.getCofigObj();
		return _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/company/' + companyId + '/interviewer' + query, config);
	}


	getPreviousPositionInfo(query) {
		let companyId = this.AuthService.user.companyId || 1;
		let  config = _this.UtilsService.getCofigObj();
		return _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/position/allpositionforfilter/' + companyId +"?"+query, config);
	}

	getExistingTemplateInfo() {
		let companyId = this.AuthService.user.companyId || 1,
			config = _this.UtilsService.getCofigObj();
		_activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/settings/template/custom/' + companyId, config);
	}

	getQuestionBankInfo(companyId) {
//		let config = _this.UtilsService.getCofigObj();
//		return _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/position/company/department/' + companyId, config);
        let config  = _this.UtilsService.getCofigObj(),
        userId = _this.AuthService.user.userId;
        return _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/setting/admin/department/' + userId+"?limit=100&page=1", config);
	}

	getAVQuestionTypeInfo() {
		let config = _this.UtilsService.getCofigObj();
		return _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/position/question/questiontypes', config);
	}

	getAVSubCategory() {
		var onSuccess = (response) => {
				_avsubcategory = response.data;
				_activePromise = null;
			},
			onError = (error) => {
				if (error.status === 409) {
					_errorTranslationKey = error.data.errorCode;
				}
				_activePromise = null;
			};
		let config = _this.UtilsService.getCofigObj();
		_activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/position/allpositionforfilter/1', config);
		_activePromise.then(onSuccess, onError);
	}

	//Get Skillset by department ID
	getSkillSet(id) {
		let config = _this.UtilsService.getCofigObj();
		return _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/position/skills/' + id, config);
	}

	saveAddedCandidate(cdnObj) {
		var onSuccess = (response) => {
				_newCandidateId = response;
				_activePromise = null;
			},
			onError = (error) => {
				if (error.status === 409) {
					_errorTranslationKey = error.data.errorCode;
				}
				_activePromise = null;
			},
			config = _this.UtilsService.getCofigObj();
		_activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/position/skills/' + id, config);
		_activePromise.then(onSuccess, onError);
	}

	//Get Questions by Skill ID ( For  Questions from question bank)
	getQuestionsBySkills(cid, sid) {
		let config = _this.UtilsService.getCofigObj();
		return _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/position/getrecomdatequestions/' + cid + '/' + sid, config);
	}

	//Get Existing Template Questions
	getExsTemplateQuestions(tid) {
		let config = _this.UtilsService.getCofigObj();
		return _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/settings/template/custom/question/' + tid, config);

	}

	//Get Previous positions
	getPreviousPositionQuestions(pid) {
		let config = _this.UtilsService.getCofigObj();
		return _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/position/previous/questions/' + pid, config);

	}

	//Post New Question
	saveNewQuestion(data) {
            let companyId = this.AuthService.user.companyId || 1;
            data.companyId = companyId;
		var deferred = this.$q.defer();
		var onSuccess = (response) => {
				//_skillSetList = response.data;
				deferred.resolve(response);
				_activePromise = null;
			},
			onError = (error) => {
				if (error.status === 409) {
					_errorTranslationKey = error.data.errorCode;
				}
				_activePromise = null;
				deferred.reject(error);
			},
			config = _this.UtilsService.postCofigObj();
		_activePromise = this.Upload.upload({
			url: this.APP_CONSTANTS.SERVER_URL + '/questions/savequestions',
			data: data,
			headers: config.headers
		});
		_activePromise.then(onSuccess, onError);
		return deferred.promise;
	}

	saveSelectedCandidates(cndList, positionID) {
		var payload = {
				"interviewId": 1,
				"candidateIds": cndList
			},
			onSuccess = (response) => {
				_newCandidateId = response;
				_activePromise = null;
			},
			onError = (error) => {
				if (error.status === 409) {
					_errorTranslationKey = error.data.errorCode;
				}
				_activePromise = null;
			},
			config = _this.UtilsService.postCofigObj();
		_activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL + '/interview/candidate', payload, config);
		_activePromise.then(onSuccess, onError);
	}

	//Get Recommended Questions and Saved Questions
	getInterviewQuestions(data) {
		var deferred = this.$q.defer();
		var onSuccess = (response) => {
				//_skillSetList = response.data;
				deferred.resolve(response.data);
				_activePromise = null;
			},
			onError = (error) => {
				if (error.status === 409) {
					_errorTranslationKey = error.data.errorCode;
				}
				_activePromise = null;
				deferred.reject(error);
			},
			config = _this.UtilsService.postCofigObj();
		_activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL + '/position/getinterviewquestions', data, config);
		_activePromise.then(onSuccess, onError);
		return deferred.promise;
	}

	//Save Interview recommended questions
	saveInterviewQuestions(data) {
		var deferred = this.$q.defer();
		var onSuccess = (response) => {
				//_skillSetList = response.data;
				deferred.resolve(response);
				_activePromise = null;
			},
			onError = (error) => {
				if (error.status === 409) {
					_errorTranslationKey = error.data.errorCode;
				}
				_activePromise = null;
				deferred.reject(error);
			};
		let config = _this.UtilsService.postCofigObj();
		_activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL + '/interview/questions', data, config);
		_activePromise.then(onSuccess, onError);
		return deferred.promise;
	}

	//update Interview questions
	updateInterviewQuestions(data) {
		var deferred = this.$q.defer();
		var onSuccess = (response) => {
				//_skillSetList = response.data;
				deferred.resolve(response);
				_activePromise = null;
			},
			onError = (error) => {
				if (error.status === 409) {
					_errorTranslationKey = error.data.errorCode;
				}
				_activePromise = null;
				deferred.reject(error);
			};
		config = _this.UtilsService.putCofigObj();
		_activePromise = this.$http.put(this.APP_CONSTANTS.SERVER_URL + '/interview/questions', data, config);
		_activePromise.then(onSuccess, onError);
		return deferred.promise;
	}

	addEvaluator(evaluator) {
		let config = _this.UtilsService.postCofigObj();
		_activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL + '/evaluator/add', evaluator, config);
	}

	addInterviewer(interviewer) {
		let config = _this.UtilsService.postCofigObj();
		_activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL + '/position/interviewer/add', interviewer, config);
	}

	addCandidate(candidate) {
		let config = _this.UtilsService.postCofigObj();
		_activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL + '/company/addcandidate', candidate, config);
	}
        
        updateCandidate(candidateId, candidate) {
		let config = _this.UtilsService.postCofigObj();
		_activePromise = this.$http.put(this.APP_CONSTANTS.SERVER_URL + '/candidate-review/candidate/'+candidateId, candidate, config);
	}

	importEvaluatorList(data) {
		let config = _this.UtilsService.postCofigObj();
		_activePromise = this.Upload.upload({
			url: this.APP_CONSTANTS.SERVER_URL + '/evaluator/import',
			data: data,
			headers: config.headers
		});
	}

	importInterviewerList(data) {
		let config = _this.UtilsService.postCofigObj();
		_activePromise = this.Upload.upload({
			url: this.APP_CONSTANTS.SERVER_URL + '/interviewer/import',
			data: data,
			headers: config.headers
		});
	}

	importCandidateList(data) {
		let companyId = this.AuthService.user.companyId || 1,
			config = _this.UtilsService.postCofigObj();
		_activePromise = this.Upload.upload({
			url: this.APP_CONSTANTS.SERVER_URL + '/candidate/import/list/' + companyId,
			data: data,
			headers: config.headers
		});
	}

	linkInterviewerToInterview(data) {
		let config = _this.UtilsService.postCofigObj();
		_activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL + '/position/interview/interviewer', data, config);
	}

	linkEvaluatorToInterview(data) {
            let config = _this.UtilsService.postCofigObj();
            _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL + '/position/interview/evaluator', data, config);

	}

	linkCompanyCandidateToInterview(data) {
		let config = _this.UtilsService.postCofigObj();
		_activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL + '/interview/candidate', data, config);

	}

	removeInterviewer(interviewId, interviewerId) {
		let config = _this.UtilsService.deleteConfigObj();
		_activePromise = this.$http.delete(this.APP_CONSTANTS.SERVER_URL + '/position/interview/' + interviewId + '/interviewer/' + interviewerId, config);

	}

	removeEvaluator(interviewId, evaluatorId) {
		let config = _this.UtilsService.deleteConfigObj(),
			apiUrl = this.APP_CONSTANTS.SERVER_URL + '/position/interview/' + interviewId + '/evaluator/' + evaluatorId;
		_activePromise = this.$http.delete(apiUrl, config);

	}

	removeCandidate(removeCandidateObj) {
		let config = _this.UtilsService.postCofigObj(),
			apiUrl = this.APP_CONSTANTS.SERVER_URL + '/position/interview/change-candidate-interview-status';
		_activePromise = this.$http.post(apiUrl, removeCandidateObj, config);

	}
  
  resendMail(data) {
		let config = _this.UtilsService.postCofigObj(),
			apiUrl = this.APP_CONSTANTS.SERVER_URL + '/settings/positions/resendmail';
		_activePromise = this.$http.post(apiUrl, data, config);

	}
  
  fetchHostInterviewer(intId) {
		let config = _this.UtilsService.getCofigObj();
		return _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/position/interview/'+intId+'/linkedinterviewer-host', config);
	}
  
  socialMediaApp() {
		let companyId = this.AuthService.user.companyId || 1,
        config = _this.UtilsService.getCofigObj();
		return _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/positions/getactivecompanysocialmedia/'+ companyId, config);
	}
  
  jobPortals(data) {
        let query = "?"+'&positionId='+data,
            config = _this.UtilsService.getCofigObj();
        return _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/position/job-portals'+query, config);
	}
  
  deletCartPortals(portalId) {
		let config = _this.UtilsService.getCofigObj();
		 _activePromise = this.$http.delete(this.APP_CONSTANTS.SERVER_URL + '/cart/remove/'+portalId , config);
	}
  
  getCartItems() {
		let config = _this.UtilsService.getCofigObj();
		return _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/cart/items', config);
	}
  
  addCartPortal(payload) {
		let config = _this.UtilsService.getCofigObj();
	 _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL + '/cart/save', payload, config);
	}

  markPositionPublic(data){
    let config = _this.UtilsService.postCofigObj(),
      apiUrl = this.APP_CONSTANTS.SERVER_URL + '/position/set_positions_private_public';
    _activePromise = this.$http.post(apiUrl, data, config);
  }  
  
  skills(positionId){  
      let config  = _this.UtilsService.getCofigObj();  
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+'/company/position/skillsets/'+positionId, config);
  }
  
  getCompanyDetails(){
    let  config = this.UtilsService.getCofigObj(),
        url = this.APP_CONSTANTS.SERVER_URL+'/setting/company/card-details';

    return _activePromise = this.$http.get(url,config);
  }
  
  socialMediaApp() {
		let companyId = _this.AuthService.user.companyId || 1,
    config = _this.UtilsService.getCofigObj();
		_activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/positions/getactivecompanysocialmedia/'+ companyId, config);
	}

}

