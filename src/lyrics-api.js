// Import Libraries
const fetch = require("isomorphic-fetch");
const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// Main class lyrics
class Lyrics {
    // Constructor
    constructor() { };

    // The getLyrics function
    async getLyrics(query) {

        try {
            // Get the link and fetch it
            const Link = await melodyUtils.getLink(query);
            const response = await fetch(Link);

            // Get the HTML
            const lyrics = await response.text();
            const dom = await new JSDOM(lyrics);

            // Get the raw lyrics
            const divs = dom.window.document.getElementsByTagName("div");
            const divList = Array.from(divs);
            
            // Get the title
            let title = dom.window.document.querySelector("div.ringtone").
            nextElementSibling.textContent;

            // process the raw lyrics
            let Lyrics = melodyUtils.processLyrics(title, divList);
            
            // Return the lyrics
            return Lyrics
        } catch (err) {
            console.log(err);
        }
    }
}

// The Utility class getLyrics
class melodyUtils {
    // Function to process lyrics
    static processLyrics(title, divList) {
        let block;
        let cleanLyrics;
        let status = true;
        let header = "\n" + title + "\n";

        // Append title to header
        cleanLyrics += header;

        // Select the correct lyrics
        for (let i = 0; i < divList.length; i++) {
            if (divList[i].className == "ringtone") {
                i++;
                block = divList[i].innerHTML;
                break;
            }
        }

        // Seperate HTML from Lyrics
        for (let i = 1; i < block.length; i++) {
            if(block[i] === "<"){
                status = false;
            }
            else if(block[i] === ">"){
                status = true;
            }
            else{
                if(status){
                    cleanLyrics += block[i];
                }
            }
        }
        // Return the pure lyrics
        return cleanLyrics;
    }

    // Get a Link to Lyrics
    static async getLink(query) {
        // Query Processing
        query = query.split(" ").join("+");

        // URL Processing
        const URL = "https://search.azlyrics.com/?q=" + query;

        try {
            // Request Data from URL
            const res = await axios.post(URL);
            const text = res.data;

            // Conversion to DOM
            const dom = await new JSDOM(text);

            // Get correct Panel
            let panelList = dom.window.document.querySelectorAll(".panel");
            panelList = Array.from(panelList);
            const panel = this.getPanel(panelList);

            // Get the correct Link
            const Link = panel.querySelector('a').href;
            return Link;

        } catch (e) {
            console.log(e);
        }
    }

    // Function to get most suitable Panel
    static getPanel(panelList) {

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
}

module.exports = Lyrics