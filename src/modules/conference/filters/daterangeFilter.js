export default ()=>{
    return (items, startDate, endDate, compareDate) => {
		  var retArray = [];

		  if (!startDate && !endDate) {
		    return items;
		  }
		  console.log('start date:',startDate);
		  console.log('end date:',endDate);
		  console.log('compare date:',compareDate);
		    angular.forEach(items, (obj) => {
		        var receivedDate = compareDate;        
		        if(moment(receivedDate).isAfter(startDate) && moment(receivedDate).isBefore(endDate)) {
		            retArray.push(obj);
		        }
		    });

		    return retArray;
	}
}