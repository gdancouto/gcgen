/*-------------------------------------------------------------------
RECEIVE NOTIFICATIONS FROM ANCILLARY
PROCESS AND SENDS MESSAGE TO INDEX
--------------------------------------------------------------------*/

module.exports = (nodecg, config, profile) => {

    const spliceMonitor = require("./spliceMonitor.js") (nodecg, config, parseNotification);
    const commandsDatabase = require ("./commandsDatabase.js") (nodecg, profile);

    function parseNotification (msg) {
        try {
			let splice = JSON.parse(msg.toString());

            let query = {"info.eventId": splice["event-id"]};

			nodecg.log.info('Message received on splice monitor. ID:' + splice["event-id"]);

            find (query);

		} catch (error) {
			nodecg.log.error(error);
		}
    }

    async function find (query){

        const message = await commandsDatabase.find (query, (message) => {
            
            nodecg.sendMessage('ancillaryChannel', message);

        });
    }
    
    return {
        parseNotification
    }

}