export class cpuUsageController {
	/** @ngInject  */
  constructor() {
    this.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    this.series = ['Series A', 'Series B'];
    this.data = [
      [80, 60, 80, 85, 56, 55, 30],
      [20, 10, 15, 19, 86, 20, 90]
    ];
    this.onClick = function (points, evt) {
      console.log(points, evt);
    };
    this.onHover = function (points) {
      if (points.length > 0) {
        console.log('Point', points[0].value);
      } else {
        console.log('No point');
      }
    };
    this.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];

    this.options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
          },
          {
            id: 'y-axis-2',
            type: 'linear',
            display: true,
            position: 'right'
          }
        ]
      }
    };


  }
}


