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
                    <video id="${stream.id}" controls class="video-player"></video>
                `;

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


// Function to initialize the video player (ASSUMES HLS.JS is loaded)
function initPlayer(videoId, streamUrl) {
    const videoElement = document.getElementById(videoId);

    // --- START: Your Video Player Logic ---

    // **IMPORTANT: Replace this section with the correct setup for your player.**
    // If you are using HLS.js (most likely based on the deployed page):
    if (Hls.isSupported() && streamUrl.endsWith('.m3u8')) {
        const hls = new Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(videoElement);
        // Add more HLS.js configuration here if needed
    } 
    // If it is a standard MP4 or if HLS is supported natively:
    else if (videoElement.canPlayType('application/vnd.apple.mpegurl') || streamUrl.endsWith('.mp4')) {
        videoElement.src = streamUrl;
    } 
    // Handle other formats or show an error
    else {
        console.error('Video format not supported or HLS.js not loaded for stream:', streamUrl);
    }
    
    // --- END: Your Video Player Logic ---
}
