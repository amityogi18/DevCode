export class PropsFilter {
	constructor() {

	}

	filterData(items,props){
		var out = [];
		 if (angular.isArray(items)) {
			 var keys = Object.keys(props);

			 items.forEach(function(item) {
				 var itemMatches = false;

				 for (var i = 0; i < keys.length; i++) {
					 var prop = keys[i];
					 var text = props[prop].toLowerCase();
					 if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
						 itemMatches = true;
						 break;
					 }
				 }

				 if (itemMatches) {
					 out.push(item);
				 }
			 });
		 } else {
			 // Let the output be the input untouched
			 out = items;
		 }

		 return out;
	}
	static PropsFilterFactory(items,props){
	    let filter = new PropsFilter();
	    return filter.filterData(items,props);
 	}
}
PropsFilter.PropsFilterFactory.$inject = ['items','props'];
