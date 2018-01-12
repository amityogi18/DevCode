let _this;

//import XLSX from 'xlsx';
/*
 @interviewActivityReportController Controller
 @param {object} $state - service that can contain some state.
 @param {object} companyInfoService - returns the object and provides all the values and methods related to the companyInfo.
 @param {object} LoaderService -  It is service which helps in showing the progress bar.
 @param {object} locationService -  It is service which provides the methods for fetching country, state and city list.
 */
export class interviewActivityReportController {
	/** @ngInject  */
  constructor(analyticsService,GrowlerService,$timeout,AuthService) {  
    _this = this;
    _this.companyId = _this.cid;
    _this.positionId = _this.pid;
    _this.durationId = _this.durationid;
    _this.analyticsService = analyticsService;
    _this.AuthService = AuthService;
    _this.interviewActiviyReportData =[];
    _this.departmentList = [];
    _this.positionList = [];
    _this.GrowlerService = GrowlerService;
    _this.$timeout = $timeout;
    _this.position = {};
    _this.department = {};
    _this.getDepartments();  
    _this.fileDnldType = 'xls';
    _this.dateOptions = {
	    formatYear: 'yy',
	    maxDate: new Date(2020, 5, 22),	    
      startingDay: 1
     };
    _this.fromDatePopup = {
	    opened: false
	  };
    _this.toDatePopup = {
       opened: false
    }
    _this.dateformat = 'MM-dd-yyyy';
    _this.altInputFormats = ['M!/d!/yyyy'];
  }
  
    openFromDatePopup(){
       _this.fromDatePopup.opened = true;
    }
    openToDatePopup(){
      _this.toDatePopup.opened = true;
    }
  
  setInterviewActiviyReport(){
      var reportData = {
            "positionId":_this.position.id,
            "departmentId":_this.department.id,
            "createdFrom":_this.createdFromDate,
            "createdTo":_this.createdToDate,
            "invitedFrom":_this.invitedFromDate,
            "invitedTo":_this.invitedToDate
            }; 
      _this.analyticsService.setInterviewActiviyReportData(reportData);
      _this.analyticsService.activePromise.then((response)=>{
            console.log(response);
            _this.GrowlerService.growl({
                  type: 'success',
                  message: "Data Added Successfully",
                  delay: 2000
              });
            },(error)=>{
                 console.log(error);
            });        
  }
  
  
  getDepartments(){
      let onSuccess = (response) => {
        console.log(response.data);
        _this.departmentList = response.data || [];        
      },
      onError = (error) => {
        console.log(error);
      }
    _this.analyticsService.getDepartments();
    _this.analyticsService.activePromise.then(onSuccess, onError);
  }
  
 
  
  getActivityReport(){
      if(angular.isDefined(_this.reportType) && _this.reportType !== null){
            let query = "";
               if(_this.AuthService.user.userRoles && _this.AuthService.user.userRoles == 7){
                   let companyId = 1;
                   if(angular.isDefined(_this.companyId)
                          && _this.companyId !==''
                          && _this.companyId !==null){
                      companyId = _this.companyId;
                  }
                   query = "/"+companyId+"?";
                   if(companyId === 1){
                       query = query+'isAdmin=1';
                   }
               }else
               {
                  let companyId = _this.AuthService.user.companyId;
                  query = "/"+companyId+"?";
               }

            let onSuccess = (response) => {
              //console.log(response.data);
              _this.activityReport =response.data ||  []; 
              //var blob = new Blob([_this.activityReport], {type: "application/vnd.ms-excel"});
              //var objectUrl =  (window.URL || window.webkitURL).createObjectURL(blob);
              //window.open(objectUrl);
              _this.convertToCSV(_this.activityReport);
            },
            onError = (error) => {
              console.log(error);
            }
            let currentTimestamp = new Date();
            let timeZone = currentTimestamp.toTimeString()
            let config = {
                'reportType' : parseInt(_this.reportType),
                'departmentId' : _this.department.id,
                "searchFrom" : _this.createdFromDate,
                "searchTo"  : _this.createdToDate,
                "timeZone" : timeZone
            }
          _this.analyticsService.getActivityReport(config,query);
          _this.analyticsService.activePromise.then(onSuccess, onError);
          }
          else{
            _this.GrowlerService.growl({
                  type: 'success',
                  message: "Please Select Report Type",
                  delay: 2000
              });
          }
  }
  getFileNameFromHeader(header){
      if (!header) return null;
 
      var result = header.split(";")[1].trim().split("=")[1];
 
      return result.replace(/"/g, '');
  }
  convertToCSV(array){
      if(array){
          let reportName = "Report.csv";
            if(_this.reportType == 1){
              reportName = "Interviews.csv";
            }
            else if(_this.reportType == 2){
                reportName = "Position.csv";
            }
            else if(_this.reportType == 3){
                reportName = "Recruiter.csv";
            }
            else if(_this.reportType == 4){
                reportName = "Department.csv";
            }
            else if(_this.reportType == 5){
                reportName = "Candidate.csv";
            }
//            var keys = Object.keys(array[0]);
//            // Build header
//            var result = keys.join("|") + "\n";
//             // Add the rows
//            array.forEach(function(obj){
//                keys.forEach(function(k, ix){
//                    if (ix) result += "|";
//                    result += obj[k];
//                });
//                result += "\n";
//            });

            _this.$timeout(function(){
                $('#downloadLnk').attr({
                            href: 'data:attachment/csv;charset=utf-8,' + encodeURI(array),
                            target: '_blank',
                            download: reportName
                        })[0].click();
            },0);
      }
      else{
          _this.GrowlerService.growl({
                  type: 'danger',
                  message: "No Data Found",
                  delay: 2000
              });
      }
  }
  
  
}


