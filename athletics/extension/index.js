module.exports = nodecg => {
}
	
	/*const config = { 

		template:{
			domain: "GAMES",
			package: "athletics",  //this package name?
			graphic: "",
			channel: "",
			layer: 0,
			command: 0,
		}
	}

	const channelToSend = {
		PGM: true,
		PVW: false,
	}

	module.exports = nodecg => {

	// LISTEN FOR DASHBOARD --------------------------------------------------

	nodecg.listenFor(config.template.package + "TX", (newValue) => {

		try {
			if (channelToSend[newValue.template.channel])
				nodecg.sendMessageToBundle('mainChannel', 'main', newValue);

		} catch (error) {
			nodecg.log.error(error);
		}
	});

	// LISTEN FOR MAIN CHANNELS --------------------------------------------------

	nodecg.listenFor(config.template.package + "RX", (newValue) => {

		try {
			nodecg.sendMessageToBundle(newValue.template.graphic, newValue);

		} catch (error) {
			nodecg.log.error(error);
		}
	});
}

*/