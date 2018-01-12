import _ from 'lodash';
let _this;

/*
 @ticket--Controller
 @param {object} NgTableParams description - initialise the ng-table & provides configuration
 @param {object} clientsService description - returns the object and provides all the values related to the company tickets.
 @param {object} $scope This is act like glue between view and controller.
 @param {object} $element This represent element of dom.
 @param  {object} $timeout
 @param {NestedTableService} It nested table accordian service which is used in table accordian.
 */
export class TicketingSystemSaController {
	/** @ngInject  */
  constructor(NgTableParams, TicketingSystemSaService, $timeout, IssueTicketingService, GrowlerService, SuperAdminService, $state, AuthService, UtilsService, dataTableService, LoaderService) {
    _this = this;
    _this.TicketingSystemSaService = TicketingSystemSaService;
    _this.$timeout = $timeout;
    _this.IssueTicketingService = IssueTicketingService;
    _this.GrowlerService = GrowlerService;
    _this.SuperAdminService = SuperAdminService;
    _this.AuthService = AuthService;
    _this.userData = _this.AuthService.user;
    _this.$state = $state;
    _this.UtilsService = UtilsService;
    _this.dataTableService = dataTableService;
    _this.LoaderService = LoaderService;
    _this.dataTableService.initTable([], {});   
    _this.colNum = 6;
    _this.reasonTypeList = [];
    _this.companyList= [];
    _this.getReasonType();
    _this.getCompanyList();
    _this.isView = false;
    _this.isChange = false;
    _this.ticketTableFilter = {};
    _this.ticketTableFilter.userTypeId=1;
    _this.searchActiveCompany;
    
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

    _this.ticketTableParams = new NgTableParams(
             {
            page: 1,
            count: 5,
            filter: _this.ticketTableFilter
        }, 
             {
                counts: [5, 10, 20],
                getData: function(params) {
                    let filter = params.filter(),
                        sorting = params.sorting(),
                        count = params.count(),
                        page = params.page(),
                        filterFields = [],
                        sortFields = [],
                        queryString = '',
                        queryURL = '?';
                    angular.forEach(sorting, (value, key) => {
                        sortFields.push(`${key}&order=${value}`);
                    });
                    angular.forEach(filter, (value, key) => {
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
                      _this.isLoading = false;
                            _this.ticketList = _this.changeListToLocal(response.data.data);
                            _this.ticketListCount = response.data.total;
                            if (_this.ticketList &&
                                _this.ticketList.length > 0) {                                
                            params.total(_this.ticketListCount);
                            if(!_this.dataTableService.totalColumn.length) {
                               _this.dataTableService.initTable(_this.cols, _this.ticketTableParams);  
                            }
                            return (_this.ticketList);
                            }
                        },
                    onError = (error) => {
                        console.log(error);
                    };
                    _this.isLoading = true;
                    _this.TicketingSystemSaService.getTicketDetails(queryURL);
                    return _this.TicketingSystemSaService.activePromise.then(onSuccess, onError);
                }
            });
        _this.toggle = function() {
        _this.dataTableService.setColumn(-1);
        _this.dataTableService.toggle(_this.cols, event.target.value);
    };
}
    clearSearchActiveCompany(){
      _this.searchActiveCompany = '';
    }    
    getCompanyList(){
        let onSuccess = (response) => {
            var allCompany = {
                id: '',
                name: 'All'
            };
            _this.companyList = response.data;
            _this.companyList.unshift(allCompany);
          },
          onError = (error) => {
            console.log(error);
          };
        _this.SuperAdminService.getCompanyList();
        _this.SuperAdminService.activePromise.then(onSuccess, onError);
      }
      
      getCompanyData(){
          //_this.ticketTableFilter.company = _this.id;
          _this.ticketTableFilter.company = (_this.id === " ") ? "" : _this.id;
      }
      
      getdurationData(){
          _this.ticketTableFilter.before = _this.duration;
      }

    getPriorityFilter(){
        if(_this.priority === "All"){
          _this.ticketTableFilter.ticketPriority = "";
        }
        else{
           _this.ticketTableFilter.ticketPriority = _this.priority;
        }       
    }
      
      
    getReasonType(){
        let onSuccess = (response) => {
            _this.reasonTypeList = response.data;
          },
          onError = (error) => {
              console.log(error);
          };
        _this.IssueTicketingService.getReasonType();
        _this.IssueTicketingService.activePromise.then(onSuccess, onError);
    }
    
    viewIssue(tiketData) {
           _this.$timeout(function() {
            _this.isView = true;
            _this.isEdit = false;
            _this.isAdd = false;
            _this.ticketId = tiketData.id;
            _this.ticketType = tiketData.ticketType;
            _this.issue = tiketData.issue;
            _this.description = tiketData.description;
        }, 1000);
    }
    
     setSelectedTicket(ticket){
       _this.$timeout(function() {
          _this.getTicketDetails(ticket.id);
          _this.selectedTicket = ticket;
          _this.selectedStatus = _this.getStatusIdFromText(ticket.status);

       }, 500);
    }
    
    getTicketDetails(ticketId){
      let onSuccess = (response) => {
        _this.comment = '';
          _this.ticketCommentList = response.data;
          angular.forEach(_this.ticketCommentList, (val) => {
              let fullName = val.user.firstName+' '+val.user.lastName;

              if(_this.userData.fullName === fullName){
                  val['user']['fullName'] = 'You';
              }else
              {
                  val['user']['fullName'] = fullName;
              }
              val['user']['createdAt'] = new Date(moment.utc(val.user.createdAt, 'YYYY-MM-DD HH:mm').local().format('MM-DD-YYYY HH:mm'));
          });
        },
        onError = (error) => {
          console.log(error);
        };

      _this.IssueTicketingService.getTicketDetails(ticketId);
      _this.IssueTicketingService.activePromise.then(onSuccess, onError);
    }
    
     getStatusIdFromText(status){
      for(var i = 0; _this.statusList.length > i; i++){
        if(_this.statusList[i].statusName == status){
          let statusId = _this.statusList[i].statusId;
          return statusId;
          break;
        }
      }
    }
    
    createComment(){
      //_this.changeStatus(_this.selectedTicket.id, _this.selectedStatus);
        let statusName = _this.getStatusNameForStatusId(_this.selectedStatus);
        if(statusName != _this.selectedTicket.status){
        _this.changeStatus(_this.selectedTicket.id, _this.selectedStatus);
      }
      if(_this.comment !== ""){
      let onSuccess = (response) => {
        _this.GrowlerService.growl({
          type: 'success',
          message: 'Comment Added Successfully',
          delay: 2000
        });
        _this.ticketTableParams.reload();
      },
      onError = (error) => {
        console.log(error);
      },
      commentData = {
        ticketId : _this.selectedTicket.id,
        comment : _this.comment
      };

    _this.IssueTicketingService.createComment(commentData);
    _this.IssueTicketingService.activePromise.then(onSuccess, onError);
  }
  
  }
  
  changeStatus(ticketId, statusId) {
      
     let onSuccess = (response) => {
          _this.isChange = true;
          _this.GrowlerService.growl({
          type: 'success',
          message: 'Status Change Successfully',
          delay: 2000
        });
        _this.ticketTableParams.reload();
       },
       onError = (error) => {
         console.log(error);
       },
       statusData = {
         status : statusId
       };

     _this.IssueTicketingService.changeStatus(ticketId, statusData);
     _this.IssueTicketingService.activePromise.then(onSuccess, onError);
   }

    onClose(){
        _this.ticketTableParams.reload();
    }
    
    getStatusNameForStatusId(statusId){
    for(let i = 0; _this.statusList.length > i; i++){
      if(_this.statusList[i].statusId == statusId){
        return _this.statusList[i].statusName;
      }
    }    
  }

    setUserType(type){
        _this.ticketTableFilter.ticketType = '';
        _this.ticketTableFilter.status = '';
        _this.ticketTableFilter.before ='';
        _this.ticketTableFilter.company ='';
        _this.ticketTableFilter.ticketPriority ='';
        _this.ticketTableFilter.userTypeId = type;
    }

    changeListToLocal(issueList){
        if(issueList && issueList.length > 0){
            for(let i = 0; issueList.length > i; i++){
                issueList[i].createdAt = _this.UtilsService.getLocalTimeFromGMT(issueList[i].createdAt, 24, 'MDY');

            }
        }

        return issueList;
    }
}

