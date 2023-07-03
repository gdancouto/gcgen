const config = require('../data/config.json');
const profile = require('../data/credentials.json');
const messageHandler = require('./messageHandler.js');

module.exports = nodecg => {

	const srcDashboard = require("./source.js")(nodecg, config);
	const ctrDashboard = require("./control.js")(nodecg, config);

	const messageHandler = require("./messageHandler.js")(nodecg);

	state =
	{
		language: nodecg.Replicant('idiomChannel'),
		keyer: nodecg.Replicant('testChannel'),
		delay:{}
	}

	if (config.RXmode){

	}
	const monitorHandler = require("./monitorHandler.js") (nodecg, config, profile);

	if (config.TXmode){
	}
	const injectorHandler = require("./injectorHandler.js") (nodecg, config, profile);


	nodecg.listenFor('ancillaryChannel', (newValue) => {

		messageHandler.dispatch (newValue);
	});


	nodecg.listenFor('mainChannel', (newValue) => {

		injectorHandler.insert (newValue);

	});

}