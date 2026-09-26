const API_KEY = "AIzaSyB3oSEcvi7-4xyuUSAN6wTPpv5KdNmtoZ8"; // insert your key

let ytPlayer, currentVideos = [], currentIndex = 0, playerReady = false, progressInterval;

const categoryTitle = document.getElementById("categoryTitle");
const musicList = document.getElementById("musicList");
const searchInput = document.getElementById("searchInput");
const progressBar = document.getElementById("progressBar");
const playPauseBtn = document.getElementById("playPauseBtn");
const timeDisplay = document.getElementById("timeDisplay");

const categories = {
  gym: "best gym workout songs english remix 2024",
  yoga: "calm yoga instrumental meditation music",
  peace: "peaceful relaxing music meditation",
  relief: "stress relief healing meditation sounds",
  sleep: "sleep relaxing music 8D peaceful",
  bollywood: "top trending bollywood hindi songs 2024"
};

const params = new URLSearchParams(window.location.search);
const category = params.get("category") || "music";
categoryTitle.textContent = `🎧 ${category.toUpperCase()} Playlist`;

loadMusic(categories[category]);

// === Fetch YouTube Music List ===
async function loadMusic(query) {
  musicList.innerHTML = "<p>Loading songs...</p>";

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=25&videoDuration=medium&q=${encodeURIComponent(query)}&key=${API_KEY}`
  );
  const data = await response.json();

  currentVideos = data.items.filter(
    v => !v.snippet.title.toLowerCase().includes("shorts") && !v.snippet.title.includes("#shorts")
  );

  if (!currentVideos.length) {
    musicList.innerHTML = "<p>No tracks found 😢</p>";
    return;
  }

  displayMusicList();
}

function displayMusicList() {
  musicList.innerHTML = "";
  currentVideos.forEach((video, i) => {
    const div = document.createElement("div");
    div.className = "music-item";
    div.innerHTML = `
      <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
      <div>
        <h3>${video.snippet.title}</h3>
        <p>${video.snippet.channelTitle}</p>
      </div>
    `;
    div.onclick = () => playTrack(i);
    musicList.appendChild(div);
  });
}

// === Search ===
function searchMusic() {
  const query = searchInput.value.trim();
  if (query) loadMusic(query + " music");
}

// === YouTube API Setup ===
function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player("player", {
    height: "0",
    width: "0",
    playerVars: { autoplay: 1 },
    events: { onReady: onPlayerReady, onStateChange: onPlayerStateChange }
  });
}

function onPlayerReady() {
  playerReady = true;
  document.getElementById("playerControls").style.display = "block";
}

// === Track Control ===
function playTrack(index) {
  currentIndex = index;
  const videoId = currentVideos[index].id.videoId;

  if (playerReady) {
    ytPlayer.loadVideoById(videoId);
    ytPlayer.setVolume(document.getElementById("volume").value);
  }

  document.getElementById("currentTrack").textContent = currentVideos[index].snippet.title;

  if (progressInterval) clearInterval(progressInterval);
  progressInterval = setInterval(updateProgress, 1000);
}

function togglePlay() {
  if (!ytPlayer) return;
  const state = ytPlayer.getPlayerState();

  if (state === 1) {
    ytPlayer.pauseVideo();
    playPauseBtn.textContent = "▶️";
  } else {
    ytPlayer.playVideo();
    playPauseBtn.textContent = "⏸️";
  }
}

function nextTrack() {
  currentIndex = (currentIndex + 1) % currentVideos.length;
  playTrack(currentIndex);
}

function prevTrack() {
  currentIndex = (currentIndex - 1 + currentVideos.length) % currentVideos.length;
  playTrack(currentIndex);
}

function setVolume(v) {
  if (ytPlayer) ytPlayer.setVolume(v);
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) nextTrack();
  if (event.data === YT.PlayerState.PLAYING) playPauseBtn.textContent = "⏸️";
  if (event.data === YT.PlayerState.PAUSED) playPauseBtn.textContent = "▶️";
}

function updateProgress() {
  if (!ytPlayer || ytPlayer.getDuration() === 0) return;

  const current = ytPlayer.getCurrentTime();
  const total = ytPlayer.getDuration();
  const percent = (current / total) * 100;
  progressBar.value = percent;

  timeDisplay.textContent = `${formatTime(current)} / ${formatTime(total)}`;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" + s : s}`;
}

// === Seek on progress bar change ===
progressBar.addEventListener("input", () => {
  if (!ytPlayer) return;
  const duration = ytPlayer.getDuration();
  ytPlayer.seekTo((progressBar.value / 100) * duration);
});
