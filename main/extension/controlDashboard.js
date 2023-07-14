const exec = require('child_process').exec;
const dgram = require("dgram");

//-------------------------------------------------------------------
// CONTROL DASHBOARD
//--------------------------------------------------------------------

module.exports = (nodecg, config) => {
	
    nodecg.listenFor('monitorChannel', (newValue) => {

    if (newValue == '1') 
        openPlayer (config.output.ipPlayer);

    });

    function openPlayer (ip){

        try {
            const monitorPlayer = exec(`ffplay -loglevel warning -sync ext -fflags nobuffer -window_title 'Clean Feed' udp://${ip}?overrun_nonfatal=1`);

            monitorPlayer.stdout.on('data', (data)=>{ 
                console.log(data); 
            });
            
            monitorPlayer.stderr.on('data', (data)=>{
                console.error(data);
            });

        } catch (error) {
            nodecg.log.error(error);
        }
    }

    nodecg.listenFor('streamChannel', (newValue) => {

		try {

            let address = (config.inputs.ipSwitch).split(":");
			
            const switchSocket = dgram.createSocket("udp4");

			switchSocket.send(newValue, address[1], address[0]); 

		} catch (error) {
			nodecg.log.error(error);
		}
	});
}