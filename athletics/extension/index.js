module.exports = nodecg => {
	
	nodecg.listenFor('athleticsChannel', (newValue) => {

		try {
			nodecg.sendMessageToBundle('mainChannel', 'main', newValue);

		} catch (error) {
			nodecg.log.error(error);
		}
	});
}