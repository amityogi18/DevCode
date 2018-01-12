let _this;
export class ConferenceScheduleController {
	/** @ngInject  */
  constructor(ConferenceScheduleService){
    _this = this;
    _this.ConferenceScheduleService =  ConferenceScheduleService;
    _this.isShowToolTipMeeting = false;
    _this.isShowToolTipRecord = false;

  }
  showTooltip(type){
    if(type === 'Meeting'){
      _this.isShowToolTipMeeting = !_this.isShowToolTipMeeting;
    }else{
      _this.isShowToolTipRecord = !_this.isShowToolTipRecord;
    }
  }

  }

