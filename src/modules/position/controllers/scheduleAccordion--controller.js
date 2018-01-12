import _ from 'lodash';

var vm;
export class scheduleAccordionController {
	/** @ngInject  */
  constructor(calendarConfig, scheduleService, $timeout, GrowlerService) {

    console.log("Inside scheduleAccordionController");
    this.eventsSelected = [];
    vm = this;
    vm.isSignedIn = false;
    vm.searchFilter = {};
    this.scheduleService = scheduleService;
    this.GrowlerService = GrowlerService;
    this.isEditMode = this.mode;
    this.interviewId = this.interviewid;
    this.positionId = this.pid;
    this.$timeout = $timeout;
    this.scheduleAvailable = false;
    this.deleteSchedule = false;
    this.doDeleteAndNew = false;
    var minDate =new Date();
    this.minTime =new Date();
    this.minDate = minDate.toISOString();
    this.liveId = '';
    this.editSlot = [];
    this.deletedEvents = [];
    this.time = new Date();
    this.events = [];
    this.message = {
      hour: 'Hour is required',
      minute: 'Minute is required',
      meridiem: 'Meridiem is required'
    }
    this.dateOptions = {
	    formatYear: 'yy',
	    maxDate: new Date(2020, 5, 22),
	    minDate: new Date(),
        startingDay: 1
     };
    this.fromDatePopup = {
	    opened: false
	  };
    this.toDatePopup = {
       opened: false
    }
    this.dateformat = 'MM-dd-yyyy';
    this.altInputFormats = ['M!/d!/yyyy'];
    this.$onInit = function(){
        this.isEditMode = this.mode;
        this.interviewId = this.interviewid;
        this.positionId = this.pid;        
        this.fetchScheduledSlots();
    };
    this.$onChanges = function (changesObj) {
           console.log("updated object schedule"+changesObj);
            this.isEditMode = this.mode;
            this.interviewId = this.interviewid;
            this.positionId = this.pid;
            if(changesObj.isReset
                    && (changesObj.isReset.previousValue === true || changesObj.isReset.previousValue === false)
                    && (changesObj.isReset.currentValue !== changesObj.isReset.previousValue)){
                    this.eventsSelected = [];
                    this.events = [];
                    this.scheduleAvailable = false;
                    this.deletedEvents = [];
                    this.deleteSchedule = false;
                    this.doDeleteAndNew = false;
                    this.searchFilter = {};

            }else if(changesObj.isFetch
                    && (changesObj.isFetch.previousValue === true || changesObj.isFetch.previousValue === false)
                    && (changesObj.isFetch.currentValue !== changesObj.isFetch.previousValue)){
                this.fetchScheduledSlots();
            }
            else if(changesObj.currentState
                    && (changesObj.currentState.previousValue === true || changesObj.currentState.previousValue === false)
                    && (changesObj.currentState.currentValue !== changesObj.currentState.previousValue)){
                    
                    if(this.deletedEvents.length > 1 && !this.deleteSchedule && !this.doDeleteAndNew){
                        if(this.scheduleAvailable){
                             angular.forEach(vm.deletedEvents, (events) => {
                                    this.deleteSlots(events);
                            });
                        }                       
                    }
                 
                    if(this.eventsSelected.length < 1 && this.deleteSchedule && !this.doDeleteAndNew){
                        this.deleteInterview();
                    }else if(this.eventsSelected.length > 0){
                        if(this.deleteSchedule && this.doDeleteAndNew){
                            this.deleteInterview();
                            $timeout(function() {
                                this.saveScheduleInterviewSlots();
                            }, 1000);
                        }else
                        {                            
                            this.saveScheduleInterviewSlots();
                        }
                    }else
                    {   
                        if(this.deletedEvents.length < 1 && !this.scheduleAvailable){
                            this.GrowlerService.growl({
                                type: 'warning',
                                message: "Please Select Slots",
                                delay: 5000
                              });
                        }                        
                        return;
                      }
                  
                }
              };
              vm.calendarConfig = calendarConfig;
        //These variables MUST be set as a minimum for the calendar to work
        vm.calendarView = 'month';
        vm.viewDate = new Date();
        var actions = [
            {
              label: '<i class=\'glyphicon glyphicon-remove\'></i>',
              onClick: function(args) {
                vm.eventDeleted(args);
              }
            }];
        vm.events = [
          
        ];
        vm.isCellOpen = true;

        vm.getSlotsData = function()
        {
            if(vm.deleteSchedule){
                vm.doDeleteAndNew = true;
            }
            console.log(vm.searchFilter);
            scheduleService.getSchedulesList(vm.searchFilter);
            $timeout(function() {
              var eventsData = scheduleService.schedulesList;
              vm.addCalendarProperties(eventsData);
              vm.events = eventsData;
              vm.scheduleUpdated();
            }, 1000);          
        };

        vm.cancelSelection = function()
        {
          angular.forEach(vm.events, function(event) {
            vm.deselctEvent(event);
          });
        };

        vm.addCalendarProperties = function (eventsData) {
          angular.forEach(eventsData, function(eventObj) {
            if(eventObj.active){
        	eventObj.color = vm.calendarConfig.colorTypes.warning;
            }else{
                eventObj.color = vm.calendarConfig.colorTypes.important;
            }
            eventObj.actions = actions;
            
          });
        };
        
        
  }
  
  openFromDatePopup(){
      this.fromDatePopup.opened = true;
  }

  openToDatePopup(){
    this.toDatePopup.opened = true;
  }

  fetchScheduledSlots(){
      if (angular.isDefined(this.interviewid) && this.interviewid !== ""){
              var onSuccess = (response) => {
                  if(response && response.data){
                      vm.interviewSlotsList = response.data;
                      if(response.data && response.data.id){
                          this.liveId = response.data.id;
                      }
                      let hasData = _.isEmpty(vm.interviewSlotsList);
                      if (!hasData){
                          angular.forEach(vm.interviewSlotsList.slots, (val) => {
                                  val['startsAt'] = new Date(moment.utc(val.startDate, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm'));
                                  val['endsAt'] = new Date(moment.utc(val.endDate, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm'));
                                  val['actions'] = vm.actions;
                                  val['title'] = "SLOT ("+new Date(moment(val.startDate+'Z').local().format('MM-DD-YYYY HH:mm'))+")";
                          });
                          vm.searchFilter.fromDate = new Date(moment.utc(vm.interviewSlotsList.fromDate, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm')); 
                          vm.viewDate = new Date(vm.interviewSlotsList.fromDate); 
                          vm.searchFilter.toDate = new Date(moment.utc(vm.interviewSlotsList.toDate, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm')); 
                          let startTime = moment(this.minDate).format('YYYY-MM-DD') + ' ' + vm.interviewSlotsList.fromTime;
                          let endTime =  moment(this.minDate).format('YYYY-MM-DD') + ' ' + vm.interviewSlotsList.toTime;
                          vm.searchFilter.startTime = new Date(startTime);
                          vm.searchFilter.endTime =  new Date(endTime);
                          vm.searchFilter.duration = vm.interviewSlotsList.interviewDuration+"min";
                          vm.searchFilter.interval = vm.interviewSlotsList.intervalTime+"min";
                          vm.interviewId = vm.interviewSlotsList.interviewId;
                          vm.interviewid = vm.interviewSlotsList.interviewId;
                          vm.addCalendarProperties(vm.interviewSlotsList.slots);
                          vm.events = vm.interviewSlotsList.slots;
                          vm.scheduleAvailable = true;
                      }
                  } 
              },
              onError = (error) => {
                  console.log(error);
              };
              vm.scheduleService.getScheduleInterviewSlots(this.interviewid);
              vm.scheduleService.activePromise.then(onSuccess, onError);
      }
  }

  addEvent() {
    vm.events.push({
      title: 'New event',
      startsAt: moment().startOf('day').toDate(),
      endsAt: moment().endOf('day').toDate(),
      color: vm.calendarConfig.colorTypes.important
    });
  }

  deselctEvent(event) {
    if(event)
    {
      event.isSelected = false;
      event.color = vm.calendarConfig.colorTypes.important;
      _.remove(vm.eventsSelected, event);
    }
  }

  eventClicked(event) {
    if(!event.isSelected)
    {
      event.color = vm.calendarConfig.colorTypes.info;

      vm.eventsSelected.push({
        'title':event.title,
        'startsAt':event.startsAt,
        'endsAt':event.endsAt,
        'active':false
      });
    }
    else {
      event.color = vm.calendarConfig.colorTypes.important;
      _.remove(vm.eventsSelected, function(e){
        return e.title === event.title;
      });
    }
    event.isSelected = !event.isSelected;

    console.log('Clicked' + vm.eventsSelected);
    vm.scheduleUpdated();
  }

  saveScheduleInterviewSlots(){
    if(vm.searchFilter && vm.eventsSelected){ 
      var data = {
        "interviewId": this.interviewid,
        "positionId": this.positionId,
        "fromDate": vm.searchFilter.fromDate,
        "toDate": vm.searchFilter.toDate,
        "interviewDuration": vm.searchFilter.duration,
        "intervalTime": vm.searchFilter.interval,
        "schedulesList": vm.eventsSelected,
        "fromTime":moment(vm.searchFilter.startTime).format('HH:mm:ss'),
        "toTime":moment(vm.searchFilter.endTime).format('HH:mm:ss')
      };

      if(data){
          if(this.isEditMode && (this.interviewid === '' || this.interviewid === null)){
                this.scheduleService.saveScheduleInterviewSlots(data).then((res) => {
                if(res && res.status===200 && res.statusText.indexOf('OK')>-1){
                  this.scheduleAvailable = true;
                  this.eventsSelected = [];
                }
              });
          }
        else if(this.isEditMode && this.scheduleAvailable){
          this.scheduleService.saveReScheduleInterviewSlots(data,this.liveId).then((res) => {
            if(res && res.status===200 && res.statusText.indexOf('OK')>-1){
              this.scheduleAvailable = true;
              this.eventsSelected = [];
            }
          });
        }
        else{
          this.scheduleService.saveScheduleInterviewSlots(data).then((res) => {
            if(res && res.status===200 && res.statusText.indexOf('OK')>-1){
              this.scheduleAvailable = true;
              this.eventsSelected = [];
            }
          });
        }
      }
    }
  }

  eventDeleted(event) {
    _.remove(vm.events, event.calendarEvent);
    vm.deletedEvents.push(event.calendarEvent);
    console.log('Deleted', event);
    vm.scheduleUpdated();
  }

  eventTimesChanged(event) {
    alert.show('Dropped or resized', event);
  }

  toggle($event, field, event) {
    $event.preventDefault();
    $event.stopPropagation();
    event[field] = !event[field];
  }
  
  scheduleUpdated(){
    this.onUpdate({value: true});
  }

  confirmDelete(){
      $("#confirmDeleteModal").modal("show");
  }

  markForDelete(){
        this.deleteSchedule = true;
        this.doDeleteAndNew = false;
        this.resetData();
        this.scheduleUpdated();
        $("#confirmDeleteModal").modal("hide");
  }
      
  deleteInterview(){
    this.scheduleService.deleteLiveInterview(this.liveId).then((res) => {
      if(res){
        this.deleteSchedule = false;
        this.doDeleteAndNew = false;
        this.scheduleAvailable = false;
      }
    });
  }

  resetData(){
      vm.searchFilter.fromDate = "";
      vm.searchFilter.toDate = "";
      vm.searchFilter.startTime = "";
      vm.searchFilter.endTime = "";
      vm.searchFilter.duration = "";
      vm.searchFilter.interval = "";
      vm.events = [];
      vm.deletedEvents = [];
      vm.scheduleUpdated();
      if(!vm.isEditMode || vm.deleteSchedule){
          vm.eventsSelected = [];
      }else
      {
          vm.fetchScheduledSlots();
      }
      
  }
      
  reScheduleSlot(){
    var self = this;
    var data = {
      "title":$('#reschedule-slot').attr('slot-title'),
      "startAt":moment(this.refromDate).format('YYYY-MM-DD') + ' ' + moment(this.refromTime).format('HH:mm:ss'),
      "endAt":moment(this.retoDate).format('YYYY-MM-DD') + ' ' + moment(this.retoTime).format('HH:mm:ss'),
      "userId":$('#reschedule-slot').attr('slot-candidateid')
    };
    self.scheduleService.reScheduleSlotByUser(data,self.editSlot.id).then((res) => {
      if(res){
        $('#reschedule-slot').modal('hide');  
      }
    },(error) => {
      $('#reschedule-slot').modal('hide');
    });
  }
      
  deleteSlots(args){
        vm.scheduleService.cancelSlot(args.id,args.candidateId).then((res) =>{
        if(res){              
        }
      });
  }
      
}
 
