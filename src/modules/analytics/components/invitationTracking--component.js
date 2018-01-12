let invitationTrackingChart = {
  bindings: {
                pid : "=",
                durationid: "=",
                cid: "=" 
            },
  templateUrl: 'analytics/partials/invitationTrackingChart.jade',
  controller: 'invitationTrackingController',
  controllerAs: 'invitationTrackingCtrl'
};


export default invitationTrackingChart;


