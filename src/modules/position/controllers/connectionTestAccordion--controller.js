const imageAddr = 'http://www.kenrockwell.com/contax/images/g2/examples/31120037-5mb.jpg';
const downloadSize = 4995374;
export class connectionTestAccordionController {
	/** @ngInject  */
  constructor($scope) {
      console.log('this is connection test');
      this.acceptedSpeed = 0.5;
      this.measureConnectionSpeed();
      this.speed = 'Calculating';
      this.$scope = $scope;
  }

  measureConnectionSpeed() {
    let startTime, endTime;
    let download = new Image();
    startTime = (new Date()).getTime();
    download.onload = ()=> {
        console.log('download complete');
        endTime = (new Date()).getTime();
        this.calculateSpeed(startTime, endTime);
    }

    download.onerror = function (err, msg) {
        console.log("Invalid image, or error downloading");
    }

    var cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr + cacheBuster;
    console.log('image address set');
  }

  calculateSpeed(startTime, endTime) {
      console.log('calculate speed');
      let duration = (endTime - startTime) / 1000;
      let bitsLoaded = downloadSize * 8;
      let speedBps = (bitsLoaded / duration).toFixed(2);
      let speedKbps = (speedBps / 1024).toFixed(2);
      let speedMbps = (speedKbps / 1024).toFixed(2);
      this.speed = speedMbps;
      this.connectionStatus = (this.speed >= this.acceptedSpeed) ? 'Fine' : 'Bad';
      this.$scope.$apply();
  }
}


