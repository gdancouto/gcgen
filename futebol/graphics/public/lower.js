function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var animationId = getParameterByName('id');
if (animationId === undefined || animationId === null) {
	animationId = '1';
}

switch (animationId) {
	case '1':
		document.writeln('<div id="animation-1" class="animation">');
		document.writeln('	<div class="color2">/</div>');
		document.writeln('	<div class="color1 light mask">');
		document.writeln('	  <div>' + line1 + '</div>');
		document.writeln('	</div>');
		document.writeln('	<div class="color1 light mask">');
		document.writeln('	  <div>' + line2 + '</div>');
		document.writeln('	</div>');
		document.writeln('</div>');
		break;
	case '2':
		document.writeln('<div id="animation-2" class="animation">');
		document.writeln('	<div class="color2 bold arimo mask">');
		document.writeln('	  <div>' + line1 + '</div>');
		document.writeln('	</div>');
		document.writeln('	<div class="color1 light mask">');
		document.writeln('	  <div>' + line2 + '</div>');
		document.writeln('	</div>');
		document.writeln('</div>');
		break;
	case '3':
		document.writeln('<div id="animation-3" class="animation">');
		document.writeln('	<div class="color1 light mask">');
		document.writeln('	  <div>' + line1 + '</div>');
		document.writeln('	</div><div class="color2 bold arimo mask">');
		document.writeln('	  <div>' + line2 + '</div>');
		document.writeln('	</div>');
		document.writeln('</div>');
		break;
	case '4':
		document.writeln('<div id="animation-4" class="animation">');
		document.writeln('	<div class="color1 bold arimo mask">');
		document.writeln('	  <div>' + line1 + '</div>');
		document.writeln('	</div>');
		document.writeln('	<div class="mask"><div class="back2"></div></div>');
		document.writeln('</div>');
		break;
	case '5':
		document.writeln('<div id="animation-5" class="animation">');
		document.writeln('	<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">');
		document.writeln('		<defs>');
		document.writeln('			<clipPath id="mask-bottom-right">');
		document.writeln('				<rect class="clip-path" x="70%" y="0" width="30%" height="100%"/>');
		document.writeln('			</clipPath>');
		document.writeln('			<clipPath id="mask-top">');
		document.writeln('				<rect class="clip-path" x="0" y="0" width="100%" height="100%"/>');
		document.writeln('			</clipPath>');
		document.writeln('			<clipPath id="mask-bottom-left">');
		document.writeln('				<rect class="clip-path" x="0" y="0" width="30%" height="100%"/>');
		document.writeln('			</clipPath>');
		document.writeln('		</defs>');
		document.writeln('		<line class="bottom-right" x1="70%" y1="100%" x2="100%" y2="100%"/>');
		document.writeln('		<line class="right" x1="100%" y1="0" x2="100%" y2="100%"/>');
		document.writeln('		<line class="top" x1="0" y1="0" x2="100%" y2="0"/>');
		document.writeln('		<line class="left" x1="0" y1="0" x2="0" y2="100%"/>');
		document.writeln('		<line class="bottom-left" x1="0" y1="100%" x2="30%" y2="100%"/>');
		document.writeln('	</svg>');
		document.writeln('	<div class="color1 bold arimo mask">');
		document.writeln('	  <div>' + line1 + '</div>');
		document.writeln('	</div>');
		document.writeln('	<div class="color1 mask">');
		document.writeln('	  <div>' + line2 + '</div>');
		document.writeln('	</div>');
		document.writeln('</div>');
		document.writeln('<style>');
		document.writeln('#animation-5 line {');
		document.writeln('  stroke: #' + color2 + ';');
		document.writeln('}');
		document.writeln('</style>');
		break;
}

document.writeln('<style>');
document.writeln('.color1 {');
document.writeln('  color: #' + color1 + ';');
document.writeln('}');
document.writeln('.color2 {');
document.writeln('  color: #' + color2 + ';');
document.writeln('}');
document.writeln('.back1 {');
document.writeln('  background-color: #' + color1 + ' !important;');
document.writeln('}');
document.writeln('.back2 {');
document.writeln('  background-color: #' + color2 + ' !important;'); 
document.writeln('}');
document.writeln('</style>');
