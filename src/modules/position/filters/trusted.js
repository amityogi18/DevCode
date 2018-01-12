/*class TrustedFilter {
	constructor(input, $sce) {
		this.input = input;
		this.$sce = $sce;
	}

	parseSrc() {
		return this.$sce.trustAsResourceUrl(this.input);
	}

	static TrustedFilterFactory(input, $sce){
	    let filter = new TrustedFilter(input, $sce);
	    return filter.parseSrc();
 	}
}

TrustedFilter.TrustedFilterFactory.$inject = ['input', '$sce'];

export TrustedFilter.TrustedFilterFactory;*/