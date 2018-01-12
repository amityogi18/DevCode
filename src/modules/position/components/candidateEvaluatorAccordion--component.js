let AsmCandidateEvaluatorAccordion = {
    bindings: { mode : '<',
                pid : '<',
                interviewid: '<',
                currentState: '<',
                isReset: '<',
                isFetch:'<',
                onUpdate: '&',
                interviewtype: '<'
            },
    templateUrl: 'position/partials/candidate-evaluator-accordion.jade',
    controller: 'candidateEvaluatorAccordionController',
    controllerAs: 'candidateAccordionCtrl'
};


export default AsmCandidateEvaluatorAccordion;

