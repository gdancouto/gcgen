const dgram = require("dgram");

/*-------------------------------------------------------------------
MONITOR SPLICE IN ANCILLARY STREAM AND
CALLBACK FUNCTION WITH THE RAW CONTENT
--------------------------------------------------------------------*/

module.exports = (nodecg, config, callback) => {

    try {
        openSocket();

    } catch (error) {
        nodecg.log.error(error);
    }

    function openSocket (){

        let address = (config.rx.ipMonitor).split(":");

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
