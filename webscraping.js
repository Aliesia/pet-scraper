import puppeteer from 'puppeteer';

const webscraping = async function(clanURL, warURL) {
	const browser = await puppeteer.launch({
		headless: true,
		args :[
		]
	});

	const page = await browser.newPage();

	async function getClanMembers() {
		await page.goto(clanURL);
		
		return await page.evaluate(() => {
			let data = [];
			let members = document.querySelectorAll('#roster > tbody > tr');
			
			members.forEach(element => {
				let clanMember = {
					name: element.querySelector('td:nth-child(2) > a').firstChild.nodeValue.trim(),
					role: element.querySelector('td:nth-child(6)').innerText,
					lastOnline: element.querySelector('td:nth-child(2) > a > div').innerText,
					tag: element.querySelector('td:nth-child(7)').innerText.trim(),
					donated: element.querySelector('td:nth-child(10)').innerText,
					received: element.querySelector('td:nth-child(11)').innerText,
				}

				data.push(clanMember);
			})

			return data;
			});
	}
	async function getWarData() {
		await page.goto(warURL);

		return await page.evaluate(() => {
			let data = {};
			let members = document.querySelectorAll('.war_table_wrapper tbody > tr + .member_row');
			members.forEach(element => {
				let warsArray = {};
				for (let i = 1; i <= 10; i++) { 
					warsArray[i] = element.querySelector('td:nth-child(' + (i + 4) +')').getAttribute('data-sort-value');
				}

				let clanMember = {
					tag: element.querySelector('a').getAttribute('data-tag'),
					count: element.querySelector('td:nth-child(3)').innerText,
					mia: element.querySelector('td:nth-child(4)').innerText,
					wars: warsArray
				}

				data[clanMember.tag] = clanMember;
			})

			return data;
			});
	}
	let clanMembers, warData;
	
	try {
		clanMembers = await getClanMembers();
		warData = await getWarData();
		clanMembers.forEach(member => {
			member['warInfo'] = warData[member.tag];	
		});

	} catch (e) {
		console.log(e);
	} finally {
		browser.close();
	}
	
	return clanMembers;
};

export default webscraping;