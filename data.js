import dotenv from 'dotenv'
dotenv.config();

const tag = process.env.CLAN_TAG;
const clanURL = 'https://royaleapi.com/clan/' + tag;
const warURL = 'https://royaleapi.com/clan/' + tag + '/war/analytics';
const MONGOURI = process.env.MONGOURI;

export { clanURL, warURL, MONGOURI };