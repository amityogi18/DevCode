let _this = this;
export class ThemeSettingsController {
	/** @ngInject  */
  constructor(ThemeSettingsService,$timeout,$rootScope,GrowlerService) {
    _this = this;
    _this.ThemeSettingsService = ThemeSettingsService;
    _this.GrowlerService = GrowlerService;
    console.log('Inside ThemeSettings Controller');
    _this.$timeout = $timeout;
    _this.themes = [];
    _this.$rootScope = $rootScope;
    _this.getThemeList();



  }

  changeTheme(){
    console.log(_this.theme);
    if(_this.theme.name){
      _this.$rootScope.themeClass ='application.'+_this.theme.name;
      if (typeof(Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        localStorage.setItem('theme',_this.$rootScope.themeClass );
      } else {
        console.log('Local Storage not supported')
      }
    }
  }
  // getThemes(){
  //   _this.ThemeSettingsService.getThemes().then((data)=>{
  //     console.log(data);
  //     _this.themes = data;
  //   },(err)=>{
  //     console.log("Error while fetching themes");
  //   });
  // }



  addTheme(){
    _this.changeTheme();
    let onSuccess = (response) => {
        _this.GrowlerService.growl({
          type: 'success',
          message: 'Theme Added successfully',
          delay: 2000
        });
      },
      onError = (error) => {
        console.log(error);
      };
     let data ={
       "id":_this.theme.id
     }

    _this.ThemeSettingsService.addTheme(data);
    _this.ThemeSettingsService.activePromise.then(onSuccess, onError);
  }

  getThemeList() {
    let onSuccess = (response) => {
        _this.themes = response.data;
        _this.getThemeByUserId();
      },
      onError = (error) => {
        console.log(error);
      };
    _this.ThemeSettingsService.getThemeList();
    _this.ThemeSettingsService.activePromise.then(onSuccess, onError);
  }

  getThemeByUserId(){
    let onSuccess = (response) => {

       _this.userThemes = response.data;
        for(var i = 0; i < _this.userThemes.length; i++){
          _this.theme = _.find(_this.themes, function (theme) {
            return theme.id == _this.userThemes[i].id;
          });
        }


      },
      onError = (error) => {
        console.log(error);
      };
    _this.ThemeSettingsService.getThemeByUserId();
    _this.ThemeSettingsService.activePromise.then(onSuccess, onError);
  }

}

