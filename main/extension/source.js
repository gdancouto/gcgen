const dgram = require("dgram");

//-------------------------------------------------------------------
// SOURCE DASHBOARD
//--------------------------------------------------------------------

module.exports = (nodecg, config) => {

	nodecg.listenFor('streamChannel', (newValue) => {

		try {

            let address = (config.rx.ipSwitch).split(":");
			
            const switchSocket = dgram.createSocket("udp4");

			switchSocket.send(newValue, address[1], address[0]); 

		} catch (error) {
			nodecg.log.error(error);
		}
	});
}