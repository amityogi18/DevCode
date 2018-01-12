export class AppController {
    /** @ngInject */
    constructor(appService, $window, $rootScope, AuthService, $state, LoaderService, $interval, $storage) {

console.log("Main Controller calling..");

        this.activeTab = 0;
        this.appService = appService;
        this.AuthService = AuthService;
        this.$window = $window;
        this.$state = $state;
        this.$interval = $interval;
        this.$storage = $storage;
        this.$rootScope = $rootScope;
        this.user = this.AuthService.user;
        this.isLoggedIn = this.AuthService.isUserLoggedIn();
        this.$rootScope.loader = {};
        LoaderService.loader = $rootScope.loader;
        let refreshTokenPromise = this.AuthService.refreshToken();

        if(refreshTokenPromise) {
            LoaderService.show();
            refreshTokenPromise['finally'](LoaderService.hide);
        }

        console.log('Inside app controller constructor');
        $(document).ready(function () {
            $(document).click(function (event) {
                var clickover = $(event.target);
                if ($("#navbarCollapse").hasClass("in")) {
                    $("#navbarCollapse").removeClass("in");
                  }
            });
        });
    }

    isInLoginPage() {
        return this.appService.isInLoginPage;
    }

    doLogout() {
        /*var logoutPromise = this.AuthService.logout();
        logoutPromise.then(function () {
            vm.$state.go('app.home');
        });*/
        this.AuthService.user = null;
        this.$storage.removeItem('user');
        this.$window.sessionStorage.removeItem('user');
        this.user = {};
        this.isLoggedIn = false;
        this.$rootScope.isLoggedIn = false;
        if (angular.isDefined(this.$rootScope.notification)) {
            this.$interval.cancel(this.$rootScope.notification);
            this.$rootScope.notification = undefined;
        }
        this.$state.go('app.login');
    }
}