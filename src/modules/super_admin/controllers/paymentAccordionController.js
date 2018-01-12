export class paymentAccordionController {
	/** @ngInject  */
  constructor(NgTableParams,$filter, dataTableService) {
  	let _this = this;
  	_this.category = this.category;
    _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});   
    _this.colNum = 6;
    _this.paymentDetailAcc = JSON.parse(this.paymentDetailAccordian);
    _this.columns = [];
    for(let prop in _this.paymentDetailAcc[0]){
    	_this.columns.push(prop);
    }
    _this.tableParams = new NgTableParams({
      page : 1,
      count: 5
    }, {
      counts: [5, 10, 20],
      getData: function (params) {
        var filter = params.filter();
        var sorting = params.sorting();
          var sortedData = params.sorting() ? $filter('orderBy')(_this.paymentDetailAcc, params.orderBy()) : _this.paymentDetailAcc;
          var pageData = sortedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
          //params.total(_this.paymentDetailAcc.length);
         // $defer.resolve(pageData);
          params.total(_this.paymentDetailAcc.length);
            if(!_this.dataTableService.totalColumn.length) {
               _this.dataTableService.initTable(_this.cols, _this.tableParams);  
            }
            return (pageData);
       
      }
    });
  }

}