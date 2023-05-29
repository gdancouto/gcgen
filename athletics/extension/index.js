var dgram = require("dgram"); 
const fs = require('fs');

module.exports = nodecg => {

    const startlistIN = nodecg.Replicant('ath/starlistIN');
	const startlistOUT = nodecg.Replicant('ath/starlistOUT');

	startlistIN.on('change', (newValue, oldValue) => {

		try {

            console.log ("STSR IN");

		} catch (error) {
			nodecg.log.error(error);
		}
	});

	startlistOUT.on('change', (newValue, oldValue) => {

		try {

			console.log ("START OUT");
			
		} catch (error) {
			nodecg.log.error(error);
		}
	});

}