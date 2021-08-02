const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// Get a Link to Lyrics
async function getLink(query) {
    // Query Processing
    query = query.split(" ").join("+");

    // URL Processing
    const URL = "https://search.azlyrics.com/?q=" + query;
    console.log(URL);

    try {
        // Request Data
        const res = await axios.post(URL);
        const text = res.data;

        // Conversion to DOM
        const dom = await new JSDOM(text);

        // Get Panel
        let panelList = dom.window.document.querySelectorAll(".panel");
        panelList = Array.from(panelList);
        const panel = getPanel(panelList);

        // Get Link
        const Link = panel.querySelector('a').href;
        return Link;

    } catch (e) {
        console.log(e);
    }
}

// Function to get most suitable Panel
function getPanel(panelList) {

    let panels = new Array(4);

    for (let index = 0; index < panelList.length; index++) {
        const element = panelList[index];
        if (element.querySelector('b').innerHTML === "Lyrics results:") {
            panels[0] = element;
        }
        if (element.querySelector('b').innerHTML === "Song results:") {
            panels[1] = element;
        }
        if (element.querySelector('b').innerHTML === "Artist results:") {
            panels[2] = element;
        }
    }

    let cnt = 0;
    while (panels[cnt] === undefined) {
        cnt++;
    }
    return panels[cnt];
}

module.exports = getLink;