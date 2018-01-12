let _this;

export class CandidateCompareController {
	/** @ngInject  */
  constructor($stateParams, NgTableParams, $state, $timeout, $filter, candidateReviewService, $sce, $window, UtilsService, dataTableService, $storage, LoaderService) {

    console.log('Inside candidate controller constructor');
    _this=this;
    _this.$timeout = $timeout;
    _this.$filter = $filter;
    _this.$stateParams = $stateParams;
    _this.$window = $window;
    _this.UtilsService = UtilsService;
    _this.$state = $state;
    _this.$sce = $sce;
    _this.job='';
    _this.interview='';
    _this.statusFilter = '';
    _this.filterCollapse=false;
    _this.shownone = false;
    _this.sortBy = '';
    _this.order = true;
    _this.hideAnswer = false;
    _this.searchtext='';
    _this.selectedCandidate = null;
    _this.selectedQuestion = null;
    _this.selectedQuestionIndex = -1;
    _this.candidateReviewService = candidateReviewService;
    _this.dataTableService = dataTableService;
    _this.LoaderService = LoaderService;
   // _this.dataTableService = dataTableService;
   _this.$storage = $storage;
    _this.dataTableService.initTable([], {});
    _this.colNum = 6;
    _this.positionId = null;
    _this.interviewId = null;
    _this.searchFilter = {};
    _this.sortField = {};
    _this.pageSize = 10;
    _this.isFirstLoad = true;
    _this.getPositionList();
    _this.candidateIds = "";
    _this.isReadonly = true;
    _this.candidateCount = 0;
    _this.screenConfigData = {           
            sortOptions: {
                'name': 'Name',
                'rating': 'Overall Rating',
                'likeCount': 'Likes',
                'dislikeCount': 'Dislikes',
                'maybeCount': 'May Be'
            },
            filterOptions: {
                '21': "New",
                '11': "Completed",
                '22': "In Review",
                '14': "On Hold",
                '6': "Hired",
                '12': "No (Rejected)",
                '5': "Archive"
            }
    }; 
    _this.getCandidates = function(ids){
        _this.tableParams = new NgTableParams({
            page: 1,
            count: _this.pageSize,
            filter: _this.searchFilter,
            sorting: _this.sortField
        },
            {
                counts: [],
                getData: function (params) {
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
                    queryURL += `${queryString}&limit=${count}&page=${page}`;
                    let onSuccess = (response) => {
                        _this.positionStatusCount = response.data.statusCounts;
                        if (response.data && response.data.data) {
                            _this.candidateReviewList = response.data.data;
                            _this.candidateList = response.data.data;
                            _this.candidateCount = response.data.total;
                            console.log(_this.candidateList);
                            if(_this.isFirstLoad){
                              _this.candidateReviewList.length>0? _this.selectCandidate(_this.candidateList[0].candidateId):null;
                              _this.isFirstLoad = false;
                            }                                                       
                            params.total(_this.candidateCount);
                            if(!_this.dataTableService.totalColumn.length) {
                               _this.dataTableService.initTable(_this.cols, _this.tableParams);  
                            }
                            return (_this.candidateList); 
                        }

                    },
                    onError = (error) => {
                        console.log(error);
                    }
                  _this.candidateReviewService.compareCandidates(_this.compareIds, queryURL);
                   return _this.candidateReviewService.activePromise.then(onSuccess, onError);
                }
            });
    };
    
    _this.onLoad = function () {
        _this.compareIds = [];
        _this.positionId =   _this.$storage.getItem('compare-positionId');
        _this.candidateId =   _this.$storage.getItem('compareIds');
        _this.interviewId =   _this.$storage.getItem('compare-interviewId');        
        _this.searchFilter = {};
        
        if(angular.isDefined(_this.positionId) && _this.positionId !== null && _this.positionId !== "" && _this.positionId !== "undefined"){             
             _this.searchFilter.positionId = _this.positionId;
             _this.$storage.setItem('compare-positionId', _this.positionId);
        }
        
        if((angular.isDefined(_this.candidateId) && _this.candidateId !== null && _this.candidateId.length > 0) 
                || (angular.isDefined(_this.positionId) && _this.positionId !== null && _this.positionId !== "")){
            
            let ids = _this.candidateId;
            if(ids !== null && ids !== ""){
              _this.compareIds =  ids.split(',');
            }else
            {
              _this.compareIds = _this.candidateId || [];
            }
            _this.$storage.setItem('compareIds', _this.compareIds);
        }
        
        if((angular.isDefined(_this.interviewId) && _this.interviewId !== null && _this.interviewId !== "")
                || (angular.isDefined(_this.positionId) && _this.positionId !== null && _this.positionId !== "")){
            _this.$storage.setItem('compare-interviewId', _this.interviewId);
        }
      
      _this.getCandidates(_this.compareIds);
    };
    _this.onLoad();

  }
  trustSrc(src) {
    return _this.$sce.trustAsResourceUrl(src);
  }

  showMoreData(){
      _this.pageSize = (_this.pageSize + 10);
      _this.getCandidates();
  };
  
  getPositionList(){
    _this.candidateReviewService.getPositionCodes().then((data)=>{
      _this.positionList = data?data:[];
    },(error)=>{
      _this.positionList = [];
    });
  }
  
  getInterviewsList(){  
    _this.candidateReviewService.getInterviews(_this.positionId).then((data)=>{
      _this.interviewList = data?data:[];
    },(error)=>{
      _this.interviewList = [];
    });
  }
  
   filter(type){
       _this.isFirstLoad = true;
       if(type==='position'){
           if(_this.positionId === null){
               _this.positionId = "";
           } 
           if(_this.positionId === ""){
               _this.interviewId = "";
           } 
            _this.searchText= '';
            _this.statusFilter = '';
            _this.searchFilter.candidateStatus = '';
            _this.searchFilter.fullName = '';
           _this.searchFilter.positionId = _this.positionId;
            if(_this.positionId !== ""){
               _this.getInterviewsList();
           }           
       }
       if(type==='interview'){
           if(_this.interviewId === null){
               _this.interviewId = "";
           }
           _this.searchFilter.interviewId = _this.interviewId;
       }
       if(type==='status'){
           if(_this.statusFilter === null){
               _this.statusFilter = '';
           }
           _this.searchFilter.candidateStatus = _this.statusFilter;
       }
       if(type==='name'){
            _this.searchFilter.fullName = _this.searchText;
       }    
   }

    sortFields(){
        _this.isFirstLoad = true;
        _this.sortField = {};
        let order = "asc";
//        _this.order = !_this.order;
//        if(_this.order){
//            order = "asc";
//        }
       
        if(_this.sortBy === 'name'){
            _this.sortField.name = order;
        }else if(_this.sortBy === 'rating'){
            _this.sortField.overallRating = 'desc';
        }else if(_this.sortBy === 'likeCount'){
            _this.sortField.yes = 'desc';
        }else if(_this.sortBy === 'dislikeCount'){
            _this.sortField.no = 'desc';
        }else if(_this.sortBy === 'maybeCount'){
            _this.sortField.maybe = 'desc';
        }
        
        _this.getCandidates();

    }
    
   getOrderBy(){
   	return (_this.sortBy && _this.sortBy!='')?_this.sortBy:null;
   }

   openFilterBox(){
    this.filterCollapse= !_this.filterCollapse;
   }
   
   selectCandidate(index){
    _this.selectedQuestion = null;
    _this.selectedCandidate = {};
   	if(_this.candidateReviewList && _this.candidateReviewList.length>0){
   		_this.selectedCandidate = _.find(_this.candidateReviewList, 
                                    function(candidate){ 
                                        return candidate.candidateId === index; 
                                    });
      _this.selectedCandidate.candidateId = index;
      _this.selectedCandidate.isReadOnly = true;
      _this.candidateId = index;
      _this.candidateReviewService.getAllCandidateInterviews(_this.selectedCandidate.candidateId,_this.positionId).then((data)=>{
          if(angular.isDefined(data)){
                _this.candidateInterviews = []; 
                if(angular.isDefined(_this.searchFilter.interviewId) && _this.searchFilter.interviewId !== ""){
                   let candidateInterviews = _.find(data, 
                                                   function(interview){ 
                                                       return interview.interviewId === _this.searchFilter.interviewId 
                                                   });
                   _this.candidateInterviews.push(candidateInterviews);
                 }else
                 {
                     _this.candidateInterviews = data;
                 }

               console.log(_this.candidateInterviews );
               (_this.candidateInterviews.length && _this.candidateInterviews.length>0)?_this.selectInterview(_this.candidateInterviews[0].interviewId):null;
           }
        });
      
      
      _this.getFavorite();
   	} else {
   		_this.selectedCandidate = null;
   	}
   }    
          
   selectInterview(index){
     _this.UtilsService.stopVideoPlayer();
     _this.selectedQuestion= {};
     _this.selectedCandidate.questionList = [];
     let candidateInterviews = _.find(_this.candidateInterviews, 
                                    function(interview){ 
                                        return interview.interviewId === index; 
                                    });
     _this.selectedCandidateInterview = candidateInterviews; 
     _this.selectedCandidate.candidateInterviewStatus = _this.selectedCandidateInterview.candidateInterviewStatus;
     _this.selectedCandidate.interviewId = _this.selectedCandidateInterview.interviewId;
     _this.selectedCandidate.interviewTypeId = _this.selectedCandidateInterview.interviewTypeId;
     _this.selectedCandidate.type = _this.selectedCandidateInterview.interviewType;
     _this.interviewId = _this.selectedCandidateInterview.interviewId;
     _this.getOtherPositionRatings(12);
     _this.getProfileDetails();
     //_this.fetchAllRatings();
     if(_this.selectedCandidateInterview.candidateInterviewStatus === 11
            || _this.selectedCandidateInterview.candidateInterviewStatus === 14
            || _this.selectedCandidateInterview.candidateInterviewStatus === 23
            || _this.selectedCandidateInterview.candidateInterviewStatus === 22
            || _this.selectedCandidateInterview.candidateInterviewStatus === 6){
     if(_this.selectedCandidateInterview.interviewTypeId === 1 || _this.selectedCandidateInterview.interviewTypeId === 4){
         _this.candidateReviewService.getLiveRecordings(_this.candidateId, _this.interviewId).then((data)=>{     
             if(angular.isDefined(data)){
                _this.selectedQuestion.recordingList = data;
                _this.selectedCandidate.recordingList = data;
                if(angular.isDefined(_this.selectedQuestion.recordingList.filePath)){
                    _this.UtilsService.initVideoPlayer('interviewRecording', _this.selectedQuestion.recordingList.filePath);
                }
                console.log(_this.selectedQuestion.recordingList);
                _this.selectedQuestion.questionId  = data.fileId;
                _this.selectedQuestionRatings(_this.selectedQuestion.recordingList.fileId, 13);
                _this.otherEvaluatorRatings(_this.selectedQuestion.recordingList.fileId, 13);
                _this.getComments(_this.selectedQuestion.recordingList.fileId, 13);
            }
        });
     }else if(_this.selectedCandidateInterview.interviewTypeId === 2){
            _this.selectedQuestion.questionId  = _this.interviewId;
            _this.getComments(_this.interviewId, 12);
            _this.selectedQuestionRatings(_this.interviewId, 12);
            _this.otherEvaluatorRatings(_this.interviewId, 12);
            
     }else if(_this.selectedCandidateInterview.interviewTypeId === 3){
        _this.candidateReviewService.getInterviewQuestions(_this.candidateId, _this.interviewId).then((data)=>{
            if(angular.isDefined(data)){
                _this.selectedCandidate.questionList = data.data;
                _this.selectedCandidate.questionList && _this.selectedCandidate.questionList.length? _this.selectQuestion(0):null;
            }
        });
     }
    }
   }
   
   selectQuestion(index){
   	if(_this.selectedCandidate.questionList && _this.selectedCandidate.questionList.length>0){
   		_this.selectedQuestionIndex = index;
   		_this.selectedQuestion = _this.selectedCandidate.questionList[index];                
      _this.selectedQuestionRatings(_this.selectedQuestion.questionId, 12);
      _this.otherEvaluatorRatings(_this.selectedQuestion.questionId, 12);
      _this.getComments(_this.selectedQuestion.questionId, 12);
      _this.getQuestionResponses();
   	} else {
   		_this.selectedQuestion = null;
   	}
   }
   
   nextQuestion(){
   	if(_this.selectedCandidate.questionList.length-1>_this.selectedQuestionIndex){
   		_this.selectQuestion(_this.selectedQuestionIndex+1);
   	}
   }

   previousQuestion(){
   	if(_this.selectedQuestionIndex>0){
   		_this.selectQuestion(_this.selectedQuestionIndex-1);
   	}
   }
   
   selectedQuestionRatings(genericId,ratingTypeId){
       let payload = {
                    "genericId": genericId,
                    "interviewId": _this.interviewId,
                    "ratingTypeId" : ratingTypeId,
                    "candidateId" : _this.candidateId,
                    "userId" : 1
            };
       _this.candidateReviewService.getRating(payload).then((data)=>{
           if(angular.isDefined(data)){
             _this.selectedQuestion.ratings = _.round(Number(data.stars));  
             console.log(_this.selectedQuestion.ratings);
           }
            
        });
       
   }
   
   otherEvaluatorRatings(genericId,ratingTypeId){
       let payload = {
                "interviewId":_this.interviewId,
                "candidateId" : _this.candidateId,
                "genericId" : genericId,
                "ratingTypeId" : ratingTypeId
        };
       _this.candidateReviewService.getEvaluatorRatings(payload).then((data)=>{
           if(angular.isDefined(data)){
                _this.selectedQuestion.evaluators = data;
            }
        });
       
   }
   
   fetchAllRatings(){
       let payload = {
                "interviewId":_this.interviewId,
                "candidateId" : _this.candidateId
        };
       _this.candidateReviewService.getAllRatings(payload).then((data)=>{  
           if(angular.isDefined(data)){
                _this.allRatings = data.ratings;
            }
        });
   }
   
   postComment(commentTypeId){
     if(_this.comment && _this.comment !== ''){
       let commentInfo = {
         candidateId : _this.candidateId,
         interviewId : _this.interviewId,
         genericId  : _this.selectedQuestion.questionId,
         userId : 1,
         comment : _this.comment,
         commentTypeId : commentTypeId,
         createdAt : new Date()
       };
       _this.candidateReviewService.postComment(commentInfo).then((data)=>{
           if(angular.isDefined(data)){
                _this.comment = '';
                _this.getComments(_this.selectedQuestion.questionId, commentTypeId);
            }
       });
     }
   }
   
   getComments(genericId, commentTypeId){   
        if(angular.isDefined(genericId)){
            _this.candidateReviewService.getComment(_this.candidateId,_this.interviewId,genericId,commentTypeId,20,1).then((data)=>{
              _this.selectedQuestion.commentList = data.data;
              if(_this.selectedQuestion.commentList && _this.selectedQuestion.commentList.length > 0){
                    angular.forEach(_this.selectedQuestion.commentList, function (item) {
                        if (item.updatedAt !== "" && item.updatedAt !== null) {
                            item.updatedAt = moment.utc(item.updatedAt, 'YYYY-MM-DD HH:mm').local().format('MM-DD-YYYY HH:mm');
                        }
                    });  
                }  
            });
        }
   }
   
   getRecommendation(){    
    _this.candidateReviewService.getRecommendationCount(_this.candidateId).then((data)=>{
        if(angular.isDefined(data)){
            _this.recommendations = data.data;
        }
    });
   }
   
   saveRecommendation(recommendation){    
    let payload = {
	"userId":1,
	"candidateId":_this.candidateId,
	"recommendation":recommendation
    };
    _this.candidateReviewService.saveRecommendation(payload).then((data)=>{
      console.log(data);
    });
   }
   
   getQuestionResponses(){
    _this.LoaderService.show();
     _this.UtilsService.stopVideoPlayer();
     if(_this.selectedQuestion.questionId){
        _this.candidateReviewService.getInterviewQuestionResponse(_this.candidateId,_this.interviewId,_this.selectedQuestion.questionId).then((data)=>{
        _this.selectedQuestion.response = data;
        if(angular.isDefined(_this.selectedQuestion.response.answersGiven)){
            _this.UtilsService.initVideoPlayer('responseVideo', _this.selectedQuestion.response.answersGiven);
        }
        _this.selectedQuestion.answer = [];
        if(data && data.correctAnswer){
            for(var i = 0; i < data.correctAnswer.length; i++){
                 let correctAnswer = _.find(data.options, 
                                          function(option){ 
                                              return option.id === data.correctAnswer[i]; 
                                          });
                 angular.forEach(data.options, function(val){
                     if((val['id'] === data.correctAnswer[i]) && val['selected']){
                         val['isCorrect'] = true;
                     }
                 });				 
             _this.selectedQuestion.answer.push(correctAnswer);
            }
        }
        console.log('correct answer '+_this.selectedQuestion.answer)

      });
     }    
   }
   
   getProfileDetails(){
     _this.candidateReviewService.getCandidateProfile(_this.candidateId,_this.interviewId).then((data)=>{
         if(angular.isDefined(data)){
            _this.selectedCandidate.profile = data;
        }
     });
   }
   
   getFavorite(){
     _this.candidateReviewService.getFavorite(_this.candidateId).then((data)=>{
         if(angular.isDefined(data)){
            _this.selectedCandidate.isFavorite = data.isFavourite;
            console.log(_this.selectedCandidate.isFavorite);
        }
     });
   }   
   toggleFavorite(){
     let data = {
       userId : 1,
       candidateId : _this.candidateId,
       favorite : !_this.selectedCandidate.isFavorite
     };
     _this.candidateReviewService.toggleFavorite(data).then((resp)=>{
       _this.selectedCandidate.isFavorite = !_this.selectedCandidate.isFavorite;
       if(_this.selectedCandidate.isFavorite){
            _this.GrowlerService.growl({
                type: 'success',
                message: "Marked as favourite",
                delay: 500
            });
        }else{
            _this.GrowlerService.growl({
                type: 'success',
                message: "Removed from favourites",
                delay: 500
            });
        }
     });
   }
   
   getOtherPositionRatings(ratingTypeId){
     let data ={
	      "interviewId":_this.interviewId,
	      "candidateId" : _this.candidateId,
	      "ratingTypeId" : ratingTypeId
      };
     _this.candidateReviewService.getOtherPositionRatings(data).then((resp)=>{
       console.log("Marked Favorite");
       _this.selectedCandidate.otherPositionRatings = resp;

     });
   }
   
   changeData(positionId, value){
       _this.positionId = positionId;
       _this.searchText = _this.selectedCandidate.fullName;
       _this.searchFilter.fullName = _this.selectedCandidate.fullName;
       _this.searchFilter.positionId = _this.positionId;
       if(_this.positionId){
        _this.isFirstLoad = true;
         _this.getCandidates();
        }
   }
   
   loadPreviousInterviews(){
      this.begin=this.begin>0?this.begin-1:this.begin;
   }
   
   loadNextInterviews(){
     if((this.begin+5)<this.candidateInterviews.length)
     this.begin=(this.begin<this.candidateInterviews.length-1)?this.begin+1:this.begin;
   }
  
  addRating(ratingType){    
    let payload = {
            "interviewId":_this.interviewId,
            "genericId" : _this.selectedQuestion.questionId,
            "userId" : 1,
            "candidateId" : _this.candidateId,
            "ratingTypeId" : ratingType,
            "stars" :_this.selectedQuestion.ratings
        };    
    _this.candidateReviewService.addRating(payload).then((data)=>{
  _this.isFirstLoad = false;
  _this.getCandidates();

    });
   }
onClose(){
     _this.isFirstLoad = false;
     _this.getCandidates();
      
  }
    hideList(){
        var windowWidth = angular.element(window).width();
        if (windowWidth > 767)
        {
            return false;
        }
        else {
            _this.shownone = true; 
            document.getElementById('candidateBar').style.display='none';
            document.getElementById('backbutton').style.display='block';
            document.getElementById('candidateDetail').style.display='initial';
            document.getElementById('candidateResponse').style.display='initial';
            return true;
        }
    }
    showList(){
        var windowWidth = angular.element(window).width();
        if (windowWidth > 767)
        {
            return false;
        }
        else {
            _this.shownone = false; 
            document.getElementById('candidateBar').style.display='initial';
            document.getElementById('backbutton').style.display='none';
            document.getElementById('candidateDetail').style.display='none';
            document.getElementById('candidateResponse').style.display='none';
            return true;
        }
    }
    
  hideQuestionList(){
      var windowWidth = angular.element(window).width();
      if (windowWidth > 767)
      {
          return false;
      }
      else {
          _this.hideAnswer = false;
          document.getElementById('mobileQuestion').style.display='none';
          document.getElementById('backbuttonQuestion').style.display='block'; 
          return true;
      }
  }
  showResponse(){
        var windowWidth = angular.element(window).width();
        if (windowWidth > 767)
        {
            return false;
        }
        else {
            document.getElementById('responseBar').style.display='initial';
             document.getElementById('backbutton').style.display='none';            
            return true;
        }
    }
    showQuestionList(){
        var windowWidth = angular.element(window).width();
        if (windowWidth > 767)
        {
            return false;
        }
        else {
            _this.hideAnswer = true;
            document.getElementById('mobileQuestion').style.display='initial';
            document.getElementById('backbuttonQuestion').style.display='none';
            document.getElementById('backbutton').style.display='initial';
           
            return true;
        }
    }
  
}

