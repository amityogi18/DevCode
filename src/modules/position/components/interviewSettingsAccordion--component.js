let AsmInterviewSettingsAccordion = {
    bindings: { mode : '<',
                pid : '<',
                interviewid: '<',
                currentState: '<',
                isReset: '<',
                isFetch:'<',
                onUpdate: '&'
     },
    templateUrl: 'position/partials/interviewSettings-accordion.jade',
    controller: 'interviewSettingsAccordionController',
    controllerAs:'interviewSettingCtrl'
};


export default AsmInterviewSettingsAccordion;

