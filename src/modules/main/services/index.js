import angular from 'angular';

/*Importing all the required files */
import {AppService} from './main--service';
import {AuthService} from './AuthService--service';
import {StatesConfig} from './statesConfig--service';
import {GrowlerService} from './growler--service';
import {DashboardService} from './dashboard--service';
import {HttpInterceptorService} from './http-interceptor--service';
import {UtilsService} from './utils--service';
import {LoaderService} from './loader--service';
import {TimeZoneService} from './timeZone--service';
import {LocationService} from './location--service';
import ErrorLoggerService from './errorLogger--service';
import {feedbackService} from './feedback--service';
import {dataTableService} from './dataTable--service';

//console.log("UtilsServices::",UtilsService )

const MODULE_NAME = 'mainServices';


 angular
    .module(MODULE_NAME, [])
    .service('appService', AppService)
    .service('AuthService', AuthService)
    .service('StatesConfig', StatesConfig)
    .service('GrowlerService', GrowlerService)
    .service('DashboardService', DashboardService)
    .service('HttpInterceptorService', HttpInterceptorService)
    .service('UtilsService', UtilsService)
    .service('LoaderService', LoaderService)
    .service('timeZoneService', TimeZoneService)
    .service('locationService', LocationService)
    .provider('ErrorLoggerService', ErrorLoggerService)
    .service('dataTableService', dataTableService)
    .service('feedbackService', feedbackService);



export default MODULE_NAME;