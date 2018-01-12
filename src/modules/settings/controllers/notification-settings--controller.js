let _this ;

export class NotificationSettingsController {
	/** @ngInject  */
  constructor(NotificationSettingsService, GrowlerService) {
    _this = this;
    _this.NotificationSettingsService = NotificationSettingsService;   
    _this.GrowlerService = GrowlerService;
    _this.notifications = [];
    _this.getNotifications();
   
    console.log('Inside NotificationSettings Controller');
  }

  getNotifications(){
      let onSuccess = (response) => {
        _this.notifications = response.data;
      },
      onError = (error) => {
        console.log(error);   
      };
    _this.NotificationSettingsService.getNotifications();
    _this.NotificationSettingsService.activePromise.then(onSuccess, onError);
  }    
  
  toggleNotification(event,notificationId, elementId){    
    let status = event.currentTarget.attributes['aria-checked'].value === "true" ? 0 : 1; 
    let onSuccess = (response) => {
        _this.GrowlerService.growl({
                  type: 'success',
                  message: 'Notification updated successfully',
                  delay: 2000
              });
              
    },
    onError = (error) => {   
        console.log(error);
    };
    let updateData = {
                notificationTypeId:notificationId,
                isEnabled: status
          };
    _this.NotificationSettingsService.toggleNotification(updateData);
    _this.NotificationSettingsService.activePromise.then(onSuccess, onError);
  }
}


