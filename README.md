# HTML5 Internet Radio Player

A modern, responsive web-based radio player with a clean Spotify-inspired interface for streaming internet radio stations.

![Radio Player Preview](img/imageupdate.png)

## Features

- **Live Streaming** - Support for Icecast, Shoutcast, Zeno, and Radiojar protocols
- **Real-time Metadata** - Display current song, artist, and album artwork
- **Integrated Lyrics** - View lyrics for the currently playing song
- **Playback History** - Shows 5 recently played songs
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Volume Control** - Adjustable volume with keyboard shortcuts
- **Full Keyboard Navigation** - Complete keyboard support for accessibility

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/joeyboli/radioplayer.git
   cd radioplayer
   ```

2. **Configure your stream:**
   - Open `js/script.js`
   - Update `URL_STREAMING` with your stream URL
   - Set `API_URL` with your endpoint from [RadioAPI.me](https://radioapi.me)

3. **Launch:**
   - Open `index.html` in your browser

## Configuration

Edit `js/script.js`:

```javascript
const URL_STREAMING = "https://your-stream-url.com/stream"
const API_URL = "https://prod-api.radioapi.me/streamtitile/STREAM_ID"
const HISTORY_ITEMS_COUNT = 5 // Adjust history length, max 10
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space / P | Play/Pause |
| ↑ | Volume Up |
| ↓ | Volume Down |
| M | Mute/Unmute |
| 0-9 | Set volume (0-90%) |

## API Integration

This player uses [RadioAPI.me](https://radioapi.me) for metadata and lyrics. Supported platforms include:

- **Broadcasting APIs:** Azuracast, Live365, RadioKing
- **Stream Types:** Icecast, Shoutcast, Zeno, Radiojar, HTTP/HTTPS
- **Music Platforms:** iTunes, Spotify, YouTube Music, Deezer, KKBOX, Line Music, FLOMusic

## Upgrade to JC Player Pro

Want more features? **JC Player Pro** is available for **$99** and includes:

- **Multi-Radio Support** - Manage and switch between multiple radio stations
- **Embeddable Players** - Integrate players into any website
- **Sticky Players** - Floating players that stay visible while scrolling
- **Advanced Customization** - Extended theming and branding options
- **Radio API Dashboard** - Full access to the RadioAPI.me dashboard
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

## License

GNU Affero General Public License v3.0
