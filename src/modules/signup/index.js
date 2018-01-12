//module styles import
//import './styles/index.scss';

import angular from 'angular';
import signupServices from './services';
import signupControllers from './controllers';
import signupConstants from './constants';
import signupPartials from './partials';
//import signupRouteConfig from './signup.route';





const MODULE_NAME = 'signupModule';


export default angular
    .module(MODULE_NAME, [
        signupPartials,
        signupServices, 
        signupControllers,
        signupConstants
        ]);
    //.config(signupRouteConfig);


 //export default  MODULE_NAME;
