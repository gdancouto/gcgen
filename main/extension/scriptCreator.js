const exec = require('child_process').exec;

module.exports = (nodecg, config) => {
/*
    const config = {
        "id": "PGM",

        "tx": {
        "mode": true,
        "ipInjector": "127.0.0.1:5555"
        },

        "rx": {
        "mode": true,
        "ipMonitor": "127.0.0.1:4444"
        },

        "inputs":{
        "ipSwitch":"127.0.0.1:2222",
        "paths":[
            {
            "type": "file",
            "path": "bundles/main/streams/stream1.ts"
            },
            {
            "type": "ip",
            "path": "239.1.1.1:4445",
            "source": "192.168.1.10"
            }
        ]
        },

        "output":{
            "ipPlayer": "127.0.0.1:7777",
            "recording": false,
            "fileOutput": "bundles/main/streams/injected/stream1.ts"
        }
    }

    const valendo = 
    tsswitch --remote 127.0.0.1:2222 --fast-switch --buffer-packets 14 --max-input-packets 7 --max-output-packets 7 --verbose 
    -I ip 239.1.1.1:4445 --source 192.168.1.10 
    -I fork 'tsp --verbose 
            -I file bundles/main/streams/stream1.ts 
            -P regulate' 
    -O fork "tsp --verbose --realtime 
            -P spliceinject --service 1 --udp 127.0.0.1:5555 
            -P splicemonitor --json-udp 127.0.0.1:4444 
            -P fork 'tsp -O file bundles/main/streams/injected/stream1.ts' 
            -O ip 127.0.0.1:7777"

    tsswitch --remote 127.0.0.1:2222 --fast-switch --buffer-packets 14 --max-input-packets 7 --max-output-packets 7 --verbose -I fork 'tsp --verbose -I file bundles/main/streams/stream1.ts -P regulate' -I ip 239.1.1.1:4445 --source 192.168.1.10 -O fork "tsp --verbose --realtime -P spliceinject --service 1 --udp 127.0.0.1:5555 -P splicemonitor --json-udp 127.0.0.1:4444 -P fork 'tsp -O file bundles/main/streams/injected/stream1.ts' -O ip 127.0.0.1:7777"
`;
*/

    try {
        openScript();

    } catch (error) {
        nodecg.log.error(error);
    }


    function openScript (){

        let command = scriptCreate ();

        const spliceScript = exec(command);

        nodecg.log.info(command);

        spliceScript.stdout.on('data', (data)=>{ 
            nodecg.log.info(data); 
        });
        
        spliceScript.stderr.on('data', (data)=>{
            nodecg.log.info(data);
        });
    }

    function scriptCreate () {

        let script = ``;

        try {

            script += `tsswitch --remote ${config.inputs.ipSwitch} --fast-switch --buffer-packets 14 --max-input-packets 7 --max-output-packets 7 --verbose `;
            script += `${generateInputs()}`;
            script += `-O fork "tsp --verbose --realtime ${generateSpliceManipulators()}`;
            script += `${generateOutputFile()} -O ip ${config.output.ipPlayer}"`;

        }
        catch (error){
            nodecg.log.error (error);
        }

        return script;
    }

    function checkInputs ()
    {
        let inputs = config.inputs.paths;
        return inputs.length;
    }

    function generateInputs ()
    {
        let inputs = config.inputs.paths;
        let argument = ``;
        let option = ``;

        if (!config.output.recording)
            option = `--infinite `;

        for (let input of inputs){

            if (input.type == "file")
                argument += `-I fork "tsp --verbose -I file ${option}${input.path} -P regulate" `;

            else if (input.type == "ip")
                argument += `-I ip ${input.path} --source ${input.source} `;
        }

        return argument;
    }

    function generateSpliceManipulators ()
    {
        let argument = ``;
        let ipInjector = config.tx.ipInjector;
        let ipMonitor = config.rx.ipMonitor;
        
        if (config.tx.mode)
            argument += `-P spliceinject --service 1 --udp ${ipInjector} `;
        
        if (config.rx.mode)
            argument += `-P splicemonitor --json-udp ${ipMonitor} `;

        return argument;
    }

    function generateOutputFile ()
    {
        let argument = ``;

        if (config.output.recording)
            argument = `-P fork 'tsp -O file ${config.output.fileOutput}'`;

        return argument;
    }

    return {
        checkInputs
    }
}