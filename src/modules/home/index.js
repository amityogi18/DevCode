//import './styles/index.scss';

import angular from 'angular';


import routeConfig from './home.route';
import Services from './services';
import Controllers from './controllers';


const MODULE = 'homeModule';

export default angular
    .module(MODULE, [
        Services, 
        Controllers
        ])
    .config(routeConfig)
    .name;