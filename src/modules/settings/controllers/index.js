import angular from 'angular';

import {SettingsController} from './settings--controller.js';
import {GeneralSettingsController} from './general-settings--controller.js';
import {CustomQuestionController} from './custom-question--controller.js';
import {CustomQuestionListingController} from './custom-question-listing--controller.js';
import {EmailTemplateSettingsController} from './email-template-settings--controller.js';
import {ThemeSettingsController} from './theme-settings--controller.js';
import {NotificationSettingsController} from './notification-settings--controller.js';
import {IssueTicketingController} from './issue-ticketing--controller.js';
import {transactionDetailController} from './transaction-detail--controller.js';
import {AdminCompanyInfoController} from './admin-company-info--controller.js';
import {AdminDepartmentController} from './admin-department--controller.js';
import {AdminDepartmentListingController} from './admin-department-listing--controller.js';
import {AdminUserDetailController} from './admin-user-detail--controller.js';
import {AdminCustomQuestionController} from './admin-custom-question--controller.js';
import {AdminPaymentPlanController} from './admin-payment-plan--controller.js';
import {VideoRecorderController} from './videoRecorder.js';
import {ExitVideoRecorderController} from './exitVideoRecorder.js';
import {CompanyLogoController} from './company-logo--controller.js';
import {CompanyProfileController} from './company-profile--controller.js';
import {ReportingController} from './reporting--controller.js';
import {WelcomeVideoController} from './welcome-video--controller.js';
import {LandingImageController} from './landing-image--controller.js';
import {AdminSocialMediaController} from './admin-social-media--controller.js';
import {DialInController} from './dial-in--controller.js';
import {AdminUserEditController} from './admin-user-edit--controller.js';
import {AdminPaymentController} from './admin-payment--controller.js';
import {AdminConfirmationController} from './admin-confirmation--controller.js';
import {AdminPlanController} from './admin-plan--controller.js';
import {PortalIntegrationController} from './portal-integration--controller.js';
import {AdminPaymentSuccessController} from './admin-payment-success--controller.js';
import {positionAutomationController} from './position-automation--controller.js';
import {CalendarController} from './calendar--controller.js';
import {ExitVideoController} from './exit-video--controller.js';

const MODULE_NAME = 'settingsControllers';

angular
.module(MODULE_NAME, [])
.controller('SettingsController', SettingsController)
.controller('GeneralSettingsController', GeneralSettingsController)
.controller('CustomQuestionController', CustomQuestionController)
.controller('CustomQuestionListingController', CustomQuestionListingController)
.controller('EmailTemplateSettingsController', EmailTemplateSettingsController)
.controller('NotificationSettingsController', NotificationSettingsController)
.controller('ThemeSettingsController', ThemeSettingsController)
.controller('NotificationSettingsController', NotificationSettingsController)
.controller('IssueTicketingController', IssueTicketingController)
.controller('transactionDetailController', transactionDetailController)
.controller('AdminCompanyInfoController', AdminCompanyInfoController)
.controller('AdminDepartmentController', AdminDepartmentController)
.controller('AdminDepartmentListingController', AdminDepartmentListingController)
.controller('AdminUserDetailController', AdminUserDetailController)
.controller('AdminCustomQuestionController', AdminCustomQuestionController)
.controller('AdminPaymentPlanController', AdminPaymentPlanController)
.controller('VideoRecorderController', VideoRecorderController)
.controller('ExitVideoRecorderController', ExitVideoRecorderController)
.controller('CompanyLogoController', CompanyLogoController)
.controller('CompanyProfileController', CompanyProfileController)
.controller('ReportingController', ReportingController)
.controller('WelcomeVideoController', WelcomeVideoController)
.controller('LandingImageController', LandingImageController)
.controller('AdminSocialMediaController', AdminSocialMediaController)
.controller('DialInController', DialInController)
.controller('AdminUserEditController', AdminUserEditController)
.controller('AdminPaymentController', AdminPaymentController)
.controller('AdminConfirmationController', AdminConfirmationController)
.controller('AdminPlanController', AdminPlanController)
.controller('PortalIntegrationController', PortalIntegrationController)
.controller('AdminPaymentSuccessController', AdminPaymentSuccessController)
.controller('positionAutomationController', positionAutomationController)
.controller('CalendarController', CalendarController)
.controller('ExitVideoController', ExitVideoController);

export default MODULE_NAME;
