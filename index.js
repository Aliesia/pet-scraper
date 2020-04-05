const {clanURL, warURL} = require('./data');
const webscraping = require('./webscraping');
const compareAndSaveResults = require('./resultAnalysis');

function handle() {
	return webscraping(clanURL, warURL)
		.then(dataObj => {
			console.log(dataObj);
			compareAndSaveResults(dataObj);
		})
		.catch(console.error);
};

handle();
