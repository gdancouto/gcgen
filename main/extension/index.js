const mongo = require("./mongo.js");

const config = require('../data/config.json');
const database = require('../data/credentials.json');

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

	const dbGFX = new mongo(database.uri);

	const srcDashboard = require("./source.js")(nodecg, config);
	const ctrDashboard = require("./control.js")(nodecg, config);

	if (config.RXmode){
	}

	if (config.TXmode){
	}

		const spliceMonitor = require("./spliceMonitor.js") (nodecg, config, formater);

		const spliceInjector = require("./spliceInjector.js") (nodecg, config);

	//const idiom = nodecg.Replicant('languageChannel');
	//idiom.value = translate(message);

	//-------------------------------------------------------------------
	// RECEBE UM JSON DA GFX COMMANDS DATABASE
	//--------------------------------------------------------------------

	function translate (message) {

		message.data.forEach(element => {

			Object.keys(element).forEach(function (atribute){

				let field = element[atribute];

				if (Array.isArray(field)) {

					if (field[idiom] !== undefined) 
						element[atribute] = field[idiom];
					
					else 
						element[atribute] = field[0];
				}
			})
		});

		return message;
	}


	async function format (query) {

		const message = await dbGFX.find(database.db, database.collection, query);

		//inserir delay variavel aqui

		if (message != null)
		{
			if (message['output'])
				nodecg.sendMessage('keyerChannel', message.output);

			if (message['template']){
				
				nodecg.sendMessage('templateChannel', message.template);

				const dataReplicant = nodecg.Replicant(message.template.src, { persistent: false });
				
				dataReplicant.value = translate(message);
			}
		} 
	}

	function formater (msg)
	{
		try {
			let splice = JSON.parse(msg.toString());

			let query = {"info.eventId": splice["event-id"]};

			//nodecg.log.info('Message received on splice monitor. Id:' + splice["event-id"]);
			
			format(query);

		} catch (error) {
			nodecg.log.error(error);
		}
	}


	//-------------------------------------------------------------------
	// DASHBOARD LANGUAGE CONTROL
	//--------------------------------------------------------------------

	let idiom;

	nodecg.listenFor('languageChannel', (newValue) => {
		idiom = newValue;
	});

	//const idiom = nodecg.Replicant('languageChannel');
	//idiom.value = translate(message);


	//-------------------------------------------------------------------
	// MONITOR GUI AND INJECT (DB and ANCI)
	//--------------------------------------------------------------------

	async function insertDatabase (id, newValue) {

		//let toSendDatabase = Object.assign({}, messageToDatabase);
		let toSendDatabase = {
			info: {
			},
		};

		toSendDatabase.info.eventId = id;
		toSendDatabase.info.timestamp = Date.now();
		toSendDatabase.info.injectCount = 1;

		for (let prop in newValue) 
			toSendDatabase[prop] = newValue[prop];

		const message = await dbGFX.insert(database.db, database.collection, toSendDatabase);
	}

	function insertInjector(id) {

		let toSendInjector = messageToInjector.slice();

		toSendInjector = toSendInjector.replace ("splice-id", id);

		spliceInjector.openSocket (toSendInjector);

	}

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