
let AsmLiveNowInterviewAccordion = {
    bindings: { mode : '<',
                pid : '<',
                interviewid: '<',
                currentState: '<',
                isReset: '<',
                isFetch:'<',
                onUpdate: '&',
                primarySkillId :'<',
                secondarySkillId :'<',
                tertiarySkillId :'<',
                recommendations : '<'
            },
    templateUrl: 'position/partials/live-candidate-accordion.jade',
    controller: 'liveNowInterviewAccordionController',
    controllerAs: 'liveInterviewAccordionCtrl'
};


export default AsmLiveNowInterviewAccordion;

