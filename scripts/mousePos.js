// mousePos.js
// Ethan Kerr

// let canvas = document.getElementById("canvas");

/*
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

document.addEventListener("mousemove", function(evt) {
	let pos = getMousePos(document, evt);
	console.log(pos);
});
*/
window.addEventListener("mousemove", function(evt) {
	console.log(evt.clientX, evt.clientY)
})