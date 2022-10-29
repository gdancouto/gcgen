var dgram = require("dgram"); //const
const xml2js = require('xml2js');

var socket = dgram.createSocket("udp4");
const { MongoClient } = require("mongodb");



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

const doc = {
	id: "SWM100MBA",
	discipline: ["Swimming", "競泳"],
	event: ["Men's 100m Breaststroke","男子100m平泳ぎ"],
	content: "Test"
  }

function myDB (_uri) {

    this.uri = _uri;
	this.client = new MongoClient(this.uri);

	this.insert = async function (db, collection, doc)
	{
		try{

			const database = this.client.db(db);
			const table = database.collection(collection);

			const result = await table.insertOne(doc);

			console.log(`Inserted at ${db}/${collection} with the _id: ${result.insertedId}`);
			return result.insertedId;
		}
		
		catch (error) {
			console.log.error(error);
		}
		
		finally {
			await this.client.close();
		}
	}
}


translationDB = new myDB("mongodb+srv://host:PYiRipXX5tC9AqC7@gcgen.kj6g3v6.mongodb.net/?retryWrites=true&w=majority");

translationDB.insert("translation", "athletes", doc);


/*

const uri = "mongodb+srv://host:PYiRipXX5tC9AqC7@gcgen.kj6g3v6.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);




async function insert() {

	try {
  
		const database = client.db("translation");
		const codes= database.collection("codes");
  

  
	  const result = await codes.insertOne(doc);
  
	  console.log(`A document was inserted with the _id: ${result.insertedId}`);
	}
	
	catch (error) {
		console.log.error(error);
	}
  
	 finally {
	  await client.close();
	}
}

  insert().catch(console.dir);



async function run() {
  try {

	const database = client.db("translation");
	const codes= database.collection("codes");

    const query = { id: "SWM100MBA" };
    const obj = await codes.findOne(query);
    console.log(obj);
  }
	catch (error) {
		console.log.error(error);
	}

   finally {
    await client.close();
  }
}
run().catch(console.dir);

*/


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