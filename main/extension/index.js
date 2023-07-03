const config = require('../data/config.json');
const profile = require('../data/credentials.json');

module.exports = nodecg => {

	const dbGFX = require ("./commandsDatabase.js")(nodecg, profile);

	const srcDashboard = require("./source.js")(nodecg, config);
	const ctrDashboard = require("./control.js")(nodecg, config);

	const msgHandler = require("./messageHandler.js")(nodecg);

	state =
	{
		language: nodecg.Replicant('idiomChannel'),
		keyer: nodecg.Replicant('testChannel'),
		delay:{}
	}

	if (config.RXmode){

		const spliceMonitor = require("./spliceMonitor.js") (nodecg, config, formater);

	}

	//const monitorHandler = require("./spliceMonitor.js") (nodecg, config, profile);

	if (config.TXmode){
	}
	const injectorHandler = require("./injectorHandler.js") (nodecg, config, profile);


	//-------------------------------------------------------------------
	// RX - MONITOR ANCI MESSAGES
	//--------------------------------------------------------------------
	
	async function formater (splice)
	{
		try {
			const message = await dbGFX.find (splice, msgHandler.dispatch);

		} catch (error) {
			nodecg.log.error(error);
		}
	}
	
	//-------------------------------------------------------------------
	// TX - MONITOR GUI MESSAGES
	//--------------------------------------------------------------------

	nodecg.listenFor('ancillaryChannel', (newValue) => {


	});

	nodecg.listenFor('mainChannel', (newValue) => {

		injectorHandler.insert (newValue);

	});

}