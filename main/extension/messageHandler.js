/*-------------------------------------------------------------------
RECEIVE FORMATED MESSAGES, EITHER FROM COMMANDS DATABASE OR INTERFACE
PROCESS AND SEND TO CORRESPONDING TEMPLATE CHANNEL
--------------------------------------------------------------------*/

module.exports = (nodecg) => {

    const idiom = nodecg.Replicant('idiomChannel');

    //FUNCTION TO CHECK INTEGRITY AND SCHEMA CONFORMITY

	function dispatch (message) {

		if (message != null)
		{
			if (message['output'])

				nodecg.sendMessage('keyerChannel', message.output);

			if (message['template']){
				
				nodecg.sendMessage('templateChannel', message.template);

				const dataReplicant = nodecg.Replicant(message.template.src, { persistent: false });
				
				dataReplicant.value = translateFields(message);
			}
		}
    }

    function translateFields (message) {

        message.data.forEach(element => {

            Object.keys(element).forEach(function (atribute){

                let field = element[atribute];

                if (Array.isArray(field)) {

                    if (field[idiom.value] !== undefined) 
                        element[atribute] = field[idiom.value];
                    
                    else 
                        element[atribute] = field[0];
                }
            })
        });

        return message;
	}

    return {
        dispatch
    }

}