let candidateStatusReport = {
    bindings: { 
                cid : "=",
                pid : "=",
                durationid: "=" },
    templateUrl: 'analytics/partials/candidateStatusReportChart.jade',
    controller: 'candidateStatusReportController',
    controllerAs: 'candidateStatusReportCtrl'
};


export default candidateStatusReport;


