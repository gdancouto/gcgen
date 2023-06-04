const mongo = require("./mongo.js");
var dgram = require("dgram"); 
const exec = require('child_process').exec;

// read file
const config = { 
	id: "PGM",
	TXmode: true,
	RXmode: true,

	tx:{
		fileInput: "bundles/main/streams/stream1.ts",
		fileOutput: "bundles/main/streams/stream2.ts",
		ipOutput: "239.1.1.1:4445",
		ipSplice: "5555",
		recording: false,
	},

	rx:{
		ipInput1: "239.1.1.1:4445",
		ipInput2: "239.1.1.2:4445",
		ipRemote: "127.0.0.1:2222",
		ipSplice: "127.0.0.1:4444",
		ipPlayer: "127.0.0.1:7777",
	},

	db:{
		ip: "",
		porta: "",
		user: "host",
		pass: "LZgC86hvXW7f3ttU",
		URI: "mongodb+srv://host:LZgC86hvXW7f3ttU@gcgen.kj6g3v6.mongodb.net/?retryWrites=true&w=majority",
	},
}

const messageToDatabase = { 
	info:{},
	output:{},
	template:{},
	data:{},
}

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

					if (field[language] !== undefined) {
						element[atribute] = field[language];
					} 
					
					else {
						element[atribute] = field[0];
					}
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
			if (message.hasOwnProperty('output'))
				nodecg.sendMessage('keyerChannel', message.output);

			if (message.hasOwnProperty('template'))
			{
				nodecg.sendMessage('templateChannel', message.template);

				const dataReplicant = nodecg.Replicant(message.template.src, { persistent: false });
				
				dataReplicant.value = translate(message);
			}
		} 
	}

	//-------------------------------------------------------------------
	// SOCKET RECEBE UM JSON DO SPLICE INJECTOR
	//--------------------------------------------------------------------

	var socketANC = dgram.createSocket("udp4");

	socketANC.on("error", function (err) {
		nodecg.log.error(err);
		socketANC.close();
	});

	socketANC.on("listening", function () {
		var address = socketANC.address();
		//nodecg.log"server listening " + address.address + ":" + address.port()
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

	socketANC.bind(4444,'localhost'); 

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

	nodecg.listenFor('mainChannel', (newValue) => {

		let messageToSend = Object.assign({}, messageToDatabase);

		try {

			messageToSend.info.eventId = Date.now();
			messageToSend.info.timestamp = Date.now();
			//messageToSend.info.injectCount = 1;

			for (let prop in newValue) 
				messageToSend[prop] = newValue[prop];

			//UDPsender.send('next', address[1], address[0]); 
			
		} catch (error) {
			nodecg.log.error(error);
		}

		finally {
			console.log(messageToSend);
		}
	});


}