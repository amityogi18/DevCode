let averageCompletionTime = {
     bindings: { 
                cid : "=",
                pid : "=",
                durationid: "=" },
    templateUrl: 'analytics/partials/averageCompletionTimeChart.jade',
    controller: 'averageCompletionTimeController',
    controllerAs: 'averageCompletionTimeCtrl',
};


export default averageCompletionTime;

