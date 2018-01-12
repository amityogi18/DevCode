let _this;
export class addBackgroundMusicController {
	/** @ngInject  */
    constructor($scope, $uibModalInstance, $document, $window, $timeout, candidateProfilePublicService, GrowlerService, LoaderService) {
        _this = this;
        _this.$uibModalInstance = $uibModalInstance;
        _this.$scope = $scope;
        _this.$document = $document;
        _this.$window = $window;
        _this.$timeout = $timeout;
        _this.init();
        _this.candidateProfilePublicService = candidateProfilePublicService;
        _this.GrowlerService = GrowlerService;
        _this.LoaderService = LoaderService;
        _this.listofBackgroundMusic= {};
        _this.getAllBackgroundMusic();
    }
//    closeModal() {
//    $('#music').modal('hide');
//  }
closeModal(){
      _this.$uibModalInstance.close();
  }

    addGeneralMusic(audioFile) {
        _this.$uibModalInstance.close(audioFile.url);
    }

    addOnDeviceMusic( data , isAudio) {
        _this.$uibModalInstance.close(_this.backgroundMusic);
        _this.LoaderService.show();
        let onSuccess = (response) => {
         _this.GrowlerService.growl({
          type: 'success',
          message: 'Audio Uploaded successfully',
          delay: 2000
        });
          _this.LoaderService.hide();
       },
      onError = (error) => {
          console.log(error);
          _this.LoaderService.hide();
        }
      _this.candidateProfilePublicService.addBackgroundMusic(data, isAudio).then(onSuccess,onError);
    }

    registerOnDeviceAudioHandler() {
        var audioInput = this.$document.find('.on-device-audio-file');
        audioInput.on('change', function (inputEvent) {
            var files = inputEvent.target.files;
            if (files && files.length > 0) {
                var file = files[0];
                try {
                    var url = _this.$window.URL.createObjectURL(file);
                    //audio.src = url;
                    _this.backgroundMusic = url;
                    _this.onDeviceMusicAdded = true;
                    _this.$scope.$apply();
                    _this.backgroundMusicFile = file[0];
                    _this.addOnDeviceMusic(file, true);
                } catch (event) {
                    try {
                        var fileReader = new FileReader();
                        fileReader.onload = function (fileReaderEvent) {
                            _this.backgroundMusic = fileReaderEvent.target.result;

                            // audio.src = fileReaderEvent.target.result;
                        };
                        fileReader.readAsDataURL(file);
                        _this.onDeviceMusicAdded = true;
                        _this.$scope.$apply();

                    } catch (error) {
                        console.log('Neither createObjectURL or FileReader are supported',
                            error);
                    }
                }
            }
        });
    }

    init() {
        _this.onDeviceMusicAdded = false;
        _this.generalAudioFiles = [{title: 'Kalimba', url:'/kalimba'},
            {title: 'Maid', url:'maidwith'},
            {title: 'Sleep Away', url: 'sleepaway'},
        ];
        _this.$uibModalInstance.rendered.then(function () {
            _this.registerOnDeviceAudioHandler();
        });
    }

    getAllBackgroundMusic(){
       let onSuccess = (response) => {
                 _this.listofBackgroundMusic = response.data;
            },
            onError = (error) => {
                console.log(error);
            };
        _this.candidateProfilePublicService.getAllBackgroundMusic();
        _this.candidateProfilePublicService.activePromise.then(onSuccess, onError);
    }
};