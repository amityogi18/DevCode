let AsmQuestionsListAccordion = {
    bindings: { mode : '<',
                pid : '<',
                interviewid: '<' ,
                currentState: '<',
                isReset: '<',
                isFetch:'<',
                onUpdate: '&',
                primarySkillId :'<',
                secondarySkillId :'<',
                tertiarySkillId :'<',
                recommendations : '<'
            },
    templateUrl: 'position/partials/questionsList-accordion.jade',
    controller: 'questionsListController',
    controllerAs:'questionsListAccordionCtrl'
};


export default AsmQuestionsListAccordion;

