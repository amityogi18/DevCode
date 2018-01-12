let service;
export class HttpInterceptorService {
    /** @ngInject */
    constructor($storage, $window, $rootScope, $interval, $q, GrowlerService, errorMessage, successMessage) {
        service = this;
        service.$storage = $storage;
        service.$window = $window;
        service.$rootScope = $rootScope;
        service.$interval = $interval;
        service.$q = $q;
        service.GrowlerService = GrowlerService;
        service.errorMessage = errorMessage;
        service.successMessage = successMessage;
    }

    responseError(res) {
        if (res.status == 500) {
            if(res.config.url.includes("imap")){
                service.GrowlerService.growl({
                    type: 'success',
                    message: "Looks like your email and password is incorrect.",
                    delay: 1000
                });

            }else{
                 service.GrowlerService.growl({
                    type: 'danger',
                    message: "Oops something went wrong!",
                    delay: 1000
                });
            }
        }
        else if (res.status >= 400) {
            if (res.data.errorCode == 'USER_UNAUTHORIZED') {
                service.logout();
            } 
            else if (res.data.errorCode == 'CAN_NOT_CHANGE_STATUS_DIRECTLY_CHOOSE_ANOTHER_STATUS') {
                // Do Nothing
            } 
            else {
                let errorMessage = service.errorMessage;
                service.GrowlerService.growl({
                    type: 'danger',
                    message: errorMessage[res.data.errorCode],
                    delay: 1000
                });
            }

        }
        // else if (res.status == -1) {
        //     service.GrowlerService.growl({
        //         type: 'info',
        //         message: "INTERNET DISCONNECTED",
        //         delay: 1000
        //     });
        // }
        else {
            let successMessage = service.errorMessage;
            service.GrowlerService.growl({
                type: 'success',
                message: successMessage[res.data.successMessage],
                delay: 1000
            });
        }
        return service.$q.reject(res);
    }

    logout(){
        let userType = service.$rootScope.user.userType;
        service.$storage.removeItem('user');
        service.$window.sessionStorage.removeItem('user');
        service.$storage.removeItem('profilePicPath');
        service.$storage.removeItem('companyLogoPath');
        service.$storage.removeItem('theme');
        service.$rootScope.user = "";
        service.$rootScope.companyLogoPath = "./img/logo.png";
        service.$rootScope.profilePicPath = "./img/user.png";
        service.$rootScope.isLoggedIn = false;
        if (angular.isDefined(service.$rootScope.notification)) {
            service.$interval.cancel(service.$rootScope.notification);
            service.$rootScope.notification = undefined;
        }
        if (userType == 2) {
            service.$window.location.href = 'candidate-login';
        } else {
            service.$window.location.href = 'user-login';
        }
    }
}
