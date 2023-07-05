function templateChannel (path) {
    
    const dataReplicant = nodecg.Replicant(path, 'main');
    //const dataReplicant = nodecg.Replicant(window.location.pathname, 'main');

    const elems = document.body.getElementsByClassName("anim");

    dataReplicant.on('change', (newValue, oldValue) => {

        newValue.data.forEach(function (element) {

            Object.keys(element).forEach(function (atribute){
                
                if (atribute == 'id') {
                }

                else if (atribute == "value")
                    document.getElementById(element.id).innerHTML = element[atribute];

                else
                    document.getElementById(element.id).setAttribute(atribute, element[atribute]);
            });

            for (let i = 0; i < elems.length; i++) {

                let classes = elems[i].className;
                let mainClass = classes.split(' ')[0];
                let oldState = classes.split(' ')[2];
                let newState = mainClass + '-' + newValue.template.command;

                elems[i].classList.replace(oldState, newState);
            };
        });
    });
}