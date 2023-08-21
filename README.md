
# HTML5 Icecast/Shoutcast/Zeno Full Page Radio Player

# Documentation.

Open The [Script.js](https://github.com/joeyboli/html5-shoutcast-icecast-zeno-player/blob/main/js/script.js) file and edit the lines Below.

```javascript
// RADIO NAME
const RADIO_NAME = 'Game! Radio 1';

// SELECT ARTWORK PROVIDER, ITUNES, DEEZER & SPOTIFY. eg : spotify 
var API_SERVICE = 'DEEZER';

// Change Stream URL Here, Supports, ICECAST, ZENO, SHOUTCAST, RADIOJAR and any other stream service.
const URL_STREAMING = 'https://stream-51.zeno.fm/cfhkm5fs1uhvv?zs=HOu6hxV1SG-7iGi9WGVTqQ';

//PASTE YOUR MEDIA CP JSON URL HERE TO GET NOW PLAYING SONG TITLE.
const MEDIACP_JSON_URL = ''

//API URL / if you use MEDIA CP, CHANGE THIS TO : https://api.streamafrica.net/metadata/mediacp.php?url='+MEDIACP_JSON_URL
const API_URL = 'https://api.streamafrica.net/metadata/index?z='+URL_STREAMING


 ```

 ## Change Logo.

 Open The img folder and add your logo named "cover.png"


 
## Demo Screenshots

![Demo Screenshot](https://i.ibb.co/xfXG7fb/Screenshot-2023-06-18-21-40-11.png)


## Supported Hosting Types
* Icecast / Shoutcast
* Zeno Radio
* RadioJar
* Azuracast
* Centova Cast
* Everest Cast
* MediaCP
* Sonic Panel
* [JoeyCast](https://joeycast.com)

## Supported API/Data Sources
* Apple Music / Itunes
* Deezer
* Spotify
* SoundCloud
* BandCamp
* Azuracast
* MediaCP


## Feedback

If you have any feedback, please reach out to me at bankuboy@pm.me


## License

[MIT](https://github.com/gsavio/player-shoutcast-html5/blob/master/LICENSE)

## Credits
* [gsavio//player-shoutcast-html5](https://github.com/gsavio/player-shoutcast-html5)
* [streamafrica Free API](https://api.streamafrica.net/)


