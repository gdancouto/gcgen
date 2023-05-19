const { MongoClient } = require("mongodb");

//not working properly

module.exports = function myDB (_uri) {

	this.uri = _uri;
	this.client = new MongoClient(this.uri);
	

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
