const mongo = require("./mongo.js");
var dgram = require("dgram"); 
const exec = require('child_process').exec;

// CHeck if missing files

const config = require('../data/config.json');

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

let state = {
	idiom: 0,
	layers: [],
	oldMessage: {},
	newMessage:{},
	messageBuffer: [],
};

//-------------------------------------------------------------------
// IF GC OPERATING AS PRIMARY GENERATOR
//-------------------------------------------------------------------

if (config.TXmode){

	let command;

	if (config.tx.recording)
		command = 'sh bundles/main/scripts/injectorREC.sh ';

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

	//const monitorPlayer = exec('sh bundles/main/scripts/player.sh ' + config.tx.ipOutput);

	//monitorPlayer.stdout.on('data', (data)=>{ 
	//	console.log(data); 
	//});
	
	//monitorPlayer.stderr.on('data', (data)=>{
	//	console.error(data);
	//});
}

//-------------------------------------------------------------------
// IF GC OPERATING AS REPLICA
//-------------------------------------------------------------------

if (config.RXmode){
	console.log("Modo de recepcao");

	const spliceMonitor = exec(
		'sh bundles/main/scripts/monitor.sh ' 
		+ config.rx.ipInput1 + ' ' 
		+ config.rx.ipInput2 + ' '
		+ config.rx.ipRemote + ' '
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

	dbGFX = new mongo(config.db.user, config.db.pass);

	//-------------------------------------------------------------------
	// RECEBE UM JSON DA GFX COMMANDS DATABASE
	//--------------------------------------------------------------------

	function translate (message) {

		let language = state.idiom;

		message.data.forEach(element => {

			Object.keys(element).forEach(function (atribute){

				let field = element[atribute];

				if (Array.isArray(field)) {

					if (field[language] !== undefined) 
						element[atribute] = field[language];
					
					else 
						element[atribute] = field[0];
				}
			})
		});

		return message;
	}


	async function format (query) {

		const message = await dbGFX.find("db","got", query);

		//console.log(message);

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
	// SOCKET RECEBE UM JSON DO SPLICE MONITOR
	//--------------------------------------------------------------------

	var socketANC = dgram.createSocket("udp4");

	socketANC.bind(4444,'localhost'); 

	socketANC.on("error", function (err) {
		nodecg.log.error(err);
		socketANC.close();
	});

	socketANC.on("listening", function () {
		var address = socketANC.address();

		console.log("Listening ANC RX:  " + address.address + ":" + address.port);
	});

	socketANC.on('close',function() {
		console.log('socketANC is closed!');
	});

	socketANC.on("message", function(msg, info) {
		console.log('Got message from SPLICE');
		

		try {
			let splice = JSON.parse(msg.toString());

			let query = {"info.eventId": splice["event-id"]};
			console.log(query);
			format(query);

		} catch (error) {
			nodecg.log.error(error);
		}

	});

	

	//-------------------------------------------------------------------
	// MAIN DASHBOARD CONTROL 
	//--------------------------------------------------------------------

	let text = config.rx.ipRemote;
	const address = text.split(":");
	const UDPsender = dgram.createSocket("udp4");

	nodecg.listenFor('streamChannel', (newValue) => {

		try {
			UDPsender.send(newValue, address[1], address[0]); 

		} catch (error) {
			nodecg.log.error(error);
		}
	});


	nodecg.listenFor('languageChannel', (newValue) => {
		state.idiom = newValue;
	});


	//-------------------------------------------------------------------
	// INJECTOR CODE (DB and ANCI)
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

		const message = await dbGFX.insert("db","got", toSendDatabase);
	}

	function insertInjector(id) {

		let toSendInjector = messageToInjector.slice();

		let text = config.tx.ipSplice;
		const address = text.split(":");
		const spliceInjector = dgram.createSocket("udp4");

		toSendInjector = toSendInjector.replace ("splice-id", id);
		spliceInjector.send(toSendInjector, address[1], address[0]); 
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

		finally {
		}
	});

}