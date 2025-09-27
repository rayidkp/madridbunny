document.addEventListener('DOMContentLoaded', () => {
    // 1. Fetch the list of streams from the JSON file
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const videoListContainer = document.getElementById('video-list');
            
            // 2. Loop through each stream in the list
            data.streams.forEach(stream => {
                
                // 3. Create the HTML elements for each video
                const videoCard = document.createElement('div');
                videoCard.className = 'video-card'; // Add a class for styling
                
                // Create the video tag with the unique ID from the JSON
                videoCard.innerHTML = `
                    <h2>${stream.title}</h2>
                    <p>${stream.desc}</p>
                    <video id="${stream.id}" controls class="video-js vjs-default-skin"

                // Add the new card to the main container
                videoListContainer.appendChild(videoCard);
                
                // 4. Initialize the player for this specific video tag
                initPlayer(stream.id, stream.url);
            });
        })
        .catch(error => {
            console.error('Error loading the streams:', error);
            document.getElementById('video-list').innerHTML = 
                '<p>Error loading content. Please check the console.</p>';
        });
});


// Function to initialize the video player
function initPlayer(videoId, streamUrl) {
    const videoElement = document.getElementById(videoId);

    if (!videoElement) {
        console.error('Video element not found for ID:', videoId);
        return;
    }

    const lowerUrl = streamUrl.toLowerCase();

    // ----------------------------------------------------
    // OPTION A: Handle HLS (.m3u8) streams
    // ----------------------------------------------------
    if (lowerUrl.endsWith('.m3u8')) {
        if (typeof Hls !== 'undefined' && Hls.isSupported()) {
            console.log('Loading HLS stream:', streamUrl);
            const hls = new Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(videoElement);
        } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS playback (Safari, etc.)
            videoElement.src = streamUrl;
        } else {
             console.error('HLS stream not supported or HLS.js not loaded.');
        }
    } 
    // ----------------------------------------------------
    // OPTION B: Handle DASH (.mpd) streams
    // ----------------------------------------------------
    else if (lowerUrl.endsWith('.mpd')) {
        if (typeof dashjs !== 'undefined') {
            console.log('Loading DASH stream:', streamUrl);
            const player = dashjs.MediaPlayer().create();
            player.initialize(videoElement, streamUrl, true); // (videoElement, url, autoPlay)
        } else {
            console.error('DASH stream not supported or DASH.js not loaded.');
        }
    }
    // ----------------------------------------------------
    // OPTION C: Handle standard MP4/WEBM or unsupported formats
    // ----------------------------------------------------
    else {
        // Fallback for standard files like .mp4, or show an error
        videoElement.src = streamUrl; 
        console.warn('Stream format not recognized (.m3u8 or .mpd). Attempting native playback:', streamUrl);
    }
}
// (The rest of your player.js code should remain the same)
