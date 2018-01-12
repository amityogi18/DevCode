/*
 @name NestedTableController
 @param {Object} NgTableParams - binds the data and the function for table accordion
 @param {Object} $timeout - The $timeout service can be used to call another JavaScript function after a given time delay
 @description - Its a controller for nestedTable component and it has the tableDataCallback which contains a promise and it returns the table data and tableParams
*/

let _this;
export class NestedTableController {
    /** @ngInject */
    constructor(NgTableParams, $timeout) {
        _this = this;
        _this.isLoadingInProgress = true;

        /*
         @name tableDataCallback
         @description - Its a Callback function that contains a promise and tableParams
         */
        _this.tableDataCallback()
            .then((response) => {

                let tableData = response.data;

                this.tableParams = new NgTableParams({
                        count: 5
                    },
                    {
                        counts: [5, 10, 20],
                        getData: function getData($defer, params) {
                            $timeout(function () {
                                params.total(tableData.length);
                                $defer.resolve(tableData);
                            }, 1000);
                        }
                    });
            })
            ['finally'](()=> {
            this.isLoadingInProgress = false;
        });
    }
}