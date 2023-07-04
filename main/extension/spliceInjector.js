const dgram = require("dgram");
const exec = require('child_process').exec;

//-------------------------------------------------------------------
// INJECTS XML FORMATED MESSAGES IN THE ANCILLARY STREAM
//--------------------------------------------------------------------

module.exports = (nodecg, config) => {

    try {
       // openScript();

    } catch (error) {
        nodecg.log.error(error);
    }
    

    function openScript (){

        let command;

        if (config.tx.recording)
            command = 'sh bundles/main/scripts/injectorRec.sh ';
    
        else
            command = 'sh bundles/main/scripts/injector.sh ';

        const spliceScript = exec(
            command + ' '
            + config.tx.fileInput + ' ' 
            + config.tx.fileOutput + ' '
            + config.tx.ipSplice + ' '
            + config.tx.ipOutput);


        spliceScript.stdout.on('data', (data)=>{ 
            nodecg.log.info(data); 
        });
        
        spliceScript.stderr.on('data', (data)=>{
            nodecg.log.info(data);
        });

    }

    function insert (message){

        try {

            let address = config.tx.ipSplice.split(":");

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