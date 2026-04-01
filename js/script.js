let CONFIG = {
    STREAM_URL: 'https://play.streamafrica.net/rap',
    API_URL: 'https://openapi.streamafrica.cloud/metadata/7bb67d3b-c85f-4dae-8116-824a9c0a2425',

    STATION_NAME: 'RAP GLOBAL',
    STATION_LOGO: 'https://ik.imagekit.io/boxradio/r2/radios/01KGQFV8ZWSG9BJFVSW9TWHKFW.png',            // URL to a logo image (optional)
    BRAND_NAME: 'Radio<span class="text-[var(--primary)]">Player</span>', // HTML string for brand

    PRIMARY_COLOR: '#38f916',     // Default orange
    ACCENT_COLOR: '#38f916',
    DYNAMIC_THEME: true,          // Auto-adjust colors based on artwork
    FALLBACK_ARTIST: 'Rap Radio',
    FALLBACK_BITRATE: '128',
    FALLBACK_FORMAT: 'MP3',
    FALLBACK_ARTWORK: 'https://ik.imagekit.io/boxradio/r2/radios/01KGQFV8ZWSG9BJFVSW9TWHKFW.png',

    LABEL_PLAY: 'PLAY',
    LABEL_STOP: 'STOP',

    DEFAULT_VOLUME: 0.8,   // 0.0 – 1.0

    META_INTERVAL_MS: 15_000,
    PROGRESS_INTERVAL_MS: 1_000,
    FETCH_TIMEOUT_MS: 8_000,

    HISTORY_COMPACT_COUNT: 3,    // tracks shown in the main view
    COLOR_BRIGHTNESS_THRESHOLD: 125, // YIQ threshold for btn text contrast

    IMG_PROXY: 'https://wsrv.nl/',
};

const PlayerState = Object.freeze({
    IDLE: 'IDLE',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    ERROR: 'ERROR',
});

const state = {
    player: PlayerState.IDLE,
    track: {duration: 0, elapsed: 0, syncedAt: 0},
    history: [],
    streamLoaded: false,
};

const $ = (id) => {
    const el = document.getElementById(id);
    return el;
};

const DOM = {
    playIcon: $('play-icon'),
    playText: $('play-text'),
    visualizer: $('visualizer'),
    mainArtwork: $('main-artwork'),
    masterBtn: $('master-play-btn'),
    metaLoader: $('metadata-loader'),
    trackName: $('track-name'),
    artistName: $('artist-name'),
    artBitrate: $('art-bitrate'),
    artFormat: $('art-format'),
    artYear: $('art-year'),
    progressShadow: $('progress-shadow'),
    progressText: $('progress-text'),
    lyricsToggle: $('btn-lyrics-toggle'),
    lyricsBody: $('lyrics-body'),
    historyList: $('history-list'),
    fullHistoryList: $('full-history-list'),
    historyPanel: $('history-panel'),
    lyricsPanel: $('lyrics-panel'),
    blurBg: $('blur-bg'),
    dynamicBg: $('dynamic-bg'),
    radioLogo: $('radio-logo'),
    logoContainer: $('radio-logo-container'),
    brandName: $('brand-name'),
};

const masterBtnContainer = DOM.masterBtn.parentElement;

const audio = new Audio();
audio.preload = 'none';
audio.volume = CONFIG.DEFAULT_VOLUME;

const formatTime = (secs) => {
    const total = Math.max(0, Math.floor(secs));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const proxyImg = (url, w, h) =>
    `${CONFIG.IMG_PROXY}?url=${encodeURIComponent(url)}&w=${w}&h=${h}&fit=cover&output=webp`;

const setText = (el, text) => {
    el.textContent = text;
};

const toggleClasses = (el, condition, trueClasses, falseClasses) => {
    el.classList.remove(...(condition ? falseClasses : trueClasses));
    el.classList.add(...(condition ? trueClasses : falseClasses));
};

async function fetchWithTimeout(url, timeoutMs = CONFIG.FETCH_TIMEOUT_MS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(url, {signal: controller.signal});
    } finally {
        clearTimeout(timer);
    }
}

const colorThief = new ColorThief();

DOM.mainArtwork.addEventListener('load', () => {
    if (!CONFIG.DYNAMIC_THEME) return;
    try {
        const [r, g, b] = colorThief.getColor(DOM.mainArtwork);
        const color = `rgb(${r},${g},${b})`;

        masterBtnContainer.style.backgroundColor = color;
        DOM.progressShadow.style.backgroundColor = `rgba(${r},${g},${b},0.4)`;

        // Update dynamic background
        DOM.dynamicBg.style.backgroundImage = `url(${DOM.mainArtwork.src})`;

        // Update theme color
        document.documentElement.style.setProperty('--accent', color);

        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        DOM.masterBtn.style.color = brightness > CONFIG.COLOR_BRIGHTNESS_THRESHOLD ? '#000' : '#fff';
    } catch {
        masterBtnContainer.style.backgroundColor = '#ffffff';
        DOM.progressShadow.style.backgroundColor = 'rgba(0,0,0,0.1)';
        DOM.masterBtn.style.color = '#000';
        document.documentElement.style.setProperty('--accent', '#f97316');
    }
});

let progressIntervalId = null;

function startProgressLoop() {
    stopProgressLoop();
    progressIntervalId = setInterval(() => {
        const {duration, elapsed, syncedAt} = state.track;
        if (duration <= 0) return;

        const current = elapsed + (Date.now() - syncedAt) / 1000;
        const pct = Math.min((current / duration) * 100, 100);

        DOM.progressShadow.style.width = `${pct}%`;
        setText(
            DOM.progressText,
            `${formatTime(current)} / ${formatTime(duration)}`,
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
        wrap.className = 'flex items-center gap-4 p-3 bg-white/5 border border-white/5 rounded-sm group hover:bg-white/10 transition-all';

        const img = document.createElement('img');
        img.src = proxyImg(item.artwork || CONFIG.FALLBACK_ARTWORK, 80, 80);
        img.className = 'w-10 h-10 object-cover rounded-sm border border-white/10';
        img.alt = item.song;

        const inner = document.createElement('div');
        inner.className = 'min-w-0 flex-1';

        const song = document.createElement('span');
        song.className = 'font-bold text-zinc-200 block truncate uppercase text-[12px]';
        setText(song, item.song);

        const artist = document.createElement('span');
        artist.className = 'mono text-[10px] text-zinc-500 uppercase block truncate';
        setText(artist, item.artist);

        inner.append(song, artist);
        wrap.append(img, inner);
    } else {
        wrap.className = 'flex gap-6 items-start border-b border-white/5 pb-8 group last:border-0';

        const num = document.createElement('div');
        num.className = 'mono text-[12px] text-zinc-800 pt-1 shrink-0';
        setText(num, String(idx).padStart(2, '0'));

        const img = document.createElement('img');
        img.src = proxyImg(item.artwork || CONFIG.FALLBACK_ARTWORK, 180, 180);
        img.className = 'w-20 h-20 object-cover border border-zinc-800 shrink-0';
        img.alt = item.song;
        img.crossOrigin = 'anonymous';

        const info = document.createElement('div');
        info.className = 'min-w-0 flex-1';

        const time = document.createElement('p');
        time.className = 'text-zinc-600 mono text-[10px] uppercase tracking-tighter mb-1';
        setText(time, item.relative_time || 'RECENT');

        const title = document.createElement('h4');
        title.className = 'font-bold text-base text-zinc-200 uppercase leading-tight line-clamp-3';
        setText(title, item.song);

        const artistEl = document.createElement('p');
        artistEl.className = 'mono text-[11px] text-zinc-500 uppercase line-clamp-2 mt-1';
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
        const res = await fetchWithTimeout(CONFIG.API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setText(DOM.trackName, data.song || CONFIG.FALLBACK_TRACK);
        setText(DOM.artistName, data.artist || CONFIG.FALLBACK_ARTIST);
        setText(DOM.artBitrate, `${data.bitrate || CONFIG.FALLBACK_BITRATE}K`);
        setText(DOM.artFormat, data.format || CONFIG.FALLBACK_FORMAT);
        setText(DOM.artYear, data.year || '----');

        DOM.mainArtwork.crossOrigin = 'anonymous';
        DOM.mainArtwork.src = proxyImg(data.artwork || CONFIG.FALLBACK_ARTWORK, 600, 600);

        if (data.duration > 0) {
            state.track = {duration: data.duration, elapsed: data.elapsed, syncedAt: Date.now()};
            startProgressLoop();
        }

        const hasLyrics = typeof data.lyrics === 'string' && data.lyrics.trim() !== '';
        DOM.lyricsToggle.classList.toggle('hidden', !hasLyrics);
        if (hasLyrics) setText(DOM.lyricsBody, data.lyrics);

        state.history = Array.isArray(data.history) ? data.history : [];
        renderCompactHistory();

        // Update dynamic background with initial load too
        DOM.dynamicBg.style.backgroundImage = `url(${DOM.mainArtwork.src})`;

    } catch (err) {
        if (err.name === 'AbortError') {
            console.warn('Metadata fetch timed out.');
        } else {
            console.error('Metadata fetch failed:', err);
        }

        if (state.track.duration === 0 && state.history.length === 0) {
            setText(DOM.trackName, CONFIG.FALLBACK_TRACK);
            setText(DOM.artistName, CONFIG.FALLBACK_ARTIST);
            setText(DOM.artBitrate, `${CONFIG.FALLBACK_BITRATE}K`);
            setText(DOM.artFormat, CONFIG.FALLBACK_FORMAT);
            setText(DOM.artYear, '----');
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

    DOM.visualizer.classList.toggle('playing', isPlaying);
}

audio.addEventListener('play', () => setPlayerState(PlayerState.PLAYING));
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


function applyLogo() {
    if (CONFIG.STATION_LOGO) {
        DOM.radioLogo.src = CONFIG.STATION_LOGO;
        DOM.logoContainer.classList.remove('hidden');
    } else {
        DOM.logoContainer.classList.add('hidden');
    }
}

function applyBrand() {
    if (CONFIG.BRAND_NAME) {
        DOM.brandName.innerHTML = CONFIG.BRAND_NAME;
    }
}

function applyColors() {
    if (CONFIG.PRIMARY_COLOR) {
        document.documentElement.style.setProperty('--primary', CONFIG.PRIMARY_COLOR);
        if (!CONFIG.DYNAMIC_THEME) {
            document.documentElement.style.setProperty('--accent', CONFIG.PRIMARY_COLOR);
        }
    }
    if (CONFIG.ACCENT_COLOR) {
        document.documentElement.style.setProperty('--accent', CONFIG.ACCENT_COLOR);
    }
}

function applyStationName() {
    const el = $('main-station-name');
    const elMob = $('main-station-name-mobile');
    if (CONFIG.STATION_NAME) {
        if (el) setText(el, CONFIG.STATION_NAME);
        if (elMob) setText(elMob, CONFIG.STATION_NAME);
    }
}

window.addEventListener('load', () => {
    applyLogo();
    applyBrand();
    applyColors();
    applyStationName();

    DOM.mainArtwork.crossOrigin = 'anonymous';
    DOM.mainArtwork.src = proxyImg(CONFIG.FALLBACK_ARTWORK, 600, 600);
    fetchMetadata().catch(console.error);
    setInterval(() => fetchMetadata().catch(console.error), CONFIG.META_INTERVAL_MS);
});

window.togglePlayback = togglePlayback;
window.openHistory = openHistory;
window.openLyrics = openLyrics;
window.closeAllPanels = closeAllPanels;

/**
 * PUBLIC API for Customization
 * Usage:
 * RadioPlayer.configure({
 *   STATION_NAME: 'New Name',
 *   STREAM_URL: '...',
 *   API_URL: '...'
 * });
 */
window.RadioPlayer = {
    configure: (newConfig) => {
        Object.assign(CONFIG, newConfig);

        // Apply visual changes immediately if applicable
        if (newConfig.STATION_NAME) {
            applyStationName();
        }

        if (newConfig.STATION_LOGO !== undefined) {
            applyLogo();
        }

        if (newConfig.BRAND_NAME !== undefined) {
            applyBrand();
        }

        if (newConfig.PRIMARY_COLOR || newConfig.ACCENT_COLOR || newConfig.DYNAMIC_THEME !== undefined) {
            applyColors();
        }

        if (newConfig.DEFAULT_VOLUME !== undefined) {
            audio.volume = CONFIG.DEFAULT_VOLUME;
        }

        if (newConfig.LABEL_PLAY || newConfig.LABEL_STOP) {
            setPlayerState(state.player);
        }

        if (newConfig.API_URL || newConfig.STREAM_URL) {
            state.streamLoaded = false;
            fetchMetadata().catch(console.error);
        }
    },
    getState: () => ({...state}),
    getAudio: () => audio
};
