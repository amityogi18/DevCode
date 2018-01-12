import angular from 'angular';


import {ForgetPasswordService} from './forgetPassword--service';
import {ResetPasswordService} from './resetPassword--service';
import {LoginService} from './login--service';
import {GeneralSettingsService} from '../../settings/services/general-settings--service';
import {ThemeSettingsService} from '../../settings/services/theme-settings--service';
import {AdminCompanyInfoService} from '../../settings/services/admin-company-info--service';


const MODULE_NAME = 'homeServices';

angular
    .module(MODULE_NAME, [])
.service('forgetPasswordService', ForgetPasswordService)
.service('resetPasswordService', ResetPasswordService)
.service('LoginService', LoginService)
.service('GeneralSettingsService', GeneralSettingsService)
.service('ThemeSettingsService', ThemeSettingsService)
.service('AdminCompanyInfoService', AdminCompanyInfoService);


export default MODULE_NAME;