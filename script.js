let visitorCount = parseInt(localStorage.getItem('visitorCount') || 0);
let totalVideos = parseInt(localStorage.getItem('totalVideos') || 0);
let totalSearchCount = parseInt(localStorage.getItem('totalSearchCount') || 0);
let lastSearchQuery = localStorage.getItem('lastSearchQuery') || 'None';

visitorCount++;
document.getElementById('visitor-count').textContent = visitorCount;
document.getElementById('total-videos').textContent = totalVideos;
document.getElementById('total-search-count').textContent = totalSearchCount;
document.getElementById('last-search').textContent = lastSearchQuery;

localStorage.setItem('visitorCount', visitorCount);

async function searchYouTube() {
  const query = document.getElementById("youtube-search").value.trim();
  if (!query) return alert("Please enter a search term!");

  const apiKey = "YOUR_API_KEY"; // Replace with your actual YouTube API key
  const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=${apiKey}`;

  try {
    totalSearchCount++;
    lastSearchQuery = query;
    document.getElementById('total-search-count').textContent = totalSearchCount;
    document.getElementById('last-search').textContent = lastSearchQuery;

    localStorage.setItem('totalSearchCount', totalSearchCount);
    localStorage.setItem('lastSearchQuery', lastSearchQuery);

    const response = await fetch(apiUrl);
    const data = await response.json();

    const videoList = document.getElementById('video-list');
    videoList.innerHTML = '';

    data.items.forEach(item => {
      const videoItem = document.createElement('li');
      const thumbnail = document.createElement('img');
      thumbnail.src = item.snippet.thumbnails.default.url;
      thumbnail.className = 'thumbnail';

      const title = document.createElement('span');
      title.textContent = item.snippet.title;

      videoItem.appendChild(thumbnail);
      videoItem.appendChild(title);
      videoItem.onclick = () => playVideo(item.id.videoId);

      videoList.appendChild(videoItem);
    });
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    alert("Failed to fetch data. Please try again later.");
  }
}

function playVideo(videoId) {
  const player = document.getElementById('youtube-player');
  player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  totalVideos++;
  document.getElementById('total-videos').textContent = totalVideos;
  localStorage.setItem('totalVideos', totalVideos);
}
