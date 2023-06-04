/*
const message = { 

	template:{
		documentType: "GAMES",
		documentCode: "ATHLETICS",
		src: "../../athletics/graphics/startlist.html",
		layer: "PGM-1",
		command: 0,
	},
	data: [
	{
		"id": "PICTO",
		"src": "public/pictos/ATH.png"
	  },
	  {
		"id": "EVENT",
		"value": ["Athletics", "マッケンジー???"]
	  },
	  {
		"id": "PHASE",
		"value": ["Startlist", "ゾエ・マッケンジー"]
	  },
	  {
	  "id": "NAME_1",
	  "value": ["Zoe MACKENZIE", "ゾエ・マッケンジー"]
	  },
	  {
		"id": "NAME_2",
		"value": ["Susana SCHNARNDORF", "スザナ・シナルンドルフ"]
	  },
	  {
		"id": "NAME_3",
		"value": ["JIANG Yuyan", "蒋 裕燕"]
	  },
	  {
		"id": "NAME_4",
		"value": ["NAKAMURA Tomotaro", "中村 智太郎"]
	  },
	  {
		"id": "NAME_5",
		"value": ["Jose Antonio MARI ALCARAZ", "ホセ アントニオ・マリ アルカラス"]
	  },
	  {
		"id": "TIME_1",
		"value": "15"
	  },
	  {
		"id": "TIME_2",
		"value": "21"
	  },
	  {
		"id": "TIME_3",
		"value": "20"
	  },
	  {
		"id": "TIME_4",
		"value": "25"
	  },
	  {
		"id": "TIME_5",
		"value": "37"
	  },
	  {
		"id": "FLAG_1",
		"src": "public/flags/AUS.png"
	  },
	  {
		"id": "FLAG_2",
		"src": "public/flags/BRA.png"
	  },
	  {
		"id": "FLAG_3",
		"src": "public/flags/CHN.png"
	  },
	  {
		"id": "FLAG_4",
		"src": "public/flags/JPN.png"
	  },
	  {
		"id": "FLAG_5",
		"src": "public/flags/ESP.png"
	  }
	]
}

*/


module.exports = nodecg => {
	
	nodecg.listenFor('athleticsChannel', (newValue) => {

		try {
			//let messageToSend = message;

			//messageToSend.template.command = newValue;
			//messageToSend.template.data = newValue.data; // data comes from HTML

			nodecg.sendMessageToBundle('mainChannel', 'main', newValue);

		} catch (error) {
			nodecg.log.error(error);
		}
	});
}