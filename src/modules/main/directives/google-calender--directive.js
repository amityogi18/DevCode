function linkingFunc($document) {
    return function (scope, elem, attrs) {
        var CLIENT_ID = '220490732233-s2u9a8i35fkg8nn9o1hb9a5dac0av015.apps.googleusercontent.com';
        
        // Array of API discovery doc URLs for APIs used by the quickstart
        var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
        
        // Authorization scopes required by the API; multiple scopes can be
        // included, separated by spaces.
        var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

        var authorizeButton = document.getElementById('authorize-button');
        var signoutButton = document.getElementById('signout-button');
        handleClientLoad();
        /**
         *  On load, called to load the auth2 library and API client library.
         */
        function handleClientLoad() {
            gapi.load('client:auth2', initClient);
          }
    
        /**
         *  Initializes the API client library and sets up sign-in state
         *  listeners.
         */

        function initClient() {
            gapi.client.init({
              discoveryDocs: DISCOVERY_DOCS,
              clientId: CLIENT_ID,
              scope: SCOPES
            }).then(function () {
              // Listen for sign-in state changes.
              gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
                
              // Handle the initial sign-in state.
              updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
              authorizeButton.onclick = handleAuthClick;
              signoutButton.onclick = handleSignoutClick;
            });
        }
        
        /**
         *  Called when the signed in status changes, to update the UI
         *  appropriately. After a sign-in, the API is called.
         */
        function updateSigninStatus(isSignedIn) {
            if (isSignedIn && authorizeButton && signoutButton) {
              authorizeButton.style.display = 'none';
              signoutButton.style.display = 'block';
              listUpcomingEvents();
            } else if(authorizeButton && signoutButton) {
              authorizeButton.style.display = 'block';
              signoutButton.style.display = 'none';
            }
        }

        /**
         *  Sign in the user upon button click.
         */
        function handleAuthClick(event) {
            gapi.auth2.getAuthInstance().signIn();
          }
    
          /**
           *  Sign out the user upon button click.
           */
          function handleSignoutClick(event) {
            gapi.auth2.getAuthInstance().signOut();
        }

        /**
         * Append a pre element to the body containing the given message
         * as its text node. Used to display the results of the API call.
         *
         * @param {string} message Text to be placed in pre element.
         */
        function appendPre(message) {
            var pre = document.getElementById('content');
            var textContent = document.createTextNode(message + '\n');
            pre.appendChild(textContent);
          }
    
          /**
           * Print the summary and start datetime/date of the next ten events in
           * the authorized user's calendar. If no events are found an
           * appropriate message is printed.
           */
          function listUpcomingEvents() {
            gapi.client.calendar.events.list({
              'calendarId': 'primary',
              'timeMin': (new Date()).toISOString(),
              'showDeleted': false,
              'singleEvents': true,
              'maxResults': 10,
              'orderBy': 'startTime'
            }).then(function(response) {
              var events = response.result.items;
              appendPre('Upcoming events:');
    
              if (events.length > 0) {
                for (var i = 0; i < events.length; i++) {
                  var event = events[i];
                  var when = event.start.dateTime;
                  if (!when) {
                    when = event.start.date;
                  }
                  appendPre(event.summary + ' (' + when + ')')
                }
              } else {
                appendPre('No upcoming events found.');
              }
            });
            gapi.client.calendar.calendarList.list().then(function(response){
                var calId = response.result.items[0].id;
                var maxDate = new Date();
                var advanceDays = 30;
                maxDate.setDate(maxDate.getDate() + advanceDays);
                //var calId = gapi.auth2.getAuthInstance().currentUser.Ab.w3.U3;
                gapi.client.calendar.freebusy.query({
                    'timeMin': (new Date()).toISOString(),
                    'timeMax': maxDate.toISOString(),
                    "items": [
                        {
                          "id": calId
                        }
                      ]
                }).then(function(response){
                    appendPre('Available :');
                    var clientCalendars = response.result.calendars;
                    var busySlots = clientCalendars[Object.keys(clientCalendars)[0]].busy;
                    var startDateFormt, endDateFormt;
                    angular.forEach(busySlots, function(value,key){
                        startDateFormt = moment(value.start).format('MM-DD-YYYY HH:mm');
                        endDateFormt = moment(value.end).format('MM-DD-YYYY HH:mm');
                        appendPre('meeting ' + (key+1) + ' : ' + startDateFormt + '  to  ' + endDateFormt);
                    });
                });
            });

            
          }
    };
}

class GoogleCalenderDirective {
    constructor($document) {
        this.replace = true;
        this.$document = $document;
        this.bindToController = true;
        this.restrict = 'E';
        this.templateUrl = 'main/partials/google-calender.jade';
        this._instantiateDDO();
    }

    _instantiateDDO() {
        this.transclude = true;
        this.compile = linkingFunc(this.$document, this.$q);
    }

}
googleCalender.$inject = ['$document'];
export function googleCalender($document) {
    return new GoogleCalenderDirective($document);
}

