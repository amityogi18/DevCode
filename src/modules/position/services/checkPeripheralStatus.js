
export class checkPeripheralStatusService {
	/** @ngInject  */
  constructor() {
  }

  isInternetConnected() {
    return navigator.onLine;
  }

  isVideoDetected(cb) {
    let isWebcamavailable = false;
    navigator.getUserMedia({video:true}, function() { cb(true);}, function() { cb(false);})
    return isWebcamavailable;
  }

  isAudioDetected(cb) {
    let isMicAvailable = false;
    navigator.getUserMedia({audio:true}, function() { cb(true);}, function() { cb(false);})
    return isMicAvailable;
  }

}

