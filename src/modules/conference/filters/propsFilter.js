export default ()=>{
   return (items,props) => {
		let out = [];
		if (Array.isArray(items)) {
			let keys = Object.keys(props);

			items.forEach((item) => {
				let itemMatches = false;

				for (var i = 0; i < keys.length; i++) {
					let prop = keys[i];
					let text = props[prop].toLowerCase();
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
			out = items;
		}
		return out;
	}
}