let AsmAudioVideoAccordion = {
    bindings: { mode : '<',
                pid : "<",
                interviewid: "<",
                currentState: '<',
                isReset: '<',
                isFetch:'<',
                onUpdate: '&',
                primarySkillId :'<',
                secondarySkillId :'<',
                tertiarySkillId :'<',
                recommendations : '<'
            },
    templateUrl: 'position/partials/audioVideo-accordion.jade',
    controller: 'audioVideoAccordionController',
    controllerAs: 'audioVideoAccordionCtrl'
}


export default AsmAudioVideoAccordion;

