const getL = require('../src/lyrics-api');

const app = new getL();
app.getLyrics('roar katy perry').then((response) => {
    return console.log(response);
})
.catch((error) => {
    return console.log(error);
})
