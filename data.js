require('dotenv').config();

const clanURL = 'https://royaleapi.com/clan/89VLQR0';
const warURL = 'https://royaleapi.com/clan/89VLQR0/war/analytics';

const MONGOURI = process.env.MONGOURI;

module.exports = {
	clanURL,
	warURL,
	MONGOURI
};