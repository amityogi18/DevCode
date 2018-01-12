//module styles import
//import './styles/index.scss';

import angular from 'angular';
import candidateInterviewServices from './services';
import candidateInterviewFilters from './filters';
import candidateInterviewControllers from './controllers';
import candidateInterviewComponents from './components';
import candidateInterviewPartials from './partials';





const MODULE_NAME = 'candidateInterviewModule';


export default angular
    .module(MODULE_NAME, [
        candidateInterviewServices,
        candidateInterviewFilters, 
        candidateInterviewControllers,
        candidateInterviewComponents,
        candidateInterviewPartials
        ]);
    //.config(candidateInterviewRouteConfig);


 //export default  MODULE_NAME;
