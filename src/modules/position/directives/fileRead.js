function linkFunc($injector){
	return function(scope,element,attr){
		element.on('change',(e) => {
			console.log(e);
			let fsReader = new FileReader();

			fsReader.onload = function(evt){
				scope.$apply(() =>{
					let data = evt.target.result;
					let workbook = XLSX.read(data, {type: 'binary'});
					let headers = XLSX.utils.sheet_to_json( workbook.Sheets[workbook.SheetNames[0]], { header: 1 })[0];
					let xlData = XLSX.utils.sheet_to_json( workbook.Sheets[workbook.SheetNames[0]]);

					scope.griddata.push(...xlData);
					scope.ngtableparams.reload();
				});
			}

			fsReader.readAsBinaryString(e.target.files[0]);
		});
	}
}

class FileReadDirective {
	constructor($injector){
		this.$injector = $injector;
		this._instantiateDDO();
	}

	_instantiateDDO(){
		this.restrict = 'A';
		this.scope = {
			griddata:'=',
			ngtableparams:'='
		}
		this.link = linkFunc(this.$injector);
	}
}

fileread.$inject = ['$injector'];

export function fileread($injector){
	return new FileReadDirective($injector);
}