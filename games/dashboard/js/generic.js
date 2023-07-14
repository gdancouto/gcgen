 function createChannel (package, source, buttons, message) {

    // RX FUNCTIONS -----------------------------------------------------------------------------------------------------------------
    
    const dataReplicant = nodecg.Replicant(source, 'main',  {persistent: false });

    dataReplicant.on('change', (newValue, oldValue) => {
        
        if (newValue.template.package == package){

            let id = newValue.template.command - 1;

            buttons[id].classList.add ("blink");

            setTimeout (function (){
                buttons[id].classList.remove ("blink");
            },1000);
        }
    });


    // TX FUNCTIONS ------------------------------------------------------------------------------------------------------------------

    for (let i = 0; i < buttons.length; i++)
    {
        let button = buttons[i];

        button.onclick = () => {
            sendMainChannel ("PGM", i+1, message);
        };
    }

    function sendMainChannel (channel, command, message)
    {
        let messageToSend = Object.assign({}, message);

        messageToSend.template.package = package;
        messageToSend.template.src = source;
        messageToSend.template.channel = channel;
        messageToSend.template.command = command;
        

        nodecg.sendMessageToBundle('mainChannel', 'main', messageToSend);
    }
}