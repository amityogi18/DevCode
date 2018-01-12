var _this;

export class EventsPopupController {
	/** @ngInject  */
  constructor(DashboardService) {
    console.log('Inside Events Popup controller constructor');
      _this = this;
      _this.DashboardService = DashboardService;
     _this.eventData = _this.data;
  }
}


