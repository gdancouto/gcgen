const { MongoClient } = require("mongodb");

module.exports = class myDB {
	
	constructor(uri) {

		this.client = new MongoClient(uri);
	}

	insert = async function (db, collection, doc) {
		try {

			const database = this.client.db(db);
			const table = database.collection(collection);

			return await table.insertOne(doc);
		}

		catch (e) {
			throw e;
		}

		finally {
		}
	};

	find = async function (db, collection, query)
	{
		try {

			const database = this.client.db(db);
			const table = database.collection(collection);

			return await table.findOne(query);
		}

		catch (e) {
			throw e;
		}
	
		finally {
	  }
	}
}