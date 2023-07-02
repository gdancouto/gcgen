const config = require('../data/config.json');
const profile = require('../data/credentials.json');

//const messageToDatabase = require('../data/db.json');
//const messageToInjector = require('../data/scte35.json');

const messageToInjector = `<?xml version="1.0" encoding="UTF-8"?>
<tsduck>
  <splice_information_table protocol_version="0" pts_adjustment="0" tier="0x0FFF">
    	<splice_insert splice_event_id="splice-id" splice_event_cancel="false"  out_of_network="true" splice_immediate="true"  unique_program_id="0x00" avail_num="0" avails_expected="0">
    	</splice_insert>
    <splice_avail_descriptor identifier="0x43554549" provider_avail_id="0x00000012"/>
  </splice_information_table>
</tsduck>`;


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

	if (config.TXmode){
	}
		const spliceInjector = require("./spliceInjector.js") (nodecg, config);

	//-------------------------------------------------------------------
	// RX - RECEBE UM JSON DA GFX COMMANDS DATABASE
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
	// TX - INJECT (DB and ANCI)
	//--------------------------------------------------------------------

	async function insertDatabase (id, newValue) {

		let toSendDatabase = {
			info: {
			},
		};

		toSendDatabase.info.eventId = id;
		toSendDatabase.info.timestamp = Date.now();
		toSendDatabase.info.injectCount = 1;

		for (let prop in newValue) 
			toSendDatabase[prop] = newValue[prop];

		const result = await dbGFX.insert(toSendDatabase);
	}

	function insertInjector(id) {

		let toSendInjector = messageToInjector.slice();

		toSendInjector = toSendInjector.replace ("splice-id", id);

		spliceInjector.openSocket (toSendInjector);

	}

	//-------------------------------------------------------------------
	// TX - MONITOR GUI
	//--------------------------------------------------------------------

	nodecg.listenFor('mainChannel', (newValue) => {

		function getRandomInt(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min) + min); 
		}
		  

		try {
			let id = getRandomInt (1, Math.pow(2,32)-2);

			insertDatabase(id, newValue);
			insertInjector(id);

		} catch (error) {
			nodecg.log.error(error);
		}
	});

}