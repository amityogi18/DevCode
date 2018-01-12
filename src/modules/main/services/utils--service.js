let _this;

/*
@name UtilsService
@description - This service transforms the request object and gives config object for making http calls
*/
export class UtilsService {
    /** @ngInject */
    constructor($window, $storage, GrowlerService) {
        _this = this;
        _this.$window = $window;
        _this.$storage = $storage;
        _this.GrowlerService = GrowlerService;
    }

    /*
     @name transformRequestForFormEncoded
     @param {Object} obj - this is a request object for $http call.
     @description - this function returns an object after transforming.
     */
    transformRequestForFormEncoded(obj) {
        var str = [];
        for (var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
    }

    /*
     @name getCofigObj
     @description - This function returns the config object for header to be added on $http call
     */
    getCofigObj() {
        let _accessToken;
        let user = _this.$storage.getItem('user') || _this.$window.sessionStorage.user;
        if (user) {
            let _parsedContent = JSON.parse(user);
            _accessToken = _parsedContent.accessToken;
        }
        let config = {
            headers: {
                "Authorization": "Bearer " + _accessToken,
                'Accept': 'application/json',
                'Usertype': this.getUserType()
            }
        };

        return config;
    }

    postCofigObj() {
        let _accessToken;
        let user = _this.$storage.getItem('user') || _this.$window.sessionStorage.user;
        if (user) {
            let _parsedContent = JSON.parse(user);
            _accessToken = _parsedContent.accessToken;
        }
        let config = {
            headers: {
                "Authorization": "Bearer " + _accessToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Usertype': this.getUserType()
            }
        };

        return config;
    }

    putCofigObj() {
        let _accessToken;
        let user = _this.$storage.getItem('user') || _this.$window.sessionStorage.user;
        if (user) {
            let _parsedContent = JSON.parse(user);
            _accessToken = _parsedContent.accessToken;
        }
        let config = {
            headers: {
                "Authorization": "Bearer " + _accessToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Usertype': this.getUserType()
            }
        };

        return config;
    }

    deleteConfigObj() {
        let _accessToken;
        let user = _this.$storage.getItem('user') || _this.$window.sessionStorage.user;
        if (user) {
            let _parsedContent = JSON.parse(user);
            _accessToken = _parsedContent.accessToken;
        }
        let config = {
            headers: {
                "Authorization": "Bearer " + _accessToken,
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Usertype': this.getUserType()
            }
        };

        return config;
    }

    postXlsCofigObj() {
        let _accessToken;
        let user = _this.$storage.getItem('user') || _this.$window.sessionStorage.user;
        if (user) {
            let _parsedContent = JSON.parse(user);
            _accessToken = _parsedContent.accessToken;
        }
        let config = {
            headers: {
                "Authorization": "Bearer " + _accessToken,
                //'Accept' : 'application/zip',
                'Content-Type': 'application/json',
                'responseType': "arraybuffer",
                'Usertype': this.getUserType()
            }
        };

        return config;
    }
    /*
     @name getCofigObj
     @description - This function returns the config object for header to be added on $http call
     */
    getCompanyId() {
        let companyId;
        let user = _this.$storage.getItem('user') || _this.$window.sessionStorage.user;
        if (user) {
            let _parsedContent = JSON.parse(user);
            companyId = _parsedContent.companyId;
        }
        return companyId;
    }

    getUserType() {
        let userType;
        let user = _this.$storage.getItem('user') || _this.$window.sessionStorage.user;
        if (user) {
            let _parsedContent = JSON.parse(user);
            userType = _parsedContent.userType;
        }
        return userType;
    }

    getDateDiff(inputDateStr) {
        let returnValue = "";
        let localTime = moment().utc().local();
        let inputDate = moment.utc(inputDateStr, 'MM-DD-YYYY HH:mm:ss').local().add(12, 'hours');

        let duration = moment.duration(localTime.diff(inputDate));

        if (angular.isDefined(duration._data.days) && duration._data.days > 0) {
            returnValue += duration._data.days + " day(s) ";
        }

        else if (angular.isDefined(duration._data.hours) && duration._data.hours > 0) {
            returnValue += duration._data.hours + " hour(s) ";
        }

        else if (angular.isDefined(duration._data.minutes) && duration._data.minutes > 0) {
            returnValue += duration._data.minutes + " minute(s) ";
        }

        // else if (angular.isDefined(duration._data.seconds) && duration._data.seconds > 0) {
        //     returnValue += duration._data.seconds + " second(s) ";
        // }

        return returnValue;
    }

    getLocalTimeFromGMT(gmtDateTime, outputFormat, inputFormat) {
        let localTime = moment().format('YYYY-MM-DD hh:mm:ss');

        if (inputFormat === undefined && outputFormat == 24) {
            localTime = moment.utc(gmtDateTime, 'YYYY-MM-DD HH:mm:ss').local().format('MM-DD-YYYY');
            return localTime;
        }
        else if (angular.isDefined(inputFormat) && inputFormat === 'MDY' && outputFormat == 24) {
            localTime = moment.utc(gmtDateTime, 'MM-DD-YYYY HH:mm:ss').local().format('MM-DD-YYYY HH:mm');
            return localTime;
        }
        else if (angular.isDefined(inputFormat) && inputFormat === 'YMD' && outputFormat == 24) {
            localTime = moment.utc(gmtDateTime, 'YYYY-MM-DD').local().format('MM-DD-YYYY');
            return localTime;
        }
        if (outputFormat == 12) {
            localTime = moment.utc(gmtDateTime, 'YYYY-MM-DD HH:mm:ss').local().format('MM-DD-YYYY hh:mm A');
            return localTime;
        }
        else if (outputFormat == 24) {
            localTime = moment.utc(gmtDateTime, inputFormat).local().format('MM-DD-YYYY');
            return localTime;
        }
        else if (outputFormat == "MM-DD-YYY") {
            localTime = moment.utc(gmtDateTime, 'YYYY-MM-DD HH:mm:ss').local().format('MM-DD-YYYY');
            return localTime;
        }
        else if (outputFormat == '24H') {
            localTime = moment.utc(gmtDateTime, 'YYYY-MM-DD HH:mm:ss').local().format('MM-DD-YYYY HH:mm');
            return localTime;
        }
        else if (outputFormat == "H") {
            localTime = moment.utc(gmtDateTime, 'YYYY-MM-DD HH:mm:ss').local().format('HH:mm');
            return localTime;
        }
        else if (outputFormat == "h") {
            localTime = moment.utc(gmtDateTime, 'YYYY-MM-DD HH:mm:ss').local().format('hh:mm A');
            return localTime;
        }
        else if (outputFormat === undefined) {
            localTime = moment.utc(gmtDateTime, 'YYYY-MM-DD HH:mm:ss').local();
            return localTime;
        }

        return localTime;
    }

    initVideoPlayer(videoElementId, videoPath, videoType) {
                console.log("Utilss Services", videoPath);
                alert(videoPath);
        videoType = angular.isDefined(videoType) ? videoType : "video/webm"; // Other Formats : video/webm , video/ogg
        let videoElement = $('#' + videoElementId)[0];
        let videoPlayer = videojs(videoElement, { "controls": true, "preload": "auto", "playbackRates": [1, 1.5, 2, 2.5, 3, 3.5, 4], "poster": "images/video-player-background2.png" }, function () { });
       // setTimeout(function(){
            if (window.mobile){
                videoPlayer.src({"src": videoPath });
            }else{
                videoPlayer.src({ "type": videoType, "src": videoPath });
            }
                
            //videoPlayer.controlBar.progressControl.seekBar.playProgressBar.show();
            // videoPlayer.on('error', function (e) {
            //     this.player().errorDisplay.contentEl_.innerText = "Error: Unsupported video type or invalid video path.";
            // });
       // },1000)
      //  videoPlayer.src({ "type": videoType, "src": videoPath });
        //videoPlayer.controlBar.progressControl.seekBar.playProgressBar.show();
        videoPlayer.on('error', function (e) {
            this.player().errorDisplay.contentEl_.innerText = "No Recording Availible for the Meeting";
        });
    }

    stopVideoPlayer() {
        $(".video-js").each(function () {
            let player = $(this)[0];
            let videoPlayer = videojs(player, {}, function () { });
            videoPlayer.pause();
            //videoPlayer.dispose();
        });
        let videoElements = $("video");
        $(".video-js").find(videoElements).each(function () {
            this.pause();
            let player = $(this)[0];
            player.pause();
            let videoPlayer = videojs(player, {}, function () { });
            videoPlayer.pause();
            //videoPlayer.dispose();
        });
    }

    getScreenDetails() {
        let screenDetails = { deviceType: "mobile", width: _this.$window.screen.width, height: _this.$window.screen.height };
        if (screenDetails.width <= 320) {
            screenDetails.deviceType = "phone";
        } else if (screenDetails.width <= 768 && 768 >= screenDetails.width) {
            screenDetails.deviceType = "tablet";
        } else {
            screenDetails.deviceType = "desktop";
        }
        return screenDetails;
    }

    getDomainUrl() {
        var domanin = window.location.hostname;
        if (domanin == 'localhost') {
            return "http://localhost:8080/";
        } else if (domanin == 'stage.jottp.com') {
            return "https://stage.jottp.com/";
        } else {
            return "https://www.jottp.com/";
        }
    }

    clearAllIntervals() {
        var interval_id = window.setInterval("", 9999);
        for (var i = 1; i < interval_id; i++) {
            alert(i);
            window.clearInterval(i);
        }
    }

    notify(message, type, timeDelay) {
        message = message || "Success";
        type = type || "s";
        timeDelay = timeDelay || 1000;

        if (type == "s") {
            type = "success";
        } else if (type == "d") {
            type = "danger";
        } else if (type == "i") {
            type = "info";
        } else {
            type = "success";
        }

        _this.GrowlerService.growl({ type: type, message: message, delay: timeDelay });
    }

    isValidString(inputText) {
        if (angular.isDefined(inputText) && inputText != null && inputText !== "" && inputText.trim() !== "") {
            return true;
        } else {
            return false;
        }
    }

    checkFileSize(file, maxSize) {
        if (angular.isDefined(file)) {
            var totalBytes = file.size;
            var output = maxSize.match(/[a-zA-Z]+|[0-9]+/g);
            var _sizeLimit = parseInt(output[0]);
            var _type = output[1];
            if (_type == 'KB') {
                var _fileZize = Math.floor(totalBytes / 1000);
                if (_fileZize <= _sizeLimit) {
                    return true;
                } else {
                    _this.notify('File Size Should Be Less Than ' + maxSize);
                    return false;
                };
            } else {
                if (_fileZize <= _sizeLimit) {
                    return true;
                } else {
                    _this.notify('File Size Should Be Less Than ' + maxSize);
                    return false;
                };
            }
        } else {
            _this.notify('Please Upload Valid File Of Size Less Than ' + maxSize);
            return false;
        }

    }
}
