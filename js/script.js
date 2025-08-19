const RADIO_NAME = "Afrofusion Rap"

// Change Stream URL Here, Supports, ICECAST, ZENO, SHOUTCAST, RADIOJAR ETC.... DOES NOT SUPPORT HLS
const URL_STREAMING = "https://play.streamafrica.net/afrofusionrap"

// NEW UNIFIED API ENDPOINT
const API_URL = "https://prod-api.radioapi.me/metadata/92f09a6d-37f1-4c10-bf2a-018bf03136fc"

// Loading state management
let isInitialLoad = true
let isDataLoaded = false

// Store current song data to prevent unnecessary updates
const currentSongData = {
  song: "",
  artist: "",
}


window.onload = () => {


  var page = new Page()
  page.changeTitlePage()
  page.setVolume()

  var player = new Player()
  player.play()

  // Initialize history items
  initializeHistoryItems()

  // Initial data fetch
  getStreamingData()

  // Interval to get streaming data in milliseconds
  setInterval(() => {
    getStreamingData()
  }, 10000)
}



// Loading state helpers
function showArtworkLoading() {
  const artwork = document.getElementById("currentCoverArt")
  if (artwork) {
    artwork.classList.add("loading")
  }
}

function hideArtworkLoading() {
  const artwork = document.getElementById("currentCoverArt")
  if (artwork) {
    artwork.classList.remove("loading")
  }
}

function showButtonLoading() {
  const button = document.querySelector(".btn-play")
  if (button) {
    button.classList.add("loading")
  }
}

function hideButtonLoading() {
  const button = document.querySelector(".btn-play")
  if (button) {
    button.classList.remove("loading")
  }
}

function showLyricsLoading() {
  const lyrics = document.querySelector(".lyrics")
  if (lyrics) {
    lyrics.classList.add("loading")
  }
}

function hideLyricsLoading() {
  const lyrics = document.querySelector(".lyrics")
  if (lyrics) {
    lyrics.classList.remove("loading")
  }
}

function showHistoryLoading() {
  const covers = document.querySelectorAll(".cover-historic")
  covers.forEach((cover) => {
    cover.classList.add("loading")
  })
}

function hideHistoryLoading() {
  const covers = document.querySelectorAll(".cover-historic")
  covers.forEach((cover) => {
    cover.classList.remove("loading")
  })
}

// DOM control
function Page() {
  this.changeTitlePage = (title = RADIO_NAME) => {
    document.title = title
  }

  this.refreshCurrentSong = (song, artist) => {
    var currentSong = document.getElementById("currentSong")
    var currentArtist = document.getElementById("currentArtist")

    if (currentSong && currentArtist) {
      // Remove skeleton loading
      const songSkeleton = currentSong.querySelector(".song-skeleton")
      const artistSkeleton = currentArtist.querySelector(".artist-skeleton")

      if (songSkeleton) songSkeleton.remove()
      if (artistSkeleton) artistSkeleton.remove()

      // Animate transition
      currentSong.className = "animated flipInY current-song"
      currentSong.innerHTML = song

      currentArtist.className = "animated flipInY current-artist"
      currentArtist.innerHTML = artist

      // Refresh modal title
      const lyricsSong = document.getElementById("lyricsSong")
      if (lyricsSong) {
        lyricsSong.innerHTML = song + " - " + artist
      }

      // Remove animation classes
      setTimeout(() => {
        currentSong.className = "current-song"
        currentArtist.className = "current-artist"
      }, 2000)
    }
  }

  this.refreshHistoric = (info, n) => {
    var $historicDiv = document.querySelectorAll("#modalHistory .history-item")
    var $songName = document.querySelectorAll("#modalHistory .history-item .music-info .song")
    var $artistName = document.querySelectorAll("#modalHistory .history-item .music-info .artist")

    // Show loading for this specific item
    if ($historicDiv[n]) {
      const cover = $historicDiv[n].querySelector(".cover-historic")
      if (cover) cover.classList.add("loading")
    }

    // Use artwork directly from API if available
    if (info.artwork && $historicDiv[n]) {
      const cover = $historicDiv[n].querySelector(".cover-historic")
      if (cover) {
        cover.style.backgroundImage = "url(" + info.artwork + ")"
        cover.classList.remove("loading")
      }
    }

    // Formating characters to UTF-8
    var music = info.song.replace(/&apos;/g, "'")
    var songHist = music.replace(/&amp;/g, "&")

    var artist = info.artist.replace(/&apos;/g, "'")
    var artistHist = artist.replace(/&amp;/g, "&")

    // Remove skeleton loading
    if ($songName[n]) {
      const songSkeleton = $songName[n].querySelector(".history-song-skeleton")
      if (songSkeleton) songSkeleton.remove()
      $songName[n].innerHTML = songHist
    }

    if ($artistName[n]) {
      const artistSkeleton = $artistName[n].querySelector(".history-artist-skeleton")
      if (artistSkeleton) artistSkeleton.remove()
      $artistName[n].innerHTML = artistHist
    }

    // Add class for animation
    if ($historicDiv[n]) {
      $historicDiv[n].classList.add("animated")
      $historicDiv[n].classList.add("slideInRight")
    }

    setTimeout(() => {
      for (var j = 0; j < 5; j++) {
        if ($historicDiv[j]) {
          $historicDiv[j].classList.remove("animated")
          $historicDiv[j].classList.remove("slideInRight")
        }
      }
    }, 2000)
  }

  this.refreshCover = (artworkUrl, song, artist) => {
    // Show artwork loading
    showArtworkLoading()

    var coverArt = document.getElementById("currentCoverArt")
    var coverBackground = document.getElementById("bgCover")

    if (artworkUrl && coverArt) {
      coverArt.style.backgroundImage = "url(" + artworkUrl + ")"
      coverArt.className = "animated bounceInLeft"

      if (coverBackground) {
        coverBackground.style.backgroundImage = "url(" + artworkUrl + ")"
      }

      // Hide artwork loading
      setTimeout(() => {
        hideArtworkLoading()
        coverArt.className = ""
      }, 2000)

      // Update media session
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: song,
          artist: artist,
          artwork: [
            {
              src: artworkUrl,
              sizes: "96x96",
              type: "image/png",
            },
            {
              src: artworkUrl,
              sizes: "128x128",
              type: "image/png",
            },
            {
              src: artworkUrl,
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: artworkUrl,
              sizes: "256x256",
              type: "image/png",
            },
            {
              src: artworkUrl,
              sizes: "384x384",
              type: "image/png",
            },
            {
              src: artworkUrl,
              sizes: "512x512",
              type: "image/png",
            },
          ],
        })
      }
    } else {
      // Hide loading even if no artwork
      hideArtworkLoading()
    }
  }

  this.changeVolumeIndicator = (volume) => {
    const volIndicator = document.getElementById("volIndicator")
    if (volIndicator) {
      volIndicator.innerHTML = volume
    }

    if (typeof Storage !== "undefined") {
      localStorage.setItem("volume", volume)
    }
  }

  this.setVolume = () => {
    if (typeof Storage !== "undefined") {
      var volumeLocalStorage = !localStorage.getItem("volume") ? 80 : localStorage.getItem("volume")
      const volumeSlider = document.getElementById("volume")
      const volIndicator = document.getElementById("volIndicator")

      if (volumeSlider) {
        volumeSlider.value = volumeLocalStorage
      }
      if (volIndicator) {
        volIndicator.innerHTML = volumeLocalStorage
      }
    }
  }

  this.refreshLyric = (lyrics) => {
    // Show lyrics loading
    showLyricsLoading()

    var openLyric = document.getElementsByClassName("lyrics")[0]

    // Hide lyrics loading
    setTimeout(() => {
      hideLyricsLoading()
    }, 500)

    if (lyrics && lyrics.trim() !== "") {
      // Remove skeleton loading from modal
      const lyricsLoading = document.querySelector(".lyrics-loading")
      if (lyricsLoading) lyricsLoading.style.display = "none"

      const lyricElement = document.getElementById("lyric")
      if (lyricElement) {
        lyricElement.innerHTML = lyrics.replace(/\n/g, "<br />")
      }

      if (openLyric) {
        openLyric.style.opacity = "1"
        openLyric.setAttribute("data-toggle", "modal")
      }
    } else {
      if (openLyric) {
        openLyric.style.opacity = "0.3"
        openLyric.removeAttribute("data-toggle")
      }

      var modalLyric = document.getElementById("modalLyrics")
      if (modalLyric) {
        modalLyric.style.display = "none"
        modalLyric.setAttribute("aria-hidden", "true")
      }

      const backdrop = document.getElementsByClassName("modal-backdrop")[0]
      if (backdrop) {
        backdrop.remove()
      }
    }
  }
}

var audio = new Audio(URL_STREAMING)

// Player control
function Player() {
  this.play = () => {
    // Show button loading
    showButtonLoading()

    audio.play()

    const volumeSlider = document.getElementById("volume")
    var defaultVolume = volumeSlider ? volumeSlider.value : 80

    if (typeof Storage !== "undefined") {
      if (localStorage.getItem("volume") !== null) {
        audio.volume = intToDecimal(localStorage.getItem("volume"))
      } else {
        audio.volume = intToDecimal(defaultVolume)
      }
    } else {
      audio.volume = intToDecimal(defaultVolume)
    }

    const volIndicator = document.getElementById("volIndicator")
    if (volIndicator) {
      volIndicator.innerHTML = defaultVolume
    }

    // Hide button loading after a short delay
    setTimeout(() => {
      hideButtonLoading()
    }, 1000)
  }

  this.pause = () => {
    audio.pause()
  }
}

// On play, change the button to pause
audio.onplay = () => {
  var botao = document.getElementById("playerButton")
  var bplay = document.getElementById("buttonPlay")
  if (botao && botao.className === "fa fa-play") {
    botao.className = "fa fa-pause"
    if (bplay) bplay.innerHTML = "PAUSE"
  }
  hideButtonLoading()
}

// On pause, change the button to play
audio.onpause = () => {
  var botao = document.getElementById("playerButton")
  var bplay = document.getElementById("buttonPlay")
  if (botao && botao.className === "fa fa-pause") {
    botao.className = "fa fa-play"
    if (bplay) bplay.innerHTML = "PLAY"
  }
  hideButtonLoading()
}

// Unmute when volume changed
audio.onvolumechange = () => {
  if (audio.volume > 0) {
    audio.muted = false
  }
}

audio.onerror = () => {
  hideButtonLoading()
  hideArtworkLoading()
  var confirmacao = confirm("Stream Down / Network Error. \nClick OK to try again.")

  if (confirmacao) {
    window.location.reload()
  }
}

// Volume control
const volumeSlider = document.getElementById("volume")
if (volumeSlider) {
  volumeSlider.oninput = function () {
    audio.volume = intToDecimal(this.value)

    var page = new Page()
    page.changeVolumeIndicator(this.value)
  }
}

function togglePlay() {
  if (!audio.paused) {
    audio.pause()
  } else {
    showButtonLoading()
    audio.load()
    audio.play()
  }
}

function volumeUp() {
  var vol = audio.volume
  if (audio) {
    if (audio.volume >= 0 && audio.volume < 1) {
      audio.volume = (vol + 0.01).toFixed(2)
    }
  }
}

function volumeDown() {
  var vol = audio.volume
  if (audio) {
    if (audio.volume >= 0.01 && audio.volume <= 1) {
      audio.volume = (vol - 0.01).toFixed(2)
    }
  }
}

function mute() {
  const volIndicator = document.getElementById("volIndicator")
  const volumeSlider = document.getElementById("volume")

  if (!audio.muted) {
    if (volIndicator) volIndicator.innerHTML = 0
    if (volumeSlider) volumeSlider.value = 0
    audio.volume = 0
    audio.muted = true
  } else {
    var localVolume = localStorage.getItem("volume") || 80
    if (volIndicator) volIndicator.innerHTML = localVolume
    if (volumeSlider) volumeSlider.value = localVolume
    audio.volume = intToDecimal(localVolume)
    audio.muted = false
  }
}

function getStreamingData() {
  var xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      if (this.response.length === 0) {
        console.log("%cdebug", "font-size: 22px")
        return
      }

      try {
        var data = JSON.parse(this.responseText)
        console.log("Received data:", data)

        var page = new Page()

        // Extract current song info from unified API
        const song = data.song || ""
        const artist = data.artist || ""

        // Change the title
        document.title = song + " - " + artist + " | " + RADIO_NAME

        // Compare with stored data instead of innerHTML to prevent unnecessary updates
        if (currentSongData.song !== song || currentSongData.artist !== artist) {
          // Update stored data
          currentSongData.song = song
          currentSongData.artist = artist

          // Update current song info
          page.refreshCurrentSong(song, artist)

          // Update artwork using the direct URL from API
          if (data.artwork) {
            page.refreshCover(data.artwork, song, artist)
          }

          // Update lyrics
          page.refreshLyric(data.lyrics || "")

          // Update history if available
          if (data.history && data.history.length > 0) {
            for (var i = 0; i < Math.min(5, data.history.length); i++) {
              page.refreshHistoric(data.history[i], i)
            }
          }
        }

        isDataLoaded = true
      } catch (error) {
        console.error("Error parsing API response:", error)
      }
    }
  }

  // Make the API request
  xhttp.open("GET", API_URL)
  xhttp.send()
}

// Player control by keys
document.addEventListener("keydown", (event) => {
  var key = event.keyCode || event.which

  var slideVolume = document.getElementById("volume")
  var page = new Page()

  switch (key) {
    // Arrow up
    case 38:
      volumeUp()
      if (slideVolume) slideVolume.value = decimalToInt(audio.volume)
      page.changeVolumeIndicator(decimalToInt(audio.volume))
      break
    // Arrow down
    case 40:
      volumeDown()
      if (slideVolume) slideVolume.value = decimalToInt(audio.volume)
      page.changeVolumeIndicator(decimalToInt(audio.volume))
      break
    // Spacebar
    case 32:
      togglePlay()
      break
    // P
    case 80:
      togglePlay()
      break
    // M
    case 77:
      mute()
      break
    // 0
    case 48:
      audio.volume = 0
      if (slideVolume) slideVolume.value = 0
      page.changeVolumeIndicator(0)
      break
    // 0 numeric keyboard
    case 96:
      audio.volume = 0
      if (slideVolume) slideVolume.value = 0
      page.changeVolumeIndicator(0)
      break
    // 1
    case 49:
      audio.volume = 0.1
      if (slideVolume) slideVolume.value = 10
      page.changeVolumeIndicator(10)
      break
    // 1 numeric key
    case 97:
      audio.volume = 0.1
      if (slideVolume) slideVolume.value = 10
      page.changeVolumeIndicator(10)
      break
    // 2
    case 50:
      audio.volume = 0.2
      if (slideVolume) slideVolume.value = 20
      page.changeVolumeIndicator(20)
      break
    // 2 numeric key
    case 98:
      audio.volume = 0.2
      if (slideVolume) slideVolume.value = 20
      page.changeVolumeIndicator(20)
      break
    // 3
    case 51:
      audio.volume = 0.3
      if (slideVolume) slideVolume.value = 30
      page.changeVolumeIndicator(30)
      break
    // 3 numeric key
    case 99:
      audio.volume = 0.3
      if (slideVolume) slideVolume.value = 30
      page.changeVolumeIndicator(30)
      break
    // 4
    case 52:
      audio.volume = 0.4
      if (slideVolume) slideVolume.value = 40
      page.changeVolumeIndicator(40)
      break
    // 4 numeric key
    case 100:
      audio.volume = 0.4
      if (slideVolume) slideVolume.value = 40
      page.changeVolumeIndicator(40)
      break
    // 5
    case 53:
      audio.volume = 0.5
      if (slideVolume) slideVolume.value = 50
      page.changeVolumeIndicator(50)
      break
    // 5 numeric key
    case 101:
      audio.volume = 0.5
      if (slideVolume) slideVolume.value = 50
      page.changeVolumeIndicator(50)
      break
    // 6
    case 54:
      audio.volume = 0.6
      if (slideVolume) slideVolume.value = 60
      page.changeVolumeIndicator(60)
      break
    // 6 numeric key
    case 102:
      audio.volume = 0.6
      if (slideVolume) slideVolume.value = 60
      page.changeVolumeIndicator(60)
      break
    // 7
    case 55:
      audio.volume = 0.7
      if (slideVolume) slideVolume.value = 70
      page.changeVolumeIndicator(70)
      break
    // 7 numeric key
    case 103:
      audio.volume = 0.7
      if (slideVolume) slideVolume.value = 70
      page.changeVolumeIndicator(70)
      break
    // 8
    case 56:
      audio.volume = 0.8
      if (slideVolume) slideVolume.value = 80
      page.changeVolumeIndicator(80)
      break
    // 8 numeric key
    case 104:
      audio.volume = 0.8
      if (slideVolume) slideVolume.value = 80
      page.changeVolumeIndicator(80)
      break
    // 9
    case 57:
      audio.volume = 0.9
      if (slideVolume) slideVolume.value = 90
      page.changeVolumeIndicator(90)
      break
    // 9 numeric key
    case 105:
      audio.volume = 0.9
      if (slideVolume) slideVolume.value = 90
      page.changeVolumeIndicator(90)
      break
  }
})

function intToDecimal(vol) {
  return vol / 100
}

function decimalToInt(vol) {
  return vol * 100
}

// Initialize history items dynamically
function initializeHistoryItems() {
  const historyContainer = document.getElementById("historicSong")
  const HISTORY_ITEMS_COUNT = 5

  if (historyContainer) {
    // Clear any existing items
    historyContainer.innerHTML = ""

    // Generate history items
    for (let i = 0; i < HISTORY_ITEMS_COUNT; i++) {
      const historyItem = document.createElement("article")
      historyItem.className = "history-item"

      historyItem.innerHTML = `
        <div class="cover-historic">
          <div class="cover-loading-spinner"></div>
        </div>
        <div class="music-info">
          <div class="song">
            <span class="history-song-skeleton">Loading song...</span>
          </div>
          <div class="artist">
            <span class="history-artist-skeleton">Loading artist...</span>
          </div>
        </div>
      `

      historyContainer.appendChild(historyItem)
    }
  }
}
