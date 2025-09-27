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
                videoCard.className = 'video-card'; // Add a class for your custom styling
                
                // *** IMPORTANT HTML UPDATE ***
                // Note the video-js and vjs-default-skin classes
                videoCard.innerHTML = `
                    <h2>${stream.title}</h2>
                    <p>${stream.desc}</p>
                    <video id="${stream.id}" class="video-js vjs-default-skin" controls preload="auto" width="640" height="300"></video>
                `;

                // Add the new card to the main container
                videoListContainer.appendChild(videoCard);
                
                // 4. Initialize the Video.js player
                initPlayer(stream.id, stream.url);
            });
        })
        .catch(error => {
            console.error('Error loading the streams:', error);
            document.getElementById('video-list').innerHTML = 
                '<p>Error loading content. Please check the console.</p>';
        });
});


// Function to initialize the Video.js player for both HLS and DASH
function initPlayer(videoId, streamUrl) {
    const lowerUrl = streamUrl.toLowerCase();
    let streamType = '';

    if (lowerUrl.endsWith('.m3u8')) {
        streamType = 'application/x-mpegURL'; // HLS MIME Type
    } else if (lowerUrl.endsWith('.mpd')) {
        streamType = 'application/dash+xml'; // DASH MIME Type
    } else {
        streamType = 'video/mp4'; // Fallback for standard video
    }

    // Initialize the Video.js player using its unique ID
    const player = videojs(videoId, {
        // Optional player options can go here (e.g., fluid: true)
    });

    // Load the source dynamically
    player.src({
        src: streamUrl,
        type: streamType
    });

    // Optional: Auto-play the video if the stream is marked as live
    // player.play(); 
    
    console.log(`Video.js initialized for ${streamUrl}`);
}
