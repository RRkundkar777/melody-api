const { Lyrics } = require('../dist')

const app = new Lyrics();
app.getLyrics('roar katy perry').then((response) => {
    return console.log(response);
})
.catch((error) => {
    return console.log(error);
})
