const CONFIG = Object.freeze({
  // ── Stream ──────────────────────────────────────────────────────────
  STREAM_URL:       'https://play.streamafrica.net/rap',
  API_URL:          'https://api.streamafrica.net/metadata/92f09a6d-37f1-4c10-bf2a-018bf03136fc',

  // ── Branding / fallbacks ─────────────────────────────────────────────────────
  STATION_NAME:     'RAP',
  FALLBACK_TRACK:   'Live Broadcast',
  FALLBACK_ARTIST:  'RAP',
  FALLBACK_BITRATE: '128',
  FALLBACK_FORMAT:  'MP3',
  FALLBACK_ARTWORK: 'https://ik.imagekit.io/boxradio/r2/radios/01KGQFV8ZWSG9BJFVSW9TWHKFW.png',

  // ── Player UI labels ───────────────────────────────────────────────────────────────
  LABEL_PLAY:       'PLAY',
  LABEL_STOP:       'STOP',

  // ── Audio ────────────────────────────────────────────────────────────────────
  DEFAULT_VOLUME:   0.8,   // 0.0 – 1.0

  // ── Timings ──────────────────────────────────────────────────────────────────
  META_INTERVAL_MS:     15_000,
  PROGRESS_INTERVAL_MS:  1_000,
  FETCH_TIMEOUT_MS:      8_000,

  // ── UI behaviour ─────────────────────────────────────────────────────────────
  HISTORY_COMPACT_COUNT: 3,    // tracks shown in the main view
  COLOR_BRIGHTNESS_THRESHOLD: 125, // YIQ threshold for btn text contrast

  // ── Image proxy ─────────────────────────────────────────────────────────────────
  IMG_PROXY: 'https://wsrv.nl/',
});

const PlayerState = Object.freeze({
  IDLE:    'IDLE',
  PLAYING: 'PLAYING',
  PAUSED:  'PAUSED',
  ERROR:   'ERROR',
});

const state = {
  player:       PlayerState.IDLE,
  track:        { duration: 0, elapsed: 0, syncedAt: 0 },
  history:      [],
  streamLoaded: false,
};

const $ = (id) => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing DOM element: #${id}`);
  return el;
};

const DOM = {
  playIcon:       $('play-icon'),
  playText:       $('play-text'),
  liveDot:        $('live-dot'),
  visualizer:     $('visualizer'),
  mainArtwork:    $('main-artwork'),
  masterBtn:      $('master-play-btn'),
  metaLoader:     $('metadata-loader'),
  trackName:      $('track-name'),
  artistName:     $('artist-name'),
  artBitrate:     $('art-bitrate'),
  artFormat:      $('art-format'),
  artYear:        $('art-year'),
  progressShadow: $('progress-shadow'),
  progressText:   $('progress-text'),
  lyricsToggle:   $('btn-lyrics-toggle'),
  lyricsBody:     $('lyrics-body'),
  historyList:    $('history-list'),
  fullHistoryList:$('full-history-list'),
  historyPanel:   $('history-panel'),
  lyricsPanel:    $('lyrics-panel'),
  blurBg:         $('blur-bg'),
  volume:         $('volume'),
  clock:          $('clock'),
};

const masterBtnContainer = DOM.masterBtn.parentElement;

const audio = new Audio();
audio.preload = 'none';
audio.volume  = CONFIG.DEFAULT_VOLUME;

const formatTime = (secs) => {
  const total = Math.max(0, Math.floor(secs));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const proxyImg = (url, w, h) =>
    `${CONFIG.IMG_PROXY}?url=${encodeURIComponent(url)}&w=${w}&h=${h}&fit=cover&output=webp`;

const setText = (el, text) => { el.textContent = text; };

const toggleClasses = (el, condition, trueClasses, falseClasses) => {
  el.classList.remove(...(condition ? falseClasses : trueClasses));
  el.classList.add(...(condition ? trueClasses : falseClasses));
};

async function fetchWithTimeout(url, timeoutMs = CONFIG.FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

const colorThief = new ColorThief();

DOM.mainArtwork.addEventListener('load', () => {
  try {
    const [r, g, b] = colorThief.getColor(DOM.mainArtwork);
    masterBtnContainer.style.backgroundColor = `rgb(${r},${g},${b})`;
    DOM.progressShadow.style.backgroundColor = `rgba(${Math.floor(r*0.4)},${Math.floor(g*0.4)},${Math.floor(b*0.4)},0.35)`;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    DOM.masterBtn.style.color = brightness > CONFIG.COLOR_BRIGHTNESS_THRESHOLD ? '#000' : '#fff';
  } catch {
    masterBtnContainer.style.backgroundColor = '#ffffff';
    DOM.progressShadow.style.backgroundColor = 'rgba(0,0,0,0.1)';
    DOM.masterBtn.style.color = '#000';
  }
});

let progressIntervalId = null;

function startProgressLoop() {
  stopProgressLoop();
  progressIntervalId = setInterval(() => {
    const { duration, elapsed, syncedAt } = state.track;
    if (duration <= 0) return;

    const current = elapsed + (Date.now() - syncedAt) / 1000;
    const pct     = Math.min((current / duration) * 100, 100);

    DOM.progressShadow.style.width = `${pct}%`;
    setText(
        DOM.progressText,
        `${formatTime(current)} // ${formatTime(duration - current)} LEFT`,
    );
  }, CONFIG.PROGRESS_INTERVAL_MS);
}

function stopProgressLoop() {
  if (progressIntervalId !== null) {
    clearInterval(progressIntervalId);
    progressIntervalId = null;
  }
}

function buildHistoryItem(item, idx, mode) {
  const wrap = document.createElement('div');

  if (mode === 'compact') {
    wrap.className = 'flex items-center justify-between text-[11px] border-b border-zinc-900 pb-3';

    const inner = document.createElement('div');
    inner.className = 'min-w-0 flex-1 pr-4';

    const song = document.createElement('span');
    song.className = 'font-bold text-zinc-300 block truncate uppercase line-clamp-2';
    setText(song, item.song);

    const artist = document.createElement('span');
    artist.className = 'mono text-[9px] text-zinc-600 uppercase block line-clamp-1';
    setText(artist, item.artist);

    inner.append(song, artist);
    wrap.append(inner);
  } else {
    wrap.className = 'flex gap-5 items-start border-b border-zinc-900/50 pb-6 group';

    const num = document.createElement('div');
    num.className = 'mono text-[10px] text-zinc-800 pt-1 shrink-0';
    setText(num, String(idx).padStart(2, '0'));

    const img = document.createElement('img');
    img.src       = proxyImg(item.artwork || CONFIG.FALLBACK_ARTWORK, 150, 150);
    img.className = 'w-16 h-16 object-cover border border-zinc-800 shrink-0';
    img.alt       = item.song;
    img.crossOrigin = 'anonymous';

    const info = document.createElement('div');
    info.className = 'min-w-0 flex-1';

    const time = document.createElement('p');
    time.className = 'text-zinc-600 mono text-[9px] uppercase tracking-tighter mb-1';
    setText(time, item.relative_time || 'LOGGED');

    const title = document.createElement('h4');
    title.className = 'font-bold text-sm text-zinc-200 uppercase leading-tight line-clamp-3';
    setText(title, item.song);

    const artistEl = document.createElement('p');
    artistEl.className = 'mono text-[10px] text-zinc-500 uppercase line-clamp-2 mt-1';
    setText(artistEl, item.artist);

    info.append(time, title, artistEl);
    wrap.append(num, img, info);
  }

  return wrap;
}

function renderCompactHistory() {
  DOM.historyList.replaceChildren(
      ...state.history
          .slice(0, CONFIG.HISTORY_COMPACT_COUNT)
          .map((item, i) => buildHistoryItem(item, i + 1, 'compact')),
  );
}

function renderFullHistory() {
  DOM.fullHistoryList.replaceChildren(
      ...state.history.map((item, i) => buildHistoryItem(item, i + 1, 'full')),
  );
}

async function fetchMetadata() {
  DOM.metaLoader.classList.remove('hidden');
  try {
    const res  = await fetchWithTimeout(CONFIG.API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    setText(DOM.trackName,  data.song   || CONFIG.FALLBACK_TRACK);
    setText(DOM.artistName, data.artist || CONFIG.FALLBACK_ARTIST);
    setText(DOM.artBitrate, `${data.bitrate || CONFIG.FALLBACK_BITRATE}K`);
    setText(DOM.artFormat,  data.format || CONFIG.FALLBACK_FORMAT);
    setText(DOM.artYear,    data.year   || '----');

    DOM.mainArtwork.crossOrigin = 'anonymous';
    DOM.mainArtwork.src = proxyImg(data.artwork || CONFIG.FALLBACK_ARTWORK, 600, 600);

    if (data.duration > 0) {
      state.track = { duration: data.duration, elapsed: data.elapsed, syncedAt: Date.now() };
      startProgressLoop();
    }

    const hasLyrics = typeof data.lyrics === 'string' && data.lyrics.trim() !== '';
    DOM.lyricsToggle.classList.toggle('hidden', !hasLyrics);
    if (hasLyrics) setText(DOM.lyricsBody, data.lyrics);

    state.history = Array.isArray(data.history) ? data.history : [];
    renderCompactHistory();

  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn('Metadata fetch timed out.');
    } else {
      console.error('Metadata fetch failed:', err);
    }

    if (state.track.duration === 0 && state.history.length === 0) {
      setText(DOM.trackName,  CONFIG.FALLBACK_TRACK);
      setText(DOM.artistName, CONFIG.FALLBACK_ARTIST);
      setText(DOM.artBitrate, `${CONFIG.FALLBACK_BITRATE}K`);
      setText(DOM.artFormat,  CONFIG.FALLBACK_FORMAT);
      setText(DOM.artYear,    '----');
    }
  } finally {
    DOM.metaLoader.classList.add('hidden');
  }
}

function togglePlayback() {
  if (!state.streamLoaded) {
    audio.src = CONFIG.STREAM_URL;
    state.streamLoaded = true;
  }

  if (audio.paused) {
    audio.play().catch((err) => {
      console.error('Playback error:', err);
      setPlayerState(PlayerState.ERROR);
    });
  } else {
    audio.pause();
  }
}

function setPlayerState(next) {
  state.player = next;

  const isPlaying = next === PlayerState.PLAYING;

  DOM.playIcon.innerHTML = isPlaying
      ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'
      : '<path d="M8 5v14l11-7z"/>';

  setText(DOM.playText, isPlaying ? CONFIG.LABEL_STOP : CONFIG.LABEL_PLAY);

  toggleClasses(DOM.liveDot, isPlaying, ['bg-orange-600', 'animate-pulse'], ['bg-zinc-800']);

  DOM.visualizer.classList.toggle('playing', isPlaying);
}

audio.addEventListener('play',  () => setPlayerState(PlayerState.PLAYING));
audio.addEventListener('pause', () => setPlayerState(PlayerState.PAUSED));
audio.addEventListener('error', () => {
  console.error('Audio stream error:', audio.error);
  setPlayerState(PlayerState.ERROR);
});

function openPanel(panelEl) {
  panelEl.classList.add('open');
  DOM.blurBg.classList.add('open');
}

function openHistory() {
  renderFullHistory();
  openPanel(DOM.historyPanel);
}

function openLyrics() {
  openPanel(DOM.lyricsPanel);
}

function closeAllPanels() {
  DOM.historyPanel.classList.remove('open');
  DOM.lyricsPanel.classList.remove('open');
  DOM.blurBg.classList.remove('open');
}

DOM.volume.addEventListener('input', () => {
  audio.volume = Number(DOM.volume.value);
});

setInterval(() => {
  setText(DOM.clock, new Date().toTimeString().slice(0, 8));
}, 1000);

window.addEventListener('load', () => {
  DOM.mainArtwork.crossOrigin = 'anonymous';
  DOM.mainArtwork.src = proxyImg(CONFIG.FALLBACK_ARTWORK, 600, 600);
  fetchMetadata().catch(console.error);
  setInterval(() => fetchMetadata().catch(console.error), CONFIG.META_INTERVAL_MS);
});

window.togglePlayback = togglePlayback;
window.openHistory    = openHistory;
window.openLyrics     = openLyrics;
window.closeAllPanels = closeAllPanels;