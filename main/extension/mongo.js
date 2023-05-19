const { MongoClient } = require("mongodb");

module.exports = class myDB {
	
	constructor(_user, _pass) {

		this.uri = `mongodb+srv://${_user}:${_pass}@gcgen.kj6g3v6.mongodb.net/?retryWrites=true&w=majority`;
		this.client = new MongoClient(this.uri);
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