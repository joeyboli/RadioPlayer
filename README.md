# HTML5 Internet Radio Player

A modern, responsive web-based radio player with a clean interface for streaming internet radio stations.

![Radio Player Preview](img/imageupdate.png)

## Features

- **Live Streaming** - Support for Icecast, Shoutcast, Zeno, and Radiojar protocols
- **Real-time Metadata** - Display current song, artist, and album artwork
- **Integrated Lyrics** - View lyrics for the currently playing song
- **Playback History** - Shows recently played songs
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Volume Control** - Adjustable volume slider
- **Color Theming** - Play button dynamically adopts the artwork's dominant color

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/joeyboli/radioplayer.git
   cd radioplayer
   ```

2. **Configure your stream:**
   - Open `js/script.js`
   - Update the `CONFIG` object at the top of the file with your values

3. **Launch:**
   - Open `index.html` in your browser — no build step required

## Configuration

All configurable values live at the top of `js/script.js` in a single `CONFIG` object:

```javascript
const CONFIG = Object.freeze({
  // ── Stream ──────────────────────────────────────────────────
  STREAM_URL:       'https://your-stream-url.com/stream',
  API_URL:          'https://your-metadata-api.com/endpoint',

  // ── Branding / fallbacks ─────────────────────────────────────
  STATION_NAME:     'My Radio Station',
  FALLBACK_TRACK:   'Live Broadcast',
  FALLBACK_ARTIST:  'My Station',
  FALLBACK_BITRATE: '128',
  FALLBACK_FORMAT:  'MP3',
  FALLBACK_ARTWORK: 'img/cover.png',   // shown before metadata loads

  // ── Player UI labels ─────────────────────────────────────────
  LABEL_PLAY: 'PLAY',
  LABEL_STOP: 'STOP',

  // ── Audio ────────────────────────────────────────────────────
  DEFAULT_VOLUME: 0.8,   // 0.0 – 1.0

  // ── Timings ──────────────────────────────────────────────────
  META_INTERVAL_MS:     15_000,  // how often to poll metadata
  PROGRESS_INTERVAL_MS:  1_000,  // progress bar update rate
  FETCH_TIMEOUT_MS:      8_000,  // API request timeout

  // ── UI behaviour ─────────────────────────────────────────────
  HISTORY_COMPACT_COUNT:      3,  // tracks shown in the main view
  COLOR_BRIGHTNESS_THRESHOLD: 125, // YIQ threshold for button text contrast

  // ── Image proxy ───────────────────────────────────────────────
  IMG_PROXY: 'https://wsrv.nl/',
});
```

The fallback values (`FALLBACK_TRACK`, `FALLBACK_ARTIST`, etc.) are shown automatically when the metadata API is unavailable or returns empty fields.

## Upgrade to JC Player Pro

Want more features? **JC Player Pro** is available for **$79** and includes:

- **Multi-Radio Support** - Manage and switch between multiple radio stations
- **Embeddable Players** - Integrate players into any website
- **Sticky Players** - Floating players that stay visible while scrolling
- **Advanced Customization** - Extended theming and branding options
- **Radio API Dashboard** - Full access to add, edit and configure radios, free hosting, custom domains
- **API Access** - Complete API integration and support
- **Priority Support** - Direct technical assistance
- And much more!

**Note:** This is a hosted player service with full dashboard and API access. You are purchasing access to the JC Player Pro platform, not the source code.

### Live Demo

Check out the player in action: [View Demo](https://1ceb9727-3e36-4e64-99e7-f776b50c7f4f.radioplayer.streamafrica.net/)

### Screenshots

![JC Player Pro Interface](https://ik.imagekit.io/boxradio/Screenshot%202026-02-05%20at%2011.03.32.png)
![JC Player Pro Features](https://ik.imagekit.io/boxradio/Screenshot%202026-02-05%20at%2011.03.19.png)

[Get JC Player Pro →](https://streamafrica.net/player/jcplayer)

---

## Support & Contact

For questions, customisation requests, or integration help:

- **WhatsApp:** [Chat with us](https://wa.link/yn9zpy)
- **Email:** [bankuboy@proton.me](mailto:bankuboy@proton.me)

---

## License

GNU Affero General Public License v3.0