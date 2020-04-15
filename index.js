import {clanURL, warURL } from './data.js';
import webscraping from './webscraping.js';
import compareAndSaveResults from './resultAnalysis.js';

function handle() {
	return webscraping(clanURL, warURL)
		.then(dataObj => {
			compareAndSaveResults(dataObj);
		})
		.catch(console.error);
};

handle();
