function playVideo() {
  const url = document.getElementById('videoUrl').value.trim();
  const video = document.getElementById('myVideo');
  video.pause();
  video.src = '';

  if (url.endsWith('.m3u8')) {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.addEventListener('loadedmetadata', () => video.play());
    } else {
      alert('HLS not supported in this browser!');
    }
  } else if (url.endsWith('.mpd')) {
    const player = dashjs.MediaPlayer().create();
    player.initialize(video, url, true);
    player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => video.play());
  } else {
    video.src = url;
    video.addEventListener('canplay', () => video.play());
  }
}
