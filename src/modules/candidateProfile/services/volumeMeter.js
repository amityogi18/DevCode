
export class volumeMeterService {
	/** @ngInject  */
  constructor() {
  }

  createAudioMeter(audioContext, clipLevel = 0.70, averaging = 0.95, clipLag = 750) {
    let processor = audioContext.createScriptProcessor(512);
    processor.onaudioprocess = this.volumeAudioProcess;
    processor.clipping = false;
    processor.lastClip = 0;
    processor.volume = 0;
    processor.clipLevel = clipLevel;
    processor.averaging = averaging;
    processor.clipLag = clipLag;

    // this will have no effect, since we don't copy the input to the output,
    // but works around a current Chrome bug.
    processor.connect(audioContext.destination);

    processor.shutdown = ()=> {
      this.disconnect();
      this.onaudioprocess = null;
    };

    processor.getVolumeLevel = ()=> {
      return processor.volume;
    };

    return processor;
  }

  volumeAudioProcess( event ) {
    let buf = event.inputBuffer.getChannelData(0);
    let bufLength = buf.length;
    let sum = 0;
    let x;

    // Do a root-mean-square on the samples: sum up the squares...
    for (let i=0; i<bufLength; i++) {
      x = buf[i];
      if (Math.abs(x)>=this.clipLevel) {
        this.clipping = true;
        this.lastClip = window.performance.now();
      }
      sum += x * x;
    }

    // ... then take the square root of the sum.
    let rms =  Math.sqrt(sum / bufLength);

    // Now smooth this out with the averaging factor applied
    // to the previous sample - take the max here because we
    // want "fast attack, slow release."
    this.volume = Math.max(rms, this.volume*this.averaging);
}

}

