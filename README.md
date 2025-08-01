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
- **🎨 Dynamic Artwork**: Album covers with loading animations
- **🔊 Media Session**: Integration with browser media controls

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A radio stream URL
- (Optional) Vagalume API key for lyrics

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/radio-player.git
   cd radio-player
   ```

2. **Install dependencies** (if using npm/pnpm)
   ```bash
   pnpm install
   ```

3. **Configure your radio stream**
   - Open `js/script.js`
   - Update the `URL_STREAMING` constant with your stream URL
   - Update the `API_URL` with your metadata API endpoint

4. **Serve the files**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

5. **Open in browser**
   ```
   http://localhost:8000
   ```

## ⚙️ Configuration

### Stream Configuration

Edit `js/script.js` to configure your radio stream:

```javascript
// Change Stream URL Here
const URL_STREAMING = "https://your-stream-url.com/stream"

// API endpoint for metadata
const API_URL = "https://your-api-endpoint.com/metadata"

// Vagalume API key for lyrics (optional)
const API_KEY = "your-vagalume-api-key"
```

### Supported Stream Types

- **Icecast**: `http://icecast.server.com:8000/stream`
- **Shoutcast**: `http://shoutcast.server.com:8000/stream`
- **Radiojar**: `https://stream.radiojar.com/stream`
- **Zeno**: `https://zeno.fm/stream`

### API Configuration

The player expects a JSON API response with the following structure:

```json
{
  "title": "Song Title",
  "artist": "Artist Name",
  "art": "https://album-art-url.com/cover.jpg",
  "history": [
    {
      "song": "Previous Song",
      "artist": "Previous Artist",
      "artwork": "https://previous-artwork-url.com/cover.jpg"
    }
  ]
}
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

### Styling

The player uses CSS custom properties for easy theming. Edit `css/style.css` to customize:

```css
:root {
  --primary-color: #1db954;
  --secondary-color: #191414;
  --text-color: #ffffff;
  --background-color: #121212;
}
```

### History Items

To change the number of history items displayed:

1. Edit `js/script.js`
2. Modify the `HISTORY_ITEMS_COUNT` constant in `initializeHistoryItems()`

```javascript
const HISTORY_ITEMS_COUNT = 10 // Change from 5 to desired number
```

## 📱 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🔧 Development

### Project Structure

```
radio-player/
├── css/
│   ├── animate.css          # Animation library
│   ├── bootstrap.min.css    # Bootstrap framework
│   ├── font-awesome.min.css # Icon library
│   └── style.css           # Custom styles
├── fonts/                  # Font Awesome fonts
├── img/                   # Images and artwork
├── js/
│   ├── bootstrap.min.js   # Bootstrap JavaScript
│   └── script.js         # Main application logic
├── index.html            # Main HTML file
├── package.json          # Dependencies
└── README.md            # This file
```

### Key Functions

- `Page()` - Handles UI updates and DOM manipulation
- `Player()` - Manages audio playback and controls
- `getStreamingData()` - Fetches metadata from API
- `initializeHistoryItems()` - Dynamically generates history items

## 🌐 API Integration

### Vagalume Lyrics API

To enable lyrics functionality:

1. Visit [Vagalume API](https://api.vagalume.com.br/docs/)
2. Get your API key
3. Update the `API_KEY` constant in `js/script.js`

### Custom Metadata API

The player expects a REST API endpoint that returns JSON metadata. Implement your own API or use services like:

- RadioAPI.me
- Radio Browser API
- Custom Icecast metadata parser

## 🐛 Troubleshooting

### Common Issues

**Stream not playing:**
- Check if the stream URL is accessible
- Verify CORS settings on your server
- Ensure the stream format is supported

**Metadata not updating:**
- Verify API endpoint is working
- Check browser console for errors
- Ensure API response format matches expected structure

**Lyrics not showing:**
- Verify Vagalume API key is valid
- Check if song/artist exists in Vagalume database
- Ensure API requests are not blocked by CORS

### Debug Mode

Enable debug logging by opening browser console and looking for:
- API response data
- Stream connection status
- Error messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Bootstrap](https://getbootstrap.com/) - CSS framework
- [Font Awesome](https://fontawesome.com/) - Icons
- [Animate.css](https://animate.style/) - Animations
- [Vagalume](https://www.vagalume.com.br/) - Lyrics API

## 📞 Support

If you need help or have questions:

- Create an [issue](https://github.com/yourusername/radio-player/issues)
- Check the [documentation](https://github.com/yourusername/radio-player/wiki)
- Join our [Discord community](https://discord.gg/your-community)

---

Made with ❤️ for radio lovers everywhere
