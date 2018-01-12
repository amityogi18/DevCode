//import './styles/index.scss';
import angular from 'angular';
import analyticsServices from './services';
import analyticsControllers from './controllers';
import analyticsComponents from './components';
import analyticsPartials from './partials';


const MODULE_NAME = 'analyticsModule';


export default angular
    .module(MODULE_NAME, [
        analyticsPartials,
        analyticsServices, 
        analyticsControllers,
        analyticsComponents
        ]);
