var dgram = require("dgram"); //const

module.exports = class mySocket {
	
	constructor(_host, _port, _user, _pass) {

		this.host = _host;
		this.port = _port;
		this.socket = dgram.createSocket("udp4");
	}

	

	insert = async function (db, collection, doc) {
		try {

			const database = this.client.db(db);
			const table = database.collection(collection);

			return await table.insertOne(doc);

			//console.log(`Inserted at ${db}/${collection} with the _id: ${result.insertedId}`);
			//return this.result;
		}

		catch (e) {
			//console.log(e); // throw
			throw e;
			console.log ("trhwouzou");
		}

		finally {
			await this.client.close();
			//console.log ("fechou");
			//return this.result.insertedId;
		}
	};
	
}






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