let _this;
export class ConferenceHeadingController {
	/** @ngInject  */
	constructor(ConferenceService){
		_this =  this;
		_this.ConferenceService = ConferenceService;
    //Control display setting for meetnow and join by number
    _this.showConferenceMeetNowPopup = false;
    _this.showJoinByNumberPopup = false;
    _this.showTextBox=false;
}

	openConferenceModal(type){
		switch(type){
			case "meetnow":
			this.showConferenceMeetNowPopup = true;
			this.showJoinByNumberPopup = false;
			break;
			case "joinbynumber":
			this.showConferenceMeetNowPopup = false;
			this.showJoinByNumberPopup = true;
			break;
		}
	}


	closeConferenceModal(){
		this.showConferenceMeetNowPopup = false;
		this.showJoinByNumberPopup = false;
	}

	openTextBox(type){
		this.showTextBox=true;
 }
	closeTextBox(type){
		this.showTextBox=false;
	}
}

