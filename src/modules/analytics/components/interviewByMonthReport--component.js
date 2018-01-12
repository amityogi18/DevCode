let interviewByMonthReport = {
    bindings: { 
                cid : "=",
                pid : "=",
                durationid: "=" },
    templateUrl: 'analytics/partials/interviewByMonthReportChart.jade',
    controller: 'interviewByMonthController',
    controllerAs: 'interviewByMonthCtrl'
};


export default interviewByMonthReport;


