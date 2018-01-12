//Directive for feedback form

class FeedBackForm{
	constructor(){
		this.restrict = 'E';
		this.scope = true;
		this.replace = true;
		this.templateUrl = 'main/partials/feedback-form.jade';
		this.controller = 'FeedbackFormController';
		this.controllerAs = '$ctrl';
	}
}

export function feedbackForm(){
	return new FeedBackForm();
}