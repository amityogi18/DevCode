function linkingFunc($parse, $document, $q, $window) {
    return function link(scope, element, attrs) {
        var STRIPE_CHECKOUT_URL = 'https://js.stripe.com/v3/', key = attrs.key, stripe, card;

        function init() {
            let onSuccessMountCard = (response) => {
                mountCard();
            },
            onErrorMountCard = (error) => {
                console.log(error);
            };            
            loadLibrary($document, $q, STRIPE_CHECKOUT_URL).then(onSuccessMountCard, onErrorMountCard);
        };

        function mountCard() {

            stripe = Stripe(key);
            //stripe.setApiVersion('2017-06-05');
            var elements = stripe.elements();
            var style = {
                base: {
                    iconColor: '#666EE8',
                    color: '#31325F',
                    lineHeight: '40px',
                    fontWeight: 300,
                    fontFamily: 'Helvetica Neue',
                    fontSize: '15px',

                    '::placeholder': {
                        color: '#CFD7E0'
                    }
                },
                invalid: {
                    color: '#e5424d',
                    ':focus': {
                        color: '#303238'
                    }
                }
            };
            card = elements.create('card', {style: style});

            // Add an instance of the card Element into the `card-element` <div>
            card.mount('#card-element');

            // Handle real-time validation errors from the card Element.
            card.on('change', function (event) {
                setOutcome(event);
            });
            
            getOwnerInfo();
        };

        function createSource() {
            var form = document.querySelector('form');
            var address = {
                "line1":form.querySelector('input[name=cardholderAddress1]').value,
                "line2":form.querySelector('input[name=cardholderAddress2]').value,
                "city":form.querySelector('input[name=cardholderCity]').value,
                "state":form.querySelector('input[name=cardholderState]').value,
                "country":form.querySelector('input[name=cardholderCountry]').value,
                "postal_code":form.querySelector('input[name=cardholderZip]').value
            };  
            var metadata = {
                "name": form.querySelector('input[name=cardholderName]').value,
                "address": address,
                "email": form.querySelector('input[name=cardholderEmail]').value,
                "phone": form.querySelector('input[name=cardholderPhone]').value
            };
            
            stripe.createSource(card,{
                owner: metadata
              }).then(setOutcome);
        };

        // Common SetOutcome Function
        function setOutcome(result) {
            var displayError = $('#card-errors');
            if (result.source) {
                if (result.source.card.three_d_secure === "not_supported") {
                    stripeTokenHandler(result.source);
                } else {
                    stripe3DSecureSourceHandler(result.source);
                }
                // Use the source to create a charge or a customer
                displayError.text("");
            } else if (result.error) {
                displayError.text(result.error.message);
                displayError.fadeIn();
            } else {
                displayError.text("");
                displayError.fadeOut();
            }
        };
        function getOwnerInfo() {
            //..send to server ...
            var callback = $parse(attrs.ownerInfo);
            if (typeof callback === 'function') {
                let onSuccess = (response) => {
                    console.log(response);
                    if (response !== null && response !== 'undefined') {
                        let ownerInfo = response.data;
                        if(ownerInfo.status){
                            setFormData(ownerInfo);
                        }                        
                    }
                },
                onError = (error) => {
                    console.log(error);
                };
                scope.ownerInfo().then(onSuccess, onError);
            }
        };
        
        function setFormData(info){
            var form = document.querySelector('form');            
                form.querySelector('input[name=cardholderAddress1]').value = info.owner.address.line1;
                form.querySelector('input[name=cardholderAddress2]').value = info.owner.address.line2;
                form.querySelector('input[name=cardholderCity]').value = info.owner.address.city;
                form.querySelector('input[name=cardholderState]').value = info.owner.address.state;
                form.querySelector('input[name=cardholderCountry]').value = info.owner.address.country;
                form.querySelector('input[name=cardholderZip]').value = info.owner.address.postal_code;
                form.querySelector('input[name=cardholderName]').value = info.owner.name;                
                form.querySelector('input[name=cardholderEmail]').value = info.owner.email;
                form.querySelector('input[name=cardholderPhone]').value = info.owner.phone;
            
        };
        // Response Handler callback to handle the response from Stripe server if 3d secure is not supported
        function stripeTokenHandler(token) {
            //..send to server ...
            var callback = $parse(attrs.planCheckout);
            if (typeof callback === 'function') {
                scope.planCheckout({token: token});
            }
            console.log("inside stripeTokenHandler" + token);
        }
        // Response Handler callback to handle the response from Stripe server if 3d secure is supported
        function stripe3DSecureSourceHandler(response) {
            var callback = $parse(attrs.threeDSource);
            var type = attrs.type;
            if (typeof callback === 'function') {
                let onSuccess = (response) => {
                    console.log(response);
                    if (response !== null && response !== 'undefined') {
                        let stripe3DSecureObj = response.data;
                        stripe3DSecureResponseHandler(stripe3DSecureObj);
                    }
                },
                onError = (error) => {
                    console.log(error);
                };
                scope.threeDSource({token: response, type: type}).then(onSuccess, onError);
            }
        };

        function stripe3DSecureResponseHandler(response) {
            let windowWidth = $window.innerWidth,
                windowHeight = $window.innerHeight,
                windowStyle = 'width:'+windowWidth+'px;height:'+windowHeight+'px;overflow: hidden;border:0px;position:absolute;top:-65px;left:-133px;z-index:9999;';
            
            //window.location.replace(response.redirect.url);
            let paymentContainer = document.querySelector('#payment-form');
                paymentContainer.style.display ='none';
            
            var iframe = document.createElement("iframe");
            iframe.src = response.redirect.url;
            iframe.setAttribute('style',windowStyle);
            iframe.className = "secure-iframe";
            $("#payment-iframe").append(iframe);            
        };

        element.on('submit', function () {
            createSource();
        });

        function loadLibrary($document, $q, url) {
            var deferred = $q.defer();

            var doc = $document[0];
            var script = doc.createElement('script');
            script.src = url;

            script.onload = function () {
                deferred.resolve();
            };

            script.onreadystatechange = function () {
                var rs = this.readyState;
                if (rs === 'loaded' || rs === 'complete')
                    deferred.resolve();
            };

            script.onerror = function () {
                deferred.reject(new Error('Unable to load stripe.js'));
            };

            var container = doc.getElementsByTagName('head')[0];
            container.appendChild(script);

            return deferred.promise;
        };

        init();
    };
}


class PaymentModalDirective {
    constructor($parse, $document, $q, $window) {
        this.$parse = $parse;
        this.$document = $document;
        this.$q = $q;
        this.$window = $window;
        this._instantiateDDO();
    }

    _instantiateDDO() {
        this.restrict = 'AE';
        this.templateUrl = 'settings/partials/admin-payment-elements.jade';
        this.scope = {
            threeDSource: '&',
            planCheckout: '&',
            ownerInfo:'&'
        };
        this.link = linkingFunc(this.$parse, this.$document, this.$q, this.$window);
    }
}

paymentModal.$inject = ['$parse', '$document', '$q', '$window'];

export function paymentModal($parse, $document, $q, $window) {
    return new PaymentModalDirective($parse, $document, $q, $window);
}