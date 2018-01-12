let candidateRating = {
    bindings: { 
                cid : "=",
                pid : "=",
                durationid: "=" },
    templateUrl: 'analytics/partials/candidateRatingChart.jade',
    controller: 'candidateRatingController',
    controllerAs: 'candidateRatingCtrl'
};


export default candidateRating;


