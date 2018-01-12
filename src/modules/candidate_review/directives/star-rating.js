let _this;
export class StarRating{
	 constructor() {
	 	_this = this;
        //_this.template = '<span class="{{class}}"><i class="fa fa-star" ng-repeat="star in stars" ng-class="star"></i></span';
        _this.template = '<i class="fa fa-star" ng-repeat="star in stars" ng-class="star"></i>';
        _this.restrict = 'A';
        _this.scope = {
        	 ratingValue: '=',
        	    max: '=',
        	    //class : '@'
           }        

    }


    // optional link function
    link(scope, element) {
    	//console.log(scope);
        
        let constructStars = function(){
        	scope.stars = [];
        	for (var i = 0; i < scope.max; i++) {
                scope.stars.push({
                    gold: i < scope.ratingValue
                });
         }

        }
        constructStars();
        scope.$watch("ratingValue",constructStars);
    }

   
}
