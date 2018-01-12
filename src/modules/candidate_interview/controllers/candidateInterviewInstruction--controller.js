let _this;

export class candidateInterviewInstructionController {
  /** @ngInject  */
  constructor($state, $window, CandidateInterviewService, AuthService, $storage) {
    _this = this;

    document.addEventListener("contextmenu", function (e) {
      alert('Right Click is Not Allowed.');
      e.preventDefault();
    }, false);
    _this.$state = $state;
    _this.$window = $window;
    _this.CandidateInterviewService = CandidateInterviewService;
    _this.AuthService = AuthService;
    _this.$storage = $storage;
    _this.questionContent = "";
    _this.isWrongInterviewCode = false;
    _this.isShowQuestionDetails = true;
    _this.isNoQuestion = false;
    _this.interviewDetails = JSON.parse(_this.$storage.getItem('interviewDetails'));
    _this.getInterviewQuestionCountDetails();
  }

  getInterviewQuestionCountDetails() {
    if (!angular.isDefined(_this.interviewDetails.interviewTypeId) || _this.interviewDetails.interviewTypeId == "") {
      _this.isWrongInterviewCode = true;
    } else {
      if (_this.interviewDetails.interviewTypeId != 1 && _this.interviewDetails.interviewTypeId != 4) {
        let onSuccess = (response) => {
          _this.interviewQuestionCountDetails = response.data || {};
          if (response.data.audioQuestion == 0 && response.data.mcqQuestion == 0 && response.data.msqQuestion == 0 && response.data.numberOfRetries == 0 && response.data.redirectUrl == 0 && response.data.responseTime == 0 && response.data.textQuestion == 0 && response.data.videoQuestion == 0) {
            _this.questionContent = "We don't have any question for this interview."
            _this.isShowQuestionDetails = false;
            _this.isNoQuestion = true;
          } else {
            _this.$storage.setItem('numberOfRetries', _this.interviewQuestionCountDetails.numberOfRetries);
            _this.$storage.setItem('redirectUrl', _this.interviewQuestionCountDetails.redirectUrl);
            _this.totalDuration = _this.getTotalDuration(response.data);
            _this.questionContent = "You will have to answer";
            _this.isNoQuestion = false;

            if (response.data.videoQuestion != 0) {
              _this.questionContent += " " + response.data.videoQuestion + " video questions ";
            }
            if (response.data.audioQuestion != 0) {
              if (_this.questionContent !== "You will have to answer") {
                _this.questionContent += "and ";
              }
              _this.questionContent += response.data.audioQuestion + " audio questions ";
            }
            if (response.data.textQuestion != 0) {
              if (_this.questionContent !== "You will have to answer") {
                _this.questionContent += "and ";
              }
              _this.questionContent += response.data.textQuestion + " text question(s) ";
            }
            if (response.data.mcqQuestion != 0) {
              if (_this.questionContent !== "You will have to answer") {
                _this.questionContent += "and ";
              }
              _this.questionContent += response.data.mcqQuestion + " multiple choice question(s) ";
            }
            if (response.data.msqQuestion != 0) {
              if (_this.questionContent !== "You will have to answer") {
                _this.questionContent += "and ";
              }
              _this.questionContent += response.data.msqQuestion + " multiple select question(s) ";
            }
          }
        },
          onError = (error) => {
            _this.questionContent = "We don't have any question for the interview."
            _this.isNoQuestion = true;
            console.log(error);
          };
        _this.CandidateInterviewService.getInterviewQuestionCountDetails(_this.interviewDetails.interviewId);
        _this.CandidateInterviewService.activePromise.then(onSuccess, onError);
      } else {
        _this.questionContent = "Welcome to the interview.";
        _this.isShowQuestionDetails = false;
      }
    }
  }

  getTotalDuration(q) {
    let totalDuration = "Duration : " + 0 + " min estimated.";
    let totalQuestion = q.audioQuestion + q.videoQuestion + q.textQuestion + q.mcqQuestion + q.msqQuestion;
    let count = (totalQuestion * q.responseTime);
    let totalCount = (count * (q.numberOfRetries + 1));
    _this.$storage.setItem('totalDuration', totalCount);
    totalDuration = "Duration : " + totalCount + " min estimated.";
    return totalDuration;
  }

  startInterview() {
    let interviewType = _this.interviewDetails.interviewTypeId;
    if (_this.AuthService.user.userType == 2) {
      _this.updateCandidateInterviewStatus();
    }
    if (interviewType == 1 || interviewType == 4) {
      let fullName = _this.AuthService.user.fullName;
      let interviewCode = _this.interviewDetails.interviewCode;
      let interviewRole = _this.$storage.getItem('interviewRole') || "participant";
      let meetingData = { fullName: fullName, interviewCode: interviewCode, participantType: interviewRole };
      _this.$storage.setItem('meetingType', "interview");
      _this.joinMeeting(meetingData);
    } else {
      _this.$state.go('ci.video');
    }
  }

  takePractice() {
    _this.$storage.setItem('oldPage', "ci");
    _this.$state.go('ci.test-instruction');
  }



  updateCandidateInterviewStatus() {
    let onSuccess = (response) => {
      console.log('***-----------Candidate Interview Status Updated To In Progress------------***');
    },
      onError = (error) => {
        console.log(error);
      },
    statusData = { statusId: 13, interviewId: _this.interviewDetails.interviewId };
    _this.CandidateInterviewService.updateCandidateInterviewStatus(statusData);
    _this.CandidateInterviewService.activePromise.then(onSuccess, onError);
  }

  joinMeeting(meetingData) {
    let stateParams = { participantName: meetingData.fullName, confId: meetingData.interviewCode, meetingTypeM: 'interview' }
    if (meetingData.participantType == "host") {
      _this.$state.go('conference.host-webrtc', stateParams);
    }
    else if (meetingData.participantType == "participant") {
      _this.$storage.setItem('interviewCandidateId', _this.AuthService.user.userId);
      _this.$storage.setItem('interviewParticipantId', _this.AuthService.user.userId);
      _this.$state.go('conference.participant-webrtc', stateParams);
    }
    else if (meetingData.participantType == "candidate") {
      _this.$storage.setItem('interviewCandidateId', _this.AuthService.user.userId);
      _this.$state.go('conference.participant-webrtc', stateParams);
    }
  }
}

