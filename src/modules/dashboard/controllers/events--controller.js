import _ from 'lodash';
let _this;

export class eventsController {
	/** @ngInject  */
  constructor(NgTableParams,$window, calendarConfig, DashboardService, $element, $timeout, $sce , UtilsService, QuickStasticsService, calendarService, AuthService) {
    _this = this;
    
    _this.UtilsService = UtilsService;
    _this.$timeout = $timeout;
    _this.$element = $element;
    _this.$window = $window;
    _this.fullHeight = false;
    _this.noGoogleEvent = 0;
    _this.QuickStasticsService = QuickStasticsService;
    _this.AuthService = AuthService;
    _this.roleId = _this.AuthService.user.userRoles;
    _this.$sce = $sce;
    _this.eventsDataList = [];
    _this.calendarConfig = calendarConfig;
    _this.calendarService = calendarService;
    _this.DashboardService = DashboardService;
    //These variables MUST be set as a minimum for the calendar to work
    _this.calendarView = 'month';
    _this.viewDate = new Date();
    _this.events = [];
    _this.loggedInMail = "";
    _this.color = { 
        primary: '#e3bc08', // the primary event color (should be darker than secondary)
        secondary: '#fdf1ba' // the secondary event color (should be lighter than primary)
      };
      _this.LocalEventsColor = { 
        primary: '#73acde', // the primary event color (should be darker than secondary)
        secondary: '#fdf1ba' // the secondary event color (should be lighter than primary)
      };
    _this.isCellOpen = true;
    _this.allStastics = '';
    _this.isLocalEvents = false;
    _this.getallStastics();
    _this.eventsTableParams = new NgTableParams(
             {
            page: 1,
            count: 5,
            filter: _this.eventsTableFilter
        }, 
             {
                counts: [],
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
                            _this.eventsDataList = _this.getEventListInLocalTime(response.data.data);                           
                            _this.eventsDataListCount = response.data.total;
                            if (_this.eventsDataList &&
                                _this.eventsDataList.length > 0) {                                
                                params.total(_this.eventsDataListCount);              
                                if(!_this.dataTableService.totalColumn.length) {
                                   _this.dataTableService.initTable(_this.cols, _this.eventsTableParams);  
                                }
                                return (_this.eventsDataList);
                            }
                        },
                    onError = (error) => {
                        console.log(error);
                    };

                    _this.DashboardService.getEventsData(queryURL);
                    return _this.DashboardService.activePromise.then(onSuccess, onError);
                }
                
                
            });
    _this.showlist();
    _this.getPreference(); 
    _this.getLocalEvents();
    
    $(".btn-group > .btngrp").click(function(){
        $(".btn-group > .btngrp").removeClass("active");
        $(_this).addClass("active");
    });
  }
  showlist(){
    if(_this.roleId === 3 || _this.roleId === 4){
      _this.fullHeight = true;
    }else{
      _this.fullHeight = false;
    }
  }
  getallStastics(){
        let onSuccess = (response) => {
          _this.allStastics = response.data;
        },
        onError = (error) => {
          console.log(error);   
        };
    if(_this.roleId !== 3 && _this.roleId !== 4){
      _this.QuickStasticsService.getallStastics();
      _this.QuickStasticsService.activePromise.then(onSuccess, onError);
    }
   }   
  
  getEventListInLocalTime(eventsDataList){
    if(eventsDataList && eventsDataList.length > 0){
      for(let i = 0; eventsDataList.length > i; i++){
         let eventStartDateTime = eventsDataList[i].fromDate;
         let eventEndDateTime =  eventsDataList[i].toDate;
         eventsDataList[i].localFromDateTime = moment.utc(eventStartDateTime, 'YYYY-MM-DD HH:mm').local().format('MM-DD-YYYY HH:mm');
         eventsDataList[i].localToDateTime =  moment.utc(eventEndDateTime, 'YYYY-MM-DD HH:mm').local().format('MM-DD-YYYY HH:mm');
      }
    }
    return eventsDataList;
  }

  getPreference() {
    let onSuccess = (response) => {
      var calendarOption = response.data.defaultCalendar;
      if(calendarOption === 'gmail') {
        _this.getGoogleEvents();
      }
      else if(calendarOption === 'outlook') {
        _this.getOutlookEvents();
      }
    },
    onError = (error) => {
      console.log(error);
    };

    _this.calendarService.getCalendarPrefernce();
    _this.calendarService.activePromise.then(onSuccess, onError);
  }
  
  getGoogleEvents() {
    let onSuccess = (response) => {
            console.log(response.data);  
            if(response.data.status === 'empty') {
                _this.noGoogleEvent = 1;
                _this.loggedInMail = response.data.loggedEmail;
            }
            else if(response.data.status === 'fail') {
                _this.noGoogleEvent = 2;
            }
            else {
                var tempArray = response.data;
                console.log(tempArray);
                angular.forEach(tempArray, function(value, key){
                    var tempObj = {};
                    tempObj.title = value.summary;
                    //var temptime = "" + value.start.dateTime;
                    tempObj.startsAt = moment(moment.utc(value.start.dateTime).toDate()).local().toDate();
                    tempObj.color = _this.color;
                    tempObj.summary = value.summary;
                    _this.events.push(tempObj);
                    _this.loggedInMail = value.loggedEmail;
                });
                console.log('all events', _this.events);
            }
            
        },
        onError = (error) => {
            console.log(error);
        };
    _this.calendarService.googleEvents();
    _this.calendarService.activePromise.then(onSuccess, onError);
  }

  getOutlookEvents() {
    let onSuccess = (response) => {
            console.log(response.data);  
            if(response.data.status === 'empty') {
                _this.noGoogleEvent = 1;
                _this.loggedInMail = response.data.loggedEmail;
            }
            else if(response.data.status === 'fail') {
                _this.noGoogleEvent = 2;
            }
            else {
                var tempArray = response.data;
                console.log(tempArray);
                angular.forEach(tempArray, function(value, key){
                    var tempObj = {};
                    tempObj.title = value.subject;
                    tempObj.summary = value.summary;
                    //var temptime = "" + value.start.dateTime;
                    tempObj.startsAt = moment(moment.utc(value.start.dateTime).toDate()).local().toDate();
                    tempObj.color = _this.color;
                    _this.loggedInMail = value.loggedEmail;
                    _this.events.push(tempObj);
                });
                console.log('all events', _this.events);
            }
            
        },
        onError = (error) => {
            console.log(error);
        };
    _this.calendarService.outlookEvents();
    _this.calendarService.activePromise.then(onSuccess, onError);
  }
  
  getLocalEvents() {
    let onSuccess = (response) => {
        console.log(response);
        if(response.data.total > 0) {
            _this.isLocalEvents = true;
            var tempArray = response.data.data;
            angular.forEach(tempArray, function(value, key){
                var tempObj = {};
                tempObj.title =
               `<b> Candidate Name :</b> ${value.candidateName} <br>
               <b> Position Name :</b> ${value.positionName} <br>
               <b> Interview Link :</b> ${value.interviewLink} <br>`;
                //var temptime = "" + value.start.dateTime;
                tempObj.startsAt = moment(moment.utc(value.fromDate).toDate()).local().toDate();
                tempObj.color = _this.LocalEventsColor;
                tempObj.summary = value.positionName;
                _this.events.push(tempObj);
            });


        }
        else {
            _this.isLocalEvents = false;
        }
      },
      onError = (error) => {
        console.log(error);
      };
  
      _this.calendarService.getLocalEvents();
      _this.calendarService.activePromise.then(onSuccess, onError);

  }

  eventClicked(event) {
      console.log(event);
      var title = event.title;

      var link = title.slice(title.indexOf('https'),-5);
      console.log(link);
      _this.$window.location.replace(link);

  }
}


