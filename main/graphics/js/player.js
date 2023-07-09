	/*
	var video = document.getElementById('back');
 	//var videoSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
	var videoSrc = 'public/teste.m3u8';

	if (Hls.isSupported()) {
		var hls = new Hls();
		hls.loadSource(videoSrc);
		hls.attachMedia(video);
	}
	*/

	/*
	let hls = new Hls({backBufferLength:30, autoStartLoad:false, debug:true});
                hls.loadSource(src);
                hls.attachMedia(v);
                v.addEventListener('play', () => hls.startLoad(), {once:true});
	*/

	/*var ctime = player.currentTime();
	player.currentTime(0);
	player.currentTime(ctime);
	*/

	var absolutePath = function (href) {
		let link = document.createElement("a");
		link.href = href;

		let src = link.href;
		link.remove();
		return src;
	}

	
	nodecg.listenFor('templateChannel', (template) => {

		let id = template.layer;
		let src = absolutePath (template.src);

		const layer = document.getElementById("layer" + id);

		if (layer == null)
		{
			let iframe = document.createElement('iframe');

			iframe.id = "layer" + id;
			iframe.classList.add("layer");
			iframe.src = src;
			iframe.title = "layer" + id;
			iframe.style = "z-index: " + id;

			wrapper.appendChild(iframe);
		}

		else if (src != layer.src)
			layer.src = src;

	})

	nodecg.listenFor('keyerChannel', (output) => {

		const layers = document.getElementsByClassName("layer");

		for (let layer of layers)
		{
			if (output.on) {
				layer.classList.remove("fadeOut");
				layer.classList.add("fadeIn");
			}

			else {
				layer.classList.remove("fadeIn");
				layer.classList.add("fadeOut");
			}
		}
	});