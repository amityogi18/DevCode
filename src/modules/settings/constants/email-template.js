/*
@author Amit Kumar Yogi
@date 03/10/2016
@emailTemplateModal Modal
*/

export var emailTemplateModal = {
  controller: 'EmailTemplateSettingsController',
  controllerAs: 'emailTemplateSettingsCtrl',
  bindToController : true,
  templateUrl: 'settings/partials/modals/email-template-pop-up.jade',
  backdrop: 'static',
  size: 'md'
};
