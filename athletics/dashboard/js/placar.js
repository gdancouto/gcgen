const datasReplicant = nodecg.Replicant("../../athletics/graphics/placar.html", 'main',  {persistent: false });
//const dataReplicant = nodecg.Replicant("bundles/athletics/graphics/placar.html", 'main',  {persistent: false });

placarIN.onclick = () => {
    sendMainChannel ("PGM", 1, placarMessage);
};

placarOUT.onclick = () => {
    sendMainChannel ("PGM", 2, placarMessage);
};


datasReplicant.on('change', (newValue, oldValue) => {

    if (oldValue) {
    //if (newValue.template.channel = "PGM") {

        if (newValue.template.command == 1)
            dataReceived (placarIN);

        if (newValue.template.command == 2)
            dataReceived (placarOUT);
    }

});

const placarMessage = { 

    template:{
        domain: "GAMES",
        package: "athletics",
        graphic: "placar",
        src: "../../athletics/graphics/placar.html",
        channel: "",
        layer: 2,
        command: 0,
    },

    data: [
    {
        "id": "PICTO",
        "src": "pictos/ATH.png"
    },
    {
        "id": "EVENT",
        "value": ["Athletics", "マッケンジー???"]
    },
    {
        "id": "PHASE",
        "value": ["Startlist", "ゾエ・マッケンジー"]
    }]
}
