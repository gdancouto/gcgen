const mongo = require("./mongo.js");

/*-----------------.--------------------------------------------------
CREATES INSTANCE OF COMMANDS DATABASE
--------------------------------------------------------------------*/

module.exports = (nodecg, database) => {

    let dbGFX;

    try {
        dbGFX = new mongo(database.uri);

    } catch (error) {
        nodecg.log.error(error);
    }

	async function find (query, callback) {

		try {
            const result = await dbGFX.find(database.db, database.collection, query);

			checkMessage (result);

		} catch (error) {
			nodecg.log.error(error);
		}

        function checkMessage (result) {

        if (result != null)
            callback (result);
        }
	}

    async function insert (message) {

        try {
            const result = await dbGFX.insert(database.db, database.collection, message);

		} catch (error) {
			nodecg.log.error(error);
		}
    }

    return {
        find,
        insert
    }
}