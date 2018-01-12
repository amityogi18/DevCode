import angular from 'angular';


import routeConfig from './main.route';
import mainService from './services';
import mainConstants from './constants';
import mainPartials from './partials';
import mainControllers from './controllers';
import mainDirectives from './directives';
import mainComponents from './components';
import errorHandler from './configs/error-handler';
import mainRunConfig from './main.run';


const mainModule = 'mainModule';

//modules
import homeModule from '../home';

export default angular
    .module(mainModule, [
        mainService, 
        mainConstants, 
        mainPartials, 
        mainControllers, 
        mainDirectives,
        mainComponents,
        homeModule
        ])
    .config(routeConfig)
    .config(errorHandler)
    .run(mainRunConfig)
    .name;