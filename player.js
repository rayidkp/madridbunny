document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const videoListContainer = document.getElementById('video-list');
            
            data.streams.forEach(stream => {
                
                const videoCard = document.createElement('div');
                videoCard.className = 'video-card'; 
                
                // Use the IFRAME tag to embed the external working player
                videoCard.innerHTML = `
                    <h2>${stream.title}</h2>
                    <p>${stream.desc}</p>
                    <iframe 
                        src="${stream.url}" 
                        width="640" 
                        height="300" 
                        allowfullscreen
                        frameborder="0">
                    </iframe>
                `;

                videoListContainer.appendChild(videoCard);
            });
        })
        .catch(error => {
            console.error('Error loading the streams:', error);
            document.getElementById('video-list').innerHTML = 
                '<p>Error loading content. Please check the console.</p>';
        });
});
