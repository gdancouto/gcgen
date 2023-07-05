const dgram = require("dgram");

//-------------------------------------------------------------------
// INJECTS XML FORMATED MESSAGES IN THE ANCILLARY STREAM
//--------------------------------------------------------------------

module.exports = (nodecg, config) => {

    function insert (message){

        try {

            let address = config.tx.ipInjector.split(":");

            const spliceInjector = dgram.createSocket("udp4");

            spliceInjector.send(message, address[1], address[0]); 

        } catch (error) {
			nodecg.log.error(error);
		}
    }

    return {
        insert
    }
}