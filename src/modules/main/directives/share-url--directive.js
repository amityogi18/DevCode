function linkingFunc($document, $q) {
    return function (scope, elem, attrs) {
        function initGoogle() {
            
     
     window.fbAsyncInit = function() {
        FB.init({
            appId      : '1866579003562258',
            cookie     : true,  // enable cookies to allow the server to access
                                // the session
            xfbml      : true,  // parse social plugins on this page
            version    : 'v2.8' // use graph api version 2.8
        });
    };

    // Load the SDK asynchronously
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    
    
    window.twttr = (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
                t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function(f) {
            t._e.push(f);
        };

        return t;
    }(document, "script", "twitter-wjs"));
            
            let onSuccess = (response) => {
                console.log(response);
            },
                    onError = (error) => {
                console.log(error);
            };
            loadLibrary($document, $q, 'https://apis.google.com/js/platform.js', 'google-jssdk').then(onSuccess, onError);
        }
        ;
        function initLinkedIn() {
            let onSuccess = (response) => {
                console.log(response);
            },
                    onError = (error) => {
                console.log(error);
            };
            loadLibrary($document, $q, 'https://platform.linkedin.com/in.js', 'linkedIn-jssdk').then(onSuccess, onError);
        }
        ;
        function initFb() {
            let onSuccess = (response) => {
                console.log(response);
            },
                    onError = (error) => {
                console.log(error);
            };
            loadLibrary($document, $q, 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8', 'facebook-jssdk').then(onSuccess, onError);
        }
        ;
        function initTwitter() {
            let onSuccess = (response) => {
                console.log(response);
                var t = window.twttr;
                t._e = [];
                t.ready = function (f) {
                    t._e.push(f);
                };
                t.widgets.load();

                return t;
            },
                    onError = (error) => {
                console.log(error);
            };
            loadLibrary($document, $q, 'https://platform.twitter.com/widgets.js', 'twitter-wjs').then(onSuccess, onError);
        }
        ;

        window.fbAsyncInit = function () {
            FB.init({
                appId: '1866579003562258',
                cookie: true, // enable cookies to allow the server to access
                // the session
                xfbml: true, // parse social plugins on this page
                version: 'v2.8' // use graph api version 2.8
            });
            FB.AppEvents.logPageView();
        };

        function loadLibrary($document, $q, url, id) {            
            var deferred = $q.defer();
            if (document.getElementById(id))
                return deferred.promise;
            var doc = $document[0];
            var script = doc.createElement('script');
            script.src = url;
            script.id = id;
            script.onload = function () {
                deferred.resolve();
            };

            script.onreadystatechange = function () {
                var rs = this.readyState;
                if (rs === 'loaded' || rs === 'complete')
                    deferred.resolve();
            };

            script.onerror = function () {
                deferred.reject(new Error('Unable to load share api'));
            };

            var container = doc.getElementsByTagName('head')[0];
            container.appendChild(script);

            return deferred.promise;
        }

        //initFb();
        //initTwitter();
        //initLinkedIn();
        //initGoogle();
    };
}

class ShareInterviewUrlDirective {
    constructor($document, $q) {
        this.replace = true;
        this.$document = $document;
        this.$q = $q;
        this.bindToController = true;
        this.restrict = 'E';
        this.templateUrl = 'main/partials/share-url.jade';
        this.controller = 'ShareUrlController';
        this.controllerAs = 'ShareUrlCtrl';
        this._instantiateDDO();
    }

    _instantiateDDO() {
        this.transclude = true;
        this.scope = {
            shareUrl: '='
        };
        this.compile = linkingFunc(this.$document, this.$q);
    }

}
shareInterviewUrl.$inject = ['$document', '$q'];
export function shareInterviewUrl($document, $q) {
    return new ShareInterviewUrlDirective($document, $q);
}

