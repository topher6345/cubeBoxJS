export default function fetchBuffer(
  filename: string,
  audioContext: AudioContext
) {
  let soundSource, concertHallBuffer;

  const ajaxRequest = new XMLHttpRequest();
  ajaxRequest.open("GET", filename, true);
  ajaxRequest.responseType = "arraybuffer";

  ajaxRequest.onload = function() {
    const audioData = ajaxRequest.response;
    audioContext.decodeAudioData(
      audioData,
      function(buffer) {
        concertHallBuffer = buffer;
        soundSource = audioContext.createBufferSource();
        soundSource.buffer = concertHallBuffer;
      },
      function(e) {
        console.log(e);
      }
    );
  };

  ajaxRequest.send();

  return concertHallBuffer;
}
