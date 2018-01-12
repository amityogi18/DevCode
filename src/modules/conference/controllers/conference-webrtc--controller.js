import { WebRTC } from '../../../libs/webrtc.js';
import { Conference } from '../../../libs/conference';
import { CallRecorder } from '../../../libs/recording';
import { attachMediaStream } from '../../../libs/adapter';
import hark from '../../../libs/hark';

const myhttps = 'media.jottp.com';


let _this, obj, bgimg, confid, session, meetingStatusBtn, candId, name, type, role, text, recorder, recording_name,
    isScrnSharing = false,
    isAudioMuted = false,
    isVideoMuted = false,
    isPAudioMuted = false,
    isPVideoMuted = false,
    isIntialFeed = true,
    isFreeConferene = false,
    localStream = "",
    candStream = "",
    nodeurl = 'wss://' + myhttps + '/ws',	// Node Server URL
    lastSess = null,
    recSess = null,
    counter = 1,
    isarrowon = false,
    widthcounter = 0,
    isRemoteFeedOn = false,
    isCoAdmin = false,
    isParticipantJoined = false,
    ParticipantsCount = 1,
    isClicked = false,
    isHarkStarted = false,
    tagIdArray = [],
    remoteCon = "",
    remoteSelfVideo1 = "",
    speechEvents = null,
    isrejoin = false,
    isRecordingFeed = false,
    texteditorData = "",
    recordedVideopath = "",
    config = {},
    env = "",
    interviewType = 0,
    interviewId = "",
    changeDeviceCounter = 0,
    remoteParticipants = {},
    startScriptTag = "<script src='";
let endScriptTag = "'></";
endScriptTag += "script>";
let linkStartTag = "<link rel='stylesheet' href='",
    linkEndTag = "'/>",
    languageReference = [
        {
            value: 1,
            name: 'Angular JS',
            cdnLink: startScriptTag + "https://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular.min.js" + endScriptTag
        },
        {
            value: 2,
            name: 'Jquery',
            cdnLink: startScriptTag + "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js" + endScriptTag
        },
        {
            value: 3,
            name: 'Bootstrap Stylesheet',
            cdnLink: linkStartTag + "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" + linkEndTag
        },
        {
            value: 4,
            name: 'Bootstrap Script',
            cdnLink: startScriptTag + "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" + endScriptTag
        }
    ];


export class ConferenceWebrtcController {
    /** @ngInject  */
    constructor($state, $scope, UtilsService, $window, $rootScope, $sce, $uibModal, $log, $stateParams, ConferenceWebrtcService, AuthService, ConferenceService, DemoService, GrowlerService, $compile) {
        _this = this;
        _this.$scope = $scope;
        _this.$rootScope = $rootScope;
        _this.UtilsService = UtilsService;
        _this.$sce = $sce;
        _this.$uibModal = $uibModal;
        _this.$log = $log;
        _this.$state = $state;
        _this.$window = $window;
        _this.AuthService = AuthService;
        _this.ConferenceWebrtcService = ConferenceWebrtcService;
        _this.ConferenceService = ConferenceService;
        _this.DemoService = DemoService;
        _this.GrowlerService = GrowlerService;
        _this.$stateParams = $stateParams;
        _this.$compile = $compile;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        _this.meetingTypeM = _this.$stateParams.meetingTypeM;
        _this.meetingRole = _this.$stateParams.meetingRole;
        _this.participantName = _this.$stateParams.participantName;
        session = _this.$stateParams.confId;
        _this.interviewDetails = {};
        if (angular.isDefined(_this.$window.localStorage.interviewDetails)) {
            _this.interviewDetails = JSON.parse(_this.$window.localStorage.interviewDetails);
        }
        _this.userRoles = 4;
        _this.meetinglink = '';
        _this.isShowParticipants = false;
        _this.isSendMailShow = false;
        _this.isShowChat = false;
        _this.isTextEditor = false;
        _this.isCodeEditor = false;
        _this.isAddParticipant = false;
        _this.meetingId = "";
        _this.chatcounter = 0;
        _this.isVideoFeed = false;
        _this.isRejoining = false;
        _this.recordingStarts = false;
        _this.haveScreenStream = false;
        _this.deviceListVideo = [];
        _this.deviceListAudio = [];
        _this.videosourceselect = {};
        _this.audiosourceselect = {};
        _this.audiofound = false;
        _this.videofound = false;
        _this.displayName = _this.$window.localStorage.quickMeetName || 'User';
        _this.whoIsSharing = "";
        _this.subjects = ['Java', 'Dotnet', 'Javascript', 'C#'];
        _this.selectedItem = _this.subjects[0];
        _this.placement = {
            options: [
                'top',
                'top-left',
                'top-right',
                'bottom',
                'bottom-left',
                'bottom-right',
                'left',
                'left-top',
                'left-bottom',
                'right',
                'right-top',
                'right-bottom'
            ],
            selected: 'bottom-left'
        };
        _this.classes = [{}];
        _this.animationsEnabled = true;
        _this.modalInstance = "";
        _this.e = { keyCode: 13 };
        _this.isFullScreen = false;
        _this.recommendedQuestion = [];

        _this.callViaInternetPopup = {
            content: '',
            selected: 'bottom-left',
            templateUrl: 'conference/partials/model/call-via-internet.jade',
            title: 'How will you call in?'
        };
        _this.addDisplayNamePopup = {
            content: '',
            selected: 'bottom-left',
            templateUrl: 'conference/partials/model/add-display-name.jade',
            title: 'Display Name',
            popoverIsOpen: false
        };
        _this.recordingHelp = {
            content: '',
            selected: 'bottom-right',
            templateUrl: 'conference/partials/model/recording-help.jade',
            title: 'Recording'
        };
        _this.controlPopup = {
            content: '',
            selected: 'bottom-left',
            templateUrl: 'conference/partials/model/control.jade',
            title: 'Control Panel'
        };
        _this.shareLinkPopup = {
            content: '',
            selected: 'bottom-right',
            templateUrl: 'conference/partials/model/share-link.jade',
            title: 'Share Link'
        };
        _this.screenSharePopup = {
            content: '',
            selected: 'bottom-left',
            templateUrl: 'conference/partials/model/screen-share.jade',
            title: 'Screen Share',
            isScreenShareOpen: 'false'
        };
        _this.connectToVideo = {
            content: '',
            selected: 'bottom-right',
            templateUrl: 'conference/partials/model/connect-to-video.jade',
            title: 'Audio Video Settings'
        };

        _this.meetingLink = {
            content: '',
            selected: 'bottom-left',
            templateUrl: 'conference/partials/model/meeting-link.jade',
            title: 'Invite others'
        };

        _this.controlPopup = {
            content: '',
            selected: 'bottom-left',
            templateUrl: 'conference/partials/model/control.jade',
            title: ''
        };

        _this.recommendedQuestions = {
            content: '',
            selected: 'bottom-left',
            templateUrl: 'conference/partials/model/recommended-questions.jade',
            title: 'Questions'
        };
        var scrollparent = document.querySelector('.full-height');
        scrollparent.style = "overflow:hidden;";
        _this.selfVideo = document.getElementById('selfvideo');
        _this.num = (Math.floor(Math.random() * 5));
        _this.Imgarray = ['one', 'two', 'three', 'four', 'five'];
        _this.bgclass = _this.Imgarray[_this.num];
        console.log('meeting type is:', _this.meetingTypeM);
        console.log('participant role is:', _this.meetingRole);
        console.log('participant name is:', _this.participantName);
        role = _this.$stateParams.meetingRole;
        confid = session;
        type = _this.meetingTypeM;
        if (_this.$window.location.hostname === 'localhost' || _this.$window.location.hostname === '127.0.0.1' || _this.$window.location.hostname === 'dev.jottp.com' || _this.$window.location.hostname === 'stage.jottp.com') {
            env = 'dev';
        } else {
            env = 'prod';
        }
        if (_this.meetingTypeM === 'unlisted') {
            isFreeConferene = true;
        }

        if (_this.meetingTypeM == 'conference') {
            _this.$window.localStorage.removeItem('interviewCandidateId');
            _this.$window.localStorage.removeItem('interviewId');
            _this.$window.localStorage.removeItem('interviewType');
            _this.$window.localStorage.removeItem('interviewCode');
            _this.$window.localStorage.removeItem('interviewDetails');
        }
        interviewType = _this.interviewDetails.interviewTypeId;
        interviewId = _this.interviewDetails.interviewCode;
        _this.getMeetingLink(_this.meetingTypeM);
        if (_this.$rootScope.isLoggedIn || _this.meetingTypeM == 'conference' || _this.meetingTypeM == 'interview' || _this.meetingTypeM == 'unlisted') {
            _this.onLoading();
            if (angular.isDefined(_this.interviewDetails.interviewTypeId) && _this.interviewDetails.interviewTypeId === 1) {
                _this.getRecommendedQuestions();
            }
        }

        _this.$window.onhashchange = function (e) {
            console.log('back button click');
            window.stream.getVideoTracks()[0].stop();
            window.stream.getAudioTracks()[0].stop();
        }
        _this.getDeviceList();
        _this.$rootScope.$on("sourceChange", function () {
            obj.getStream(_this.$window.localStorage.audio, _this.$window.localStorage.video);
        });
        
        // handling mobile app flag
        if(typeof PLATFORM!="undefined" && PLATFORM=="cordova_app"){
            _this.isMobileApp = true;
        }else{
            _this.isMobileApp = false;
        }
    }

    getMeetingLink(meettype) {
        let linkUrl = "https://stage.jottp.com";
        if (meettype === 'unlisted') {
            _this.participantMeetingLink = linkUrl + "/meet/" + session;
        }
        else {
            _this.participantMeetingLink = linkUrl + "/cn/" + session;
        }

        _this.meetingCode = session;
    }

    inviteparticipants() {
        _this.invalidEmail = false;
        let emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
        angular.forEach(_this.inviteParticipant, function (value, key) {
            if (!emailRegex.test(value)) {
                _this.invalidEmail = true;
            }
        });
        if (!_this.invalidEmail) {
            _this.isSendMailShow = true;
            if (_this.meetingTypeM == 'conference') {
                var inviteParticipantData = {};
                inviteParticipantData.meetingJoiningId = confid;
                inviteParticipantData.userId = _this.AuthService.user.userId;
                inviteParticipantData.participants = _this.inviteParticipant;
                inviteParticipantData.link = _this.participantMeetingLink;

                let onSuccess = (response) => {
                    console.log(response);
                    _this.isSendMailShow = false;
                    _this.inviteParticipant = [];
                    _this.GrowlerService.growl({
                        type: 'success',
                        message: 'invite sent to participant(s)',
                        delay: 100
                    });
                },
                    onError = (response) => {
                        console.log(response);
                        _this.isSendMailShow = false;
                        _this.inviteParticipant = [];
                        _this.GrowlerService.growl({
                            type: 'danger',
                            message: response.data.errorCode,
                            delay: 100
                        });

                    };
                _this.ConferenceWebrtcService.sendMailToParticipant(inviteParticipantData);
                _this.ConferenceWebrtcService.activePromise.then(onSuccess, onError);
            }
            else if (_this.meetingTypeM == 'interview') {
                var inviteParticipantDataI = {};
                inviteParticipantDataI.emailIds = _this.inviteParticipant;
                inviteParticipantDataI.interviewCode = _this.interviewDetails.interviewCode;

                let onSuccess = (response) => {
                    console.log('invite sent');
                    _this.isSendMailShow = false;
                    _this.inviteParticipant = [];
                    _this.GrowlerService.growl({
                        type: 'success',
                        message: 'invite sent to participant(s)',
                        delay: 100
                    });
                },
                    onError = (error) => {
                        console.log(error);
                        _this.isSendMailShow = false;
                        _this.inviteParticipant = [];
                    };
                _this.ConferenceWebrtcService.sendMailToParticipantI(inviteParticipantDataI);
                _this.ConferenceWebrtcService.activePromise.then(onSuccess, onError);
            }
            else if (_this.meetingTypeM === 'unlisted') {
                var inviteParticipantData = {};
                inviteParticipantData.meetingId = confid;
                inviteParticipantData.participants = _this.inviteParticipant;
                inviteParticipantData.meetingUrl = _this.participantMeetingLink;

                let onSuccess = (response) => {
                    console.log('invite sent');
                    _this.isSendMailShow = false;
                    _this.inviteParticipant = [];
                    _this.GrowlerService.growl({
                        type: 'success',
                        message: 'invite sent to participant(s)',
                        delay: 100
                    });
                },
                    onError = (error) => {
                        console.log(error);
                        _this.isSendMailShow = false;
                        _this.inviteParticipant = [];
                    };
                _this.DemoService.invitetoConference(inviteParticipantData);
                _this.DemoService.activePromise.then(onSuccess, onError);
            }
        }
        else {
            _this.GrowlerService.growl({
                type: 'danger',
                message: 'Please enter valid email.',
                delay: 100
            });
        }


    }

    clickToOpen(index) {
        _this.selectedClass = _this.classes[index];
        ngDialog.open({ template: '../../uib/template/model/Participants.jade' });
    };

    openClosePopUp(type, ngChatWindow) {
        if (type === 'P') {
            _this.isShowParticipants = !_this.isShowParticipants;
        } else if (type === 'C') {
            if (angular.isDefined(ngChatWindow)) {
                $('#' + ngChatWindow).hide();
            } else {
                _this.isShowChat = !_this.isShowChat;
            }
            _this.chatcounter = 0;
        } else if (type === 'E') {
            _this.isTextEditor = !_this.isTextEditor;
            _this.getTextEditorWorking();
        }
        else if (type === 'A') {
            _this.isAddParticipant = !_this.isAddParticipant;
        }
        else if (type === 'CE') {
            _this.isCodeEditor = !_this.isCodeEditor;
        }

        if (angular.isDefined(ngChatWindow)) {
            let idArray = ngChatWindow.split('_');
            if (angular.isDefined(idArray) && idArray.length > 1) {
                _this.clearChatCount('chatCount_' + idArray[1]);
            }
        }
    };

    toggleAnimation() {
        _this.animationsEnabled = !_this.animationsEnabled;
    };

    dropboxItemSelected1(item) {
        _this.selectedItem = item;
    }

    copyfun() {
        var meetinglinkvalue = document.createElement("textarea");
        meetinglinkvalue.style.position = 'fixed';
        meetinglinkvalue.style.top = 0;
        meetinglinkvalue.style.left = 0;
        meetinglinkvalue.style.width = '2em';
        meetinglinkvalue.style.height = '2em';
        meetinglinkvalue.style.padding = 0;
        meetinglinkvalue.style.border = 'none';
        meetinglinkvalue.style.outline = 'none';
        meetinglinkvalue.style.boxShadow = 'none';
        meetinglinkvalue.style.background = 'transparent';
        meetinglinkvalue.value = _this.participantMeetingLink;
        document.body.appendChild(meetinglinkvalue);
        meetinglinkvalue.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
            _this.GrowlerService.growl({
                type: 'success',
                message: 'Meeting invite link copied',
                delay: 100
            });
        } catch (err) {
            console.log('Oops, unable to copy');
        }

        document.body.removeChild(meetinglinkvalue);
    }

    copyfun2() {
        console.log('copy link func');
        if (document.selection) {
            document.selection.empty();
        }
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        var myelement = document.getElementById('CopyMeetingLink'),
            range = document.createRange();
        range.selectNode(myelement);
        console.dir(range);
        window.getSelection().addRange(range);
        try {
            document.execCommand('copy');
        } catch (e) { };
    }

    startSpeechRecognation() {
        if (isHarkStarted == false) {
            remoteSelfVideo1 = document.querySelector('.myfeedremote');
            isHarkStarted = true;
            if (Object.keys(remoteParticipants).length > 1) {
                var options = {};
                speechEvents = hark(localStream, options);
                speechEvents.on('speaking', function () {
                    obj.speaking(true);
                    remoteSelfVideo1.style = "border: 2px solid green;";
                });
                speechEvents.on('stopped_speaking', function () {
                    remoteSelfVideo1.style = "border: 2px #ccc solid;";
                    obj.speaking(false);
                });
            }

        }
    }

    alignVideoDivs() {
        var count = Object.keys(remoteParticipants).length;
        var selfVideo = document.querySelector('.selfvideo');
        var remoteSelfVideo = document.querySelector('.myfeedremote');
        if (count == 0) {
            var selfVideo = document.querySelector('.selfvideo');
            attachMediaStream(selfVideo, localStream);
            var remoteSelfVideoz = document.querySelector('.myfeedremote');
            remoteSelfVideoz.style = "display:none;";
            return;
        } else {
            var remoteSelfVideo = document.querySelector('.myfeedremote');
            attachMediaStream(remoteSelfVideo, localStream);
            remoteSelfVideo.style = "display:inline-block;";
        }

        for (var id in remoteParticipants) {
            var p = remoteParticipants[id];
            if (p) {
                if ((count == 1)) {
                    remoteCon = document.getElementById(p.stream.tagId + 'div');
                    remoteCon.style = "display:none;";
                    attachMediaStream(selfVideo, p.stream);

                } else {
                    remoteCon.style = "display:inline-block;";
                    var remoteVid = document.getElementById(p.stream.tagId);
                    attachMediaStream(remoteVid, p.stream);
                }
            }
        }
    }

    onLoading() {
        console.log('in loading method');
        if (_this.meetingTypeM == 'conference' || _this.meetingTypeM == 'interview' || _this.meetingTypeM == 'unlisted') {
            if (_this.$rootScope.isLoggedIn) {
                name = _this.AuthService.user.fullName;
                config = _this.UtilsService.getCofigObj();
            }
            else if (_this.participantName) {
                name = _this.participantName;
            }
            else {
                name = _this.displayName;
            }
        }
        else {
            name = 'User';
        }

        console.log('node url is:' + nodeurl);

        obj = new Conference({ 'url': nodeurl, 'role': role, 'name': name, 'type': type, 'interviewTypeId': interviewType, 'interviewId': interviewId, 'env': env });
        window._object = obj;
        recorder = new CallRecorder(obj.uploader);
        obj.on('connected', function (data) {
            isScrnSharing = false;
            obj.stopScrnShare();
            if (role == "host") {
                console.log('in start conf');
                _this.startConf(config);
            } else {
                _this.joinConf(config);
            }
        });

        obj.on('confstarted', function (data) {
            for (var delmem in remoteParticipants) {
                delete remoteParticipants[delmem];
            }
            _this.haveScreenStream = false;
            confid = session = data.confid;
            if (isFreeConferene) {
                document.querySelector('.stopmeeting').textContent = 'Leave Meeting';
            }
            else {
                document.querySelector('.stopmeeting').textContent = 'Stop Meeting';
            }

            console.log('conference started ' + confid);
            ParticipantsCount = 1;

        });
        obj.on('updateDetails', function (data) {
            var participant = remoteParticipants[data.wsId];
            var usert = document.getElementById(data.wsId);
            var span = usert.getElementsByTagName('span');
            span[2].innerHTML = data.name;
            console.log(data);
            var overlayNameDiv = document.getElementById(participant.stream.tagId + 'div');
            var overlayName = overlayNameDiv.getElementsByTagName('div');
            overlayName[0].innerHTML = data.name;

            console.log('participant name updated ' + participant.name + ' to ' + data.name);
        });
        obj.on('speaking', function (data) {
            var selfVideo = document.querySelector('.selfvideo');
            var speaking = data.speaking;
            var participantSpeak = remoteParticipants[data.wsId];
            participantSpeak.speaking = speaking;
            if (speaking) {
                var rvideo = document.getElementById(participantSpeak.stream.tagId);
                rvideo.style = "border: 2px solid green;";
                if (_this.haveScreenStream == false)
                    attachMediaStream(selfVideo, participantSpeak.stream);
            } else {
                var rvideom = document.getElementById(participantSpeak.stream.tagId);
                rvideom.style = "border: 2px #ccc solid;";
            }


        });

        obj.on('stream', function (stream) {
            if (isHarkStarted) {
                _this.stoppeechRecognation();
                localStream = window.stream;
                _this.startSpeechRecognation();
            }
            localStream = window.stream;

            if (Object.keys(remoteParticipants).length === 0) {
                console.log('local stream9 is: ' + localStream);
                console.log('Participants count is: ' + ParticipantsCount);
                var selfVideo = document.querySelector('.selfvideo');
                var remoteselfVideo = document.querySelector('.myfeedremote');
                remoteselfVideo.style = "display:none;";
                attachMediaStream(selfVideo, stream);
            } else {
                _this.alignVideoDivs();
            }
        });


        obj.on('remStream', function (sess, stream) {
            var isScreen = sess.wsId.indexOf('_screen') > 0;
            stream.isScreen = isScreen;
            if (isScreen) {
                _this.haveScreenStream = true;
                _this.whoIsSharing = sess.name;
                var selfVideo = document.querySelector('.selfvideo');
                attachMediaStream(selfVideo, stream);
                return;
            }

            var participantR = { 'name': sess.name, 'wsId': sess.wsId, 'stream': stream, 'isScreen': isScreen, 'speaking': false, 'role': sess.role, 'tagId': sess.tagId };
            remoteParticipants[sess.wsId] = participantR;
            var count = Object.keys(remoteParticipants).length;
            if (count > 1) {
                _this.startSpeechRecognation();
            }


            var stopmeetingbtn = document.querySelector('.stopmeeting');
            var parent = document.getElementById('remotefeeds');
            stream.tagId = sess.wsId + '_' + counter++;
            lastSess = sess;
            var remotecontainer = document.createElement('div');
            remotecontainer.setAttribute('id', stream.tagId + 'div');
            remotecontainer.setAttribute('class', 'scrollV');
            parent.appendChild(remotecontainer);
            var remoteVideo = document.createElement('video');
            remoteVideo.setAttribute('id', stream.tagId);
            remoteVideo.setAttribute('width', '100%');
            remoteVideo.style = "border: 2px #ccc solid;";
            remoteVideo.autoplay = true;
            remotecontainer.appendChild(remoteVideo);
            stopmeetingbtn.style = "visibility : visible";


            if (sess.stream) {
                console.log('screen stream ', sess.stream2);
                sess.stream2 = stream;
                remoteVideo.controls = true;
                var parent = document.getElementById('videoSection');
                parent.appendChild(remoteVideo);
                var span = document.createElement("span");
                var parent = document.getElementById("chatid");
                parent.appendChild(span);
                parent.scrollTop = parent.scrollHeight;
                span.outerHTML = "</br><span style='float:left'><i>" + sess.name + " Sharing screen </i></span>";
            } else {
                var overdiv = document.createElement('div');
                sess.stream = stream;
                overdiv.className = 'overlay';
                overdiv.innerHTML = sess.name;
                overdiv.style.top = remoteVideo.offsetTop + remoteVideo.clientHeight - 20;
                overdiv.style.left = remoteVideo.offsetLeft + remoteVideo.clientWidth / 2;
                console.dir(remoteVideo);
                console.dir(overdiv);
                remotecontainer.appendChild(overdiv);
            }
            _this.alignVideoDivs();
            _this.isRejoining = false;
            _this.$scope.$apply();
            console.log('attaching remote stream : ' + sess.name + ' == ' + sess.wsId, stream);

        });

        obj.on('scrnStream', function (stream, err) {
            if (err) {
                alert(err);
            } else {
                isScrnSharing = true;
                _this.haveScreenStream = true;
                _this.whoIsSharing = name;
                if (role == 'host') {
                    var selfVideo = document.querySelector('.selfvideo');
                    attachMediaStream(selfVideo, stream);
                }

                //_this.stoppeechRecognation();
                console.log('sharing screenRP');
            }
        });

        obj.on('stopScrn', function (stream) {
            isScrnSharing = false;
            _this.haveScreenStream = false;
            var countr = Object.keys(remoteParticipants).length;
            if (countr === 0) {
                console.log('partcount', countr);
                var centerfeed = document.querySelector('.selfvideo');
                attachMediaStream(centerfeed, window.stream);
            } else {
                var centerfeed = document.querySelector('.selfvideo');
                var remoteParticipant = remoteParticipants[Object.keys(remoteParticipants)[0]];
                console.log('partcount1', remoteParticipant);
                attachMediaStream(centerfeed, remoteParticipant.stream);
            }

            _this.startSpeechRecognation();

        });

        obj.on('remScrnStream', function (sess, stream) {

        });

        function removeTag(stream) {
            console.log('remove tag ', stream);
            if (stream && stream.tagId) {
                var tag = stream.tagId;
                //TODO stop active recording
                var rVideo = document.getElementById(tag);
                console.log('Removing video tag ', rVideo);
                if (rVideo) {
                    rVideo.parentNode.removeChild(rVideo);
                }
                var rdiv = document.getElementById(tag + 'div');
                if (rdiv) rdiv.parentNode.removeChild(rdiv);
                stream.tagId = null;

                if (stream.isScreen) {
                    _this.haveScreenStream = false;
                    var countr = Object.keys(remoteParticipants).length;
                    if (countr === 0) {
                        var centerfeed = document.querySelector('.selfvideo');
                        attachMediaStream(centerfeed, window.stream);
                    } else {
                        var centerfeed = document.querySelector('.selfvideo');
                        var remoteParticipant = remoteParticipants[Object.keys(remoteParticipants)[0]];
                        attachMediaStream(centerfeed, remoteParticipant.stream);
                    }
                }
            }
        }

        obj.on('removeStream', function (sess, stream) {
            console.log('remove stream ', stream);
            var isScreen = sess.wsId.indexOf('_screen') > 0;

            if (isScreen) {
                _this.haveScreenStream = false;

                var countr = Object.keys(remoteParticipants).length;
                if (countr === 1) {
                    var centerfeed = document.querySelector('.selfvideo');
                    var remoteParticipant = remoteParticipants[Object.keys(remoteParticipants)[0]];
                    attachMediaStream(centerfeed, remoteParticipant.stream);
                }
                if (countr === 0) {
                    var centerfeed = document.querySelector('.selfvideo');
                    attachMediaStream(centerfeed, window.stream);
                }
                if (countr > 1) {
                    obj.speaking(true);
                }
                return;
            }
            if (stream) {
                removeTag(stream);
            } else {
                removeTag(sess.stream);
                removeTag(sess.stream2);
            };
        });

        obj.on('pjoined', function (sess) {
            if (sess.wsId.search('_screen') == -1) {
                var span = document.createElement("span");
                var parent = document.getElementById("chatid");
                parent.appendChild(span);
                parent.scrollTop = parent.scrollHeight;
                span.outerHTML = "</br><div class='part-joined'><i>" + sess.name + " Joined</i> </div>";
                ParticipantsCount = ParticipantsCount + 1;

                if (ParticipantsCount > 6) {
                    isarrowon = true;
                    document.querySelector('.arrowdivleft').style = "visibility : visible";
                    document.querySelector('.arrowdivright').style = "visibility : visible";
                };

                _this.sess = sess;

                let userIcon = document.createElement("i");
                userIcon.setAttribute("class", "fa fa-user");
                var userName = document.createElement("span");
                userName.style = "margin-left:5px";
                userName.textContent = sess.name;
                var listItem = document.createElement("li");

                angular.element(userName).on("click", function () {
                    var videofeed = document.getElementById(sess.stream.tagId);
                    videofeed.style = "transform: scale(1.1); box-shadow: 4px 4px 4px #888888";
                    userIcon.style = "color:orange!important;";

                    setTimeout(function () {
                        videofeed.style = "transform: scale(1); box-shadow: none";
                        userIcon.style = "color:black!important;"
                    }, 2000);
                });

                listItem.style = "padding:5px 0px 5px 10px";

                listItem.setAttribute("id", sess.wsId);
                listItem.setAttribute("ng-chat", JSON.stringify(sess));
                listItem.setAttribute("ng-click", "ConferenceWebrtcCtrl.clearChatCount('chatCount_" + sess.wsId + "')");

                var newListItem = _this.$compile(listItem)(_this.$scope);
                var userList = document.querySelector('.userlist');

                let chatCountSpan = '<span style="color:green; font-size:18px; float:right; margin-right:20px;" class="glyphicon glyphicon-comment"><span id="chatCount_' + sess.wsId + '"  style="margin-left: -10px;font-size: 9px; color: white; padding-bottom: 12px; line-height: .9; position: relative; right: 1px; top: -7px;"></span></span>';
                newListItem[0].innerHTML = chatCountSpan;

                newListItem[0].appendChild(userIcon);
                newListItem[0].appendChild(userName);
                userList.appendChild(newListItem[0]);

                var userList = document.querySelector('.userlist');
                userList.appendChild(listItem);

            }

            if (isrejoin) {
                var remoteSelfVideo = document.querySelector('.myfeedremote');
                remoteSelfVideo.style = "display:inline-block";
            }

            console.log('candidated added: name is :' + sess.name + ' ws id is:' + sess.wsId);
            if (role == 'candidate' || role == 'participant') {
                document.querySelector('.stopmeeting').textContent = 'Leave Meeting';
            }


        });

        obj.on('pleft', function (sess) {

            var span = document.createElement("span");
            var parent = document.getElementById("chatid");
            parent.appendChild(span);
            parent.scrollTop = parent.scrollHeight;
            span.outerHTML = "</br><div class='part-left'><i>" + sess.name + " Left</i></div>";
            console.log('Participants count on pleft before:' + ParticipantsCount);
            ParticipantsCount = ParticipantsCount - 1;
            console.log('Participants count on pleft after:' + ParticipantsCount);
            if (Object.keys(remoteParticipants).length == 0) {

                _this.stoppeechRecognation();
                var remoteSelfVideo = document.querySelector('.myfeedremote');
                remoteSelfVideo.style = "display:none";
            }
            if (ParticipantsCount < 7) {
                isarrowon = false;
                document.querySelector('.arrowdivleft').style = "visibility : hidden";
                document.querySelector('.arrowdivright').style = "visibility : hidden";
            }

            var userListD = document.querySelector('.userlist');
            var listItemD = userListD.getElementsByTagName("li");
            for (var i = 0; i < listItemD.length; i++) {
                if (listItemD[i].id == sess.wsId) {
                    console.log(' deleting candidate ' + sess.wsId);
                    listItemD[i].remove();
                }
            }
            delete remoteParticipants[sess.wsId];
            console.log('calling alignVideoDivs call ', Object.keys(remoteParticipants).length);
            _this.alignVideoDivs();
        });

        obj.on('addCand', function (wsId, name) {

        });

        obj.on('delCand', function (wsId, name) {

        });

        obj.on('addBuddy', function (wsId, name) {


        });

        obj.on('delBuddy', function (wsId, name) {

        });
        obj.on('dimMsg', function (data) {
            var from = data.name;
            var content = data.content;
            var participant = remoteParticipants[data.wsId];
            console.log('Received private message ' + content + ' from ' + from, participant);

            if (!_this.isShowChat) {
                _this.chatcounter = _this.chatcounter + 1;
                _this.$scope.$apply();
            }

            let chatBox = $("#chatWindow_" + data.wsId);
            if (angular.isDefined(chatBox.get(0))) {
                var parent = document.getElementById("chatid_" + data.wsId);
                var span = document.createElement("span");
                parent.appendChild(span);
                let chatHtml = "";
                let time = moment().format('MM-DD-YYYY hh:mm A');
                let profilePicture = _this.$window.localStorage.profilePicPath || "";
                let firstLetter = from.charAt(0);
                chatHtml += '<li class="right clearfix  you-li">';
                chatHtml += '<div class="circleBase you-type pull-right">' + firstLetter.toUpperCase() + '</div>';
                chatHtml += '<div class="chat-body clearfix" style="width:100% !important;"><div class="header">';
                chatHtml += '<strong class="primary-font">' + from + '</strong>';
                chatHtml += '<small class="pull-right you-text-muted"><span class="glyphicon glyphicon-time"></span> ' + time + '</small>';
                chatHtml += '</div><p>' + content + '</p></div>';
                chatHtml += '</li>';
                span.outerHTML = chatHtml;
                parent.scrollTop = parent.scrollHeight;

                let chatCountSpan = document.getElementById("chatCount_" + data.wsId);
                let chatCount = chatCountSpan.innerText
                if (angular.isDefined(chatCount) && chatCount !== "NaN" && chatCount !== "") {
                    chatCount = parseInt(chatCount);
                    chatCount = chatCount + 1;
                    chatCountSpan.innerText = chatCount;
                } else {
                    chatCountSpan.innerText = "1";
                }
            } else {
                let chatWindow = "<div id='chatWindow_" + data.wsId + "' style='display:none;'";
                chatWindow += " ng-draggable='dragOptions' class='row chat-section'> <div style='margin-left: 365%;' class='chat-container'> <div class='chat-page'> <div class='part-container'> <div style='width: 123%;margin-left: -15px;' class='col-md-12'> <div class='panel panel-primary'> <div class='panel-heading'><span class='glyphicon glyphicon-comment'></span> " + data.name + "\'s Chat <div class='btn-group pull-right'>";
                chatWindow += "<button type='button' data-toggle='dropdown' style='padding-bottom: 3px; margin-top: -3px;' ";
                chatWindow += "ng-click='ConferenceWebrtcCtrl.openClosePopUp(\"C\", \"chatWindow_" + data.wsId + "\")' ";
                chatWindow += "class='btn btn-default btn-xs dropdown-toggle'><i aria-hidden='true' class='fa fa-times fa-lg'></i></button>";
                chatWindow += "</div> </div> <div style='height: 308px;padding: 5px !important;' class='panel-body'> <ul id='chatid_" + data.wsId + "' style='height: 290px !important;overflow-y: scroll;' class='chat'>";
                let time = moment().format('MM-DD-YYYY hh:mm A');
                let profilePicture = _this.$window.localStorage.profilePicPath || "";
                let firstLetter = from.charAt(0);
                chatWindow += '<li class="right clearfix  you-li">';
                chatWindow += '<div class="circleBase you-type pull-right">' + firstLetter.toUpperCase() + '</div>';
                chatWindow += '<div class="chat-body clearfix" style="width:100% !important;"><div class="header">';
                chatWindow += '<strong class="primary-font">' + from + '</strong>';
                chatWindow += '<small class="pull-right you-text-muted"><span class="glyphicon glyphicon-time"></span> ' + time + '</small>';
                chatWindow += '</div><p>' + content + '</p></div>';
                chatWindow += '</li>';
                chatWindow += "</ul> </div> <div class='panel-footer'> <div class='input-group'> <input id='textbox_" + data.wsId + "' type='text' placeholder='Type your message here...' ng-keydown='ConferenceWebrtcCtrl.sendPrivateMsg($event, \"textbox_" + data.wsId + "\", \"" + data.wsId + "\")' ";
                chatWindow += "ng-click='ConferenceWebrtcCtrl.setFocus(\"textbox_" + data.wsId + "\")' ";
                chatWindow += "class='form-control input-sm'/><span class='input-group-btn'> <button id='btn-chat' data-ng-click='ConferenceWebrtcCtrl.sendPrivateMsg(ConferenceWebrtcCtrl.e, \"textbox_" + data.wsId + "\", \"" + data.wsId + "\")' class='btn btn-warning btn-sm'>Send</button></span> </div> </div> </div> </div> </div> </div> </div> </div>";
                angular.element(document.getElementById('imgwrapper')).append(_this.$compile(chatWindow)(_this.$scope));

                let chatCountSpan = document.getElementById("chatCount_" + data.wsId);
                chatCountSpan.innerText = "1";

            }
        });
        obj.on('imMsg', function (from, content) {
            try {
                if (!_this.isShowChat) {
                    _this.chatcounter = _this.chatcounter + 1;
                    _this.$scope.$apply();
                }

                var span = document.createElement("span");
                var parent = document.getElementById("chatid");
                parent.appendChild(span);
                let chatHtml = "";
                let time = moment().format('MM-DD-YYYY hh:mm A');
                let profilePicture = _this.$window.localStorage.profilePicPath || "";
                let firstLetter = from.charAt(0);

                chatHtml += '<li class="right clearfix  you-li">';
                chatHtml += '<div class="circleBase you-type pull-right">' + firstLetter.toUpperCase() + '</div>';
                chatHtml += '<div class="chat-body clearfix" style="width:100% !important;"><div class="header">';
                chatHtml += '<strong class="primary-font">' + from + '</strong>';
                chatHtml += '<small class="pull-right you-text-muted"><span class="glyphicon glyphicon-time"></span> ' + time + '</small>';
                chatHtml += '</div><p>' + content + '</p></div>';
                chatHtml += '</li>';
                span.outerHTML = chatHtml;
                parent.scrollTop = parent.scrollHeight;
            } catch (e) {
                console.log('Exception in imMsg ', e);
            }
        });

        obj.on('videolist', function (name, file) {
            isRecordingFeed = true;
            console.log('got video file: ' + file + ' name:' + name);
            recordedVideopath = "https://" + myhttps + "/media/" + file + '.webm';
            console.log('video path is:', recordedVideopath);

        });

        obj.on('hangup', function (data) {
            var selfVideo = document.querySelector('.selfvideo');
            var remoteSelfVideo = document.querySelector('.myfeedremote');
            attachMediaStream(selfVideo, localStream);
            remoteSelfVideo.style = "display:none";
            var userListR = document.querySelector('.userlist');
            ParticipantsCount = 1;
            for (var delmem in remoteParticipants) {
                delete remoteParticipants[delmem];
            }

            while (userListR.childElementCount > 1) {
                userListR.removeChild(userListR.lastChild);
            }

            var chatbox = document.getElementById("chatid");

            while (chatbox.firstChild) {
                chatbox.removeChild(chatbox.firstChild);
            }
            document.querySelector('.arrowdivleft').style = "visibility : hidden";
            document.querySelector('.arrowdivright').style = "visibility : hidden";

            _this.alignVideoDivs();
            isScrnSharing = false;
            // _this.stopRecording();
            // var speech = hark();
            // speech.stop();
            _this.stoppeechRecognation();
            if (role == 'host' && _this.meetingTypeM == 'conference') {
                _this.afterSave();
            }
            if (role == 'host' && _this.meetingTypeM == 'interview') {
                _this.saveInterview();
            }
            if (_this.meetingTypeM === 'unlisted') {
                window.stream.getVideoTracks()[0].stop();
                window.stream.getAudioTracks()[0].stop();
                _this.$window.localStorage.removeItem('quickMeetName');
                _this.$window.localStorage.removeItem('quickMeetRole');
                _this.$window.location.replace("https://www.jottp.com");
            }

            if (role == 'participant' || role == 'candidate') {
                window.stream.getVideoTracks()[0].stop();
                window.stream.getAudioTracks()[0].stop();
                if (_this.$rootScope.isLoggedIn && !_this.AuthService.user.userType == 2) {
                    var scrollparent = document.querySelector('.full-height');
                    scrollparent.style = "overflow:auto;";
                    _this.$state.go('conference.conference-home');
                }
                else if (_this.meetingTypeM === 'unlisted') {
                    _this.$window.location.replace("https://www.jottp.com");
                }
                else {
                    _this.$state.go('conference.meeting-end');
                }
            }
        });

        obj.on('ctext', function (confid, text, version) {
            var codeb1 = document.getElementById("codebox");
            codeb1.value = text;
        });

        obj.on('recStarted', function (sess) {

            _this.recordingStarts = true;
        });
        if (role == 'candidate' || role == 'participant') {
            obj.getStream(_this.$window.localStorage.audio, _this.$window.localStorage.video);
            obj.connect();
        }
        obj.getStream(_this.$window.localStorage.audio, _this.$window.localStorage.video);
        obj.connect();
    }

    connect() {
        obj.connect();
    }

    startConf() {
        console.log('starting conf ' + session);
        if (session) _this.joinConf();
        else obj.startConf(interviewType, interviewId, env, config);
    }

    joinConf() {
        var valid = true;
        if (isFreeConferene) {
            document.querySelector('.stopmeeting').textContent = 'Leave Meeting';
        }
        console.log('-----in join conf: session:  ' + session + ' role is:' + role + ' confid value: ' + confid + 'is valid: ' + valid + '----------');
        obj.joinConf(session, role, valid, interviewType, interviewId, env, config);
    }

    leaveConf() {
        _this.isRejoining = false;
        obj.leaveConf();

    }

    sendPrivateMsg(event, txtBoxId, rwsId) {
        try {
            if (event.keyCode == 13) {
                var chatText = document.getElementById(txtBoxId).value;
                if (angular.isDefined(chatText) && chatText.trim() !== "") {
                    console.log('Sending private message to ' + rwsId + ' c:' + chatText);
                    obj.sendDirectIM(obj.confId, rwsId, chatText);
                    var span = document.createElement("div");
                    var parent = document.getElementById("chatid_" + rwsId);
                    parent.appendChild(span);
                    parent.scrollTop = parent.scrollHeight;
                    let chatHtml = "";
                    let time = moment().format('MM-DD-YYYY hh:mm A');
                    let profilePicture = _this.$window.localStorage.profilePicPath || "";
                    let firstLetter = name.charAt(0);
                    let fullName = name;

                    chatHtml += '<li class="right clearfix me-li">';
                    chatHtml += '<div class="chat-body clearfix" style="width:100% !important;"><div class="header">';
                    chatHtml += '<strong class="primary-font user-name">' + fullName + '</strong>';
                    chatHtml += '<small class="pull-left me-text-muted"><span class="glyphicon glyphicon-time"></span> ' + time + '</small>';
                    chatHtml += '</div><p class="chat-para">' + chatText + '</p></div>';
                    chatHtml += '<div class="circleBase me-type pull-right">' + firstLetter.toUpperCase() + '</div>';
                    chatHtml += '</li>';
                    span.outerHTML = chatHtml;
                    span.focus();
                    document.getElementById(txtBoxId).value = '';
                }
            }
        } catch (e) {
            console.log('Exception in sendChatMsg ', e);
        }
    }

    sendChatMsg(event, txtBoxId, chatDivId) {
        try {
            if (event.keyCode == 13) {
                var chat = document.getElementById(txtBoxId).value;
                if (angular.isDefined(chat) && chat.trim() !== "") {
                    obj.sendIM(obj.confid, chat);
                    var span = document.createElement("div");
                    var parent = document.getElementById(chatDivId);
                    parent.appendChild(span);
                    parent.scrollTop = parent.scrollHeight;
                    let chatHtml = "";
                    let time = moment().format('MM-DD-YYYY hh:mm A');
                    let profilePicture = _this.$window.localStorage.profilePicPath || "";
                    let firstLetter = name.charAt(0);
                    let fullName = name;

                    chatHtml += '<li class="right clearfix me-li">';
                    chatHtml += '<div class="chat-body clearfix" style="width:100% !important;"><div class="header">';
                    chatHtml += '<strong class="primary-font user-name">' + fullName + '</strong>';
                    chatHtml += '<small class="pull-left me-text-muted"><span class="glyphicon glyphicon-time"></span> ' + time + '</small>';
                    chatHtml += '</div><p class="chat-para">' + chat + '</p></div>';
                    chatHtml += '<div class="circleBase me-type pull-right">' + firstLetter.toUpperCase() + '</div>';
                    chatHtml += '</li>';

                    span.outerHTML = chatHtml;
                    span.focus();
                }
                document.getElementById(txtBoxId).value = '';
            }
        } catch (e) {
            console.log('Exception in sendChatMsg ', e);
        }
    }

    hangup() {
        try {
            if (role == 'candidate' || role == 'participant' || isFreeConferene) {
                obj.leaveConf(obj.confid);
            }
            else {
                obj.hangup();
            }
            _this.stoppeechRecognation();
        } catch (e) {
            console.error('Exception in hangup ', e);
        }
    }

    meetingstatus() {
        try {
            if (role == "participant" || role == "candidate" || isFreeConferene) {
                if (document.querySelector('.stopmeeting').textContent == 'Leave Meeting') {
                    _this.leaveConf();
                }
            }
            else if (role == "host") {
                if (document.querySelector('.stopmeeting').textContent == 'Stop Meeting') {
                    _this.hangup();
                } else
                    if (document.querySelector('.stopmeeting').textContent == 'Leave Meeting') {
                        _this.leaveConf();
                    }
            }

        }
        catch (e) {
            console.error('Exception in hangup ', e);
        }
    }

    afterSave() {
        if (_this.$rootScope.isLoggedIn && _this.AuthService.user.userType === 1) {
            window.stream.getVideoTracks()[0].stop();
            window.stream.getAudioTracks()[0].stop();
            var scrollparent = document.querySelector('.full-height');
            scrollparent.style = "overflow-y:auto;";
            _this.$state.go('conference.conference-home');
        }
        else {
            window.stream.getVideoTracks()[0].stop();
            window.stream.getAudioTracks()[0].stop();
            _this.$state.go('conference.meeting-end');
        }
    }

    saveConference() {
        let onSuccess = (response) => {
            console.log('meeting saved successfully');
            console.log(response);
            if (_this.$rootScope.isLoggedIn && _this.AuthService.user.userType === 1) {
                window.stream.getVideoTracks()[0].stop();
                window.stream.getAudioTracks()[0].stop();
                var scrollparent = document.querySelector('.full-height');
                scrollparent.style = "overflow:auto;";
                _this.$state.go('conference.conference-home');
            }
            else {
                window.stream.getVideoTracks()[0].stop();
                window.stream.getAudioTracks()[0].stop();
                _this.$state.go('conference.meeting-end');
            }


        };
        let onError = (error) => {
            console.log('error');

        };
        console.log('text data', text);
        if (text) {
            texteditorData = text.toString();
        }

        var data = {};
        data.meetingJoiningId = confid;
        data.editorText = texteditorData;
        data.videoFilePath = recordedVideopath;
        data.sharedFiles = "";
        _this.ConferenceWebrtcService.saveConference(data);
        _this.ConferenceWebrtcService.activePromise.then(onSuccess, onError);
    }
    endConference() {
        let onSuccess = (response) => {
            console.log('meeting validate');
            _this.$state.go('conference.mainpage');

        };

        let onError = (error) => {
            console.log(error);
            _this.$state.go('conference.mainpage');
        };
        _this.DemoService.conferenceEnd(confid);
        _this.DemoService.activePromise.then(onSuccess, onError);
    }

    saveInterview() {
        console.log('----------------- Interview saved successfully -------------------');
        _this.$window.localStorage.removeItem('interviewCandidateId');
        _this.$window.localStorage.removeItem('interviewId');
        _this.$window.localStorage.removeItem('interviewType');
        _this.$window.localStorage.removeItem('interviewCode');
        _this.$window.localStorage.removeItem('interviewDetails');

        if (_this.$rootScope.isLoggedIn) {
            var scrollparent = document.querySelector('.full-height');
            scrollparent.style = "overflow:auto;";
            _this.$state.go('app.dashboard');
        }
        else {
            var scrollparent = document.querySelector('.full-height');
            scrollparent.style = "overflow:auto;";
            _this.$state.go('conference.meeting-end');
        }
    }

    toggleScreenShare() {
        if (isScrnSharing) {
            obj.stopScrnShare();
        }
        else if (_this.haveScreenStream) {
            alert('already screenshare is going on');
        } else {
            obj.startScrnShare();
        }
    }

    toogleAudioMute() {
        if (isAudioMuted == true) {
            isAudioMuted = false;
            obj.unmute(true, false);
            var elementA = document.querySelector(".audioIcon");
            elementA.classList.remove("fa-microphone-slash");
            elementA.classList.add("fa-microphone");
        } else {
            isAudioMuted = true;
            obj.mute(true, false);
            var elementB = document.querySelector(".audioIcon");
            elementB.classList.remove("fa-microphone");
            elementB.classList.add("fa-microphone-slash");
        }
    }

    toogleVideoMute() {
        if (isVideoMuted == true) {
            isVideoMuted = false;
            obj.unmute(false, true);
            var elementC = document.querySelector(".videoIcon");
            elementC.classList.remove("fa-stop");
            elementC.classList.add("fa-video-camera");
        } else {
            isVideoMuted = true;
            obj.mute(false, true);
            var elementD = document.querySelector(".videoIcon");
            elementD.classList.add("fa-stop");
            elementD.classList.remove("fa-video-camera");
        }
    }

    setFocus(id) {
        document.getElementById(id).focus();

        if (angular.isDefined(id)) {
            let idArray = id.split('_');
            if (angular.isDefined(idArray) && idArray.length > 1) {
                _this.clearChatCount('chatCount_' + idArray[1]);
            }
        }
    }
    scrollLeft() {
        event.preventDefault();
        var myElmL = angular.element(document.querySelector('#remotefeeds'));
        var leftposL = myElmL.scrollLeft();

        myElmL.animate({ scrollLeft: leftposL - 400 }, 500);
    }

    scrollRight() {
        event.preventDefault();
        var myElmR = angular.element(document.querySelector('#remotefeeds'));
        var leftposR = myElmR.scrollLeft();

        myElmR.animate({ scrollLeft: leftposR + 400 }, 500);
    }

    getTextEditorWorking() {
        var codeb = document.getElementById("codebox");
        var code_text = '', ig_list = [0, 16, 17, 18, 20, 33, 34, 35, 36, 37, 38, 39, 40, 144];
        codeb.onkeyup = function (e) {
            try {
                if (ig_list.indexOf(e.keyCode) > -1) {
                    return;
                }
                console.log('keyup ' + e.keyCode, e);
                text = codeb.value;
                if (code_text === text) {
                    return;
                }
                code_text = text;
                obj.sendCode(text);
            } catch (e) {
                console.error('Exception in cb keyup', e);
            }
        }
    }

    showHideShareMail() {
        _this.isSendMailShow = !_this.isSendMailShow;
    }

    sendInvitationLinkForEmail() {

    }

    stoppeechRecognation() {
        if (speechEvents) { speechEvents.stop(); speechEvents = null; isHarkStarted = false; }
    }


    getRecommendedQuestions() {
        let onSuccess = (response) => {
            _this.recommendedQuestion = response.data.data;
        },
            onError = (error) => {
                console.log(error);
                _this.recommendedQuestion = [];
            },
            recommendedQuestionData = {
                "interviewId": _this.$window.localStorage.interviewId || 1,
                "positionId": "",
                "primarySkillId": "",
                "secondarySkillId": "",
                "tertiarySkillId": "",
                "questionTypeId": [1, 2, 3, 4, 5]
            }
        _this.ConferenceWebrtcService.getRecommendedQuestions(recommendedQuestionData);
        _this.ConferenceWebrtcService.activePromise.then(onSuccess, onError);
    }

    getDeviceList() {
        navigator.mediaDevices.enumerateDevices().then(_this.deviceList).catch(_this.handleError);
    }
    getDevices() {
        _this.videofound = false;
        _this.audiofound = false;
        for (var i = 0; i < _this.deviceListVideo.length; i++) {
            if (_this.$window.localStorage.video === _this.deviceListVideo[i].id) {
                _this.videosourceselect = _this.deviceListVideo[i];
                _this.videofound = true;
            }
        }

        for (var i = 0; i < _this.deviceListAudio.length; i++) {
            if (_this.$window.localStorage.audio === _this.deviceListAudio[i].id) {
                _this.audiosourceselect = _this.deviceListAudio[i];
                _this.audiofound = true;
            }
        }
        if (!_this.videofound) {
            _this.videosourceselect = _this.deviceListVideo[0];
        }
        if (!_this.audiofound) {
            _this.audiosourceselect = _this.deviceListAudio[0];
        }

        _this.startRecording();

    }
    deviceList(deviceInfos) {

        var deviceListHolder = [];
        var deviceListHolderAudio = [];
        var deviceListHolderAudioId = [];
        for (var i = 0; i !== deviceInfos.length; ++i) {
            var deviceInfo = deviceInfos[i];
            if (deviceInfo.kind === 'videoinput') {
                deviceInfo.text = deviceInfo.label || 'camera ';
                deviceInfo.id = deviceInfo.deviceId;
                deviceListHolder.push(deviceInfo);
            }
            else if (deviceInfo.kind === 'audioinput') {
                if (deviceListHolderAudioId.indexOf(deviceInfo.deviceId) < 0) {
                    deviceInfo.text = deviceInfo.label || 'microphone ';
                    deviceInfo.id = deviceInfo.deviceId;
                    deviceListHolderAudio.push(deviceInfo);
                    deviceListHolderAudioId.push(deviceInfo.deviceId);
                }
            }
        }
        _this.deviceListVideo = deviceListHolder;
        _this.deviceListAudio = deviceListHolderAudio;

    }
    handleError(error) {
        console.log('error in first call to get device: ', error);
    }
    startRecording() {
        _this.isVideoFeed = true;
        _this.firstVideoFeed();
    }
    changeVideoFeed() {
        var videoSource = _this.videosourceselect.id;
        _this.$window.localStorage.video = _this.videosourceselect.id;
        var constraints = {
            video: { deviceId: videoSource ? { exact: videoSource } : undefined }
        };
        navigator.mediaDevices.getUserMedia(constraints).then(_this.onStream.bind(_this)).catch(_this.handleError());
        obj.switchStream(_this.$window.localStorage.audio, _this.$window.localStorage.video);
    }

    firstVideoFeed() {
        var PreviousVideoSource = _this.$window.localStorage.video;
        var constraints = {
            video: { deviceId: PreviousVideoSource ? { exact: PreviousVideoSource } : undefined }
        };
        navigator.mediaDevices.getUserMedia(constraints).then(_this.onStream.bind(_this)).catch(_this.handleError());
    }

    onStream(stream) {
        changeDeviceCounter = changeDeviceCounter + 1;
        if (changeDeviceCounter === 1) {
            setTimeout(function () {
                let url = window.URL || window.webkitURL;
                _this.videoElement = document.getElementById('videoTestElementCertIns');
                _this.videoElement.src = url ? url.createObjectURL(stream) : stream;
                _this.videoElement.controls = false
                _this.videoElement.play();
            }, 1000);
        }
        else {
            let url = window.URL || window.webkitURL;
            _this.videoElement = document.getElementById('videoTestElementCertIns');
            _this.videoElement.src = url ? url.createObjectURL(stream) : stream;
            _this.videoElement.controls = false
            _this.videoElement.play();
        }

    }

    changeAudioFeed() {
        _this.$window.localStorage.audio = _this.audiosourceselect.id;
        obj.switchStream(_this.$window.localStorage.audio, _this.$window.localStorage.video);
    }

    updateDisplayName() {
        _this.participantName = name = _this.displayName;
        obj.updateDetails(confid, { name: _this.displayName });
        _this.$window.localStorage.quickMeetName = _this.displayName;
    }

    compile() {
        try {
            var htmlSection = document.getElementById("myHtmlSection").value;
            var cssSection = document.getElementById("myCssSection").value;
            var jsSection = document.getElementById("myJsSection").value;
            var selectedLanguage = document.getElementById("ddlLanguage").value;
            var html = "<html>";
            html += "<head>";
            if (selectedLanguage == 1) {
                html += languageReference[0].cdnLink;

            } else if (selectedLanguage == 2) {
                html += languageReference[1].cdnLink;

            } else if (selectedLanguage == 3) {
                html += languageReference[2].cdnLink;
                html += languageReference[3].cdnLink;

            } else if (selectedLanguage == 4) {
                html += languageReference[2].cdnLink;
                html += languageReference[3].cdnLink;
            }

            html += "<style>";
            html += cssSection;
            html += "</style></head><body>"
            html += htmlSection;
            html += "<script type='text/javascript'>";
            html += jsSection;
            html += "</";
            html += "script></body></html>";
            document.getElementById("resultSection").srcdoc = html;

        } catch (ex) {
            alert(ex);
        }
    }

    reset() {
        document.getElementById("myHtmlSection").value = "";
        document.getElementById("myCssSection").value = "";
        document.getElementById("myJsSection").value = "";
        document.getElementById("resultSection").value = "";
        document.getElementById("resultSection").srcdoc = "";
    }

    dynamicMargin() {
        var webrtcDiv = document.getElementById('webrtcElement');
        webrtcDiv.style.marginLeft = window.innerWidth - '10px';
    }

    clearChatCount(id) {
        document.getElementById(id).innerText = "";
    }

    showFullScreen() {
        _this.isFullScreen = !_this.isFullScreen;
        let normalScreenCss = {
            'position': 'fixed',
            'cursor': 'pointer',
            'top': '100px',
            'left': '-150px',
            'overflow': 'hidden',
            'height': '570px',
            'width': '855px'
        }

        let fullScreenCss = {
            'position': 'fixed',
            'cursor': 'pointer',
            'top': '76px',
            'left': '-29%',
            'width': '100%',
            'height': '109%'
        }
        if (_this.isFullScreen) {
            $('.code-editor-dimension').css(fullScreenCss);
        } else {
            $('.code-editor-dimension').css(normalScreenCss);
        }

    }


}
