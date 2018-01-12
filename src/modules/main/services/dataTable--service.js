let _this;

export class dataTableService {
  constructor($window, $rootScope) {
    _this = this;
    _this.$window = $window;
    _this.$rootScope = $rootScope;
    _this.colNum = 0;
    _this.totalColumn  = [] ;
    _this.tableParam = {};

    _this.initTable = function(cols, tableParam){
      _this.totalColumn = cols;
      _this.tableParam =  tableParam;
      _this.colNum  = _this.totalColumn.length;
    };
    var w = angular.element($window);
    w.bind('resize', () => {
        $rootScope.$broadcast('resizeTriggered');
    });

    _this.onLoad = function() {
      if(window.innerWidth < 768 && window.innerWidth > 480) {
        _this.setColumn(3);
      }
      if(window.innerWidth < 480) {
        _this.setColumn(2);
      }
      if(window.innerWidth > 768) {
        _this.setColumn(_this.totalColumn.length);
      }
      _this.showAllColumns(_this.getColumn());
    }

    _this.showAllColumns = function(endIdx) {
      if(_this.colNum != -1) {
        for(var i=0 ; i< _this.totalColumn.length;i++) {
          var col  = _this.totalColumn[i];
          if(i <= endIdx) {
            col.show(true);
          } else {
            col.show(false);
          }
        }
      }
    };

    _this.toggle = function(cols , selectedIdx) {
      _this.setColumn(-1);
      for(var i=2 ; i<cols.length;i++) {
        if(selectedIdx == i) {
          var col  = cols[parseInt(selectedIdx) + 1];
          col && col.show(true);
        }
        else {
          var col  = cols[i + 1];
          col && col.show(false);
        }
      }
    };

    _this.setColumn = function (noOfColumn) {
      _this.colNum = noOfColumn;
    };

    _this.getColumn = function () {
      return _this.colNum;
    };
  }
}
dataTableService.$inject = ['$window', '$rootScope'];
