import _ from 'lodash';
var vm;
export class candidateScheduleInterviewController {
	/** @ngInject  */
  constructor(calendarConfig, scheduleService, $timeout, $stateParams, $interval, GrowlerService) {

      console.log("Inside candidateScheduleInterviewController");      
        this.eventsSelected = [];
        vm = this;
   	vm.searchFilter = {};
        vm.$stateParams = $stateParams;
        vm.$interval = $interval;
        vm.$timeout = $timeout;
        vm.scheduleService = scheduleService;
        vm.GrowlerService = GrowlerService;
        vm.interviewId = vm.$stateParams.interviewId;
        vm.calendarConfig = calendarConfig;
        vm.calendarView = 'month';
        vm.viewDate = new Date();
        vm.events = [];
        vm.isCellOpen = false;
        vm.candidateEmailId = '';
        vm.InvalidEmailError = false;
        vm.isReschedule = false;
        vm.isScheduled = false;
        vm.isScheduleAvailable = false;
        vm.slotsAvailable = false;
        $(document).ready(function(){
            // Show the Modal on load
            var options = {
                "backdrop" : "static",
                "show": "true"
            };
            
            $("#emailId").modal(options);
            // Hide the Modal           
            $("#cancel").click(function(){
                $("#emailId").modal("hide");
            });
        });
           
    
    vm.cancelSelection = function()
     {
      angular.forEach(vm.events, function(event) {
      	if(!event.isBooked && !(event.candidatesOpted === event.candidatesAllowed)){
      		 vm.deselctEvent(event);
      	}
      });
     };

    vm.addCalendarProperties = function (eventsData) {
      angular.forEach(eventsData, function(eventObj) {
        if(eventObj.active){
            if(eventObj.active && vm.candidateId === eventObj.candidateId){
                  eventObj.color = vm.calendarConfig.colorTypes.special;
              }
              else{
                  eventObj.color = vm.calendarConfig.colorTypes.warning;
              }
        }
        else{
        	eventObj.color = vm.calendarConfig.colorTypes.success; 
        }
        
      });
    };
}
   

    fetchScheduledSlots(){
        if (angular.isDefined(vm.interviewId) && vm.interviewId !== ""){
                var onSuccess = (response) => {
                    vm.events = [];
                    if(response && response.data){
                        debugger;
                        vm.interviewSlotsList = response.data;
                        let hasData = _.isEmpty(vm.interviewSlotsList);                        
                        if (!hasData){
                            let val = vm.interviewSlotsList.slots;
                            for(var i=0;i < val.length ;i++){                            
                                    val[i]['startsAt'] = new Date(moment.utc(val[i].startDate, 'YYYY-MM-DD H:mm').local().format('MM-DD-YYYY HH:mm'));
                                    val[i]['endsAt'] = new Date(moment.utc(val[i].endDate, 'YYYY-MM-DD H:mm').local().format('MM-DD-YYYY HH:mm'));
                                    val[i]['actions'] = vm.actions;
                                    val[i]['title'] = "SLOT ("+new Date(moment.utc(val[i].startDate+'Z').local().format('MM-DD-YYYY HH:mm'))+")";
                                    val[i]['summary'] = "SLOT ("+moment(val[i].startDate+'Z').local().format('HH:mm')+")";
                                    if(val[i].candidateId === vm.candidateId){
                                        vm.isReschedule = true;
                                        vm.candidateSlotId = val[i].id;
                                    }
                                    if(!val[i].active){
                                        vm.slotsAvailable = true;
                                    }
                            };
                            vm.isScheduleAvailable = true;
                            vm.searchFilter.fromDate = new Date(moment.utc(vm.interviewSlotsList.fromDate, 'YYYY-MM-DD H:mm').local().format('MM-DD-YYYY HH:mm')); 
                            vm.viewDate = new Date(vm.interviewSlotsList.fromDate); 
                            vm.searchFilter.toDate = new Date(moment.utc(vm.interviewSlotsList.toDate, 'YYYY-MM-DD H:mm').local().format('MM-DD-YYYY HH:mm')); 
                            vm.searchFilter.startTime = vm.interviewSlotsList.fromTime;
                            vm.searchFilter.endTime = vm.interviewSlotsList.toTime;
                            vm.searchFilter.companyName = vm.interviewSlotsList.companyName;
                            vm.searchFilter.interviewName = vm.interviewSlotsList.interviewName;
                            vm.searchFilter.positionName = vm.interviewSlotsList.positionName;
                            vm.searchFilter.positionCode = vm.interviewSlotsList.positionCode;
                            vm.searchFilter.positionDescription = vm.interviewSlotsList.description;
                            vm.searchFilter.userName = vm.interviewSlotsList.userName;
                            vm.searchFilter.duration = vm.interviewSlotsList.interviewDuration+"min";
                            vm.searchFilter.interval = vm.interviewSlotsList.intervalTime+"min";
                            vm.searchFilter.primarySkillsetName = vm.interviewSlotsList.primarySkillsetName;
                            vm.searchFilter.secondarySkillsName = vm.interviewSlotsList.secondarySkillsName;
                            vm.searchFilter.tertiarySkillsName = vm.interviewSlotsList.tertiarySkillsName;
                            vm.interviewId = vm.interviewSlotsList.interviewId;
                            vm.interviewid = vm.interviewSlotsList.interviewId;
                            vm.addCalendarProperties(vm.interviewSlotsList.slots);
                            vm.events = vm.interviewSlotsList.slots; 
                            // if(vm.searchFilter.positionDescription!=='') {
                            //     document.querySelector('.jobdescripbtionHtml').innerHTML = vm.searchFilter.positionDescription;
                            // }else {
                            //     document.querySelector('.jobdescripbtionHtml').innerHTML = 'N/A'
                            // }
                        }
                    } 
                },
                onError = (error) => {
                   console.log(error);
                   vm.events = [];
                };
                vm.scheduleService.getScheduleInterviewSlots(vm.interviewId);
                vm.scheduleService.activePromise.then(onSuccess, onError);
        }
    }

    deselctEvent(event) {
      if(event)
      {
        event.isSelected = false;
        event.color = vm.calendarConfig.colorTypes.success;
        _.remove(vm.eventsSelected, event);
      }
    };

    eventClicked(event,eventList) {
      if(event.active && vm.candidateId !== event.candidateId){
      	 vm.GrowlerService.growl({
                type: 'warning',
                message: "Slot is already Booked!! Please try another.",
                delay: 5000
            }); 
      	return;
      }
      if(event.endsAt < new Date()){
            vm.GrowlerService.growl({
                  type: 'warning',
                  message: "Slot Booking Time Expired",
                  delay: 5000
              });
            return;
        }
      if(vm.events && vm.events.length>0){
        angular.forEach(vm.events, function(eventObj) {            
             if(eventObj.active){
                  eventObj.color = vm.calendarConfig.colorTypes.warning;
             }else
             {
                 eventObj.color = vm.calendarConfig.colorTypes.success;
             }
          });
      }

      if(event.active && vm.candidateId === event.candidateId){
        event.color = vm.calendarConfig.colorTypes.special;
      	return;
      }
      else if(!event.isSelected)
      {
        if(vm.eventsSelected.length > 0){
          vm.eventsSelected.length = 0;
        }
      	event.color = vm.calendarConfig.colorTypes.special;
        vm.eventsSelected.push(event);
      }
      else {
      	event.color = vm.calendarConfig.colorTypes.success;
        _.remove(vm.eventsSelected, function(e){
          return e.title === event.title;
        });
      }      
      event.isSelected = !event.isSelected;

      var bookedFlag = false;
      angular.forEach(vm.events, function(eventObj) {
       	if(JSON.stringify(eventObj) != JSON.stringify(event)) {
            if(eventObj.active){
                eventObj.color = vm.calendarConfig.colorTypes.warning;
       		eventObj.isSelected = false; 
            }
            if(eventObj.isSelected){
       		eventObj.isSelected = false; 
            }
       	} 
      });
    };

    dateClicked(calendarEvent){
    	console.log(calendarEvent);
    }

    eventEdited(event) {
      console.log('Edited' + event);
    };

    eventDeleted(event) {
      _.remove(vm.events, event.calendarEvent);
      console.log('Deleted', event);
    };

    eventTimesChanged(event) {
      alert.show('Dropped or resized', event);
    };

    toggle($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };

    bookInterview (eventsData){
    	angular.forEach(eventsData, function(eventObj) {
       	if(eventObj.isSelected){
            if(eventObj.endsAt < new Date()){
                return;
            }
            if(eventObj.active && vm.candidateId === eventObj.candidateId){
                vm.GrowlerService.growl({
                      type: 'warning',
                      message: "You have already booked this slot.",
                      delay: 5000
                  });
                return;
            }          
            vm.scheduleService.candidateBookRescheduleSlot(eventObj.id,vm.candidateId).then(function(result){
              if(result){
                   vm.isScheduleAvailable = false;
                   vm.candidateSlotData = eventObj;
                   vm.isScheduled = true;
              }
            }, function(error){
                console.log(error);
                vm.fetchScheduledSlots();
            });
       	}
       	else{
       		eventObj.isSelected = false;
       	}
      });
    }

    reSchedule(){
    	//clear the user selected Slot and reduce the opted Candidate
    	angular.forEach(vm.events, function(eventObj) {
       	if(eventObj.isSelected){
       		eventObj.isBooked = false;
       		eventObj.candidatesOpted = eventObj.candidatesOpted - 1;	
       	}
       		eventObj.isSelected = false;
      });
    	alert("your slot will be vacated for other candidate ,  Please book another one.");
       	vm.addCalendarProperties(vm.events);
    } 
    
    showSchedulePage(){
        if(angular.isDefined(vm.candidateEmailId) && vm.candidateEmailId !== ""){
                var emailScheduleCalender ={
                    "email":vm.candidateEmailId
                };
                let onSuccess = (response) => {            
                    if(response && response.data && response.data.candidateId){
                        vm.candidateId = response.data.candidateId;
                        vm.candidateName = response.data.candidateName;
                        vm.InvalidEmailError = false;
                        $("#emailId").modal("hide");
                        vm.fetchScheduledSlots();
                        vm.$timeout(function(){
                            if(vm.searchFilter.positionDescription!=='') {
                               document.querySelector('.jobdescripbtionHtml').innerHTML = vm.searchFilter.positionDescription;
                            }else {
                                document.querySelector('.jobdescripbtionHtml').innerHTML = 'N/A';
                            }
                        },1000);

                    }else
                    {
                        vm.InvalidEmailError = true;
                    }

                },
                onError = (error) => {
                    console.log(error);
                    vm.InvalidEmailError = true;
                };

               vm.scheduleService.getCandidateEmailId(emailScheduleCalender);
               vm.scheduleService.activePromise.then(onSuccess, onError);
        }
    }
    cancelBooking(){
           vm.scheduleService.cancelSlot(vm.candidateSlotId,vm.candidateId).then((res) =>{
            if(res){
              vm.GrowlerService.growl({
                    type: 'success',
                    message: "Your Booking for the interview slot is cancelled successfully",
                    delay: 5000
              });
              
              vm.resetData();
              vm.fetchScheduledSlots();
            }
          },
            function(error){
              console.log(error);
              vm.fetchScheduledSlots();
          });
      }
      resetData(){
        vm.candidateSlotData = {};
        vm.candidateSlotId = '';
        vm.events = [];
        vm.isReschedule = false;
    }
}

