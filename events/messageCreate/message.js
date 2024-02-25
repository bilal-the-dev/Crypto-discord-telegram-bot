let oldTicker;
const tickers = [];
let pingCountObj = {};
let day = Date.now();

module.exports = async (message) => {
	const {
		content,
		author: { id },
		channel,
	} = message;

	if (id !== process.env.CLIENT_ID) return;

	// split the message into array
	const [sign, newTicker] = content.split(" ");

	const curDate = Date.now();
	const ms = 1000 * 16;

	const msInDay = 86_400_000;

	if (day + msInDay < curDate) {
		console.log("deleting pings");
		pingCountObj = {};
		day = curDate;
	}

	console.log(pingCountObj);

	const garbageItems = tickers.filter(
		(item) => item.name !== newTicker && item.date + ms < curDate
	);

	for (const item of garbageItems) {
		const index = tickers.indexOf(item);
		tickers.splice(index, 1);
	}

	const isExisiting = tickers.find((item) => item.name === newTicker);

	const tickerObj = {
		name: newTicker,
		times: 1,
		date: curDate,
	};

	//check if old ticker exists
	console.log(tickers);
	if (!isExisiting) {
		// push into arrays
		tickers.push(tickerObj);

		oldTicker = newTicker;

		return;
	}

	const { times, date: oldDate } = isExisiting;
	const index = tickers.indexOf(isExisiting);

	const isValidTicker =
		oldTicker === newTicker ||
		(oldTicker !== newTicker && oldDate + ms > curDate);

	if (times === 1) {
		if (isValidTicker) tickerObj.times++;
		tickers[index] = tickerObj;
	}

	if (times === 2) {
		//send the message
		if (isValidTicker) {
			const pingCount = pingCountObj[newTicker];
			pingCount ? pingCountObj[newTicker]++ : (pingCountObj[newTicker] = 1);

			await channel.send(
				`<@&${process.env.ROLE_ID}> ${sign} \`${newTicker}\` (${pingCountObj[newTicker]})`
			);
		}

		tickers.splice(index, 1);
	}

	oldTicker = newTicker;
};
