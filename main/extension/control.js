const exec = require('child_process').exec;

//-------------------------------------------------------------------
// CONTROL DASHBOARD
//--------------------------------------------------------------------

module.exports = (nodecg, config) => {
	
    nodecg.listenFor('monitorChannel', (newValue) => {

    if (newValue == '1') 
        openPlayer ('239.1.1.1:4445');

    });

    function openPlayer (ip){

        try {
            const monitorPlayer = exec('sh bundles/main/scripts/player.sh ' + ip);

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
}