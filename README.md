# 🎵 Game! Radio Player

A modern, responsive web-based radio player with a beautiful Spotify-inspired interface. Stream your favorite radio station with real-time song information, lyrics, and playback history.

![Radio Player Preview](img/cover.png)

## ✨ Features

- **🎧 Live Streaming**: Supports multiple streaming protocols (Icecast, Zeno, Shoutcast, Radiojar)
- **🎨 Modern UI**: Spotify-inspired interface with smooth animations
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **🎵 Real-time Metadata**: Displays current song, artist, and album artwork
- **📜 Lyrics Integration**: Automatic lyrics lookup using Vagalume API
- **📚 Playback History**: Shows up to 5 recently played songs
- **🎛️ Volume Control**: Precise volume control with keyboard shortcuts
- **⌨️ Keyboard Shortcuts**: Full keyboard navigation support

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/radio-player.git
   cd radio-player
   ```

2. **Configure your radio stream**
   - Open `js/script.js`
   - Update the `URL_STREAMING` constant with your stream URL
   - Get your API endpoint from [RadioAPI.me](https://radioapi.me)

3. **Open in browser**
   ```
   Open index.html in your browser
   ```

## ⚙️ Configuration

Edit `js/script.js` to configure your radio stream:

```javascript
const URL_STREAMING = "https://your-stream-url.com/stream"
const API_URL = "https://prod-api.radioapi.me/metadata/YOUR-API-KEY"
```

## 🎮 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` or `P` | Play/Pause |
| `↑` | Volume Up |
| `↓` | Volume Down |
| `M` | Mute/Unmute |
| `0-9` | Set volume to 0-90% |

## 🎨 Customization

To change the number of history items displayed, edit `js/script.js` and modify the `HISTORY_ITEMS_COUNT` constant.

## 📱 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🔧 Project Structure

```
radio-player/
├── css/          # Stylesheets
├── fonts/        # Font Awesome fonts
├── img/          # Images and artwork
├── js/           # JavaScript files
├── index.html    # Main HTML file
└── README.md     # This file
```

## 🌐 API Integration

This player uses [RadioAPI.me](https://radioapi.me) for metadata. Get your API endpoint from their service.

For lyrics functionality, get a Vagalume API key from [Vagalume API](https://api.vagalume.com.br/docs/).

## 🐛 Troubleshooting

- Check browser console for errors
- Verify stream URL is accessible
- Ensure API endpoint is working

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

Made with ❤️ for radio lovers everywhere
