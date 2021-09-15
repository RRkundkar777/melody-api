// Import Libraries
import fetch from "isomorphic-fetch"
import jsdom from 'jsdom'
import { MelodyUtils } from "./Utils";
const { JSDOM } = jsdom

/* Main class lyrics*/
export default class Lyrics {
    /**
     * Fetch lyrics
     * @param query 
     * @returns 
     */
    async getLyrics(query: string): Promise<string> {

        try {
            // Get the link and fetch it
            const Link = await MelodyUtils.getLink(query);
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
            let Lyrics = MelodyUtils.processLyrics(title, divList);
            
            // Return the lyrics
            return Lyrics
        } catch (err) {
            throw new Error('Error Fetching Lyrics')
        }
    }
}
