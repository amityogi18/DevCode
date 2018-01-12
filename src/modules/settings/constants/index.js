import angular from 'angular';


import { settingsAddCustomQuestionsModal } from './settings-add-custom-questions.js';
import { settingsViewCustomQuestionsModal } from './settings-view-custom-question.js';
import { settingsAddNewTemplateModal } from './settings-add-new-template.js';
import { settingsViewNewTemplateModal } from './settings-view-new-template.js';
import { adminDepartmentModal } from './admin-department-pop-up.js';
import { adminUserModal } from './admin-user.js';
import { emailTemplateModal } from './email-template.js';

const MODULE_NAME = 'settingsConstants';

angular
.module(MODULE_NAME, [])
.constant('settingsAddCustomQuestionsModal', settingsAddCustomQuestionsModal)
.constant('settingsViewCustomQuestionsModal', settingsViewCustomQuestionsModal)
.constant('settingsAddNewTemplateModal', settingsAddNewTemplateModal)
.constant('settingsViewNewTemplateModal', settingsViewNewTemplateModal)
.constant('adminDepartmentModal', adminDepartmentModal)
.constant('adminUserModal', adminUserModal)
.constant('emailTemplateModal', emailTemplateModal);

export default MODULE_NAME;
