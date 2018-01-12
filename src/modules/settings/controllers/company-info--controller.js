let _this = this;
export class CompanyInfoController {
	/** @ngInject  */
  constructor(CompanyInfoService) {
    _this = this;
    _this.CompanyInfoService = CompanyInfoService;
    console.log('Inside CompanyInfo Controller');

  }
}