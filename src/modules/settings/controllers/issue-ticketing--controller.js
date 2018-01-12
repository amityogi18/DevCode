let _this;
export class IssueTicketingController {
	/** @ngInject  */
  constructor(AuthService, IssueTicketingService, $timeout, NgTableParams, GrowlerService, $state,UtilsService, dataTableService) {
    _this = this;
    _this.AuthService = AuthService;
    _this.GrowlerService = GrowlerService;
    _this.IssueTicketingService = IssueTicketingService;
    _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});
    console.log('Inside IssueTicketing Controller');
    _this.$timeout = $timeout;
    _this.reasonTypeList = [];
    _this.issueTicketTableFilter = {};
    _this.getReasonType();
    _this.showAddSection = false;
    _this.isEditMode = false;
    _this.hideSaveBtn= false;
    _this.userData = _this.AuthService.user;
    _this.$state = $state;
    _this.UtilsService = UtilsService;    
    let companyId = _this.AuthService.user.companyId || 1;
    _this.issueTicketTableFilter.companyId = companyId;
    _this.ticketData = {
      issue: "",
      description: "",
      ticketType: 2,
      priority: 2
    };
    _this.message = {
      text: '',
      error: false
    };
    _this.statusList = [
      {
        "statusId": 1,
        "statusName": "ACTIVE"
      },
      {
        "statusId": 2,
        "statusName": "INACTIVE"
      },
      {
        "statusId": 3,
        "statusName": "CLOSED"
      },
      {
        "statusId": 14,
        "statusName": "ONHOLD"
      },
      {
        "statusId": 17,
        "statusName": "OPEN"
      },
      {
        "statusId": 18,
        "statusName": "REOPENED"
      }];
  
  _this.priorityTypeList =[{
     "id": 1,
      "name": "High"     
  },
  {
     "id": 2,
      "name": "Medium"     
  },
  {
     "id": 3,
      "name": "Low"     
  }];
  _this.issueTickets = function(){
    _this.issueTicketTableParams = new NgTableParams({
      page: 1,
      count: 5,
      filter: _this.issueTicketTableFilter
    }, {
      counts: [5, 10, 20],
      getData: function (params) {
          let filter = params.filter(),
              sorting = params.sorting(),
              count = params.count(),
              page = params.page(),
              filterFields = [],
              sortFields = [],
              queryString = '',
              queryURL = '&';
          angular.forEach(sorting, (value, key) => {
              console.log(key + '---' + value);
              sortFields.push(`${key}&order=${value}`);
          });
          angular.forEach(filter, (value, key) => {
              console.log(key + '---' + value);
              filterFields.push(`${key}=${value}`);
          });
          if (sortFields.length) {
              queryString += `orderBy=${sortFields.join('&')}&`;
          }
          if (filterFields.length) {
              queryString += filterFields.join('&');
          }
          queryURL += `${queryString}&limit=${count}&page=${page}`;
        let onSuccess = (response) => {
            _this.ticketDatalist = _this.changeListInLocalDateTime(response.data.data);
            _this.ticketDataListCount = response.data.total;
            
            params.total(_this.ticketDataListCount);
                if(!_this.dataTableService.totalColumn.length) {
                   _this.dataTableService.initTable(_this.cols, _this.issueTicketTableParams);  
                }                
                return (_this.ticketDatalist);
                            
            if (_this.ticketDatalist &&
                _this.ticketDatalist.length > 0) {
                params.total(_this.ticketDataListCount);
                return(_this.ticketDatalist);
            }
          },
          onError = (error) => {
            console.log(error);
          };

        _this.IssueTicketingService.getAllIssueTickets(queryURL);
        return _this.IssueTicketingService.activePromise.then(onSuccess, onError);
      }
    });
     _this.toggle = function() {
        _this.dataTableService.setColumn(-1);
        _this.dataTableService.toggle(_this.cols, event.target.value);
    };
  };
    _this.issueTickets();
  }

    resetTicket(issueForm) {
        _this.issueForm.$setPristine();
        _this.issueForm.$setUntouched();
        _this.attachment = "";
        _this.ticketData.description = '';
        _this.ticketData.issue = '';
        _this.attachment = '';
        _this.isEditMode = false;
        //_this.showAddSection = false;
    }
  
    checkIssueBlank() {
      if (_this.ticketData.issue === "") {
        _this.isIssueBlank = true;
      } else {
        _this.isIssueBlank = false;
      }
    }
    hideAddSEction(){
        _this.showAddSection = false;
    }
    showSection(){
        _this.showAddSection = true;   
    }
    checkDescriptionBlank() {
      if (_this.ticketData.description === "") {
        _this.isDescriptionBlank = true;
      } else {
        _this.isDescriptionBlank = false;
      }
    }
  
    checkTicketTypeBlank() {
      if (_this.ticketData.ticketType === "") {
        _this.isTicketTypeBlank = true;
      } else {
        _this.isTicketTypeBlank = false;
      }
    }

    checkMandatoryFields() {
        if(_this.ticketData.issue  && _this.ticketData.issue !== '' 
            && _this.ticketData.ticketType && _this.ticketData.ticketType !== ''
            && _this.ticketData.priority && _this.ticketData.priority !== ''
            && _this.ticketData.description  && _this.ticketData.description !== '') {
                if (_this.attachment && _this.attachment.length > 5) {
                  _this.GrowlerService.growl({type: 'warning', message: 'Max 5 attachments allowed.',delay: 300});
                  _this.hideSaveBtn= false;
                  _this.attachment = "";
                  return false;
                }
            return true;
        }
        else{_this.issueForm.$setSubmitted();
            return false;
        }
    }

    saveIssueTicket(form) {
        if(_this.checkMandatoryFields()){
              _this.hideSaveBtn= true;            
              _this.ticketData.ticketType = parseInt(_this.ticketData.ticketType);
              _this.ticketData.statusId = 17;
              if(_this.attachment){
                 _this.ticketData.attachment = _this.attachment;
              }

              let onSuccess = (response) => {
                  _this.GrowlerService.growl({type: 'success',message: 'Ticket Added successfully',delay: 300});
                  _this.ticketData.description = '';
                  _this.ticketData.issue = '';
                  _this.attachment = '';
                  _this.showAddSection = false;
                  _this.hideSaveBtn= false;
                  _this.$timeout(function(){
                      _this.issueTicketTableParams.reload();
                  },1000);
                  _this.resetTicket(form);
                  _this.$state.go(_this.$state.current, {}, {reload: true});
                },
                onError = (error) => {
                  console.log(error);
                };
              _this.IssueTicketingService.saveIssueTicket(_this.ticketData).then(onSuccess, onError);
            
        }
    }

  
  uploadAttachment(file) {
    _this.attachment = file;
  }

  isFileAdded(file) {
    if (file.length > 0) {
      this.fileNotSelected = true;
    }
    else {
      this.fileNotSelected = false;
    }
  }
  
  updateIssueTicket(form) {
    _this.ticketData.attachment = _this.attachment;
    let onSuccess = (response) => {
        _this.isEditMode = false;
        _this.GrowlerService.growl({
          type: 'success',
          message: 'Ticket Updated successfully',
          delay: 300
        });
        _this.ticketData = {};
        _this.attachment = '';
        _this.resetTicket(form);
        _this.issueTickets();
      },
      onError = (error) => {
        console.log(error);
      };

    _this.IssueTicketingService.updateIssueTicket(_this.ticketData);
    _this.IssueTicketingService.activePromise.then(onSuccess, onError);
  }

  editIssueTicket(ticket) {
    _this.isEditMode = true;
    _this.ticketData.ticketId = ticket.id;
    _this.ticketData.issue = ticket.issue;
    _this.ticketData.description = ticket.description;
    _this.ticketData.ticketType = _this.getReasonTypeIdForText(ticket.ticketType);
    $('select[name^="ddltickettype"] option[value = ' + _this.ticketData.ticketType + ']').attr("selected", "selected");
    _this.ticketData.attachment = ticket.attachment;
  }

  getReasonTypeIdForText(ticketType) {
    for (let i = 0; _this.reasonTypeList.length > i; i++) {
      if (_this.reasonTypeList[i].title == ticketType) {
        return _this.reasonTypeList[i].id;
      }
    }
  }

  getReasonType() {
    let onSuccess = (response) => {
        _this.reasonTypeList = response.data;
      },
      onError = (error) => {
        console.log(error);
      };
    _this.IssueTicketingService.getReasonType();
    _this.IssueTicketingService.activePromise.then(onSuccess, onError);
  }

  createComment() {
    let statusName = _this.getStatusNameForStatusId(_this.selectedStatus);
    if(statusName != _this.selectedTicket.status){
      _this.changeStatus(_this.selectedTicket.id, _this.selectedStatus);
    }
    if(_this.comment !== ""){
      let onSuccess = (response) => {        
        _this.GrowlerService.growl({ type: 'success', message: 'Comment Added successfully', delay: 300});
      },
      onError = (error) => {
        console.log(error);
      },
      commentData = {
        ticketId: _this.selectedTicket.id,
        comment: _this.comment
      };

    _this.IssueTicketingService.createComment(commentData);
    _this.IssueTicketingService.activePromise.then(onSuccess, onError);
    }    
  }

  setSelectedTicket(ticket) {
    _this.getTicketDetails(ticket.id);
    _this.selectedTicket = ticket;
    _this.selectedStatus = _this.getStatusIdFromText(ticket.status);
  }

  getTicketDetails(ticketId) {
    let onSuccess = (response) => {
        _this.comment = '';
        _this.ticketComments = response.data;
        angular.forEach(_this.ticketComments, (val) => {
          let fullName = val.user.firstName+' '+val.user.lastName;
                    
          if(_this.userData.fullName === fullName){
            val['user']['fullName'] = 'You';
          }else 
          {
            val['user']['fullName'] = fullName;
          }
         val['createdAt'] = moment.utc(val.createdAt, 'MM-DD-YYYY HH:mm:ss').local().format('MM-DD-YYYY HH:mm');
        });
      },
      onError = (error) => {
        console.log(error);
      };

    _this.IssueTicketingService.getTicketDetails(ticketId);
    _this.IssueTicketingService.activePromise.then(onSuccess, onError);
  }

  getStatusIdFromText(statusName) {
    for (var i = 0; _this.statusList.length > i; i++) {
      if (_this.statusList[i].statusName == statusName) {
        let statusId = _this.statusList[i].statusId;
        return statusId;
        break;
      }
    }
  }

  changeStatus(ticketId, statusId) {
    let onSuccess = (response) => {
      _this.GrowlerService.growl({ type: 'success', message: 'Status Change Successfully', delay: 300});
        _this.issueTickets();
      },
      onError = (error) => {
        console.log(error);
      },
      statusData = {
        status: statusId
      };

    _this.IssueTicketingService.changeStatus(ticketId, statusData);
    _this.IssueTicketingService.activePromise.then(onSuccess, onError);
  }
  
  changeListInLocalDateTime(ticketList){    
    if(angular.isDefined(ticketList) && ticketList.length > 0){
      for(let i=0; ticketList.length > i; i++){
        ticketList[i].createdAt = _this.UtilsService.getLocalTimeFromGMT(ticketList[i].createdAt, 24);
        ticketList[i].updatedAt = _this.UtilsService.getLocalTimeFromGMT(ticketList[i].updatedAt, 24); 
      }     
    }       
    return ticketList;
  }
  
  getStatusNameForStatusId(statusId){
    for(let i = 0; _this.statusList.length > i; i++){
      if(_this.statusList[i].statusId == statusId){
        return _this.statusList[i].statusName;
      }
    }    
  }


}


