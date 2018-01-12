
export default RunConfig;

/** @ngInject */
function RunConfig($rootScope, $state, $window, AuthService, StatesConfig, $location, $timeout, LoaderService) {
    if (window.mobile) {
        $rootScope.mobile = true;
        $rootScope.appPath = cordova.file.applicationDirectory + "www/";
        var permissions = cordova.plugins.permissions;
        var list = [
            permissions.CAMERA,
            permissions.RECORD_AUDIO,
            permissions.MODIFY_AUDIO_SETTINGS
        ];

        function error() {
            console.warn('Camera permission is not turned on');
        }

        function success(status) {
            if (!status.hasPermission) {

                permissions.requestPermissions(
                    list,
                    function (status) {
                        if (!status.hasPermission) error();
                    },
                    error);
            }
        }

        permissions.hasPermission(list, success, null);
        
        // Code for Deep Linking in mobile
        universalLinks.subscribe('deeplink_cb', function(eventData){
            console.log("Deeplink Call back. >> ", eventData);
            var splitUrl = eventData.url.split('/');
            if(eventData.url.indexOf("candidate-confirmation")>-1)
                $state.go("signup.candidate-confirmation",{token:splitUrl[splitUrl.length-1]});
            else if(eventData.url.indexOf("/cn/")>-1){
                $state.go("conference.participant-login",{ConfId:splitUrl[splitUrl.length-1]});
            }
            else if(eventData.url.indexOf("/meet/")>-1){
                $state.go("conference.free-conference",{confId:splitUrl[splitUrl.length-1]});
            }
            else    
                $state.go("signup.company-info",{token:splitUrl[splitUrl.length-1]});
        });   
    } else {
        $rootScope.mobile = false;
        $rootScope.appPath = "./";
    }

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        LoaderService.show();
        angular.element('html, body').scrollTop(0);
        $rootScope.user = null;
        $rootScope.isLoggedIn = false;
        let user = $window.localStorage.user || $window.sessionStorage.user;
        if (user) {
            user = JSON.parse(user);
            $rootScope.user = user;
            $rootScope.isLoggedIn = true;
        }
        // $rootScope.companyLogoPath = ($window.localStorage.companyLogoPath) ? $window.localStorage.companyLogoPath : "./img/logo.png";
        // $rootScope.profilePicPath = ($window.localStorage.profilePicPath) ? $window.localStorage.profilePicPath : "./img/user.png";
        $rootScope.companyLogoPath = ($window.localStorage.companyLogoPath) ? $window.localStorage.companyLogoPath : $rootScope.appPath + "img/logo.png";
        $rootScope.profilePicPath = ($window.localStorage.profilePicPath) ? $window.localStorage.profilePicPath : $rootScope.appPath + "img/user.png";
        let isUserLoggedIn = AuthService.user;
        let isStateForGuestOnly = StatesConfig.guestStates.indexOf(toState.name) > -1;
        let isStateForConfGuestOnly = StatesConfig.guestConfStates.indexOf(toState.name) > -1;
        let isAuthorizedState = StatesConfig.checkAuthorizedStates(toState.name);

        if (toState && toParams && (toState.name.indexOf('application') >= 0 || toState.name.indexOf('advertise') >= 0 || toState.name.indexOf('applied') >= 0 || toState.name.indexOf('interview') >= 0 || toState.name.indexOf('hired') >= 0) && toParams.positionId === 'new') {
            console.log('stop event fired');
            event.preventDefault();
            LoaderService.hide();
            $rootScope.$emit("unauthStateChange", fromState.name);
        }
        if (fromState && fromParams && (fromState.name.indexOf('update-position') >= 0 || fromState.name.indexOf('create-position') >= 0 || fromState.name.indexOf('advertise') >= 0 || fromState.name.indexOf('application') >= 0 || fromState.name.indexOf('interview') >= 0) && fromParams.positionId !== 'new') {
            if (toParams.isCanceled) {
                console.log('user cancel');
            }
            else {
                console.log('save event fired');
                $rootScope.$broadcast("saveData", fromState.name);
            }

        }

        if (isUserLoggedIn && (isStateForGuestOnly || !isAuthorizedState || (toState.name === 'app'))) {

            if (toState.name === 'signup.company-info') {
                AuthService.logoutForSignup();
            }
            else {
                event.preventDefault();
                let isInt = false, isConf = false;
                if (user.userType === 1) {
                    if (user.products && user.products.length > 0) {
                        for (var i = 0; i < user.products.length; i++) {
                            if (user.products[i] === 1) {
                                isInt = true;
                            } else if (user.products[i] === 2) {
                                isConf = true;
                            }

                        }
                    }
                    if ((isInt && isConf) || (isInt && !isConf)) {
                        if (user.userRoles === 7 || user.userRoles === 8 || user.userRoles === 9 || user.userRoles === 10 || user.userRoles === 11 || user.userRoles === 12 || user.userRoles === 13 || user.userRoles === 14 || user.userRoles === 15 || user.userRoles === 16 || user.userRoles === 17) {
                            $state.go('sa.home');
                        } else if (user.userRoles === 18) {
                            $state.go('conference.conference-home');
                        } else {

                            $state.go('app.dashboard');
                        }
                    } else if (!isInt && isConf) {
                        $state.go('conference.conference-home');
                    }

                } else if (user.userType === 2) {
                    $state.go('candidateProfile.home');
                }
            }

        }

        if (!isUserLoggedIn) {
            if ((toState.name === 'app' || !isStateForGuestOnly) && !isStateForConfGuestOnly) {
                event.preventDefault();
                $state.go('app.user-login');
            }
        }


        let url = $location.path();
        if (url === "/candidate-compare") {
            $rootScope.isComparePath = true;
        } else {
            $rootScope.isComparePath = false;
        }



        if (toState && toState.params && toState.name.indexOf('conference') >= 0 && toState.params.showHeader) {
            $rootScope.showConfHeader = true;
        } else {
            $rootScope.showConfHeader = false;
        }

        if (toState && toState.params && toState.name.indexOf('conference') >= 0 && toState.params.hideFooter) {
            $rootScope.hideFooter = true;
        } else {
            $rootScope.hideFooter = false;
        }

        if (toState && toState.url && toState.url.indexOf('settings') >= 0) {
            $rootScope.isSettingPath = true;
        } else {
            $rootScope.isSettingPath = false;
        }


    });

    $rootScope.$on('$stateChangeSuccess', function () {
        $timeout(function () {
            LoaderService.hide();
        }, 2000);

    });

    $rootScope.$on('$stateChangeError', function () {
        $timeout(function () {
            LoaderService.hide();
        }, 2000);
    });

    $rootScope.isMobile = function () {
        var windowWidth = angular.element(window).width();
        if (windowWidth > 767) {
            return false;
        } else {
            return true;
        }
    };
    $rootScope.doLogout = () => {
        AuthService.logout();
    }
    $rootScope.setActiveLi = (id) => {
        for (var i = 0; i < 13; i++) {

            if (id !== i) {
                $("#headerLi" + i).removeClass('active');
            }
        }
        $("#headerLi" + id).addClass('active');
        $("#headerLi" + id).addClass('active');
    }
}