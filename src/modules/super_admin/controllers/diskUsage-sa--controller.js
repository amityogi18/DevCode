export class diskUsageController {
	/** @ngInject  */
  constructor() {

      this.options = { legend: { display: true } };
      this.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
      this.series = ['Series A'];
      this.data = [
        [65, 70, 90, 81, 56, 55, 20]
      ];


  }
}


