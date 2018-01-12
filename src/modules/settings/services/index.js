import angular from 'angular';

import {CompanyInfoService} from './company-info--service.js';
import {GeneralSettingsService} from './general-settings--service.js';
import {CustomQuestionService} from './custom-question--service.js';
import {EmailTemplateSettingsService} from './email-template-settings--service.js';
import {ThemeSettingsService} from './theme-settings--service.js';
import {NotificationSettingsService} from './notification-settings--service.js';
import {IssueTicketingService} from './issue-ticketing--service.js';
import {TransactionDetailService} from './transaction-detail--service.js';
import {AdminCompanyInfoService} from './admin-company-info--service.js';
import {PortalIntegartionService} from './portal-integration--service.js';
//moved to app level as have global
//import {AdminDepartmentService} from './admin-department--service.js';
import {AdminUserDetailService} from './admin-user-detail--service.js';
import {AdminCustomQuestionService} from './admin-custom-question--service.js';
import {AdminPaymentPlanService} from './admin-payment-plan--service.js';
import {mediaRecorderService} from './mediaRecorder.js';
import {calendarService} from './calendar--service.js';


const MODULE_NAME = 'settingsServices';

angular
.module(MODULE_NAME, [])
.service('CompanyInfoService', CompanyInfoService)
.service('GeneralSettingsService', GeneralSettingsService)
.service('CustomQuestionService', CustomQuestionService)
.service('EmailTemplateSettingsService', EmailTemplateSettingsService)
.service('ThemeSettingsService', ThemeSettingsService)
.service('NotificationSettingsService', NotificationSettingsService)
.service('IssueTicketingService', IssueTicketingService)
.service('TransactionDetailService', TransactionDetailService)
.service('AdminCompanyInfoService', AdminCompanyInfoService)
.service('PortalIntegartionService' ,PortalIntegartionService)
//.service('AdminDepartmentService', AdminDepartmentService)
.service('AdminUserDetailService', AdminUserDetailService)
.service('AdminCustomQuestionService', AdminCustomQuestionService)
.service('AdminPaymentPlanService', AdminPaymentPlanService)
.service('mediaRecorderService', mediaRecorderService)
.service('calendarService', calendarService);

export default MODULE_NAME;