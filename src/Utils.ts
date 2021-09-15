import axios from 'axios'
import { JSDOM } from 'jsdom';
/* The Utility class getLyrics */
export abstract class MelodyUtils {

    /**
     * Processes Lyrics
     * @param title 
     * @param divList 
     * @returns 
     */
    static processLyrics(title: string, divList: any[]): string {
        let block = ''
        let cleanLyrics = ''
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
    static async getLink(query: string) {
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
    static getPanel(panelList: any[]) {

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