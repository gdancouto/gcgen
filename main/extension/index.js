const mongo = require("./mongo.js");
var dgram = require("dgram"); 
const exec = require('child_process').exec;

// CHeck if missing files

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

/* let state = {
	idiom: 0,
	layers: [],
	oldMessage: {},
	newMessage:{},
	messageBuffer: [],
}; */

//-------------------------------------------------------------------
// IF GC OPERATING AS PRIMARY GENERATOR
//-------------------------------------------------------------------

if (config.TXmode){

	let command;

	if (config.tx.recording)
		command = 'sh bundles/main/scripts/injectorRec.sh ';

	else
		command = 'sh bundles/main/scripts/injector.sh ';

	const spliceInjector = exec(
		command + ' '
		+ config.tx.fileInput + ' ' 
		+ config.tx.fileOutput + ' '
		+ config.tx.ipSplice + ' '
		+ config.tx.ipOutput);


	spliceInjector.stdout.on('data', (data)=>{ 
		console.log(data); 
	});
	
	spliceInjector.stderr.on('data', (data)=>{
		console.error(data);
	});



	const monitorPlayer = exec('sh bundles/main/scripts/player.sh ' + config.tx.ipOutput);

	monitorPlayer.stdout.on('data', (data)=>{ 
		console.log(data); 
	});
	
	monitorPlayer.stderr.on('data', (data)=>{
		console.error(data);
	});
}

//-------------------------------------------------------------------
// IF GC OPERATING AS REPLICA
//-------------------------------------------------------------------

if (config.RXmode){

	const spliceMonitor = exec(
		'sh bundles/main/scripts/monitor.sh ' 
		+ config.rx.ipInput1 + ' ' 
		+ config.rx.ipInput2 + ' '
		+ config.rx.ipSwitch + ' '
		+ config.rx.ipSplice + ' '
		+ config.rx.ipPlayer);

	spliceMonitor.stdout.on('data', (data)=>{ 
		console.log(data); 
	});
	
	spliceMonitor.stderr.on('data', (data)=>{
		console.error(data);
	});
}


module.exports = nodecg => {

	dbGFX = new mongo(database.user, database.pass);

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

	//-------------------------------------------------------------------
	// SPLICE MONITOR SOCKET RECEIVER
	//--------------------------------------------------------------------
	
	let spliceAddress = (config.rx.ipSplice).split(":");
	var spliceMonitor = dgram.createSocket("udp4");

	spliceMonitor.bind(spliceAddress[1], spliceAddress[0]); 

	spliceMonitor.on("error", function (err) {
		nodecg.log.error(err);
		spliceMonitor.close();
	});

	spliceMonitor.on("listening", function () {
		nodecg.log.info('Listening on splice monitor socket');
	});

	spliceMonitor.on('close',function() {
		nodecg.log.info('Splice monitor socket closed');
	});

	spliceMonitor.on("message", function(msg, info) {
		
		try {
			let splice = JSON.parse(msg.toString());

			let query = {"info.eventId": splice["event-id"]};

			nodecg.log.info('Message received on splice monitor. Id:' + splice["event-id"]);
			
			format(query);

		} catch (error) {
			nodecg.log.error(error);
		}

	});

	
	//-------------------------------------------------------------------
	// MAIN DASHBOARD CONTROL 
	//--------------------------------------------------------------------

	let switchAdress = (config.rx.ipSwitch).split(":");
	const switchSocket = dgram.createSocket("udp4");

	nodecg.listenFor('streamChannel', (newValue) => {

		try {
			switchSocket.send(newValue, switchAdress[1], switchAdress[0]); 

		} catch (error) {
			nodecg.log.error(error);
		}
	});

	//-------------------------------------------------------------------
	// LANGUAGE CONTROL
	//--------------------------------------------------------------------

	let idiom;

	nodecg.listenFor('languageChannel', (newValue) => {
		idiom = newValue;
	});

	//const idiom = nodecg.Replicant('languageChannel');
	//idiom.value = translate(message);


	//-------------------------------------------------------------------
	// LISTEN MAIN CHANNEL AND INJECT (DB and ANCI)
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

		const injectorAddress = config.tx.ipSplice.split(":");
		const spliceInjector = dgram.createSocket("udp4");

		toSendInjector = toSendInjector.replace ("splice-id", id);
		spliceInjector.send(toSendInjector, injectorAddress[1], injectorAddress[0]); 
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