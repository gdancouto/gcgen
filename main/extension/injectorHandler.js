/*-------------------------------------------------------------------
RECEIVE FORMATED MESSAGES FROM INTERFACE
PROCESS AND SENDS TO DATABASE AND ANCI INJECTOR
--------------------------------------------------------------------*/

module.exports = (nodecg, config, profile) => {

    const spliceInjector = require("./spliceInjector.js") (nodecg, config);
    const commandsDatabase = require ("./commandsDatabase.js") (nodecg, profile);

    // CHECK IF MESSAGE VALID AND SCHEMA

    function messageToInjector (id, msg){
        
        const message = 
            `<?xml version="1.0" encoding="UTF-8"?>
            <tsduck>
            <splice_information_table protocol_version="0" pts_adjustment="0" tier="0x0FFF">
                    <splice_insert splice_event_id="${id}" splice_event_cancel="false"  out_of_network="true" splice_immediate="true"  unique_program_id="0x00" avail_num="0" avails_expected="0">
                    </splice_insert>
                <splice_avail_descriptor identifier="0x43554549" provider_avail_id="0x00000012"/>
            </splice_information_table>
            </tsduck>`;
            
        return message;
    }

    function messageToDatabase (id, msg){

        let message = {
            info: {
                eventId: id,
                timestamp: Date.now(),
            },
        };

        try {
            for (let prop in msg) 
                message[prop] = msg[prop];

        } catch (error) {
            nodecg.log.error(error);
        }

        return message;
    }

    function generateIdentifier (min, max) {
		min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min) + min); 
	}

    async function insert (message){

        const id = generateIdentifier(1, Math.pow(2,32)-2);

        spliceInjector.insert (messageToInjector(id, message));

        const result = await commandsDatabase.insert(messageToDatabase(id, message));
    }

    return {
        insert
    }
}