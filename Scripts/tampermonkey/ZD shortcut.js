let tab = document.getElementsByClassName('ember-view tab web selected'),
	cross = document.querySelector('.ember-view.tab.selected .tab-content-holder button');

function logMouseButton(e) {
	if (e.which == 0) {
		e.preventDefault();
		alert("middle button"); 
		}
	}

document.addEventListener("auxclick", logMouseButton(e));
tab.addEventListener("auxclick", logMouseButton(e));


let tab = $('div[aria-label="Tabs"] div.LRgm.LRb.LRgn.LRgo');
tab.toArray().forEach(element => {
	console.log(element);
	let cross = element.querySelector('.LRb button');
	console.log(cross);
	element.addEventListener("auxclick", function(e) { 
		if (e.which == 2) {
		   e.preventDefault();
		   console.log("middle button");
		   //cross.click();
		}
	 });
});