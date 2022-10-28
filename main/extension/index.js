//const axios = require('axios');
//const { clear } = require('console');
var dgram = require("dgram"); //const
const xml2js = require('xml2js');

var socket = dgram.createSocket("udp4");




// encapsular objeto 
socket.on("error", function (err) {
	console.log("server error:\n" + err.stack);
	socket.close();
});

socket.on("listening", function () {
	var address = socket.address();
	console.log("server listening " + address.address + ":" + address.port);
});

socket.on('close',function() {
	console.log('Socket is closed !');
  });

socket.on("message", function(msg, info) {
    console.log('I got this message from SPLICE');

	const parser = new xml2js.Parser({ attrkey: "atributes", explicitArray: false});

	parser.parseString(msg, function(error, result) {
		if(error) {
			console.log(error);
		}
		else {
			splice = result;
			//console.log(getObject(splice, 'splice_information_table'));
			console.log(JSON.stringify(result));
		}
	});
});

socket.bind(4444,'localhost'); 

/* se for escrever no socket. Endereco eh o mesmo?
socket.send(data,2222,'localhost',function(error) {
	if(error){
	  socket.close();
	}else{
	  console.log('Data sent !!!');
	}
  });
*/

// encapsular. Web sovket? como fazer se for API? event emitter
var socketDB = dgram.createSocket("udp4");

socketDB.on("error", function (err) {
	console.log("server error:\n" + err.stack);
	socketDB.close();
});

socketDB.on("listening", function () {
	var address = socketDB.address();
	console.log("server listening " + address.address + ":" + address.port);
});

socketDB.on('close',function() {
	console.log('Socket is closed !');
  });

/*
socketDB.on("message", function(msg, info) {
    console.log('I got this message from DB');
	message = JSON.parse(msg);

	//console.log(message.data); //try catch, se n existir elemento

});
*/

socketDB.bind(5555,'localhost'); 


// encapsular

function isNew (newMessage, oldMessage) {

	if (Object.keys(oldMessage).length === 0) 
		return true;
		
	else if (newMessage.info.eventId != oldMessage.info.eventId)
		return true;
		
	else return false;
}


function isDestination (message, id) {
	return message.output.id == id;
}

let state = {
	id: "PGM",
	visibility: true,
	layers: [],
	oldMessage: {},
	newMessage:{}
}

module.exports = nodecg => {

	let id = "PGM";
	const visibility = nodecg.Replicant('visibility');
	const layer = nodecg.Replicant('layer');
	let oldMessage = {};
	

	socketDB.on("message", function(msg, info) {

		try {
			let message = JSON.parse(msg); 
			
			//validar schema

			if (isDestination(message, id) )//&& (isNew(message, oldMessage)) REATIVAR
			{
				oldMessage = message;

				visibility.value = message.output.on;

				layer.value[message.template.layer] = message.template.src;

				const dataReplicant = nodecg.Replicant(message.template.src);

				dataReplicant.value = message;
			}
			
		} catch (error) {
			nodecg.log.error(error);
		}
	});

}