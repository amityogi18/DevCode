function controllerFunc($interval) {
    return function (scope, element) {
        var future;
            future = new Date(scope.date);
            console.log(future);
            $interval(function () {
                var diff;
                diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
                if(diff < 0){
                    return element.text("Interview already started");
                }
                return element.text("Your interview starts in...  "+getTime(diff));
            }, 1000);

        var getTime = function (t) {
            var days, hours, minutes, seconds;
            days = Math.floor(t / 86400);
            t -= days * 86400;
            hours = Math.floor(t / 3600) % 24;
            t -= hours * 3600;
            minutes = Math.floor(t / 60) % 60;
            t -= minutes * 60;
            seconds = t % 60;
            return [
                days + 'd',
                hours + 'h',
                minutes + 'm',
                seconds + 's'
            ].join(' ');
        };
    };
};

class CountdownTimer {
    constructor($interval) {
        this.$interval = $interval;
        this._instantiateDDO();
    }

    _instantiateDDO() {
        this.restrict = 'A';
        //this.templateUrl = 'main/partials/countdown-timer.jade';
        this.scope = {
            date: '='
        };
        this.link = controllerFunc(this.$interval);
    }
}
countdownTimer.$inject = ['$interval'];
export function countdownTimer($interval) {
    return new CountdownTimer($interval);
}
