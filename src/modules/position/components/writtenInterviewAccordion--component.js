let AsmWrittenInterviewAccordion = {
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
    templateUrl: 'position/partials/writtenInterview-accordion.jade',
    controller: 'writtenInterviewAccordionController',
    controllerAs: 'writtenInterviewAccordionCtrl'
};


export default AsmWrittenInterviewAccordion;

