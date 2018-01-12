let service;

let setupTimeout = (growl, timeout, defaultDelay) => {
    let $timeout = timeout;
    if (growl.timeout) {
        $timeout.cancel(growl.timeout);
        delete growl.timeout;
    }

    if (growl.delay !== -1) {
        growl.timeout = $timeout(
            function () {
                service.growls.splice(service.growls.indexOf(growl), 1);
            }, defaultDelay);
    }
};

export class GrowlerService {
    /** @ngInject */
    constructor($timeout) {
        //this.$injector = $injector;
        service = this;
        this.$timeout = $timeout;
        this.growls = [];
        this.defaultDelay = 6000;
    }

    growl(growl) {
        setupTimeout(growl, this.$timeout, this.defaultDelay);
        if (angular.isDefined(service.growls) && service.growls.length > 0) {
            service.growls.pop();
        }
        service.growls.push(growl);
    }

    update(growl) {
        setupTimeout(growl, this.$timeout);
    }

    remove(growl) {
        service.growls.splice(service.growls.indexOf(growl), 1);
    }

}