let AsmScheduleAccordion = {
    bindings: { mode : '<',
                pid : '<',
                interviewid: '<' ,
                currentState: '<',
                isReset: '<',
                isFetch:'<',
                onUpdate: '&'
            },
    templateUrl: 'position/partials/schedule-accordion.jade',
    controller: 'scheduleAccordionController',
    controllerAs: 'vm'
};


export default AsmScheduleAccordion;

