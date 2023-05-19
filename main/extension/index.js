const mongo = require("./mongo.js");
var dgram = require("dgram"); 

const fs = require('fs');
// read file
const config = { 
	id: "PGM",
	db: {
		ip: "",
		porta: "",
		user: "host",
		pass: "LZgC86hvXW7f3ttU",
	},
	splice:{
		ip: "127.0.0.1",
		porta: "5555",
		user: "",
		pass: "",
	}
}

let state = {
	visibility: true,
	layers: [],
	oldMessage: {},
	newMessage:{},
	messageBuffer: [],
};

module.exports = nodecg => {

	let id = "PGM";
	let language = 0; //permitir mudanca dinamica
	const visibility = nodecg.Replicant('visibility');
	const layer = nodecg.Replicant('layer');
	let oldMessage = {};

	dbGFX = new mongo(config.db.user, config.db.pass);

	//-------------------------------------------------------------------
	// RECEBE UM JSON DA GFX COMMANDS DATABASE
	//--------------------------------------------------------------------

	function translate (message) {

		message.data.forEach(element => {

			Object.keys(element).forEach(function (atribute){

				let field = element[atribute];

				if (Array.isArray(field))
				{

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


	function isDestination (message, id) {
		return message.output.id == id;
	}


	async function format (query) {

		const message = await dbGFX.find("db","got", query);

		//console.log(message);

		//inserir delay variavel aqui

		if (message != null)
		{
			if (isDestination(message, id) )
			{
				oldMessage = message;

				visibility.value = message.output.on;

				layer.value[message.template.layer] = message.template.src;

				const dataReplicant = nodecg.Replicant(message.template.src);

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

			format(query);

		} catch (error) {
			nodecg.log.error(error);
		}

	});

	socketANC.bind(4444,'localhost'); 


}