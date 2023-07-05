module.exports = nodecg => {

	const config = require('../data/config.json');
	const profile = require('../data/credentials.json');

	const ctrDashboard = require("./controlDashboard.js")(nodecg, config);
	const messageHandler = require("./messageHandler.js")(nodecg);
	const scriptCreator = require("./scriptCreator.js") (nodecg, config);

	state =
	{
		language: nodecg.Replicant('idiomChannel'),
		keyer: nodecg.Replicant('testChannel'),
		delay:{}
	}

	const dataReplicant = nodecg.Replicant('reloadChannel');

	if (config.tx.mode){

		const injectorHandler = require("./injectorHandler.js") (nodecg, config, profile);

		nodecg.listenFor('mainChannel', (newValue) => {
			injectorHandler.insert (newValue);

			if (!config.rx.mode)
				messageHandler.dispatch (newValue);
		});
	};

	if (config.rx.mode){
		
		const monitorHandler = require("./monitorHandler.js") (nodecg, config, profile);

		nodecg.listenFor('ancillaryChannel', (newValue) => {
			messageHandler.dispatch (newValue);
		});
	}
}