/*
@author Amit Kumar Yogi
@date 23/09/2016
@clientsEditModal Modal
*/

export var questionPopModal = {
  controller: 'EditQuestionBankController',
  controllerAs: 'questionBankCtrl',
  bindToController : true,
  templateUrl: 'super_admin/partials/modals/question-popup.jade',
  backdrop: 'static',
  size: 'lg'
};
