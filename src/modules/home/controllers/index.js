import angular from 'angular';


import {LoginController} from './login--controller.js';
import {ForgetPasswordController} from './forgetPassword--controller.js';
import {ResetPasswordController} from './resetPassword--controller.js';

const MODULE_NAME = 'homeControllers';

angular
    .module(MODULE_NAME, [])

.controller('LoginController', LoginController)
.controller('ForgetPasswordController', ForgetPasswordController)
.controller('ResetPasswordController', ResetPasswordController);

export default MODULE_NAME;