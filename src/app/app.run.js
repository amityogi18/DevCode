export default ['$rootScope', '$translate','$storage','$templateCache', ($rootScope, $translate, $storage, $templateCache) => {

$rootScope.changeLanguage = function (langKey) {
    $translate.use(langKey);
};

$templateCache.put('calendar_view.html', "<div class=\"custom-event-list\" ng-show=\"day.events.length > 0 && !$root.mobile\">\n  <span\n    ng-repeat=\"event in day.events |limitTo:2 | orderBy:'startsAt' track by event.calendarEventId \"\n      class=\"pull-left custom-event\"\n    ng-class=\"event.cssClass\"\n    ng-style=\"\"\n    ng-mousedown=\"$event.stopPropagation()\"\n    ng-mouseenter=\"vm.highlightEvent(event, true)\"\n    ng-mouseleave=\"vm.highlightEvent(event, false)\"\n    tooltip-append-to-body=\"true\"\n    uib-tooltip-html=\"vm.calendarEventTitle.monthViewTooltip(event) | calendarTrustAsHtml\"\n    mwl-draggable=\"event.draggable === true\"\n    drop-data=\"{event: event, draggedFromDate: day.date.toDate()}\"\n    auto-scroll=\"vm.draggableAutoScroll\">\n{{event.summary}}  </span>\n<div ng-show=\"day.events.length > 2\">\n<span>{{day.events.length-2}} more</span></div></div>\n");
/*
console.log("App run calling...")

$rootScope.$on('$translateLoadingSuccess', function () {
    console.log("Data loaded::", arguments);
    $translate.refresh();
  });
*/
//$translate.use('en');
    if (typeof(Storage) !== "undefined") {
        if($storage.getItem('theme')){
            $rootScope.themeClass =   $storage.getItem('theme');
        }
        else {
            $rootScope.themeClass = "application.theme1";
           // console.log('Local Storage not supported')
        }
    }
    else {
        $rootScope.themeClass = "application.theme1";
        console.log('Local Storage not supported')
    }
    if (typeof(Storage) !== "undefined") {
        if($storage.getItem('user')){
            $rootScope.isLoggedIn = true;
        }
        else{
            $rootScope.isLoggedIn = false;
        }
    }else{
        $rootScope.isLoggedIn = false;
    }

}];