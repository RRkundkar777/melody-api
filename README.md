# melody-lyrics-api
This api fetches the lyrics of a song by its artist,title and part of lyrics.
## Usage
```
const api = require('melody-api')
const app = new api();
app.getLyrics('roar katy perry').then((response) => {
    return console.log(response);
})
.catch((error) => {
    return console.log(error);
})
```
