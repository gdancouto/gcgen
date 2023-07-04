const dgram = require("dgram");
const exec = require('child_process').exec;

/*-------------------------------------------------------------------
MONITOR SPLICE IN ANCILLARY STREAM AND
CALLBACK FUNCTION WITH THE RAW CONTENT
--------------------------------------------------------------------*/

module.exports = (nodecg, config, callback) => {

    try {
        //openScript();
        openSocket();

    } catch (error) {
        nodecg.log.error(error);
    }
    
    function openScript(){

        const spliceScript = exec(
            'sh bundles/main/scripts/monitor.sh ' 
            + config.rx.ipInput1 + ' ' 
            + config.rx.ipInput2 + ' '
            + config.rx.ipSwitch + ' '
            + config.rx.ipSplice + ' '
            + config.rx.ipPlayer);


        spliceScript.stdout.on('data', (data)=>{ 
            nodecg.log.info(data); 
        });
        
        spliceScript.stderr.on('data', (data)=>{
            nodecg.log.info(data);
        });

    }

    function openSocket (){

        let address = (config.rx.ipSplice).split(":");

        const spliceMonitor = dgram.createSocket("udp4");

        spliceMonitor.bind(address[1], address[0]); 


        spliceMonitor.on("error", function (err) {
            nodecg.log.error(err);
        });

        spliceMonitor.on("listening", function () {
            nodecg.log.info('Listening on splice monitor socket');
        });

        spliceMonitor.on('close',function() {
            nodecg.log.info('Splice monitor socket closed');
        });

        spliceMonitor.on("message", function(msg, info) {
            callback (msg);
        });
    }
}
