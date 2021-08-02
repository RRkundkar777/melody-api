const fetch = require("isomorphic-fetch");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const getLink = require("./FetchLink");

async function getLyrics(query) {

	try {
		const Link = await getLink(query);
		const response = await fetch(Link);

		const lyrics = await response.text();
		const dom = await new JSDOM(lyrics);

		const divs = dom.window.document.getElementsByTagName("div");
		const divList = Array.from(divs);

		let title = dom.window.document.querySelector("div.ringtone").nextElementSibling.textContent;

		logLyrics(title,divList);
	} catch (err) {
		console.log(err);
	}
}

function logLyrics(title, divList) {
	let block;
	console.log(title);

	for (let i = 0; i < divList.length; i++) {
		if (divList[i].className == "ringtone") {
			i++;
			block = divList[i].innerHTML;
			break;
		}
	}
	console.log(block);
}

module.exports = getLyrics;