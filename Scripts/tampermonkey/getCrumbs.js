function BTN() {
	// 1. Create the button
	let button = document.createElement("button");
	button.innerHTML = "copy path";
	// 2. Add event handler
	button.addEventListener ("click", function() {
		getCrumbs();
	});
	// 3. Append somewhere
	let navi = document.getElementsByClassName('cr-topbar__breadcrumbs')[0];
	navi.insertAdjacentElement('afterend',button);
}
BTN();
function getCrumbs() {
	let text = $('.cr-topbar__breadcrumbs')[0].innerText.replace(/(\n)+/g,' > '); //puts the aray into a string
	console.log(text);
	const textarea = document.createElement('textarea');
	textarea.innerHTML = text;
	textarea.setAttribute('readonly', '');
	textarea.style.position = 'absolute';
	textarea.style.left = '-9999px';
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand('copy');
	document.body.removeChild(textarea);
}