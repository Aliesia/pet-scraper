const {clanURL, warURL} = require('./data');
const webscraping = require('./webscraping');
const compareAndSaveResults = require('./resultAnalysis');

function handle() {
	return webscraping(clanURL, warURL)
		.then(dataObj => {
			compareAndSaveResults(dataObj);
		})
		.catch(console.error);
};

handle();
