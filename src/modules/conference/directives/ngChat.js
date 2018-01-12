function linkingFuncion($document, $window, $compile) {
    return function initChatWindow(scope, element, attr) {
               let chatData = JSON.parse(attr.ngChat);
               element.bind("click", function(){
                    let chatBox = $("#chatWindow_"+ chatData.wsId);
                    if(angular.isDefined(chatBox.get(0))){
                       if(chatBox.is(':hidden')){
                          chatBox.show();
                       }else{
                          chatBox.hide();
                       }
                    }else{
                      let chatWindow = "<div id='chatWindow_"+ chatData.wsId + "' style='display:block;'";
                          chatWindow +=" ng-draggable='dragOptions' class='row chat-section'> <div style='margin-left: 365%;' class='chat-container'> <div class='chat-page'> <div class='part-container'> <div style='width: 123%;margin-left: -15px;' class='col-md-12'> <div class='panel panel-primary'> <div class='panel-heading'><span class='glyphicon glyphicon-comment'></span> " + chatData.name + "\'s Chat <div class='btn-group pull-right'>";
                          chatWindow +="<button type='button' data-toggle='dropdown' style='padding-bottom: 3px; margin-top: -3px;' ";
                          chatWindow +="ng-click='ConferenceWebrtcCtrl.openClosePopUp(\"C\", \"chatWindow_"+ chatData.wsId +"\")' ";
                          chatWindow +="class='btn btn-default btn-xs dropdown-toggle'><i aria-hidden='true' class='fa fa-times fa-lg'></i></button>";
                          chatWindow +="</div> </div> <div style='height: 308px;padding: 5px !important;' class='panel-body'> <ul id='chatid_"+ chatData.wsId + "' style='height: 290px !important;overflow-y: scroll;' class='chat'></ul> </div> <div class='panel-footer'> <div class='input-group'> <input id='textbox_"+ chatData.wsId + "' type='text' placeholder='Type your message here...' ng-keydown='ConferenceWebrtcCtrl.sendPrivateMsg($event, \"textbox_"+ chatData.wsId +"\", \""+ chatData.wsId +"\")' ";
                          chatWindow += "ng-click='ConferenceWebrtcCtrl.setFocus(\"textbox_"+ chatData.wsId +"\")' ";
                          chatWindow += "class='form-control input-sm'/><span class='input-group-btn'> <button id='btn-chat' data-ng-click='ConferenceWebrtcCtrl.sendPrivateMsg(ConferenceWebrtcCtrl.e, \"textbox_"+ chatData.wsId +"\", \""+ chatData.wsId +"\")' class='btn btn-warning btn-sm'>Send</button></span> </div> </div> </div> </div> </div> </div> </div> </div>";

                          angular.element(document.getElementById('imgwrapper')).append($compile(chatWindow)(scope));
               		  }
               		});
             }
};

class ngChatDirective {
    constructor($document, $window, $compile) {
        this.$document =  $document;
        this.$window =  $window;
        this.$compile = $compile;
        this._instantiate();
    }

    _instantiate() {
        this.restrict = 'A';
        this.transclude = true;
        this.scope = false;
        //.scope = { userchat: '=' },
        this.link = linkingFuncion(this.$document, this.$window, this.$compile);
    }
}

ngChat.$inject = ['$document', '$window', '$compile'];

export function ngChat($document, $window, $compile) {
    return new ngChatDirective($document, $window, $compile);
}