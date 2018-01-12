var _this;
export class RatingPopupController {
	/** @ngInject  */
  constructor(candidateReviewService) {
      _this = this;
      _this.interviewId = _this.data.interviewId;
      _this.status = _this.data.candidateInterviewStatus;
      _this.candidateId = _this.data.candidateId;
      _this.isReadOnly = _this.data.isReadOnly;
      _this.recommendationValue = '';
      _this.candidateReviewService = candidateReviewService;
      _this.isMandatory = false;
      _this.fetchAllRatings();
      _this.getRecomendation();
    console.log('Inside candidate controller constructor');
//allRatings
  }
fetchAllRatings(){
       let payload = {
                "interviewId":_this.interviewId,
                "candidateId" : _this.candidateId
        };
       _this.candidateReviewService.getAllRatings(payload).then((data)=>{
            _this.ratingData = data.ratings;
            console.log(_this.ratingData);
            
            if(_this.ratingData){
                if(_this.data.interviewTypeId === 2 ||_this.data.interviewTypeId === 3 ){
                        _.remove(_this.ratingData, {
                        ratingTypeId: 13
                    });
                    _this.newRatingData = _this.ratingData;
                }        
                else if(_this.data.interviewTypeId === 1 || _this.data.interviewTypeId === 4){
                        _.remove(_this.ratingData, {
                        ratingTypeId: 11
                    });
                    _this.newRatingData = _this.ratingData ;
                }
                else{
                  _this.newRatingData = _this.ratingData;  
                }
            }
        });
   }
addRating(ratingType,rating){    
    let payload = {
            "interviewId":_this.interviewId,
            "genericId" : _this.interviewId,
            "userId" : 1,
            "candidateId" : _this.candidateId,
            "ratingTypeId" : ratingType,
            "stars" :rating
        };
        if(!_this.isReadOnly){
            if( angular.isDefined(rating) 
                && rating !== null){
                    _this.candidateReviewService.addRating(payload).then((data)=>{
                       console.log(data);
                     });
                }
        }   
   }
   getRecomendation(){
       let candidateId =  _this.candidateId,
           interviewId = _this.interviewId;
           _this.candidateReviewService.getRecommendationCount(candidateId, interviewId).then((data)=>{
           _this.recommendationValue = data.candidateRecommendation;
           console.log(data);
         });
     
   }
   saveRecomendation(){
       let recommendation = {
            "interviewId":_this.interviewId,
            "userId" : 1,
            "candidateId" : _this.candidateId,
            "recommendation" :_this.recommendationValue
        };
        
        _this.candidateReviewService.saveRecommendation(recommendation).then((data)=>{
           console.log(data);
         });
         
   }
   getOtherRating(){
       let interviewId = _this.interviewId,
           candidateId =  _this.candidateId;
       _this.candidateReviewService.getOtherRatings(interviewId, candidateId).then((data)=>{
            _this.otherRatingData = data;
            console.log(data);
         });
     
   }
}
