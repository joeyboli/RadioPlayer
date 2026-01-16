# HTML5 Full Page Internet Radio Player

A modern, responsive web-based radio player with a clean interface. Stream your favorite radio station with real-time song information, lyrics, and playback history.

![Radio Player Preview](img/imageupdate.png)

## Features

- Live streaming support for multiple protocols (Icecast, Zeno, Shoutcast, Radiojar)
- Modern Spotify-inspired interface with smooth animations
- Responsive design for desktop, tablet, and mobile devices
- Real-time metadata display (song, artist, album artwork)
- Integrated lyrics display
- Playback history showing 5 recently played songs
- Volume control with keyboard shortcuts
- Full keyboard navigation support

## Supported APIs

Integration with multiple radio streaming APIs through [RadioAPI.me](https://radioapi.me):

- Azuracast API - Open-source radio broadcasting suite
- Live365 API - Professional internet radio platform
- RadioKing API - European radio streaming service

## Supported Stream Types

- Icecast - Open-source streaming media server
- Shoutcast - Nullsoft's streaming media server
- Zeno - Modern streaming platform
- Radiojar - Cloud-based radio streaming
- HTTP/HTTPS Streams - Direct audio stream URLs

## Music Platform Integration

Song information from multiple music platforms:

- iTunes (Apple Music)
- Spotify
- YouTube Music
- Deezer
- KKBOX
- Line Music
- FLOMusic

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/joeyboli/radioplayer.git
   cd radioplayer
   ```

2. Configure your radio stream:
   - Open `js/script.js`
   - Update the `URL_STREAMING` constant with your stream URL
   - Get your API endpoint from [RadioAPI.me](https://radioapi.me)

3. Open `index.html` in your browser

## Configuration

Edit `js/script.js` to configure your radio stream:

```javascript
const URL_STREAMING = "https://your-stream-url.com/stream"
const API_URL = "https://prod-api.radioapi.me/streamtitile/STREAM_ID"
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space or P | Play/Pause |
| ↑ | Volume Up |
| ↓ | Volume Down |
| M | Mute/Unmute |
| 0-9 | Set volume to 0-90% |

## Customization

To change the number of history items displayed, edit the `HISTORY_ITEMS_COUNT` constant in `js/script.js`.

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## API Integration

This player uses [RadioAPI.me](https://radioapi.me) for metadata and lyrics. Get your API endpoint from their service.

## Troubleshooting

- Check browser console for errors
- Verify stream URL is accessible
- Ensure API endpoint is working

## License

GNU AFFERO GENERAL PUBLIC LICENSE
