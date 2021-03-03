var AudioContext = window.AudioContext || window.webkitAudioContext; // cross browser compatibility
var audioContext;
var masterGain;
var analyser;

const playNote = (frequency, duration) => {
  audioContext = new AudioContext();
  analyser = new AnalyserNode(audioContext, {
    fftSize: Math.pow(2, 13),
  });
  masterGain = audioContext.createGain();
  masterGain.connect(audioContext.destination);
  masterGain.gain.setValueAtTime(0.3, audioContext.currentTime);
  masterGain.connect(analyser);

  var merger = audioContext.createChannelMerger(3);
  merger.connect(audioContext.destination);

  var oscillatorNode1 = new OscillatorNode(audioContext, {
    frequency: frequency,
    detune: 100,
    type: "triangle",
  });
  var oscillatorNode2 = new OscillatorNode(audioContext, {
    frequency: frequency * 0.25,
    detune: 100,
    type: "sine",
  });
  var oscillatorNode3 = new OscillatorNode(audioContext, {
    frequency: frequency * 2,
    detune: 100,
    type: "square",
  });
  var gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    1,
    audioContext.currentTime + 0.05
  );
  gainNode.gain.exponentialRampToValueAtTime(
    0.05,
    audioContext.currentTime + duration
  );
  oscillatorNode1.start(audioContext.currentTime);
  oscillatorNode2.start(audioContext.currentTime);
  oscillatorNode3.start(audioContext.currentTime);
  oscillatorNode1.stop(audioContext.currentTime + duration);
  oscillatorNode2.stop(audioContext.currentTime + duration);
  oscillatorNode3.stop(audioContext.currentTime + duration);
  oscillatorNode1.connect(gainNode);
  oscillatorNode2.connect(gainNode);
  oscillatorNode3.connect(gainNode);
  gainNode.connect(masterGain);
};

const drawAnalyser = (canvas, canvasContext) => {
  if (analyser) {
    let dataArray = new Uint8Array(analyser.fftSize);
    let bufferLength = analyser.fftSize;
    analyser.getByteTimeDomainData(dataArray);

    canvasContext.lineWidth = 1;
    canvasContext.beginPath();
    let sliceWidth = (canvas.width * 1) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0;
      let y = (v * canvas.height) / 2;

      if (i === 0) {
        canvasContext.moveTo(x, y);
      } else {
        canvasContext.lineTo(x, y);
      }

      x += sliceWidth;
    }
    canvasContext.stroke();
  }
};

// octave 4
const NOTES = {
  C: 261.63,
  Db: 277.18,
  D: 293.66,
  Eb: 311.13,
  E: 329.63,
  F: 349.23,
  Gb: 369.99,
  G: 392.0,
  Ab: 415.3,
  A: 440.0,
  Bb: 466.16,
  B: 493.88,
};
export { playNote, drawAnalyser, NOTES };
